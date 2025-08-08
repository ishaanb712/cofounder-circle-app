#!/bin/bash

echo "🚀 Setting up CoFounder Circle server..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
echo "📦 Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Python 3.11
echo "🐍 Installing Python 3.11..."
sudo apt install python3.11 python3.11-venv python3.11-pip -y

# Install Nginx
echo "🌐 Installing Nginx..."
sudo apt install nginx -y

# Install PM2
echo "⚡ Installing PM2..."
sudo npm install -g pm2

# Install Certbot
echo "🔒 Installing Certbot..."
sudo apt install certbot python3-certbot-nginx -y

# Install additional tools
echo "🔧 Installing additional tools..."
sudo apt install git build-essential -y

# Create app directory
echo "📁 Creating application directory..."
mkdir -p /home/ubuntu/app
cd /home/ubuntu/app

# Clone repository (replace with your actual repository URL)
echo "📥 Cloning repository..."
git clone https://github.com/yourusername/landing_page.git
cd landing_page

# Create logs directory
mkdir -p logs

# Setup frontend
echo "🔨 Setting up frontend..."
cd frontend
npm install
npm run build
cd ..

# Setup backend
echo "🐍 Setting up backend..."
cd backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..

# Make deploy script executable
chmod +x deploy.sh

# Start applications with PM2
echo "🚀 Starting applications..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Configure Nginx
echo "🌐 Configuring Nginx..."
sudo cp nginx-config.conf /etc/nginx/sites-available/cofoundercircle
sudo ln -s /etc/nginx/sites-available/cofoundercircle /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

# Configure firewall
echo "🔥 Configuring firewall..."
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000
sudo ufw allow 8000
sudo ufw --force enable

echo "✅ Server setup complete!"
echo "📊 Application status:"
pm2 status

echo "🌐 Next steps:"
echo "1. Update your domain DNS to point to this server's IP"
echo "2. Update environment variables in frontend/.env.production and backend/.env"
echo "3. Run: sudo certbot --nginx -d your-domain.com"
echo "4. Your application will be live at your domain!" 