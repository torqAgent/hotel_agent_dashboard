#!/bin/bash

# Production Setup Script for Hotel Agent Dashboard

echo "🚀 Hotel Agent Dashboard - Production Setup"
echo "==========================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please create .env with the following variables:"
    echo "  LIVEKIT_URL=..."
    echo "  LIVEKIT_API_KEY=..."
    echo "  LIVEKIT_API_SECRET=..."
    echo "  DB_URL=..."
    exit 1
fi

echo "✅ .env file found"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Build the project
echo "🔨 Building project..."
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi
echo ""

echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Create the settings table in your Neon database:"
echo "   - Copy the SQL from: drizzle/0002_settings.sql"
echo "   - Execute it in your Neon dashboard SQL editor"
echo ""
echo "2. Start the production server:"
echo "   npm start"
echo ""
echo "3. Access the dashboard:"
echo "   http://localhost:3000"
echo ""
echo "4. Test the following:"
echo "   - Toggle dark/light mode (Sun/Moon icon in topbar)"
echo "   - Go to Settings and change room rates"
echo "   - Refresh the page - rates should persist"
echo "   - Check Dashboard - bookings should only show valid entries"
echo ""
echo "✨ Happy coding!"
