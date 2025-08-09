#!/usr/bin/env node

const https = require('https');
const http = require('http');

console.log('🔍 Checking your current IP address and domain information...\n');

// Function to get public IP
function getPublicIP() {
  return new Promise((resolve, reject) => {
    https.get('https://api.ipify.org?format=json', (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result.ip);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

// Function to get domain info
function getDomainInfo() {
  return new Promise((resolve, reject) => {
    https.get('https://httpbin.org/headers', (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result.headers);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

async function main() {
  try {
    // Get public IP
    const publicIP = await getPublicIP();
    console.log('🌐 Your Public IP Address:', publicIP);
    
    // Get domain info
    const domainInfo = await getDomainInfo();
    console.log('🏠 Host Header:', domainInfo.Host || 'Not available');
    
    console.log('\n📋 Firebase Configuration Steps:');
    console.log('=====================================');
    console.log('1. Go to Firebase Console: https://console.firebase.google.com/');
    console.log('2. Select your project');
    console.log('3. Go to Authentication > Settings > Authorized domains');
    console.log('4. Add the following domains:');
    console.log(`   - ${publicIP}`);
    console.log(`   - http://${publicIP}`);
    console.log(`   - https://${publicIP}`);
    
    if (domainInfo.Host && domainInfo.Host !== publicIP) {
      console.log(`   - ${domainInfo.Host}`);
      console.log(`   - http://${domainInfo.Host}`);
      console.log(`   - https://${domainInfo.Host}`);
    }
    
    console.log('\n🔧 Additional Steps:');
    console.log('5. Wait a few minutes for changes to propagate');
    console.log('6. Clear your browser cache and cookies');
    console.log('7. Try signing in again');
    
    console.log('\n⚠️  If you\'re still having issues:');
    console.log('- Check if your IP address has changed');
    console.log('- Verify Firebase project configuration');
    console.log('- Check browser console for specific error messages');
    console.log('- Ensure all environment variables are set correctly');
    
  } catch (error) {
    console.error('❌ Error checking IP:', error.message);
    console.log('\n🔧 Manual Steps:');
    console.log('1. Visit https://whatismyipaddress.com/ to get your IP');
    console.log('2. Add your IP to Firebase Console > Authentication > Settings > Authorized domains');
  }
}

main(); 