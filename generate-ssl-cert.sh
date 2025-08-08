#!/bin/bash

# SSL Certificate Generation Script
# This script generates self-signed SSL certificates for development

echo "🔐 Generating SSL certificates for development..."

# Create certificates directory
mkdir -p ssl

# Generate private key
echo "📝 Generating private key..."
openssl genrsa -out ssl/private.key 2048

# Generate certificate signing request
echo "📋 Generating certificate signing request..."
openssl req -new -key ssl/private.key -out ssl/certificate.csr -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

# Generate self-signed certificate
echo "🎫 Generating self-signed certificate..."
openssl x509 -req -days 365 -in ssl/certificate.csr -signkey ssl/private.key -out ssl/certificate.crt

# Set proper permissions
chmod 600 ssl/private.key
chmod 644 ssl/certificate.crt

echo "✅ SSL certificates generated successfully!"
echo "📁 Certificates saved in: ssl/"
echo "🔑 Private key: ssl/private.key"
echo "🎫 Certificate: ssl/certificate.crt"
echo ""
echo "⚠️  Note: These are self-signed certificates for development only."
echo "   For production, use certificates from a trusted Certificate Authority." 