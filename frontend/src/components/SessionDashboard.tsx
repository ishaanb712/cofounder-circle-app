'use client';

import React, { useState, useEffect } from 'react';
import { sessionManager, Session } from '../lib/session';

interface SessionDashboardProps {
  userId?: string;
}

export default function SessionDashboard({ userId }: SessionDashboardProps) {
  const [activeSessions, setActiveSessions] = useState<Session[]>([]);
  const [sessionHistory, setSessionHistory] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const [activeResult, historyResult] = await Promise.all([
        sessionManager.getActiveSessions(),
        sessionManager.getSessionHistory()
      ]);

      if (activeResult.success) {
        setActiveSessions(activeResult.sessions || []);
      }

      if (historyResult.success) {
        setSessionHistory(historyResult.sessions || []);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
      setMessage('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAll = async () => {
    setLoading(true);
    try {
      const result = await sessionManager.endAllSessions();
      if (result.success) {
        setMessage(`Successfully ended ${result.sessions_ended} sessions`);
        await loadSessions(); // Reload sessions
      } else {
        setMessage(result.error || 'Failed to end sessions');
      }
    } catch (error) {
      console.error('Error ending all sessions:', error);
      setMessage('Failed to end sessions');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getDeviceInfo = (session: Session) => {
    if (session.device_info) {
      return session.device_info;
    }
    if (session.user_agent) {
      return session.user_agent.substring(0, 50) + '...';
    }
    return 'Unknown device';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Session Management</h2>
        
        {message && (
          <div className={`mb-4 p-3 rounded ${
            message.includes('Successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}

        {/* Active Sessions */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700">
              Active Sessions ({activeSessions.length})
            </h3>
            <button
              onClick={handleLogoutAll}
              disabled={loading || activeSessions.length === 0}
              className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {loading ? 'Processing...' : 'Logout All Devices'}
            </button>
          </div>

          {loading ? (
            <div className="text-center py-4">Loading sessions...</div>
          ) : activeSessions.length === 0 ? (
            <div className="text-gray-500 text-center py-4">No active sessions</div>
          ) : (
            <div className="space-y-3">
              {activeSessions.map((session) => (
                <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">
                        Session {session.session_token.substring(0, 8)}...
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Login: {formatDate(session.login_time)}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Device: {getDeviceInfo(session)}
                      </div>
                      {session.ip_address && (
                        <div className="text-sm text-gray-500">
                          IP: {session.ip_address}
                        </div>
                      )}
                    </div>
                    <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Active
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Session History */}
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Recent Session History ({sessionHistory.length})
          </h3>

          {loading ? (
            <div className="text-center py-4">Loading history...</div>
          ) : sessionHistory.length === 0 ? (
            <div className="text-gray-500 text-center py-4">No session history</div>
          ) : (
            <div className="space-y-3">
              {sessionHistory.slice(0, 10).map((session) => (
                <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">
                        Session {session.session_token.substring(0, 8)}...
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Login: {formatDate(session.login_time)}
                      </div>
                      {session.logout_time && (
                        <div className="text-sm text-gray-600">
                          Logout: {formatDate(session.logout_time)}
                        </div>
                      )}
                      <div className="text-sm text-gray-500 mt-1">
                        Device: {getDeviceInfo(session)}
                      </div>
                      {session.ip_address && (
                        <div className="text-sm text-gray-500">
                          IP: {session.ip_address}
                        </div>
                      )}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded ${
                      session.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {session.is_active ? 'Active' : 'Ended'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 