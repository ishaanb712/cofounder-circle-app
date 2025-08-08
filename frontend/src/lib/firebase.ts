import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { supabase } from './supabase';

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
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    const authUser: AuthUser = {
      id: user.uid,
      email: user.email || '',
      full_name: user.displayName || '',
      avatar_url: user.photoURL || '',
      google_id: user.providerData[0]?.uid || '',
      user_type: 'student' // Default user type
    };
    
    return {
      user: authUser,
      error: null
    };
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    return {
      user: null,
      error: error.message || 'Failed to sign in with Google'
    };
  }
};

export const signOut = async (): Promise<{ error: string | null }> => {
  try {
    await firebaseSignOut(auth);
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
    // Update user profile in Supabase
    const { error } = await supabase
      .from('landing_page_user_profiles')
      .update(updates)
      .eq('user_id', userId);
    
    if (error) throw error;
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

// User profile functions - use backend API instead of direct database access
import { apiClient } from './api';

export const createUserProfile = async (userId: string, userData: any) => {
  try {
    // Get Firebase token for authentication
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No authenticated user');
    }
    
    const token = await user.getIdToken();
    const response = await apiClient.createUserProfile(token, userData);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to create user profile');
    }
    
    return { error: null };
  } catch (error: any) {
    console.error('Create user profile error:', error);
    return { error: error.message || 'Failed to create user profile' };
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    // Get Firebase token for authentication
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No authenticated user');
    }
    
    const token = await user.getIdToken();
    const response = await apiClient.getUserProfile(token);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to get user profile');
    }
    
    return response.data;
  } catch (error) {
    console.error('Get user profile error:', error);
    return null;
  }
};

export const updateUserProfileData = async (userId: string, updates: any) => {
  try {
    // Get Firebase token for authentication
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No authenticated user');
    }
    
    const token = await user.getIdToken();
    const response = await apiClient.updateUserProfile(token, updates);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to update user profile');
    }
    
    return { error: null };
  } catch (error: any) {
    console.error('Update user profile data error:', error);
    return { error: error.message || 'Failed to update user profile' };
  }
}; 