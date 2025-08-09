import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, onAuthStateChanged, User, getRedirectResult } from 'firebase/auth';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { apiClient } from './api';

// Get the properly constructed API base URL
const getApiBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl) return envUrl;
  
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const port = '8000';
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `http://localhost:${port}`;
    }
    
    if (hostname.includes(':')) {
      const cleanHostname = hostname.split(':')[0];
      return `http://${cleanHostname}:${port}`;
    }
    return `http://${hostname}:${port}`;
  }
  
  return 'http://localhost:8000';
};

const API_BASE_URL = getApiBaseUrl();

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
};

// Debug: Check Firebase config
console.log('Firebase config check:');
console.log('API Key exists:', !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
console.log('Auth Domain exists:', !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
console.log('Project ID exists:', !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
console.log('API Base URL:', API_BASE_URL);

// Only access window object in browser environment
if (typeof window !== 'undefined') {
  console.log('Current domain:', window.location.hostname);
  console.log('Current origin:', window.location.origin);
}

// Check if required environment variables are set
if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 
    !process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 
    !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  console.error('Missing Firebase environment variables');
  console.error('Please check your .env.local file and ensure all Firebase variables are set');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Helper function to handle user profile creation and session
const handleUserProfileAndSession = async (user: any) => {
  try {
    const idToken = await user.getIdToken();
    
    // Check if user profile exists
    const profileCheckResponse = await fetch(`${API_BASE_URL}/api/user-profiles/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (profileCheckResponse.status === 404) {
      // Profile doesn't exist, create it
      const profileData = {
        user_id: user.uid,
        email: user.email || '',
        full_name: user.displayName || '',
        avatar_url: user.photoURL || '',
        google_id: user.uid,
        user_type: 'student' // Default type, can be updated later
      };
      
      const profileResponse = await fetch(`${API_BASE_URL}/api/user-profiles/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });
      
      if (profileResponse.ok) {
        console.log('User profile created successfully');
      } else {
        console.warn('Failed to create user profile:', profileResponse.status);
      }
    } else if (profileCheckResponse.ok) {
      console.log('User profile already exists');
    } else {
      console.warn('Error checking user profile:', profileCheckResponse.status);
    }
    
    // Create session
    const sessionResponse = await fetch(`${API_BASE_URL}/api/sessions/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (sessionResponse.ok) {
      const sessionData = await sessionResponse.json();
      console.log('Session created automatically:', sessionData);
      
      if (sessionData.session_token) {
        localStorage.setItem('session_token', sessionData.session_token);
      }
    } else {
      console.warn('Failed to create session automatically:', sessionResponse.status);
    }
  } catch (sessionError) {
    console.warn('Session creation failed:', sessionError);
  }
};

export interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  user_type?: 'student' | 'founder' | 'mentor' | 'vendor' | 'professional';
  google_id?: string;
}

export interface SignInResult {
  user: AuthUser | null;
  error: string | null;
}

// Real Firebase functions for authentication only
export const signInWithGoogle = async (): Promise<SignInResult> => {
  try {
    console.log('Starting Google sign-in...');
    console.log('Auth domain:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
    console.log('Current URL:', window.location.href);
    
    // Try popup first, fallback to redirect if blocked
    try {
      console.log('Attempting popup sign-in...');
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Popup sign-in successful:', result.user);
      
      const authUser: AuthUser = {
        id: result.user.uid,
        email: result.user.email || '',
        full_name: result.user.displayName || '',
        avatar_url: result.user.photoURL || '',
        google_id: result.user.providerData[0]?.uid || '',
        user_type: 'student' // Default user type
      };
      
      // Handle profile creation and session
      await handleUserProfileAndSession(result.user);
      
      return {
        user: authUser,
        error: null
      };
    } catch (popupError: any) {
      console.log('Popup failed, trying redirect:', popupError.message);
      
      // Check if it's a popup blocked error
      if (popupError.code === 'auth/popup-blocked' || 
          popupError.code === 'auth/popup-closed-by-user' ||
          popupError.message.includes('popup')) {
        
        console.log('Popup blocked, using redirect...');
        await signInWithRedirect(auth, googleProvider);
        
        // The function will redirect, so we return a pending result
        return {
          user: null,
          error: null
        };
      } else {
        // Re-throw other errors
        throw popupError;
      }
    }
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    
    // Handle specific IP authorization error
    if (error.code === 'auth/internal-error' || error.message.includes('internal-error')) {
      console.error('IP Authorization Error Detected!');
      console.error('Your current IP address may not be authorized in Firebase Console.');
      console.error('Current IP/Domain:', window.location.hostname);
      console.error('Please add the following to Firebase Console > Authentication > Settings > Authorized domains:');
      console.error('-', window.location.hostname);
      console.error('-', window.location.origin);
      console.error('-', window.location.hostname + ' (without protocol)');
      
      return {
        user: null,
        error: `IP Authorization Error: Your current domain/IP (${window.location.hostname}) is not authorized in Firebase Console. Please add it to the authorized domains list.`
      };
    }
    
    return {
      user: null,
      error: error.message || 'Failed to sign in with Google'
    };
  }
};

// Handle redirect result
export const handleRedirectResult = async (): Promise<SignInResult> => {
  try {
    console.log('Getting redirect result...');
    const result = await getRedirectResult(auth);
    console.log('Raw redirect result:', result);
    
    if (!result) {
      console.log('No redirect result found');
      return { user: null, error: null };
    }
    
    const user = result.user;
    
    const authUser: AuthUser = {
      id: user.uid,
      email: user.email || '',
      full_name: user.displayName || '',
      avatar_url: user.photoURL || '',
      google_id: user.providerData[0]?.uid || '',
      user_type: 'student' // Default user type
    };
    
    // Handle profile creation and session
    await handleUserProfileAndSession(user);
    
    return {
      user: authUser,
      error: null
    };
  } catch (error: any) {
    console.error('Redirect result error:', error);
    return {
      user: null,
      error: error.message || 'Failed to complete sign in'
    };
  }
};

export const signOut = async (): Promise<{ error: string | null }> => {
  try {
    // First, call backend logout endpoint to record logout time
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const idToken = await currentUser.getIdToken();
        
        // Get the session token from localStorage or wherever it's stored
        const sessionToken = localStorage.getItem('session_token');
        
        if (sessionToken) {
          const logoutResponse = await fetch(`${API_BASE_URL}/api/sessions/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${idToken}`,
              'x-session-token': sessionToken,
              'Content-Type': 'application/json'
            }
          });
          
          if (logoutResponse.ok) {
            console.log('Session logout recorded successfully');
          } else {
            console.warn('Failed to record session logout:', logoutResponse.status);
          }
        }
      }
    } catch (logoutError) {
      console.warn('Session logout failed:', logoutError);
    }
    
    // Then sign out from Firebase
    await firebaseSignOut(auth);
    
    // Clear session token from localStorage
    localStorage.removeItem('session_token');
    
    return { error: null };
  } catch (error: any) {
    console.error('Sign-out error:', error);
    return { error: error.message || 'Failed to sign out' };
  }
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const user = auth.currentUser;
    if (!user) return null;
    
    return {
      id: user.uid,
      email: user.email || '',
      full_name: user.displayName || '',
      avatar_url: user.photoURL || '',
      google_id: user.providerData[0]?.uid || '',
      user_type: 'student' // Default user type
    };
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

export const updateUserProfile = async (
  userId: string,
  updates: Partial<AuthUser>
): Promise<{ error: string | null }> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No authenticated user');
    }

    const idToken = await currentUser.getIdToken();
    const result = await apiClient.updateUserProfile(idToken, updates);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to update profile');
    }
    
    return { error: null };
  } catch (error: any) {
    console.error('Update user profile error:', error);
    return { error: error.message || 'Failed to update profile' };
  }
};

export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
  return onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      const authUser: AuthUser = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        full_name: firebaseUser.displayName || '',
        avatar_url: firebaseUser.photoURL || '',
        google_id: firebaseUser.providerData[0]?.uid || '',
        user_type: 'student' // Default user type
      };
      callback(authUser);
    } else {
      callback(null);
    }
  });
};

// Backend API functions for user profiles
export const createUserProfile = async (userId: string, userData: any) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No authenticated user');
    }

    const idToken = await currentUser.getIdToken();
    const result = await apiClient.createUserProfile(idToken, userData);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to create user profile');
    }
    
    // Also create a session if profile creation was successful
    try {
      const sessionResponse = await fetch(`${API_BASE_URL}/api/sessions/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (sessionResponse.ok) {
        const sessionData = await sessionResponse.json();
        console.log('Session created after profile creation:', sessionData);
      } else {
        console.warn('Failed to create session after profile creation:', sessionResponse.status);
      }
    } catch (sessionError) {
      console.warn('Session creation after profile creation failed:', sessionError);
    }
    
    return { error: null };
  } catch (error: any) {
    console.error('Create user profile error:', error);
    return { error: error.message || 'Failed to create user profile' };
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No authenticated user');
    }

    const idToken = await currentUser.getIdToken();
    const result = await apiClient.getUserProfile(idToken);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to get user profile');
    }
    
    return result.data;
  } catch (error) {
    console.error('Get user profile error:', error);
    return null;
  }
};

export const updateUserProfileData = async (userId: string, updates: any) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No authenticated user');
    }

    const idToken = await currentUser.getIdToken();
    const result = await apiClient.updateUserProfile(idToken, updates);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to update user profile');
    }
    
    return { error: null };
  } catch (error: any) {
    console.error('Update user profile data error:', error);
    return { error: error.message || 'Failed to update user profile' };
  }
};

export const verifyToken = async (): Promise<{ user: any; profile: any } | null> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return null;
    }

    const idToken = await currentUser.getIdToken();
    const result = await apiClient.verifyToken(idToken);
    
    if (!result.success) {
      throw new Error(result.error || 'Token verification failed');
    }
    
    return result.data;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}; 