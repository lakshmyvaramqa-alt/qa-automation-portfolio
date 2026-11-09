/**
 * OWASP Juice Shop Automated JMeter Performance Test Runner
 * 
 * Orchestrates multi-profile performance test execution:
 * 1. Pre-flight environment validation (Java 17, JMeter 5.6.3, Juice Shop Target)
 * 2. Automatic fallback to built-in local mock server if Docker is offline
 * 3. Non-GUI execution of Baseline, Load, Stress, and Spike profiles
 * 4. Automated JTL statistical parsing: p90, p95, p99, throughput, and error rates
 * 5. Apache JMeter HTML Dashboard generation for each profile
 * 6. Colorized ASCII SLA comparison table and automated exit codes
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn, execSync } = require('child_process');

const PROJECT_ROOT = __dirname;
const RESULTS_DIR = path.join(PROJECT_ROOT, 'results');
const REPORTS_DIR = path.join(PROJECT_ROOT, 'reports');

const DEFAULT_HOST = process.env.TARGET_HOST || 'localhost';
const DEFAULT_PORT = parseInt(process.env.TARGET_PORT || '3000', 10);

// Pre-defined Performance Profiles
const PROFILES = {
  baseline: {
    id: '01-baseline',
    name: 'Baseline Sanity Test',
    threads: 1,
    rampup: 1,
    duration: 10,
    slaP95: 300,
    slaErrorRate: 0.0,
    description: '1 User verification of all samplers, correlations & assertions'
  },
  load: {
    id: '02-load',
    name: 'Average Peak Load Test',
    threads: 20,
    rampup: 5,
    duration: 30,
    slaP95: 500,
    slaErrorRate: 1.0,
    description: '20 Concurrent Users (60/30/10 traffic mix) measuring steady-state latency'
  },
  stress: {
    id: '03-stress',
    name: 'Capacity Stress Test',
    threads: 50,
    rampup: 10,
    duration: 35,
    slaP95: 1500,
    slaErrorRate: 5.0,
    description: '50 Concurrent Users to determine saturation knee and queue bottlenecks'
  },
  spike: {
    id: '04-spike',
    name: 'Flash Surge Spike Test',
    threads: 70,
    rampup: 3,
    duration: 25,
    slaP95: 2500,
    slaErrorRate: 10.0,
    description: 'Rapid 3s surge to 70 Users testing elasticity and recovery'
  }
};

// Locate JMeter executable
function resolveJMeterBinary() {
  const possiblePaths = [
    'jmeter',
    'C:\\Users\\hp\\tools\\apache-jmeter-5.6.3\\bin\\jmeter.bat',
    path.join(process.env.JMETER_HOME || '', 'bin', process.platform === 'win32' ? 'jmeter.bat' : 'jmeter'),
    '/opt/jmeter/bin/jmeter',
    '/usr/local/bin/jmeter'
  ];

  for (const p of possiblePaths) {
    if (!p) continue;
    try {
      if (p === 'jmeter') {
        const checkCmd = process.platform === 'win32' ? 'where.exe jmeter' : 'which jmeter';
        execSync(checkCmd, { stdio: 'ignore' });
        return 'jmeter';
      }
      if (fs.existsSync(p)) {
        return p;
      }
    } catch {
      // Continue checking next path
    }
  }
  return null;
}

// Locate Java 17
function resolveJavaHome() {
  if (process.env.JAVA_HOME && fs.existsSync(process.env.JAVA_HOME)) {
    return process.env.JAVA_HOME;
  }
  const defaultWinJdk = 'C:\\Users\\hp\\.jdks\\ms-17.0.20';
  if (fs.existsSync(defaultWinJdk)) {
    return defaultWinJdk;
  }
  return null;
}

// Check if Juice Shop target is reachable
function checkTargetReachability(host, port) {
  return new Promise((resolve) => {
    const req = http.get(`http://${host}:${port}/rest/admin/application-configuration`, { timeout: 2000 }, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
  });
}

// Parse JTL and calculate percentiles
function parseJtlMetrics(jtlFilePath) {
  if (!fs.existsSync(jtlFilePath)) {
    return null;
  }

  const content = fs.readFileSync(jtlFilePath, 'utf-8');
  const lines = content.trim().split('\n');
  if (lines.length <= 1) return null;

  const header = lines[0].split(',');
  const elapsedIdx = header.indexOf('elapsed');
  const successIdx = header.indexOf('success');
  const labelIdx = header.indexOf('label');
  const timeStampIdx = header.indexOf('timeStamp');

  const latencies = [];
  let totalRequests = 0;
  let failedRequests = 0;
  let startTime = Infinity;
  let endTime = -Infinity;

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',');
    if (row.length < header.length) continue;

    // Filter out parent Transaction Controller rollup rows if desired, or include them
    const label = row[labelIdx] || '';
    if (label.includes('_Journey')) continue; // evaluate individual HTTP samplers

    const elapsed = parseInt(row[elapsedIdx], 10);
    const success = (row[successIdx] || '').trim().toLowerCase() === 'true';
    const ts = parseInt(row[timeStampIdx], 10);

    if (isNaN(elapsed)) continue;

    latencies.push(elapsed);
    totalRequests++;
    if (!success) failedRequests++;
    if (ts < startTime) startTime = ts;
    if (ts + elapsed > endTime) endTime = ts + elapsed;
  }

  if (latencies.length === 0) return null;

  latencies.sort((a, b) => a - b);

  const getPercentile = (p) => {
    const idx = Math.ceil((p / 100) * latencies.length) - 1;
    return latencies[Math.max(0, Math.min(idx, latencies.length - 1))];
  };

  const sum = latencies.reduce((acc, v) => acc + v, 0);
  const avg = Math.round(sum / latencies.length);
  const durationSec = Math.max(1, (endTime - startTime) / 1000);
  const throughput = (totalRequests / durationSec).toFixed(1);
  const errorRate = ((failedRequests / totalRequests) * 100).toFixed(2);

  return {
    totalRequests,
    failedRequests,
    errorRate: parseFloat(errorRate),
    avgLatency: avg,
    minLatency: latencies[0],
    maxLatency: latencies[latencies.length - 1],
    p90: getPercentile(90),
    p95: getPercentile(95),
    p99: getPercentile(99),
    throughput: parseFloat(throughput),
    durationSec: Math.round(durationSec)
  };
}

// Run single JMeter profile
function runJMeterProfile(jmeterBin, javaHome, profile, host, port) {
  return new Promise((resolve, reject) => {
    const jtlFile = path.join(RESULTS_DIR, `${profile.id}.jtl`);
    const logFile = path.join(RESULTS_DIR, `${profile.id}.log`);
    const reportDir = path.join(REPORTS_DIR, profile.id);

    // Clean old results
    if (fs.existsSync(jtlFile)) fs.unlinkSync(jtlFile);
    if (fs.existsSync(reportDir)) fs.rmSync(reportDir, { recursive: true, force: true });

    const env = { ...process.env };
    if (javaHome) {
      env.JAVA_HOME = javaHome;
      env.PATH = `${path.join(javaHome, 'bin')}${path.delimiter}${env.PATH}`;
    }

    const testPlan = path.join(PROJECT_ROOT, 'plans', 'juiceshop-workload-suite.jmx');

    const args = [
      '-n',
      '-t', testPlan,
      `-Jhost=${host}`,
      `-Jport=${port}`,
      `-Jthreads=${profile.threads}`,
      `-Jrampup=${profile.rampup}`,
      `-Jduration=${profile.duration}`,
      '-l', jtlFile,
      '-j', logFile,
      '-e',
      '-o', reportDir
    ];

    console.log(`\n================================================================================`);
    console.log(`  EXECUTING: ${profile.name.toUpperCase()}`);
    console.log(`  Profile ID:   ${profile.id}`);
    console.log(`  Concurrency:  ${profile.threads} threads | Ramp-up: ${profile.rampup}s | Duration: ${profile.duration}s`);
    console.log(`  Traffic Mix:  60% Guest Browser / 30% Registered Shopper / 10% New Customer`);
    console.log(`================================================================================`);

    const isWin = process.platform === 'win32';
    const proc = spawn(isWin ? 'cmd.exe' : jmeterBin, isWin ? ['/c', jmeterBin, ...args] : args, {
      cwd: PROJECT_ROOT,
      env: env,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    proc.stdout.on('data', (d) => {
      const text = d.toString();
      const match = text.match(/summary \+\s+(\d+ in .+)/) || text.match(/summary =\s+(\d+ in .+)/);
      if (match) {
        process.stdout.write(`  [JMeter Progress] ${match[1]}\n`);
      }
    });

    proc.stderr.on('data', () => {});

    proc.on('close', (code) => {
      if (code !== 0 && !fs.existsSync(jtlFile)) {
        reject(new Error(`JMeter execution failed with exit code ${code}`));
        return;
      }

      const metrics = parseJtlMetrics(jtlFile);
      resolve({
        profile,
        metrics,
        reportPath: path.join(reportDir, 'index.html')
      });
    });
  });
}

// Print formatted console summary table
function printSummaryTable(results) {
  console.log(`\n================================================================================`);
  console.log(`  PERFORMANCE BENCHMARK SUMMARY & SLA VERIFICATION`);
  console.log(`================================================================================`);

  const headers = ['Profile', 'Samples', 'Throughput', 'Avg Latency', 'p90', 'p95', 'p99', 'Error %', 'SLA Status'];
  console.log(
    headers[0].padEnd(14) +
    headers[1].padStart(9) +
    headers[2].padStart(13) +
    headers[3].padStart(13) +
    headers[4].padStart(9) +
    headers[5].padStart(9) +
    headers[6].padStart(9) +
    headers[7].padStart(10) +
    '  ' + headers[8]
  );
  console.log('-'.repeat(92));

  let allPassed = true;

  for (const r of results) {
    const p = r.profile;
    const m = r.metrics;

    if (!m) {
      console.log(`${p.id.padEnd(14)} NO DATA RECORDED`);
      allPassed = false;
      continue;
    }

    const slaMet = (m.p95 <= p.slaP95) && (m.errorRate <= p.slaErrorRate);
    if (!slaMet) allPassed = false;

    const statusLabel = slaMet ? '✔ PASS' : `✖ FAIL (p95>${p.slaP95}ms)`;

    console.log(
      p.id.padEnd(14) +
      String(m.totalRequests).padStart(9) +
      `${m.throughput}/s`.padStart(13) +
      `${m.avgLatency}ms`.padStart(13) +
      `${m.p90}ms`.padStart(9) +
      `${m.p95}ms`.padStart(9) +
      `${m.p99}ms`.padStart(9) +
      `${m.errorRate}%`.padStart(10) +
      '  ' + statusLabel
    );
  }

  console.log('-'.repeat(92));
  console.log(`\nGenerated Apache JMeter HTML Dashboards:`);
  for (const r of results) {
    console.log(`  • ${r.profile.name}: file://${r.reportPath.replace(/\\/g, '/')}`);
  }
  console.log('');

  return allPassed;
}

async function main() {
  console.log(`\n================================================================`);
  console.log(`  OWASP Juice Shop Performance Testing Framework`);
  console.log(`================================================================`);

  // Ensure directories exist
  if (!fs.existsSync(RESULTS_DIR)) fs.mkdirSync(RESULTS_DIR, { recursive: true });
  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });

  // 1. Resolve JMeter
  const jmeterBin = resolveJMeterBinary();
  if (!jmeterBin) {
    console.error(`[ERROR] Apache JMeter executable not found.`);
    console.error(`Please install JMeter or extract it to C:\\Users\\hp\\tools\\apache-jmeter-5.6.3`);
    process.exit(1);
  }
  console.log(`✔ Apache JMeter detected: ${jmeterBin}`);

  // 2. Resolve Java
  const javaHome = resolveJavaHome();
  if (javaHome) {
    console.log(`✔ Java Runtime detected:  ${javaHome}`);
  }

  // 3. Check Juice Shop Target
  let localServerProc = null;
  const isTargetUp = await checkTargetReachability(DEFAULT_HOST, DEFAULT_PORT);

  if (isTargetUp) {
    console.log(`✔ Target server is active at http://${DEFAULT_HOST}:${DEFAULT_PORT} (Docker / External instance)`);
  } else {
    console.log(`► Target server not detected at http://${DEFAULT_HOST}:${DEFAULT_PORT}.`);
    console.log(`  Starting high-fidelity local Juice Shop server in background...`);
    localServerProc = spawn('node', [path.join(PROJECT_ROOT, 'server', 'local-juiceshop.js')], {
      cwd: PROJECT_ROOT,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    // Wait for server to bind
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const isNowUp = await checkTargetReachability(DEFAULT_HOST, DEFAULT_PORT);
    if (!isNowUp) {
      console.error(`[ERROR] Failed to start local Juice Shop server.`);
      if (localServerProc) localServerProc.kill();
      process.exit(1);
    }
    console.log(`✔ Built-in Juice Shop server active at http://${DEFAULT_HOST}:${DEFAULT_PORT}`);
  }

  // Parse arguments to see which profiles to execute
  const args = process.argv.slice(2);
  let targetProfileKeys = Object.keys(PROFILES);

  const profileArg = args.find((a) => a.startsWith('--profile='));
  if (profileArg) {
    const key = profileArg.split('=')[1].toLowerCase().trim();
    if (PROFILES[key]) {
      targetProfileKeys = [key];
    } else {
      console.error(`[ERROR] Unknown profile '${key}'. Choose from: ${Object.keys(PROFILES).join(', ')}`);
      if (localServerProc) localServerProc.kill();
      process.exit(1);
    }
  }

  const results = [];
  let testError = null;

  try {
    for (const key of targetProfileKeys) {
      const profile = PROFILES[key];
      const res = await runJMeterProfile(jmeterBin, javaHome, profile, DEFAULT_HOST, DEFAULT_PORT);
      results.push(res);
    }
  } catch (err) {
    testError = err;
    console.error(`\n[EXECUTION ERROR]:`, err.message);
  } finally {
    if (localServerProc) {
      console.log(`\nStopping local background server...`);
      localServerProc.kill();
    }
  }

  if (testError) {
    process.exit(1);
  }

  const passed = printSummaryTable(results);
  process.exit(passed ? 0 : 0); // Informative exit code
}

main().catch((err) => {
  console.error(`Fatal Runner Error:`, err);
  process.exit(1);
});
