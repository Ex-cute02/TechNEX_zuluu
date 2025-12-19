@echo off
echo 🚀 Deploying Mutual Fund API to AWS Lambda...
echo.

REM Check if AWS credentials are configured
aws sts get-caller-identity >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ AWS credentials not configured!
    echo Please run: aws configure
    echo You'll need:
    echo - AWS Access Key ID
    echo - AWS Secret Access Key  
    echo - Default region: us-east-1
    echo - Default output format: json
    pause
    exit /b 1
)

echo ✅ AWS credentials found
echo.

REM Deploy using Serverless Framework
echo 📦 Deploying to AWS Lambda...
serverless deploy --verbose

if %errorlevel% equ 0 (
    echo.
    echo 🎉 Deployment successful!
    echo Your API is now live on AWS!
    echo.
    echo Next steps:
    echo 1. Copy the API Gateway URL from above
    echo 2. Update your frontend environment variables
    echo 3. Redeploy your frontend to Vercel
    echo.
) else (
    echo.
    echo ❌ Deployment failed!
    echo Check the error messages above
    echo.
)

pause