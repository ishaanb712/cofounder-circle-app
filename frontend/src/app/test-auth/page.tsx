'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestAuthPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const { data: { user }, error } = await supabase.auth.getUser();
      
      console.log('Auth check result:', { user, error });
      
      if (error) {
        setError(error.message);
      } else {
        setUser(user);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/test-auth'
      }
    });
    
    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Supabase Authentication Test</h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-100 rounded">
            <h2 className="font-semibold mb-2">Environment Variables:</h2>
            <p className="text-sm">
              <strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}
            </p>
            <p className="text-sm">
              <strong>Supabase Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}
            </p>
          </div>

          <div className="p-4 bg-gray-100 rounded">
            <h2 className="font-semibold mb-2">Authentication Status:</h2>
            {loading ? (
              <p>Loading...</p>
            ) : user ? (
              <div>
                <p className="text-green-600">✅ Signed In</p>
                <p className="text-sm">Email: {user.email}</p>
                <p className="text-sm">ID: {user.id}</p>
                <button
                  onClick={signOut}
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div>
                <p className="text-red-600">❌ Not Signed In</p>
                {error && <p className="text-sm text-red-500">Error: {error}</p>}
                <button
                  onClick={signInWithGoogle}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Sign In with Google
                </button>
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-100 rounded">
            <h2 className="font-semibold mb-2">Actions:</h2>
            <button
              onClick={checkAuth}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 mr-2"
            >
              Refresh Auth Status
            </button>
            <a
              href="/test-upload"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 inline-block"
            >
              Test File Upload
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 