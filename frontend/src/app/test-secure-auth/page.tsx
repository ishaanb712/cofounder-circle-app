'use client';

import { useState } from 'react';
import { signInWithGoogle, getCurrentUser, createUserProfile, getUserProfile, verifyToken } from '@/lib/firebase-secure';
import { apiClient } from '@/lib/api';

export default function TestSecureAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [backendStatus, setBackendStatus] = useState<string>('unknown');

  // Debug: Check if functions are available
  console.log('TestSecureAuth component loaded');
  console.log('signInWithGoogle available:', typeof signInWithGoogle);
  console.log('verifyToken available:', typeof verifyToken);
  console.log('createUserProfile available:', typeof createUserProfile);

  const addLog = (message: string) => {
    console.log('addLog called:', message); // Debug log
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testBackendConnection = async () => {
    addLog('🔍 Testing backend connection...');
    try {
      const response = await fetch('http://localhost:8000/health');
      const data = await response.json();
      addLog(`✅ Backend health check: ${JSON.stringify(data)}`);
      setBackendStatus('connected');
    } catch (error: any) {
      addLog(`❌ Backend connection failed: ${error.message}`);
      setBackendStatus('failed');
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    addLog('🔐 Starting secure Google Sign-In...');
    console.log('handleSignIn called'); // Debug log
    
    try {
      addLog('📞 Calling signInWithGoogle...');
      console.log('About to call signInWithGoogle'); // Debug log
      const result = await signInWithGoogle();
      console.log('signInWithGoogle result:', result); // Debug log
      addLog(`✅ Sign-In Result: ${JSON.stringify(result, null, 2)}`);
      
      if (result.error) {
        addLog(`❌ Error: ${result.error}`);
      } else if (result.user) {
        setUser(result.user);
        addLog(`👤 User signed in: ${result.user.email} (ID: ${result.user.id})`);
        
        // Test backend token verification
        addLog('🔍 Testing backend token verification...');
        addLog('📞 Calling verifyToken...');
        console.log('About to call verifyToken'); // Debug log
        const tokenResult = await verifyToken();
        console.log('verifyToken result:', tokenResult); // Debug log
        addLog(`📊 Token verification result: ${tokenResult ? 'Success' : 'Failed'}`);
        if (tokenResult) {
          addLog(`✅ Backend token verification successful: ${JSON.stringify(tokenResult, null, 2)}`);
        } else {
          addLog('❌ Backend token verification failed');
        }
        
        // Test profile creation via backend
        addLog('🔄 Testing backend profile creation...');
        addLog('📞 Calling getUserProfile...');
        console.log('About to call getUserProfile'); // Debug log
        const existingProfile = await getUserProfile(result.user.id);
        console.log('getUserProfile result:', existingProfile); // Debug log
        addLog(`📊 Existing profile: ${existingProfile ? 'Yes' : 'No'}`);
        
        if (!existingProfile) {
          addLog('🔄 Creating user profile via backend API...');
          addLog('📞 Calling createUserProfile...');
          const profileData = {
            user_id: result.user.id,
            email: result.user.email,
            full_name: result.user.full_name,
            avatar_url: result.user.avatar_url,
            google_id: result.user.google_id,
            user_type: 'student'
          };
          
          addLog(`📦 Profile data: ${JSON.stringify(profileData, null, 2)}`);
          console.log('About to call createUserProfile with data:', profileData); // Debug log
          const createResult = await createUserProfile(result.user.id, profileData);
          console.log('createUserProfile result:', createResult); // Debug log
          addLog(`✅ Profile creation result: ${JSON.stringify(createResult, null, 2)}`);
          
          if (!createResult.error) {
            addLog('🎉 Profile created successfully via backend!');
          } else {
            addLog(`❌ Profile creation error: ${createResult.error}`);
          }
        } else {
          addLog('✅ Profile already exists - backend API working!');
        }
      }
    } catch (error: any) {
      console.error('Error in handleSignIn:', error); // Debug log
      addLog(`❌ Exception: ${error.message}`);
      addLog(`❌ Error stack: ${error.stack}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGetCurrentUser = async () => {
    addLog('🔍 Getting current user...');
    const currentUser = await getCurrentUser();
    addLog(`👤 Current user: ${currentUser ? JSON.stringify(currentUser, null, 2) : 'null'}`);
    setUser(currentUser);
  };

  const testBackendAPI = async () => {
    addLog('🧪 Testing backend API endpoint...');
    try {
      const response = await fetch('http://localhost:8000/test');
      const data = await response.json();
      addLog(`✅ Backend test endpoint: ${JSON.stringify(data)}`);
    } catch (error: any) {
      addLog(`❌ Backend test failed: ${error.message}`);
    }
  };

  const testConsoleLog = () => {
    console.log('Test button clicked!');
    addLog('🧪 Console test button clicked!');
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔐 Secure Backend-Only Authentication Test</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">🔧 Controls</h2>
            <div className="space-y-4">
              <button
                onClick={testBackendConnection}
                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                🖥️ Test Backend Connection
              </button>
              
              <button
                onClick={handleSignIn}
                disabled={loading}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? '🔐 Signing In...' : '🔐 Sign In with Secure Backend'}
              </button>
              
              <button
                onClick={handleGetCurrentUser}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                🔍 Get Current User
              </button>
              
              <button
                onClick={testBackendAPI}
                className="w-full bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
              >
                🧪 Test Backend API Endpoint
              </button>
              
              <button
                onClick={testConsoleLog}
                className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                🧪 Console Test Button
              </button>
              
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
          
          {/* Status */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">📊 Status</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${backendStatus === 'connected' ? 'bg-green-500' : backendStatus === 'failed' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                <span>Backend: {backendStatus === 'connected' ? '✅ Connected' : backendStatus === 'failed' ? '❌ Failed' : '⏳ Unknown'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${user ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                <span>Authentication: {user ? '✅ Signed In' : '❌ Not Signed In'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span>Frontend: ✅ Running</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 rounded">
              <h4 className="font-semibold text-yellow-800 mb-2">🔐 Security Features</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Backend-only database operations</li>
                <li>• Firebase token verification</li>
                <li>• User data isolation</li>
                <li>• No client-side secrets</li>
                <li>• RLS database protection</li>
              </ul>
            </div>
          </div>
          
          {/* Logs */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">📋 Logs</h2>
            <div className="bg-gray-900 text-green-400 p-4 rounded h-96 overflow-auto">
              {logs.length === 0 ? (
                <p className="text-gray-500">No logs yet. Start testing!</p>
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