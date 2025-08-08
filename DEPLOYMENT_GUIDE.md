# EC2 Deployment Guide

This guide will walk you through deploying your CoFounder Circle application to an EC2 instance and making it live.

## 🚀 Prerequisites

### 1. AWS Account Setup
- AWS Account with billing enabled
- IAM user with EC2 permissions
- Access keys configured

### 2. Domain Name (Optional but Recommended)
- Purchase a domain (e.g., cofoundercircle.com)
- Configure DNS settings

## 📋 Step-by-Step Deployment

### Step 1: Launch EC2 Instance

#### 1.1 Create EC2 Instance
```bash
# Recommended Instance Type
Instance Type: t3.medium (2 vCPU, 4 GB RAM) ✅ CONFIRMED
AMI: Ubuntu 22.04 LTS
Storage: 20 GB GP3
Security Group: Create new with these rules:
  - SSH (Port 22): Your IP
  - HTTP (Port 80): 0.0.0.0/0
  - HTTPS (Port 443): 0.0.0.0/0
  - Custom (Port 3000): 0.0.0.0/0 (Frontend)
  - Custom (Port 8000): 0.0.0.0/0 (Backend)
```

#### 1.2 Connect to Instance
```bash
# Download your key pair and connect
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### Step 2: Server Setup

#### 2.1 Update System
```bash
sudo apt update && sudo apt upgrade -y
```

#### 2.2 Install Dependencies
```bash
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Python 3.11
sudo apt install python3.11 python3.11-venv python3.11-pip -y

# Install Nginx
sudo apt install nginx -y

# Install PM2 for process management
sudo npm install -g pm2

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y
```

#### 2.3 Install Additional Tools
```bash
# Install Git
sudo apt install git -y

# Install Build Essentials
sudo apt install build-essential -y
```

### Step 3: Application Deployment

#### 3.1 Clone Repository
```bash
# Create app directory
mkdir /home/ubuntu/app
cd /home/ubuntu/app

# Clone your repository
git clone https://github.com/yourusername/landing_page.git
cd landing_page
```

#### 3.2 Environment Setup

Create production environment files:

**Frontend Environment** (`frontend/.env.production`):
```bash
NEXT_PUBLIC_API_URL=https://your-domain.com/api
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**Backend Environment** (`backend/.env`):
```bash
HOST=0.0.0.0
PORT=8000
DEBUG=false
SECRET_KEY=your-super-secret-jwt-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
SUPABASE_URL=your-supabase-project-url
SUPABASE_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
FRONTEND_URL=https://your-domain.com
```

#### 3.3 Install Dependencies
```bash
# Install frontend dependencies
cd frontend
npm install
npm run build

# Install backend dependencies
cd ../backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Step 4: Process Management

#### 4.1 Create PM2 Configuration
Create `ecosystem.config.js` in the root directory:

```javascript
module.exports = {
  apps: [
    {
      name: 'cofounder-backend',
      cwd: '/home/ubuntu/app/landing_page/backend',
      script: 'python3.11',
      args: '-m uvicorn app.main:app --host 0.0.0.0 --port 8000',
      env: {
        NODE_ENV: 'production',
        PYTHONPATH: '/home/ubuntu/app/landing_page/backend'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    },
    {
      name: 'cofounder-frontend',
      cwd: '/home/ubuntu/app/landing_page/frontend',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }
  ]
};
```

#### 4.2 Start Applications
```bash
# Start both applications
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### Step 5: Nginx Configuration

#### 5.1 Create Nginx Config
Create `/etc/nginx/sites-available/cofoundercircle`:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files
    location /_next/static {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### 5.2 Enable Site
```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/cofoundercircle /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 6: SSL Certificate

#### 6.1 Install SSL Certificate
```bash
# Install SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal
sudo crontab -e
# Add this line:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

### Step 7: Firewall Configuration

#### 7.1 Configure UFW
```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow ssh

# Allow HTTP/HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Allow application ports
sudo ufw allow 3000
sudo ufw allow 8000
```

## 🔧 Monitoring and Maintenance

### 1. Application Monitoring
```bash
# Check application status
pm2 status

# View logs
pm2 logs

# Monitor resources
pm2 monit
```

### 2. System Monitoring
```bash
# Check system resources
htop

# Check disk usage
df -h

# Check memory usage
free -h
```

### 3. Log Management
```bash
# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# View application logs
pm2 logs cofounder-frontend
pm2 logs cofounder-backend
```

## 🚀 Deployment Scripts

### 1. Create Deployment Script
Create `deploy.sh`:

```bash
#!/bin/bash

echo "🚀 Deploying CoFounder Circle..."

# Pull latest changes
git pull origin main

# Install frontend dependencies
cd frontend
npm install
npm run build

# Install backend dependencies
cd ../backend
source venv/bin/activate
pip install -r requirements.txt

# Restart applications
pm2 restart all

echo "✅ Deployment complete!"
```

### 2. Make Script Executable
```bash
chmod +x deploy.sh
```

## 🔄 Continuous Deployment

### 1. GitHub Actions (Optional)
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to EC2

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to EC2
      uses: appleboy/ssh-action@v0.1.4
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.KEY }}
        script: |
          cd /home/ubuntu/app/landing_page
          ./deploy.sh
```

## 📊 Performance Optimization

### 1. Enable Gzip Compression
Add to Nginx config:
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

### 2. Enable Browser Caching
Add to Nginx config:
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## 🔒 Security Checklist

- [ ] Firewall configured
- [ ] SSL certificate installed
- [ ] Environment variables secured
- [ ] Regular security updates
- [ ] Backup strategy implemented
- [ ] Monitoring alerts configured

## 🆘 Troubleshooting

### Common Issues:

1. **Application not starting**
   ```bash
   pm2 logs
   sudo systemctl status nginx
   ```

2. **SSL certificate issues**
   ```bash
   sudo certbot certificates
   sudo certbot renew --dry-run
   ```

3. **Domain not resolving**
   - Check DNS settings
   - Verify domain points to EC2 IP
   - Check security group rules

4. **Performance issues**
   ```bash
   pm2 monit
   htop
   sudo nginx -t
   ```

## 📞 Support

For deployment issues:
1. Check application logs: `pm2 logs`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify environment variables are set correctly
4. Ensure all ports are open in security group

Your application should now be live and accessible to anyone with an internet connection! 