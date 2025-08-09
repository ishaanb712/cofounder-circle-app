#!/bin/bash

echo "🔄 Restarting services to apply CSP changes..."

# Check if PM2 is running
if command -v pm2 &> /dev/null; then
    echo "📦 Restarting PM2 processes..."
    pm2 restart all
    echo "✅ PM2 processes restarted"
else
    echo "⚠️  PM2 not found, restarting manually..."
    
    # Kill existing processes
    pkill -f "next dev"
    pkill -f "uvicorn"
    
    # Start frontend
    cd frontend
    nohup npm run dev > ../frontend.log 2>&1 &
    echo "✅ Frontend restarted"
    
    # Start backend
    cd ../backend
    nohup python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 > ../backend.log 2>&1 &
    echo "✅ Backend restarted"
fi

# Restart nginx if it's running
if command -v nginx &> /dev/null; then
    echo "🌐 Restarting nginx..."
    sudo systemctl restart nginx
    echo "✅ Nginx restarted"
fi

echo "🎉 Services restarted successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Clear your browser cache and cookies"
echo "2. Try signing in with Google again"
echo "3. Check browser console for any remaining errors"
echo ""
echo "🔍 If you still see issues, check:"
echo "- Browser console for CSP errors"
echo "- Network tab for blocked requests"
echo "- Application logs for any errors" 