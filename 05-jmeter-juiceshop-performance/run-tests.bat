@echo off
REM ==============================================================================
REM OWASP Juice Shop Performance Testing - Windows Batch Execution Script
REM Executes 4 Performance Profiles: Baseline, Load, Stress, and Spike
REM ==============================================================================

setlocal enabledelayedexpansion
cd /d "%~dp0"

set "TARGET_HOST=%~1"
if "%TARGET_HOST%"=="" set "TARGET_HOST=localhost"

set "TARGET_PORT=%~2"
if "%TARGET_PORT%"=="" set "TARGET_PORT=3000"

set "RESULTS_DIR=results"
set "REPORTS_DIR=reports"

REM Detect Java 17
if not defined JAVA_HOME (
    if exist "C:\Users\hp\.jdks\ms-17.0.20" (
        set "JAVA_HOME=C:\Users\hp\.jdks\ms-17.0.20"
    )
)

REM Locate JMeter
where jmeter >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    set "JMETER_CMD=jmeter"
) else (
    if exist "C:\Users\hp\tools\apache-jmeter-5.6.3\bin\jmeter.bat" (
        set "JMETER_CMD=C:\Users\hp\tools\apache-jmeter-5.6.3\bin\jmeter.bat"
    ) else (
        echo [ERROR] JMeter not found. Please install JMeter or place it in C:\Users\hp\tools\apache-jmeter-5.6.3
        exit /b 1
    )
)

if not exist "%RESULTS_DIR%" mkdir "%RESULTS_DIR%"
if not exist "%REPORTS_DIR%" mkdir "%REPORTS_DIR%"

echo ====================================================================
echo   OWASP Juice Shop Performance Suite (Windows Runner)
echo   Target: http://%TARGET_HOST%:%TARGET_PORT%
echo ====================================================================

call :RunProfile 01-baseline 1 1 10
call :RunProfile 02-load 20 15 60
call :RunProfile 03-stress 60 25 90
call :RunProfile 04-spike 80 5 45

echo.
echo ====================================================================
echo   All 4 Performance Profiles Completed!
echo   Reports available in .\%REPORTS_DIR%\
echo ====================================================================
exit /b 0

:RunProfile
set "PROFILE=%~1"
set "THREADS=%~2"
set "RAMPUP=%~3"
set "DURATION=%~4"

echo.
echo --------------------------------------------------------------------
echo   Running Profile: %PROFILE% (Threads: %THREADS%, Ramp: %RAMPUP%s, Duration: %DURATION%s)
echo --------------------------------------------------------------------

if exist "%RESULTS_DIR%\%PROFILE%.jtl" del /f /q "%RESULTS_DIR%\%PROFILE%.jtl"
if exist "%REPORTS_DIR%\%PROFILE%" rmdir /s /q "%REPORTS_DIR%\%PROFILE%"

call "%JMETER_CMD%" -n ^
    -t "plans\juiceshop-workload-suite.jmx" ^
    -Jhost="%TARGET_HOST%" ^
    -Jport="%TARGET_PORT%" ^
    -Jthreads=%THREADS% ^
    -Jrampup=%RAMPUP% ^
    -Jduration=%DURATION% ^
    -l "%RESULTS_DIR%\%PROFILE%.jtl" ^
    -j "%RESULTS_DIR%\%PROFILE%.log" ^
    -e -o "%REPORTS_DIR%\%PROFILE%"

echo Profile [%PROFILE%] completed.
goto :eof
