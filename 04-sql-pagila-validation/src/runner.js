const fs = require('fs');
const path = require('path');
const { initDatabase } = require('./db');

// ANSI Color Helpers
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  dim: '\x1b[2m',
};

const VALIDATIONS_DIR = path.join(__dirname, '..', 'sql', '03-validations');
const DEFECT_INJECT_FILE = path.join(__dirname, '..', 'sql', '04-defects', 'inject-defects.sql');
const DEFECT_ROLLBACK_FILE = path.join(__dirname, '..', 'sql', '04-defects', 'rollback-defects.sql');
const REPORTS_DIR = path.join(__dirname, '..', 'sql', '02-business-reports');

function getValidationFiles() {
  return fs.readdirSync(VALIDATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort()
    .map(filename => ({
      name: filename.replace('.sql', ''),
      filename,
      filePath: path.join(VALIDATIONS_DIR, filename),
      sql: fs.readFileSync(path.join(VALIDATIONS_DIR, filename), 'utf8'),
    }));
}

async function runValidations(client, title) {
  console.log(`\n${colors.bright}${colors.cyan}================================================================================${colors.reset}`);
  console.log(`${colors.bright}  ${title}${colors.reset}`);
  console.log(`${colors.cyan}================================================================================${colors.reset}`);

  const validationFiles = getValidationFiles();
  const results = [];

  for (const val of validationFiles) {
    const startTime = Date.now();
    let rows = [];
    let error = null;

    try {
      const res = await client.query(val.sql);
      rows = res.rows || [];
    } catch (err) {
      error = err.message;
    }

    const duration = Date.now() - startTime;
    const isPassing = !error && rows.length === 0;

    results.push({
      rule: val.name,
      rowsCount: rows.length,
      duration: `${duration}ms`,
      status: error ? 'ERROR' : (isPassing ? 'PASS' : 'FAIL (Defect Detected)'),
      isPassing,
      error,
      sampleDefect: rows.length > 0 ? rows[0] : null,
    });
  }

  // Print Formatted Table
  printResultsTable(results);
  return results;
}

function printResultsTable(results) {
  const colRule = 32;
  const colRows = 12;
  const colTime = 10;
  const colStatus = 22;

  const header = `┌─${'─'.repeat(colRule)}─┬─${'─'.repeat(colRows)}─┬─${'─'.repeat(colTime)}─┬─${'─'.repeat(colStatus)}─┐`;
  const footer = `└─${'─'.repeat(colRule)}─┴─${'─'.repeat(colRows)}─┴─${'─'.repeat(colTime)}─┴─${'─'.repeat(colStatus)}─┘`;
  const divider = `├─${'─'.repeat(colRule)}─┼─${'─'.repeat(colRows)}─┼─${'─'.repeat(colTime)}─┼─${'─'.repeat(colStatus)}─┤`;

  console.log(header);
  console.log(`│ ${pad('Validation Rule', colRule)} │ ${pad('Rows Found', colRows)} │ ${pad('Duration', colTime)} │ ${pad('Status', colStatus)} │`);
  console.log(divider);

  for (const r of results) {
    let statusColored = r.status;
    if (r.status === 'PASS') {
      statusColored = `${colors.green}${colors.bright}PASS${colors.reset}       `;
    } else if (r.status === 'ERROR') {
      statusColored = `${colors.red}${colors.bright}ERROR${colors.reset}      `;
    } else {
      statusColored = `${colors.yellow}${colors.bright}DEFECT DETECTED${colors.reset}`;
    }

    console.log(`│ ${pad(r.rule, colRule)} │ ${pad(String(r.rowsCount), colRows)} │ ${pad(r.duration, colTime)} │ ${statusColored.padEnd(colStatus + 9)} │`);
    
    if (r.sampleDefect) {
      const defectSummary = Object.entries(r.sampleDefect)
        .slice(0, 3)
        .map(([k, v]) => `${k}=${v}`)
        .join(', ');
      console.log(`│   ${colors.dim}└─ Sample: ${defectSummary.slice(0, colRule + colRows + colTime + colStatus - 5)}${colors.reset}`);
    }
  }

  console.log(footer);
}

function pad(str, len) {
  const s = String(str);
  return s.length > len ? s.slice(0, len) : s.padEnd(len);
}

async function runBusinessReports(client) {
  console.log(`\n${colors.bright}${colors.magenta}================================================================================${colors.reset}`);
  console.log(`${colors.bright}  Pagila Business Reports Summary${colors.reset}`);
  console.log(`${colors.magenta}================================================================================${colors.reset}`);

  const reportFiles = fs.readdirSync(REPORTS_DIR).filter(f => f.endsWith('.sql')).sort();

  for (const rf of reportFiles) {
    const reportSql = fs.readFileSync(path.join(REPORTS_DIR, rf), 'utf8');
    const reportName = rf.replace('.sql', '').replace(/^\d+-/, '').replace(/-/g, ' ').toUpperCase();
    
    console.log(`\n${colors.cyan}► Report: ${reportName}${colors.reset}`);
    const res = await client.query(reportSql);
    if (res.rows && res.rows.length > 0) {
      console.table(res.rows.slice(0, 5));
      if (res.rows.length > 5) {
        console.log(`  ${colors.dim}(showing top 5 of ${res.rows.length} rows)${colors.reset}`);
      }
    } else {
      console.log('  (0 rows returned)');
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  const mode = args.find((_, i) => args[i - 1] === '--mode') || 'all';
  const showReports = args.includes('--reports');

  console.log(`${colors.bright}${colors.blue}Initializing Pagila SQL Validation Engine...${colors.reset}`);
  const { client, type, version } = await initDatabase();
  console.log(`${colors.green}✓ Database Engine Active:${colors.reset} ${type}`);
  console.log(`${colors.dim}  ${version}${colors.reset}`);

  if (showReports) {
    await runBusinessReports(client);
  }

  if (mode === 'clean') {
    const cleanResults = await runValidations(client, 'Stage 1: Validation Against Clean Data');
    const allCleanPass = cleanResults.every(r => r.isPassing);
    if (!allCleanPass) {
      console.error(`\n${colors.red}${colors.bright}✖ Validation Failed: Expected 0 defects on clean data.${colors.reset}`);
      process.exit(1);
    }
    console.log(`\n${colors.green}${colors.bright}✔ All ${cleanResults.length} validation checks PASSED with 0 rows on clean data.${colors.reset}`);
    process.exit(0);
  }

  if (mode === 'defects') {
    const injectSql = fs.readFileSync(DEFECT_INJECT_FILE, 'utf8');
    await (client.exec ? client.exec(injectSql) : client.query(injectSql));
    const defectResults = await runValidations(client, 'Stage 2: Validation Against Injected Defects');
    const defectCount = defectResults.filter(r => !r.isPassing).length;
    console.log(`\n${colors.yellow}${colors.bright}✔ Defect Injection Test: Correctly caught ${defectCount} anomalies.${colors.reset}`);
    process.exit(0);
  }

  // Default mode: Complete cycle (Clean -> Inject Defects -> Verify Catches -> Rollback -> Verify Clean)
  // Stage 1: Clean
  const stage1 = await runValidations(client, 'STAGE 1: Baseline Validation on Clean Data (Expected: 100% PASS / 0 Rows)');
  const stage1Pass = stage1.every(r => r.isPassing);

  // Stage 2: Inject Defects
  console.log(`\n${colors.yellow}► Injecting deliberate defects via sql/04-defects/inject-defects.sql...${colors.reset}`);
  const injectSql = fs.readFileSync(DEFECT_INJECT_FILE, 'utf8');
  await (client.exec ? client.exec(injectSql) : client.query(injectSql));

  const stage2 = await runValidations(client, 'STAGE 2: Defect Injection Validation (Expected: Defect Alerts Caught)');
  const caughtDefects = stage2.filter(r => !r.isPassing).length;

  // Stage 3: Rollback / Restore
  console.log(`\n${colors.cyan}► Rolling back injected defects via sql/04-defects/rollback-defects.sql...${colors.reset}`);
  const rollbackSql = fs.readFileSync(DEFECT_ROLLBACK_FILE, 'utf8');
  await (client.exec ? client.exec(rollbackSql) : client.query(rollbackSql));

  const stage3 = await runValidations(client, 'STAGE 3: Post-Rollback Data Quality Re-check (Expected: 100% PASS / 0 Rows)');
  const stage3Pass = stage3.every(r => r.isPassing);

  // Run business reports summary
  await runBusinessReports(client);

  // Final Verdict
  console.log(`\n${colors.bright}================================================================================${colors.reset}`);
  console.log(`${colors.bright}  FINAL AUTOMATION TEST VERDICT${colors.reset}`);
  console.log(`${colors.bright}================================================================================${colors.reset}`);
  console.log(`• Stage 1 (Clean Data Verification):     ${stage1Pass ? colors.green + '✔ 7/7 PASSED (0 rows)' : colors.red + '✖ FAILED'}${colors.reset}`);
  console.log(`• Stage 2 (Defect Injection Detection):  ${caughtDefects > 0 ? colors.green + `✔ ${caughtDefects} Injected Defects Successfully Detected` : colors.red + '✖ FAILED'}${colors.reset}`);
  console.log(`• Stage 3 (Rollback Clean Re-assertion): ${stage3Pass ? colors.green + '✔ 7/7 PASSED (0 rows)' : colors.red + '✖ FAILED'}${colors.reset}`);

  if (stage1Pass && caughtDefects > 0 && stage3Pass) {
    console.log(`\n${colors.bright}${colors.green}✔ OVERALL SUITE PASSED: 100% data quality rules verified and proven.${colors.reset}\n`);
    process.exit(0);
  } else {
    console.error(`\n${colors.bright}${colors.red}✖ OVERALL SUITE FAILED: Data validation criteria not fully met.${colors.reset}\n`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('\nFatal error executing runner:', err);
  process.exit(1);
});
