#!/bin/bash

# Frontend-Backend Connection Setup Script
echo "🚀 Starting CollabLearn Frontend-Backend Connection Setup..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Check environment variables
echo "🔧 Checking environment configuration..."

if [ ! -f ".env" ]; then
    echo "❌ .env file not found"
    exit 1
fi

# Show current configuration
echo "📋 Current Configuration:"
echo "   API URL: $(grep VITE_API_URL .env | cut -d'=' -f2)"
echo "   WS URL: $(grep VITE_WS_URL .env | cut -d'=' -f2)"

echo ""
echo "🏃‍♂️ To start development:"
echo "   Frontend: npm run dev"
echo "   Backend:  Make sure your backend is running on http://localhost:3000"
echo "   WebSocket: Make sure your WebSocket server is running on ws://localhost:3003"
echo ""
echo "🔗 Connection Status:"
echo "   Add <ConnectionIndicator /> component to your app to monitor connections"
echo ""
echo "✅ Setup complete!"
