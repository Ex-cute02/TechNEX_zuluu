@echo off
echo 🚀 Setting up AWS deployment for Mutual Fund API
echo.

echo Step 1: Checking AWS CLI installation...
where aws >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ AWS CLI not found in PATH
    echo Please restart your terminal/PowerShell and try again
    echo Or manually add AWS CLI to your PATH
    pause
    exit /b 1
)

echo ✅ AWS CLI found
aws --version
echo.

echo Step 2: Configuring AWS credentials...
echo You'll need:
echo - AWS Access Key ID
echo - AWS Secret Access Key
echo - Default region: us-east-1
echo - Default output format: json
echo.
echo If you don't have these, create an IAM user in AWS Console first.
echo.
pause

aws configure

echo.
echo Step 3: Testing AWS connection...
aws sts get-caller-identity

if %errorlevel% equ 0 (
    echo.
    echo ✅ AWS credentials configured successfully!
    echo.
    echo Step 4: Ready to deploy!
    echo Run: deploy.bat
    echo.
) else (
    echo.
    echo ❌ AWS configuration failed
    echo Please check your credentials and try again
    echo.
)

pause