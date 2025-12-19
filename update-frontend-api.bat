@echo off
echo 🔧 Updating Frontend API URL
echo.

set /p NGROK_URL="Enter your ngrok HTTPS URL (e.g., https://abc123.ngrok.io): "

if "%NGROK_URL%"=="" (
    echo ❌ No URL provided!
    pause
    exit /b 1
)

echo.
echo Updating frontend environment variable...
echo NEXT_PUBLIC_API_URL=%NGROK_URL%

cd frontend

REM Create or update .env.local
echo NEXT_PUBLIC_API_URL=%NGROK_URL% > .env.local

echo.
echo ✅ Environment variable updated!
echo.
echo Now redeploying frontend to Vercel...
vercel --prod

if %errorlevel% equ 0 (
    echo.
    echo 🎉 Frontend updated successfully!
    echo Your deployed frontend now connects to your local backend!
    echo.
    echo Frontend: https://frontend-zeta-ten-86.vercel.app
    echo Backend: %NGROK_URL%
    echo.
) else (
    echo.
    echo ❌ Frontend deployment failed!
    echo Check the error messages above
    echo.
)

pause