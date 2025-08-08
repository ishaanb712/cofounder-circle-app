const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

console.log('API Base URL:', API_BASE_URL);
console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);

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
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
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