'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { auth, getCurrentUser, createUserProfile, getUserProfile } from '@/lib/firebase-secure';
import { onAuthStateChanged } from 'firebase/auth';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setStatus('loading');
        setMessage('Checking authentication...');

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            try {
              setMessage('User authenticated, checking profile...');
              
              // Get current user data
              const user = await getCurrentUser();
              if (!user) {
                throw new Error('Failed to get user data');
              }

              // Check if user profile exists
              const existingProfile = await getUserProfile(user.id);
              
              if (!existingProfile) {
                setMessage('Creating user profile...');
                
                // Create new user profile
                const profileData = {
                  user_id: user.id,
                  email: user.email,
                  full_name: user.full_name,
                  avatar_url: user.avatar_url,
                  google_id: user.google_id,
                  user_type: 'student', // Default user type
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                };

                const result = await createUserProfile(user.id, profileData);
                if (result.error) {
                  throw new Error(result.error);
                }
              }

              setStatus('success');
              setMessage('Authentication successful! Redirecting...');
              
              // Redirect to dashboard or home page
              setTimeout(() => {
                router.push('/dashboard');
              }, 2000);

            } catch (error: any) {
              console.error('Profile setup error:', error);
              setStatus('error');
              setMessage(error.message || 'Failed to set up user profile');
            }
          } else {
            setStatus('error');
            setMessage('No authenticated user found');
          }
        });

        // Cleanup subscription
        return () => unsubscribe();
      } catch (error: any) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setMessage(error.message || 'Authentication failed');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4"
      >
        <div className="text-center">
          {status === 'loading' && (
            <div className="flex flex-col items-center space-y-4">
              <LoadingSpinner size="xl" />
              <h2 className="text-2xl font-bold text-gray-900">Authenticating...</h2>
              <p className="text-gray-600">{message}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Success!</h2>
              <p className="text-gray-600">{message}</p>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center space-y-4">
              <XCircle className="w-12 h-12 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">Error</h2>
              <p className="text-gray-600">{message}</p>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go Back Home
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
} 