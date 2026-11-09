#!/usr/bin/env bash
# ==============================================================================
# OWASP Juice Shop Performance Testing - Non-GUI Execution Script
# Executes 4 Performance Profiles: Baseline, Load, Stress, and Spike
# Generates .jtl logs and Apache JMeter HTML Dashboard Reports
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Locate JMeter Binary
JMETER_BIN="${JMETER_HOME:-/opt/jmeter}/bin/jmeter"
if ! command -v jmeter &> /dev/null; then
    if [ ! -f "$JMETER_BIN" ]; then
        echo "[ERROR] JMeter executable not found in PATH or at $JMETER_BIN"
        echo "Please install JMeter or set JMETER_HOME."
        exit 1
    fi
else
    JMETER_BIN="jmeter"
fi

TARGET_HOST="${1:-localhost}"
TARGET_PORT="${2:-3000}"
RESULTS_DIR="results"
REPORTS_DIR="reports"

echo "===================================================================="
echo "  OWASP Juice Shop JMeter Automated Performance Test Suite"
echo "  Target: http://${TARGET_HOST}:${TARGET_PORT}"
echo "===================================================================="

mkdir -p "$RESULTS_DIR"
mkdir -p "$REPORTS_DIR"

run_profile() {
    local profile_name="$1"
    local threads="$2"
    local rampup="$3"
    local duration="$4"

    local jtl_file="${RESULTS_DIR}/${profile_name}.jtl"
    local log_file="${RESULTS_DIR}/${profile_name}.log"
    local report_dir="${REPORTS_DIR}/${profile_name}"

    echo ""
    echo "--------------------------------------------------------------------"
    echo "  RUNNING PROFILE: ${profile_name} (Threads: ${threads}, Ramp: ${rampup}s, Duration: ${duration}s)"
    echo "--------------------------------------------------------------------"

    # Clean previous run artifacts
    rm -rf "$jtl_file" "$report_dir"

    "$JMETER_BIN" -n \
        -t "plans/juiceshop-workload-suite.jmx" \
        -Jhost="$TARGET_HOST" \
        -Jport="$TARGET_PORT" \
        -Jthreads="$threads" \
        -Jrampup="$rampup" \
        -Jduration="$duration" \
        -l "$jtl_file" \
        -j "$log_file" \
        -e -o "$report_dir"

    echo "✔ Profile [${profile_name}] completed successfully."
    echo "  Dashboard Report: ${report_dir}/index.html"
}

# 1. Baseline Test (Sanity: 1 user, 10s)
run_profile "01-baseline" 1 1 10

# 2. Load Test (Expected peak: 20 users, 15s ramp, 60s sustained)
run_profile "02-load" 20 15 60

# 3. Stress Test (Saturation breaking point: 60 users, 25s ramp, 90s)
run_profile "03-stress" 60 25 90

# 4. Spike Test (Surge traffic resilience: 80 users, 5s ramp, 45s)
run_profile "04-spike" 80 5 45

echo ""
echo "===================================================================="
echo "  All 4 Performance Profiles Executed Successfully!"
echo "  View generated HTML dashboards in ./${REPORTS_DIR}/"
echo "===================================================================="
