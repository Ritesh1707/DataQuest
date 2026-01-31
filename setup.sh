#!/bin/bash

echo "========================================================"
echo "      🚀 DataQuest: Automated Setup & Migration"
echo "========================================================"
echo ""

# 1. Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it first."
    exit 1
fi

# 2. Setup Server
echo "[1/4] 📦 Installing Server Dependencies..."
cd server || exit
if [ ! -f .env ]; then
    echo "   - Creating .env from template..."
    cp .env.example .env
    echo "   ⚠️  IMPORTANT: Please update server/.env with your GEMINI_API_KEY later."
fi
npm install

# 3. Import Data
echo ""
echo "[2/4] 💾 Migrating Database..."
if [ -d "data_dump" ]; then
    npm run db:import
else
    echo "   - No data_dump found. Skipping migration."
fi

# 4. Setup Client
echo ""
echo "[3/4] 🎨 Installing Client Dependencies..."
cd ../client || exit
npm install

# 5. Finish
echo ""
echo "========================================================"
echo "      ✅ Setup Complete!"
echo "========================================================"
echo ""
echo "To start the application:"
echo " 1. cd server && npm run dev"
echo " 2. cd client && npm run dev"
echo ""
