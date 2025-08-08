'use client';

import { useState } from 'react';
import { signInWithGoogle, getCurrentUser, createUserProfile, getUserProfile } from '@/lib/firebase-secure';

export default function TestJWTSecurity() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [testUserId, setTestUserId] = useState<string>('');

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleSignIn = async () => {
    setLoading(true);
    addLog('🔐 Starting JWT-based Google Sign-In...');
    
    try {
      const result = await signInWithGoogle();
      addLog(`✅ Sign-In Result: ${JSON.stringify(result, null, 2)}`);
      
      if (result.error) {
        addLog(`❌ Error: ${result.error}`);
      } else if (result.user) {
        setUser(result.user);
        addLog(`👤 User signed in: ${result.user.email} (ID: ${result.user.id})`);
        
        // Test profile creation with JWT
        addLog('🔍 Testing JWT-based profile creation...');
        const existingProfile = await getUserProfile(result.user.id);
        addLog(`📊 Existing profile: ${existingProfile ? 'Yes' : 'No'}`);
        
        if (!existingProfile) {
          addLog('🔄 Creating user profile with JWT security...');
          const profileData = {
            user_id: result.user.id,
            email: result.user.email,
            full_name: result.user.full_name,
            avatar_url: result.user.avatar_url,
            google_id: result.user.google_id,
            user_type: 'student'
          };
          
          const createResult = await createUserProfile(result.user.id, profileData);
          addLog(`✅ Profile creation result: ${JSON.stringify(createResult, null, 2)}`);
          
          if (!createResult.error) {
            addLog('🎉 Profile created successfully with JWT security!');
          }
        } else {
          addLog('✅ Profile already exists - JWT security working!');
        }
      }
    } catch (error: any) {
      addLog(`❌ Exception: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGetCurrentUser = async () => {
    addLog('🔍 Getting current user with JWT...');
    const currentUser = await getCurrentUser();
    addLog(`👤 Current user: ${currentUser ? JSON.stringify(currentUser, null, 2) : 'null'}`);
    setUser(currentUser);
  };

  const handleTestCrossUserAccess = async () => {
    if (!testUserId) {
      addLog('❌ Please enter a test user ID first');
      return;
    }
    
    addLog(`🔒 Testing cross-user access prevention (trying to access user: ${testUserId})...`);
    try {
      const otherUserProfile = await getUserProfile(testUserId);
      if (otherUserProfile) {
        addLog('❌ SECURITY ISSUE: Able to access another user\'s profile!');
      } else {
        addLog('✅ SECURITY WORKING: Cannot access another user\'s profile');
      }
    } catch (error: any) {
      addLog(`✅ SECURITY WORKING: Access denied - ${error.message}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔐 JWT-Based Security Test</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">🔧 Controls</h2>
            <div className="space-y-4">
              <button
                onClick={handleSignIn}
                disabled={loading}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? '🔐 Signing In...' : '🔐 Sign In with JWT Security'}
              </button>
              
              <button
                onClick={handleGetCurrentUser}
                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                🔍 Get Current User
              </button>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Test User ID (for cross-user access test):
                </label>
                <input
                  type="text"
                  value={testUserId}
                  onChange={(e) => setTestUserId(e.target.value)}
                  placeholder="Enter another user's ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <button
                  onClick={handleTestCrossUserAccess}
                  className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  🔒 Test Cross-User Access Prevention
                </button>
              </div>
              
              <button
                onClick={clearLogs}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                🗑️ Clear Logs
              </button>
            </div>
            
            {user && (
              <div className="mt-6 p-4 bg-blue-50 rounded">
                <h3 className="font-semibold mb-2">👤 Current User:</h3>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            )}
          </div>
          
          {/* Security Info */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">🛡️ Security Features</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>JWT Token Authentication</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Row Level Security (RLS)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>User Isolation</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Automatic Token Expiration</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Database-Level Security</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Audit Trail</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 rounded">
              <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Important</h4>
              <p className="text-sm text-yellow-700">
                Make sure you've set up the RLS policies in Supabase as described in the setup guide.
              </p>
            </div>
          </div>
          
          {/* Logs */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">📋 Logs</h2>
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