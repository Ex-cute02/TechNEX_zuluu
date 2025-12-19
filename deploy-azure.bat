@echo off
echo 🚀 Deploying Mutual Fund API to Azure
echo.

REM Check if Azure CLI is installed
az --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Azure CLI not found!
    echo Please restart your terminal and try again
    pause
    exit /b 1
)

echo ✅ Azure CLI found
echo.

REM Login to Azure
echo Step 1: Logging into Azure...
az login

if %errorlevel% neq 0 (
    echo ❌ Azure login failed!
    pause
    exit /b 1
)

echo ✅ Logged into Azure
echo.

REM Create resource group
echo Step 2: Creating resource group...
az group create --name mutual-fund-rg --location eastus

REM Deploy using App Service (easiest option)
echo Step 3: Creating App Service...
cd backend
az webapp up --name mutual-fund-api-demo --resource-group mutual-fund-rg --runtime "PYTHON:3.11" --sku F1

if %errorlevel% equ 0 (
    echo.
    echo 🎉 Deployment successful!
    echo.
    echo Your API is now live at:
    echo https://mutual-fund-api-demo.azurewebsites.net
    echo.
    echo Next steps:
    echo 1. Test your API: https://mutual-fund-api-demo.azurewebsites.net
    echo 2. Update your frontend environment variable
    echo 3. Redeploy frontend to Vercel
    echo.
) else (
    echo.
    echo ❌ Deployment failed!
    echo Check the error messages above
    echo.
)

pause