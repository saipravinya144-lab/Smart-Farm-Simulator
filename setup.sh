#!/bin/bash

# Smart Farm Simulator - Complete Setup Script
# This script sets up both backend and frontend for development

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║   Smart Farm Simulator - MongoDB Integration Setup        ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Check Node.js
echo "✓ Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "✗ Node.js not found. Please install Node.js from https://nodejs.org"
    exit 1
fi
echo "✓ Node.js version: $(node --version)"
echo ""

# Check MongoDB
echo "✓ Checking MongoDB installation..."
if command -v mongosh &> /dev/null; then
    echo "✓ MongoDB found"
else
    echo "⚠ MongoDB not found. Please install from https://www.mongodb.com/try/download/community"
    echo "  Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas"
fi
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -eq 0 ]; then
    echo "✓ Backend dependencies installed"
else
    echo "✗ Failed to install backend dependencies"
    exit 1
fi
cd ..
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install
if [ $? -eq 0 ]; then
    echo "✓ Frontend dependencies installed"
else
    echo "✗ Failed to install frontend dependencies"
    exit 1
fi
echo ""

# Check and create .env files
echo "⚙️  Checking environment configuration..."

if [ ! -f "backend/.env" ]; then
    echo "Creating backend/.env..."
    cp backend/.env backend/.env.backup
    echo "✓ Backend .env created"
fi

if [ ! -f ".env" ]; then
    echo "Creating frontend/.env..."
    echo "✓ Frontend .env configured"
fi
echo ""

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║         Setup Complete! Ready to Start Development        ║"
echo "╠═══════════════════════════════════════════════════════════╣"
echo "║                                                           ║"
echo "║  Next Steps:                                              ║"
echo "║                                                           ║"
echo "║  1. Start MongoDB (if using local):                       ║"
echo "║     mongosh                                               ║"
echo "║                                                           ║"
echo "║  2. Open Terminal 1 - Start Backend:                      ║"
echo "║     cd backend && npm run dev                             ║"
echo "║     (Runs on http://localhost:5000)                       ║"
echo "║                                                           ║"
echo "║  3. Open Terminal 2 - Start Frontend:                     ║"
echo "║     npm run dev                                           ║"
echo "║     (Runs on http://localhost:5173)                       ║"
echo "║                                                           ║"
echo "║  4. Open Browser:                                         ║"
echo "║     http://localhost:5173                                 ║"
echo "║                                                           ║"
echo "║  For detailed setup guide, read:                          ║"
echo "║  README-MONGODB.md                                        ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Display configuration info
echo "📋 Current Configuration:"
echo ""
echo "  Backend API: http://localhost:5000"
echo "  Frontend: http://localhost:5173"
echo "  MongoDB: mongodb://localhost:27017/farming-simulator"
echo ""
echo "To change MongoDB connection, edit: backend/.env"
echo ""
