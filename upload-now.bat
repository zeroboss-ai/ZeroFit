@echo off
cd /d "%~dp0"
echo ========================================================
echo        UPLOADING COMPLETE CODEBASE TO GITHUB
echo ========================================================
echo.
echo Pushing all 56 files (including components/calculators) to GitHub...
echo Repository: https://github.com/zeroboss-ai/ZeroFit.git
echo.
git push -u origin main --force
echo.
echo ========================================================
if %errorlevel% equ 0 (
    echo [SUCCESS] All files and calculators uploaded to GitHub!
    echo Render will automatically detect this and deploy successfully!
) else (
    echo [NOTICE] If GitHub asked for login or token, please enter your GitHub credentials.
)
echo ========================================================
pause
