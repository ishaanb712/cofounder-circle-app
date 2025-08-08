import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const signInWithGoogleDebug = async () => {
  try {
    console.log('Starting Google sign-in popup (debug mode)...');
    console.log('Auth domain:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
    console.log('Current URL:', window.location.href);
    
    const result = await signInWithPopup(auth, googleProvider);
    console.log('Sign-in successful:', result.user);
    
    return {
      user: result.user,
      error: null
    };
  } catch (error: any) {
    console.error('Google sign-in error (debug):', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    
    return {
      user: null,
      error: error.message || 'Failed to sign in with Google'
    };
  }
};
