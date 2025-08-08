#!/bin/bash

echo "🚀 Deploying CoFounder Circle..."

# Create logs directory if it doesn't exist
mkdir -p logs

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Install frontend dependencies and build
echo "🔨 Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Install backend dependencies
echo "🐍 Installing backend dependencies..."
cd backend
source venv/bin/activate
pip install -r requirements.txt
cd ..

# Restart applications
echo "🔄 Restarting applications..."
pm2 restart all

# Check status
echo "📊 Application status:"
pm2 status

echo "✅ Deployment complete!"
echo "🌐 Your application should be live at your domain!" 