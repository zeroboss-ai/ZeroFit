@echo off
title Zero FIT - Starting Web Application
echo ========================================================
echo               ZERO FIT WEB PLATFORM
echo ========================================================
echo.
echo Checking dependencies...
call npm -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js/npm is not detected. Please make sure Node.js is installed.
    pause
    exit /b
)

echo Starting Zero FIT production server on http://localhost:3000 ...
echo Opening your web browser to http://localhost:3000 ...
start http://localhost:3000
echo.
echo ========================================================
echo Zero FIT Web Platform is now running!
echo URL: http://localhost:3000
echo Press Ctrl+C in this window to stop the server anytime.
echo ========================================================
echo.

call npm start
pause
