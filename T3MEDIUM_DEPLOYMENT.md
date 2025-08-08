# t3.medium Deployment Guide

## 🚀 Quick Deployment Checklist

### ✅ Instance Specifications
- **Type**: t3.medium (2 vCPU, 4 GB RAM)
- **Storage**: 20 GB GP3
- **OS**: Ubuntu 22.04 LTS
- **Cost**: ~$30/month

### ✅ Security Group Rules
```
SSH (22): Your IP only
HTTP (80): 0.0.0.0/0
HTTPS (443): 0.0.0.0/0
Custom (3000): 0.0.0.0/0 (Frontend)
Custom (8000): 0.0.0.0/0 (Backend)
```

## 🚀 One-Command Deployment

### Step 1: Launch EC2 Instance
1. Go to AWS Console → EC2
2. Launch Instance with above specs
3. Download your key pair (.pem file)

### Step 2: Connect and Deploy
```bash
# Connect to your instance
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@your-ec2-ip

# Run the automated setup
wget https://raw.githubusercontent.com/yourusername/landing_page/main/setup-server.sh
chmod +x setup-server.sh
./setup-server.sh
```

### Step 3: Configure Environment
```bash
# Update environment variables
nano frontend/.env.production
nano backend/.env

# Update domain in nginx config
sudo nano /etc/nginx/sites-available/cofoundercircle
# Replace 'your-domain.com' with your actual domain
```

### Step 4: SSL Certificate
```bash
# Install SSL certificate
sudo certbot --nginx -d your-domain.com
```

## 📊 Performance Expectations

### ✅ What t3.medium Can Handle:
- **100+ concurrent users**
- **Fast response times** (< 200ms)
- **Multiple API endpoints** simultaneously
- **File uploads** and processing
- **Real-time features** (if needed)
- **Database operations** without issues

### 📈 Monitoring Commands
```bash
# Check application status
pm2 status

# Monitor resources
pm2 monit

# Check system resources
htop
free -h
df -h

# View logs
pm2 logs
sudo tail -f /var/log/nginx/access.log
```

## 🔧 Optimizations for t3.medium

### 1. Memory Allocation
- **Frontend**: 1.5GB max (Node.js)
- **Backend**: 1.5GB max (Python)
- **System**: 1GB available
- **Total**: 4GB efficiently used

### 2. Worker Processes
- **Backend**: 2 workers for better concurrency
- **Frontend**: Single instance (sufficient)
- **Nginx**: Optimized for 4GB RAM

### 3. Caching Strategy
- **Static files**: 1 year cache
- **API responses**: 5 minutes cache
- **Database queries**: Optimized with indexes

## 🚨 Troubleshooting

### Common Issues:
1. **Application not starting**
   ```bash
   pm2 logs
   sudo systemctl status nginx
   ```

2. **High memory usage**
   ```bash
   pm2 monit
   free -h
   ```

3. **Slow performance**
   ```bash
   sudo nginx -t
   pm2 restart all
   ```

## 💰 Cost Breakdown

| Component | Monthly Cost |
|-----------|-------------|
| EC2 t3.medium | ~$30 |
| Domain (optional) | ~$1-2 |
| SSL Certificate | Free |
| **Total** | **~$31-32** |

## 🎯 Success Metrics

### ✅ Deployment Checklist:
- [ ] EC2 instance launched
- [ ] Security group configured
- [ ] Application deployed
- [ ] Domain configured
- [ ] SSL certificate installed
- [ ] Performance monitoring active
- [ ] Backup strategy in place

### 📊 Performance Targets:
- **Page Load Time**: < 2 seconds
- **API Response Time**: < 500ms
- **Uptime**: > 99.9%
- **Concurrent Users**: 100+

## 🚀 Next Steps After Deployment

1. **Test all features** thoroughly
2. **Monitor performance** for first 24 hours
3. **Set up alerts** for downtime
4. **Configure backups** (optional)
5. **Set up monitoring** dashboard

Your application will be production-ready and can handle significant traffic! 