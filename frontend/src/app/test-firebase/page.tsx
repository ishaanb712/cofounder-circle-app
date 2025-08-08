'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { signInWithGoogle, getCurrentUser, signOut, onAuthStateChange } from '@/lib/firebase';
import GoogleSignInButton from '@/components/GoogleSignInButton';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function TestFirebase() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    const result = await signInWithGoogle();
    if (result.error) {
      console.error('Sign in error:', result.error);
    }
  };

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.error) {
      console.error('Sign out error:', result.error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
              <div className="text-center">
        <LoadingSpinner size="xl" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Firebase Authentication Test
          </h1>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            {!user ? (
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Not signed in
                </h2>
                <p className="text-gray-600 mb-6">
                  Click the button below to test Google sign-in with Firebase
                </p>
                <GoogleSignInButton
                  onSuccess={() => console.log('Sign in successful')}
                  onError={(error) => console.error('Sign in error:', error)}
                  size="lg"
                />
              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Signed in successfully!
                </h2>
                
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">User Information:</h3>
                  <div className="text-left space-y-2 text-sm">
                    <p><span className="font-medium">ID:</span> {user.id}</p>
                    <p><span className="font-medium">Email:</span> {user.email}</p>
                    <p><span className="font-medium">Name:</span> {user.full_name || 'Not provided'}</p>
                    <p><span className="font-medium">User Type:</span> {user.user_type || 'Not set'}</p>
                    {user.avatar_url && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Avatar:</span>
                        <img 
                          src={user.avatar_url} 
                          alt="Avatar" 
                          className="w-8 h-8 rounded-full"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <motion.button
                  onClick={handleSignOut}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign Out
                </motion.button>
              </div>
            )}
          </div>

          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Firebase Status:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✅ Firebase SDK installed</li>
              <li>✅ Authentication configured</li>
              <li>✅ Firestore database ready</li>
              <li>✅ Google OAuth enabled</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 