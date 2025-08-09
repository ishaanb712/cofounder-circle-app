# 🔧 Firebase IP Authorization Fix

## **Problem:**
You're getting a Firebase authentication error because your new IP address (13.53.254.193) is not authorized in your Firebase project settings.

**Error:** `Firebase: Error (auth/internal-error)`

## **Solution: Add Your IP to Firebase Authorized Domains**

### **Step 1: Access Firebase Console**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication** → **Settings** → **Authorized domains**

### **Step 2: Add Your New IP/Domain**
Add these domains to the authorized domains list:
```
13.53.254.193
http://13.53.254.193
https://13.53.254.193
```

**Note:** If you have a domain name pointing to this IP, add it instead:
```
your-domain.com
www.your-domain.com
```

### **Step 3: Alternative - Add All Possible IPs**
Since your current public IP is `182.69.179.50` but you're using `13.53.254.193`, add both:
```
13.53.254.193
182.69.179.50
http://13.53.254.193
https://13.53.254.193
http://182.69.179.50
https://182.69.179.50
```

## **Step 4: Update Firebase Configuration**

### **Frontend Environment Variables**
Create or update `frontend/.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### **Backend Environment Variables**
Update `backend/.env`:
```env
FIREBASE_SERVICE_ACCOUNT_KEY=path/to/serviceAccountKey.json
FIREBASE_PROJECT_ID=your-project-id
```

## **Step 5: Verify Configuration**

### **Check Firebase Config**
The code now includes debug information. Check your browser console for:
```
Firebase config check:
API Key exists: true/false
Auth Domain exists: true/false
Project ID exists: true/false
Current domain: 13.53.254.193
Current origin: http://13.53.254.193
```

## **Step 6: Test Authentication**

### **Test Google Sign-In**
1. Start your application: `npm run dev`
2. Try signing in with Google
3. Check browser console for any errors
4. Look for the specific IP authorization error message

## **Alternative Solutions**

### **Option 1: Use Localhost for Development**
If you're still in development, you can use localhost:
```
localhost
127.0.0.1
```

### **Option 2: Use Firebase Emulator**
For local development, you can use Firebase emulator:
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase emulator
firebase init emulators

# Start emulators
firebase emulators:start
```

### **Option 3: Update CORS Settings**
If you're still having issues, update your CORS settings in Firebase:

1. Go to **Firestore Database** → **Rules**
2. Update the rules to allow your IP:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow access from your IP
    match /{document=**} {
      allow read, write: if request.auth != null || 
        request.origin.matches('.*13\.53\.254\.193.*');
    }
  }
}
```

## **Troubleshooting**

### **Common Issues:**
1. **CORS errors**: Make sure your domain is in authorized domains
2. **Authentication errors**: Check if Google provider is enabled
3. **Firestore permission errors**: Verify security rules
4. **Service account errors**: Ensure private key is properly formatted

### **Debug Steps:**
1. Check browser console for specific error messages
2. Verify Firebase project configuration
3. Test with a different browser or incognito mode
4. Check if your IP is actually 13.53.254.193 (use `curl ifconfig.me`)

### **Emergency Fix:**
If you need immediate access, you can temporarily disable authentication requirements in Firebase Console:
1. Go to **Authentication** → **Sign-in method**
2. Temporarily disable Google provider
3. Re-enable after adding your IP to authorized domains

## **Production Considerations**

### **For Production Deployment:**
1. Use a proper domain name instead of IP address
2. Set up SSL certificates
3. Configure proper CORS settings
4. Use environment-specific Firebase projects

### **Security Best Practices:**
1. Don't use IP addresses in production
2. Use proper domain names
3. Set up proper security rules
4. Monitor authentication events

## **Next Steps**

After fixing the IP authorization:
1. Test the complete authentication flow
2. Verify user profile creation
3. Test backend API integration
4. Monitor for any remaining issues

## **Quick Fix Commands**

### **Check Current IP:**
```bash
curl ifconfig.me
```

### **Test Firebase Connection:**
```bash
# Check if Firebase project is accessible
curl -I https://your-project.firebaseapp.com
```

### **Clear Browser Cache:**
1. Open browser developer tools (F12)
2. Right-click on refresh button
3. Select "Empty Cache and Hard Reload" 