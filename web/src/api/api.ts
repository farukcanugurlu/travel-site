// src/api/api.ts
const API_BASE_URL = 'http://localhost:3000';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders: Record<string, string> = {};

    // Add Content-Type header only if body is not FormData
    const isFormData = options.body instanceof FormData;
    if (!isFormData) {
      defaultHeaders['Content-Type'] = 'application/json';
    }

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      // Get content type first
      const contentType = response.headers.get('content-type') || '';
      const contentLength = response.headers.get('content-length');
      
      // Read response body once
      let responseData: any;
      if (contentType.includes('application/json')) {
        const text = await response.text();
        if (text) {
          try {
            responseData = JSON.parse(text);
          } catch (e) {
            responseData = text;
          }
        }
      } else {
        responseData = await response.text();
      }

      if (!response.ok) {
        // Handle 401 Unauthorized - token expired or invalid
        if (response.status === 401) {
          // Clear auth data and redirect to login
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          
          // Only redirect if we're not already on login page
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
        
        // Try to get error message from response
        let errorMessage = `HTTP error! status: ${response.status}`;
        if (responseData) {
          if (typeof responseData === 'object') {
            if (responseData.message) {
              errorMessage = Array.isArray(responseData.message) 
                ? responseData.message.join(', ') 
                : responseData.message;
            } else if (responseData.error) {
              errorMessage = responseData.error;
            }
          } else if (typeof responseData === 'string') {
            errorMessage = responseData;
          }
        }
        const error = new Error(errorMessage);
        (error as any).status = response.status;
        throw error;
      }

      // Some endpoints (e.g., favorites existence check) may return 204 or empty body
      if (response.status === 204 || contentLength === '0' || !responseData) {
        return undefined as unknown as T;
      }

      // Return parsed data
      return responseData as T;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<T> {
    const isFormData = data instanceof FormData;
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? (isFormData ? data : JSON.stringify(data)) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiService = new ApiService();
export default apiService;
