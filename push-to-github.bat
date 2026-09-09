@echo off
title Zero FIT - Push to GitHub
cd /d "%~dp0"
echo ========================================================
echo          ZERO FIT - AUTOMATIC GITHUB UPLOADER
echo ========================================================
echo.
echo Current Directory: %CD%
echo.

if not exist package.json (
    echo [ERROR] Must be run inside Zero FIT project directory.
    pause
    exit /b
)

echo [1/4] Initializing clean Git repository inside Zero FIT...
if not exist .git (
    git init -b main
)

echo [2/4] Staging project files (excluding node_modules and .next)...
git add .

echo [3/4] Creating commit...
git commit -m "Zero FIT production release"

echo.
echo ========================================================
echo Enter your GitHub repository URL below.
echo Example: https://github.com/your-username/zero-fit.git
echo ========================================================
set /p REPO_URL="GitHub Repository URL: "

if "%REPO_URL%"=="" (
    echo No URL entered. Exiting.
    pause
    exit /b
)

echo [4/4] Pushing to GitHub (%REPO_URL%)...
git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%
git branch -M main
git push -u origin main

echo.
echo Done! Files uploaded to GitHub successfully.
pause
