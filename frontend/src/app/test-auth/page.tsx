'use client';

import { useState } from 'react';
import { signInWithGoogle, getCurrentUser, createUserProfile, getUserProfile } from '@/lib/firebase-secure';

export default function TestAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleSignIn = async () => {
    setLoading(true);
    addLog('Starting Google Sign-In...');
    
    try {
      const result = await signInWithGoogle();
      addLog(`Sign-In Result: ${JSON.stringify(result, null, 2)}`);
      
      if (result.error) {
        addLog(`Error: ${result.error}`);
      } else if (result.user) {
        setUser(result.user);
        addLog(`User signed in: ${result.user.email}`);
        
        // Check if profile exists
        addLog('Checking if user profile exists...');
        const existingProfile = await getUserProfile(result.user.id);
        addLog(`Existing profile: ${existingProfile ? 'Yes' : 'No'}`);
        
        if (!existingProfile) {
          addLog('Creating user profile...');
          const profileData = {
            user_id: result.user.id,
            email: result.user.email,
            full_name: result.user.full_name,
            avatar_url: result.user.avatar_url,
            google_id: result.user.google_id,
            user_type: 'student'
          };
          
          const createResult = await createUserProfile(result.user.id, profileData);
          addLog(`Profile creation result: ${JSON.stringify(createResult, null, 2)}`);
        }
      }
    } catch (error: any) {
      addLog(`Exception: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGetCurrentUser = async () => {
    addLog('Getting current user...');
    const currentUser = await getCurrentUser();
    addLog(`Current user: ${currentUser ? JSON.stringify(currentUser, null, 2) : 'null'}`);
    setUser(currentUser);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Test Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Controls</h2>
            <div className="space-y-4">
              <button
                onClick={handleSignIn}
                disabled={loading}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Signing In...' : 'Sign In with Google'}
              </button>
              
              <button
                onClick={handleGetCurrentUser}
                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Get Current User
              </button>
              
              <button
                onClick={clearLogs}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Clear Logs
              </button>
            </div>
            
            {user && (
              <div className="mt-6 p-4 bg-blue-50 rounded">
                <h3 className="font-semibold mb-2">Current User:</h3>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            )}
          </div>
          
          {/* Logs */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Logs</h2>
            <div className="bg-gray-900 text-green-400 p-4 rounded h-96 overflow-auto">
              {logs.length === 0 ? (
                <p className="text-gray-500">No logs yet. Try signing in!</p>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="text-sm mb-1">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 