@echo off
REM Smart Farm Simulator - Complete Setup Script for Windows
REM This script sets up both backend and frontend for development

cls
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║   Smart Farm Simulator - MongoDB Integration Setup        ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

REM Check Node.js
echo ✓ Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Node.js not found. Please install from https://nodejs.org
    pause
    exit /b 1
)
echo ✓ Node.js version: 
node --version
echo.

REM Check MongoDB
echo ✓ Checking MongoDB installation...
mongosh --version >nul 2>&1
if errorlevel 1 (
    echo ⚠ MongoDB not found. Please install from https://www.mongodb.com/try/download/community
    echo   Or use MongoDB Atlas ^(cloud^): https://www.mongodb.com/cloud/atlas
) else (
    echo ✓ MongoDB found
)
echo.

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo ✗ Failed to install backend dependencies
    pause
    exit /b 1
)
echo ✓ Backend dependencies installed
cd ..
echo.

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
call npm install
if errorlevel 1 (
    echo ✗ Failed to install frontend dependencies
    pause
    exit /b 1
)
echo ✓ Frontend dependencies installed
echo.

REM Check and create .env files
echo ⚙️  Checking environment configuration...

if not exist "backend\.env" (
    echo Creating backend\.env...
    copy backend\.env.example backend\.env >nul 2>&1
    echo ✓ Backend .env created
)

if not exist ".env" (
    echo ✓ Frontend .env configured
)
echo.

cls
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║         Setup Complete! Ready to Start Development        ║
echo ╠═══════════════════════════════════════════════════════════╣
echo ║                                                           ║
echo ║  Next Steps:                                              ║
echo ║                                                           ║
echo ║  1. Start MongoDB ^(if using local^):                      ║
echo ║     mongosh                                               ║
echo ║                                                           ║
echo ║  2. Open Command Prompt 1 - Start Backend:                ║
echo ║     cd backend ^&^& npm run dev                             ║
echo ║     ^(Runs on http://localhost:5000^)                      ║
echo ║                                                           ║
echo ║  3. Open Command Prompt 2 - Start Frontend:               ║
echo ║     npm run dev                                           ║
echo ║     ^(Runs on http://localhost:5173^)                      ║
echo ║                                                           ║
echo ║  4. Open Browser:                                         ║
echo ║     http://localhost:5173                                 ║
echo ║                                                           ║
echo ║  For detailed setup guide, read:                          ║
echo ║  README-MONGODB.md                                        ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

echo 📋 Current Configuration:
echo.
echo   Backend API: http://localhost:5000
echo   Frontend: http://localhost:5173
echo   MongoDB: mongodb://localhost:27017/farming-simulator
echo.
echo To change MongoDB connection, edit: backend\.env
echo.

pause
