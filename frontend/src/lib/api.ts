// Detect if we're on mobile and adjust API URL accordingly
const getApiBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl) return envUrl;
  
  // If no environment URL is set, try to detect the correct URL for mobile
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const port = '8000'; // Backend port
    
    // If we're on localhost, use localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `http://localhost:${port}`;
    }
    
    // If we're on a mobile device or different host, use the same hostname
    // Make sure we don't add an extra colon
    if (hostname.includes(':')) {
      // Extract just the hostname part (remove port if present)
      const cleanHostname = hostname.split(':')[0];
      return `http://${cleanHostname}:${port}`;
    }
    return `http://${hostname}:${port}`;
  }
  
  // Fallback for server-side rendering
  return 'http://localhost:8000';
};

const API_BASE_URL = getApiBaseUrl();

console.log('API Base URL:', API_BASE_URL);
console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('Current hostname:', typeof window !== 'undefined' ? window.location.hostname : 'server-side');

// Validate API URL format
if (API_BASE_URL && API_BASE_URL.includes('::')) {
  console.error('Invalid API URL format detected:', API_BASE_URL);
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      console.log('API Request:', { url, method: options.method, body: options.body });
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      console.log('API Response:', { status: response.status, data });

      if (!response.ok) {
        return {
          success: false,
          error: data.detail || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API Error:', error);
      
      // Provide more specific error messages for mobile
      let errorMessage = 'Network error';
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorMessage = 'Unable to connect to server. Please check your internet connection and try again.';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Request timed out. Please try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // User Profile Operations
  async createUserProfile(firebaseToken: string, profileData?: any): Promise<ApiResponse> {
    return this.request('/api/user-profiles/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firebaseToken}`,
      },
      body: JSON.stringify(profileData),
    });
  }

  async getUserProfile(firebaseToken: string): Promise<ApiResponse> {
    return this.request('/api/user-profiles/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${firebaseToken}`,
      },
    });
  }

  async updateUserProfile(firebaseToken: string, updates: any): Promise<ApiResponse> {
    return this.request('/api/user-profiles/me', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${firebaseToken}`,
      },
      body: JSON.stringify({
        firebase_token: firebaseToken,
        updates,
      }),
    });
  }

  async deleteUserProfile(firebaseToken: string): Promise<ApiResponse> {
    return this.request('/api/user-profiles/me', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${firebaseToken}`,
      },
    });
  }

  async verifyToken(firebaseToken: string): Promise<ApiResponse> {
    return this.request('/api/user-profiles/verify', {
      method: 'POST',
      body: JSON.stringify({
        firebase_token: firebaseToken,
      }),
    });
  }

  // Form Submissions
  async submitStudentForm(formData: any): Promise<ApiResponse> {
    return this.request('/api/students/', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  async submitFounderForm(formData: any): Promise<ApiResponse> {
    return this.request('/api/founders/', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  async submitMentorForm(formData: any): Promise<ApiResponse> {
    return this.request('/api/mentors/', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  async submitVendorForm(formData: any): Promise<ApiResponse> {
    return this.request('/api/vendors/', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  async submitWorkingProfessionalForm(formData: any): Promise<ApiResponse> {
    return this.request('/api/working-professionals/', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL); 