@echo off
echo 🔧 Updating Frontend to use Azure Backend
echo.

set AZURE_URL=https://mutual-fund-api-demo.azurewebsites.net

echo Using Azure URL: %AZURE_URL%
echo.

cd frontend

REM Create or update .env.local
echo NEXT_PUBLIC_API_URL=%AZURE_URL% > .env.local

echo ✅ Environment variable updated!
echo.
echo Now redeploying frontend to Vercel...
vercel --prod

if %errorlevel% equ 0 (
    echo.
    echo 🎉 Frontend updated successfully!
    echo.
    echo 🌐 Your app is now fully deployed on Azure + Vercel!
    echo Frontend: https://frontend-zeta-ten-86.vercel.app
    echo Backend: %AZURE_URL%
    echo.
    echo 👥 Your friends can now access the full AI application!
    echo.
    echo 🧪 Test your deployment:
    echo 1. Visit: https://frontend-zeta-ten-86.vercel.app
    echo 2. Check Dashboard for live ML data
    echo 3. Try the recommendation engine
    echo 4. Share with friends!
    echo.
) else (
    echo.
    echo ❌ Frontend deployment failed!
    echo Check the error messages above
    echo.
)

pause