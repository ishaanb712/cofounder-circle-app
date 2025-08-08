# Firebase Setup Guide

This guide will help you set up Firebase for the StartupConnect platform, replacing the previous Supabase implementation.

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: "startupconnect" (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In Firebase Console, go to "Authentication" > "Sign-in method"
2. Enable "Google" provider
3. Add your authorized domain (localhost for development)
4. Configure OAuth consent screen if needed

## 3. Set up Firestore Database

1. Go to "Firestore Database" in Firebase Console
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select a location (choose closest to your users)
5. Click "Done"

## 4. Create Firestore Collections

Run these commands in the Firestore console or use the Firebase CLI:

### User Profiles Collection
```javascript
// Collection: user_profiles
// Document ID: auto-generated or user UID
{
  "id": "user-uid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "avatar_url": "https://example.com/avatar.jpg",
  "user_type": "founder", // student, founder, mentor, vendor, professional
  "google_id": "google-uid",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### User Type Specific Collections

#### Students Collection
```javascript
// Collection: students
{
  "id": "student-doc-id",
  "user_id": "user-uid",
  "university": "Stanford University",
  "graduation_year": 2025,
  "major": "Computer Science",
  "skills": ["JavaScript", "React", "Python"],
  "interests": ["AI", "Startups", "Web Development"],
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### Founders Collection
```javascript
// Collection: founders
{
  "id": "founder-doc-id",
  "user_id": "user-uid",
  "company_name": "TechStart Inc",
  "industry": "SaaS",
  "funding_stage": "Seed",
  "team_size": 5,
  "description": "Building the next big thing",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### Mentors Collection
```javascript
// Collection: mentors
{
  "id": "mentor-doc-id",
  "user_id": "user-uid",
  "expertise": ["Product Management", "Marketing", "Fundraising"],
  "experience_years": 10,
  "hourly_rate": 150.00,
  "availability": "Weekdays 6-8 PM",
  "bio": "Experienced startup mentor",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### Vendors Collection
```javascript
// Collection: vendors
{
  "id": "vendor-doc-id",
  "user_id": "user-uid",
  "company_name": "DevAgency",
  "services": ["Web Development", "Mobile Apps", "UI/UX Design"],
  "industry": "Technology",
  "pricing_model": "Hourly",
  "description": "Full-service development agency",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### Working Professionals Collection
```javascript
// Collection: working_professionals
{
  "id": "professional-doc-id",
  "user_id": "user-uid",
  "company": "Google",
  "position": "Senior Software Engineer",
  "industry": "Technology",
  "experience_years": 8,
  "skills": ["Java", "Kubernetes", "Cloud Architecture"],
  "interests": ["Open Source", "Mentoring", "AI"],
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

## 5. Get Firebase Configuration

### Frontend Configuration
1. Go to Project Settings > General
2. Scroll down to "Your apps"
3. Click the web icon (</>)
4. Register app with nickname "StartupConnect Web"
5. Copy the config object

### Backend Service Account
1. Go to Project Settings > Service accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Save it securely (don't commit to git)

## 6. Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### Backend (.env)
```env
# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your-project.iam.gserviceaccount.com

# Or use service account file path
FIREBASE_SERVICE_ACCOUNT_KEY=path/to/serviceAccountKey.json
```

## 7. Security Rules

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profiles - users can read/write their own profile
    match /user_profiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // User type specific collections
    match /students/{docId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.user_id;
    }
    
    match /founders/{docId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.user_id;
    }
    
    match /mentors/{docId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.user_id;
    }
    
    match /vendors/{docId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.user_id;
    }
    
    match /working_professionals/{docId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.user_id;
    }
  }
}
```

## 8. Install Dependencies

### Frontend
```bash
cd frontend
npm install firebase
```

### Backend
```bash
cd backend
pip install firebase-admin
```

## 9. Testing the Setup

1. Start the frontend: `npm run dev`
2. Try signing in with Google
3. Check Firestore to see if user profile was created
4. Test the backend API endpoints

## 10. Deployment Considerations

### Frontend (Vercel/Netlify)
- Add environment variables in deployment platform
- Update authorized domains in Firebase Console

### Backend (Railway/Heroku)
- Add environment variables in deployment platform
- Use service account JSON file or environment variables

## 11. Monitoring and Analytics

1. Enable Firebase Analytics in the console
2. Set up Firebase Performance Monitoring
3. Configure error reporting
4. Set up alerts for authentication events

## Troubleshooting

### Common Issues:
1. **CORS errors**: Add your domain to authorized domains in Firebase Console
2. **Authentication errors**: Check if Google provider is enabled
3. **Firestore permission errors**: Verify security rules
4. **Service account errors**: Ensure private key is properly formatted

### Debug Commands:
```bash
# Check Firebase connection
firebase projects:list

# Test authentication
firebase auth:export users.json

# Test Firestore
firebase firestore:indexes
```

This setup provides a robust, scalable foundation for your startup platform with Firebase's powerful authentication and database capabilities. 