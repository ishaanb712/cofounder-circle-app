const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.1.101:8000';

export interface Session {
  id: string;
  user_id: string;
  session_token: string;
  login_time: string;
  logout_time?: string;
  ip_address?: string;
  user_agent?: string;
  device_info?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SessionResponse {
  success: boolean;
  session_token?: string;
  login_time?: string;
  logout_time?: string;
  sessions?: Session[];
  count?: number;
  sessions_ended?: number;
  message?: string;
  error?: string;
}

class SessionManager {
  private sessionToken: string | null = null;

  // Create a new session when user logs in
  async createSession(): Promise<SessionResponse> {
    try {
      const token = await this.getFirebaseToken();
      const response = await fetch(`${API_BASE_URL}/api/sessions/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        this.sessionToken = data.session_token;
        if (this.sessionToken) {
          localStorage.setItem('session_token', this.sessionToken);
        }
        console.log('Session created:', data);
      }

      return data;
    } catch (error) {
      console.error('Error creating session:', error);
      return {
        success: false,
        error: 'Failed to create session'
      };
    }
  }

  // End the current session when user logs out
  async endSession(): Promise<SessionResponse> {
    try {
      const token = await this.getFirebaseToken();
      const sessionToken = this.getSessionToken();
      
      if (!sessionToken) {
        return {
          success: false,
          error: 'No active session found'
        };
      }

      const response = await fetch(`${API_BASE_URL}/api/sessions/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-session-token': sessionToken
        }
      });

      const data = await response.json();

      if (data.success) {
        this.sessionToken = null;
        localStorage.removeItem('session_token');
        console.log('Session ended:', data);
      }

      return data;
    } catch (error) {
      console.error('Error ending session:', error);
      return {
        success: false,
        error: 'Failed to end session'
      };
    }
  }

  // Get all active sessions for the current user
  async getActiveSessions(): Promise<SessionResponse> {
    try {
      const token = await this.getFirebaseToken();
      const response = await fetch(`${API_BASE_URL}/api/sessions/active`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting active sessions:', error);
      return {
        success: false,
        error: 'Failed to get active sessions'
      };
    }
  }

  // Get session history for the current user
  async getSessionHistory(): Promise<SessionResponse> {
    try {
      const token = await this.getFirebaseToken();
      const response = await fetch(`${API_BASE_URL}/api/sessions/history`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting session history:', error);
      return {
        success: false,
        error: 'Failed to get session history'
      };
    }
  }

  // End all active sessions (force logout from all devices)
  async endAllSessions(): Promise<SessionResponse> {
    try {
      const token = await this.getFirebaseToken();
      const response = await fetch(`${API_BASE_URL}/api/sessions/logout-all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        this.sessionToken = null;
        localStorage.removeItem('session_token');
        console.log('All sessions ended:', data);
      }

      return data;
    } catch (error) {
      console.error('Error ending all sessions:', error);
      return {
        success: false,
        error: 'Failed to end all sessions'
      };
    }
  }

  // Validate if the current session is active
  async validateSession(): Promise<SessionResponse> {
    try {
      const sessionToken = this.getSessionToken();
      
      if (!sessionToken) {
        return {
          success: false,
          error: 'No session token found'
        };
      }

      const response = await fetch(`${API_BASE_URL}/api/sessions/validate`, {
        method: 'GET',
        headers: {
          'x-session-token': sessionToken
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error validating session:', error);
      return {
        success: false,
        error: 'Failed to validate session'
      };
    }
  }

  // Get the current session token
  getSessionToken(): string | null {
    if (!this.sessionToken) {
      this.sessionToken = localStorage.getItem('session_token');
    }
    return this.sessionToken;
  }

  // Clear session data
  clearSession(): void {
    this.sessionToken = null;
    localStorage.removeItem('session_token');
  }

  // Get Firebase token
  private async getFirebaseToken(): Promise<string> {
    // This should be implemented based on your Firebase setup
    // For now, we'll use a placeholder
    const user = (window as any).firebase?.auth?.()?.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    throw new Error('No authenticated user found');
  }
}

export const sessionManager = new SessionManager(); 