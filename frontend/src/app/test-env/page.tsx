'use client';

import { useState } from 'react';

export default function TestEnvironment() {
  const [envStatus, setEnvStatus] = useState<any>(null);

  const checkEnvironment = () => {
    const envVars = {
      // Firebase
      NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      
      // Supabase
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    };

    const status = {
      firebase: {
        apiKey: !!envVars.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: !!envVars.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: !!envVars.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      },
      supabase: {
        url: !!envVars.NEXT_PUBLIC_SUPABASE_URL,
        anonKey: !!envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
      allSet: Object.values(envVars).every(v => !!v)
    };

    setEnvStatus({ envVars, status });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔧 Environment Variables Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Check</h2>
          <button
            onClick={checkEnvironment}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Check Environment Variables
          </button>
        </div>

        {envStatus && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Firebase Status */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Firebase Configuration</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${envStatus.status.firebase.apiKey ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span>API Key: {envStatus.status.firebase.apiKey ? '✅ Set' : '❌ Missing'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${envStatus.status.firebase.authDomain ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span>Auth Domain: {envStatus.status.firebase.authDomain ? '✅ Set' : '❌ Missing'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${envStatus.status.firebase.projectId ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span>Project ID: {envStatus.status.firebase.projectId ? '✅ Set' : '❌ Missing'}</span>
                </div>
              </div>
            </div>

            {/* Supabase Status */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Supabase Configuration</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${envStatus.status.supabase.url ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span>URL: {envStatus.status.supabase.url ? '✅ Set' : '❌ Missing'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${envStatus.status.supabase.anonKey ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span>Anon Key: {envStatus.status.supabase.anonKey ? '✅ Set' : '❌ Missing'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {envStatus && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Overall Status</h3>
            <div className={`p-4 rounded ${envStatus.status.allSet ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {envStatus.status.allSet ? 
                '✅ All environment variables are set correctly!' : 
                '❌ Some environment variables are missing. Check your .env.local file.'
              }
            </div>
            
            {!envStatus.status.allSet && (
              <div className="mt-4 p-4 bg-yellow-100 rounded">
                <h4 className="font-semibold text-yellow-800 mb-2">How to Fix:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Create a <code>.env.local</code> file in the frontend directory</li>
                  <li>Add your Firebase and Supabase credentials</li>
                  <li>Restart your development server</li>
                </ol>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <div className="space-y-2">
            <a href="/test-auth" className="block text-blue-600 hover:underline">🔐 Test Authentication</a>
            <a href="/test-jwt-security" className="block text-blue-600 hover:underline">🛡️ Test JWT Security</a>
            <a href="/" className="block text-blue-600 hover:underline">🏠 Go Home</a>
          </div>
        </div>
      </div>
    </div>
  );
} 