@echo off
echo 🔧 Updating Frontend to use Render Backend
echo.

set /p RENDER_URL="Enter your Render API URL (e.g., https://mutual-fund-api-xxxx.onrender.com): "

if "%RENDER_URL%"=="" (
    echo ❌ No URL provided!
    pause
    exit /b 1
)

echo.
echo Updating frontend environment variable...
echo NEXT_PUBLIC_API_URL=%RENDER_URL%

cd frontend

REM Create or update .env.local
echo NEXT_PUBLIC_API_URL=%RENDER_URL% > .env.local

echo.
echo ✅ Environment variable updated!
echo.
echo Now redeploying frontend to Vercel...
vercel --prod

if %errorlevel% equ 0 (
    echo.
    echo 🎉 Frontend updated successfully!
    echo.
    echo 🌐 Your app is now fully deployed in the cloud!
    echo Frontend: https://frontend-zeta-ten-86.vercel.app
    echo Backend: %RENDER_URL%
    echo.
    echo 👥 Your friends can now access the full application!
    echo.
) else (
    echo.
    echo ❌ Frontend deployment failed!
    echo Check the error messages above
    echo.
)

pause