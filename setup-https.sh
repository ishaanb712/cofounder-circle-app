#!/bin/bash

# HTTPS Setup Script for StartupConnect
# This script sets up HTTPS encryption for both development and production

set -e

echo "🔐 HTTPS Setup for StartupConnect"
echo "=================================="

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if running on EC2
is_ec2() {
    curl -s http://169.254.169.254/latest/meta-data/instance-id >/dev/null 2>&1
}

# Function to setup development HTTPS
setup_dev_https() {
    echo "🛠️  Setting up development HTTPS..."
    
    # Check if OpenSSL is installed
    if ! command_exists openssl; then
        echo "❌ OpenSSL is not installed. Please install it first."
        exit 1
    fi
    
    # Generate SSL certificates
    echo "📝 Generating SSL certificates for development..."
    mkdir -p ssl
    
    # Generate private key
    openssl genrsa -out ssl/private.key 2048
    
    # Generate certificate signing request
    openssl req -new -key ssl/private.key -out ssl/certificate.csr -subj "/C=US/ST=State/L=City/O=StartupConnect/CN=localhost"
    
    # Generate self-signed certificate
    openssl x509 -req -days 365 -in ssl/certificate.csr -signkey ssl/private.key -out ssl/certificate.crt
    
    # Set proper permissions
    chmod 600 ssl/private.key
    chmod 644 ssl/certificate.crt
    
    echo "✅ Development SSL certificates generated!"
    echo "📁 Location: ssl/"
}

# Function to setup production HTTPS
setup_prod_https() {
    echo "🚀 Setting up production HTTPS..."
    
    if ! is_ec2; then
        echo "⚠️  This doesn't appear to be an EC2 instance."
        echo "   Production HTTPS setup is designed for EC2."
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
    
    # Check if certbot is installed
    if ! command_exists certbot; then
        echo "📦 Installing Certbot..."
        sudo apt update
        sudo apt install -y certbot python3-certbot-nginx
    fi
    
    # Get domain name
    read -p "Enter your domain name (e.g., yourdomain.com): " DOMAIN_NAME
    
    if [ -z "$DOMAIN_NAME" ]; then
        echo "❌ Domain name is required for production HTTPS."
        exit 1
    fi
    
    echo "🔐 Obtaining SSL certificate for $DOMAIN_NAME..."
    
    # Stop nginx temporarily
    sudo systemctl stop nginx
    
    # Get certificate
    sudo certbot certonly --standalone -d $DOMAIN_NAME --non-interactive --agree-tos --email admin@$DOMAIN_NAME
    
    # Update nginx configuration
    echo "📝 Updating nginx configuration..."
    sudo cp nginx-https.conf /etc/nginx/sites-available/startupconnect
    
    # Replace placeholder domain
    sudo sed -i "s/your-domain.com/$DOMAIN_NAME/g" /etc/nginx/sites-available/startupconnect
    
    # Enable site
    sudo ln -sf /etc/nginx/sites-available/startupconnect /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Test nginx configuration
    sudo nginx -t
    
    # Start nginx
    sudo systemctl start nginx
    sudo systemctl enable nginx
    
    # Setup automatic renewal
    echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
    
    echo "✅ Production HTTPS setup complete!"
    echo "🌐 Your site should now be available at: https://$DOMAIN_NAME"
}

# Function to update environment variables
update_env_vars() {
    echo "🔧 Updating environment variables for HTTPS..."
    
    # Update frontend environment
    if [ -f "frontend/.env.local" ]; then
        sed -i.bak 's|http://|https://|g' frontend/.env.local
        echo "✅ Updated frontend environment variables"
    fi
    
    # Update backend environment
    if [ -f "backend/.env" ]; then
        sed -i.bak 's|http://|https://|g' backend/.env
        echo "✅ Updated backend environment variables"
    fi
    
    echo "💡 Remember to update your API URLs to use HTTPS!"
}

# Function to restart services
restart_services() {
    echo "🔄 Restarting services..."
    
    # Restart PM2 processes
    if command_exists pm2; then
        pm2 restart all
        echo "✅ PM2 processes restarted"
    fi
    
    # Restart nginx
    if command_exists nginx; then
        sudo systemctl restart nginx
        echo "✅ Nginx restarted"
    fi
    
    echo "🎉 HTTPS setup complete!"
}

# Main script
echo "Choose setup type:"
echo "1) Development HTTPS (self-signed certificates)"
echo "2) Production HTTPS (Let's Encrypt certificates)"
echo "3) Update environment variables for HTTPS"
echo "4) Restart services"
echo "5) Full setup (Development + Environment + Restart)"

read -p "Enter your choice (1-5): " -n 1 -r
echo

case $REPLY in
    1)
        setup_dev_https
        ;;
    2)
        setup_prod_https
        ;;
    3)
        update_env_vars
        ;;
    4)
        restart_services
        ;;
    5)
        setup_dev_https
        update_env_vars
        restart_services
        ;;
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "🔐 HTTPS Setup Summary:"
echo "======================="
echo "• SSL certificates: ssl/ (development)"
echo "• Nginx config: nginx-https.conf (production)"
echo "• Security headers: Added to both frontend and backend"
echo "• Environment variables: Updated for HTTPS"
echo ""
echo "📚 Next steps:"
echo "1. For development: Run 'npm run dev:https' in frontend"
echo "2. For production: Deploy to EC2 with the nginx config"
echo "3. Test your site at https://your-domain.com"
echo ""
echo "✅ HTTPS encryption is now enabled!" 