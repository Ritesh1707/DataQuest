@echo off
setlocal
TITLE DataQuest Project Setup

echo ========================================================
echo       🚀 DataQuest: Automated Setup & Migration
echo ========================================================
echo.

:: 1. Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install it first from https://nodejs.org/
    pause
    exit /b
)

:: 2. Setup Server
echo [1/4] 📦 Installing Server Dependencies...
cd server
if not exist .env (
    echo    - Creating .env from template...
    copy .env.example .env >nul
    echo    ⚠️  IMPORTANT: Please update server/.env with your GEMINI_API_KEY later.
)
call npm install
if %errorlevel% neq 0 (
    echo ❌ Server install failed.
    pause
    exit /b
)

:: 3. Import Data
echo.
echo [2/4] 💾 Migrating Database...
if exist "data_dump" (
    call npm run db:import
) else (
    echo    - No data_dump found. Skipping migration.
)

:: 4. Setup Client
echo.
echo [3/4] 🎨 Installing Client Dependencies...
cd ../client
call npm install
if %errorlevel% neq 0 (
    echo ❌ Client install failed.
    pause
    exit /b
)

:: 5. Launch
echo.
echo ========================================================
echo       ✅ Setup Complete! 
echo ========================================================
echo.
echo To start the application:
echo  1. Open a terminal in 'server' folder and run: npm run dev
echo  2. Open a terminal in 'client' folder and run: npm run dev
echo.
pause
