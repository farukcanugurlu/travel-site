// src/api/api.ts
// Production'da API URL'i otomatik olarak site domain'inden al
// ÖNEMLİ: Her zaman mevcut domain'i kullan (www veya non-www)
const getApiBaseUrl = () => {
  // Browser'da çalışıyorsak, her zaman mevcut domain'i kullan
  // Bu sayede www ve non-www arasında CORS sorunu olmaz
  if (typeof window !== 'undefined' && window.location.hostname.includes('lexorholiday.com')) {
    // Mevcut domain'i kullan (www veya non-www fark etmez)
    return `${window.location.protocol}//${window.location.hostname}/api`;
  }
  
  // Environment variable varsa onu kullan (sadece development için)
  if (import.meta.env.VITE_API_URL && import.meta.env.DEV) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Development için default
  return 'http://localhost:3000';
};

const API_BASE_URL = getApiBaseUrl();

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
      // Enhanced error handling for network issues
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'unknown';
        const apiUrl = this.baseURL;
        const fullUrl = url;
        
        console.error('Network error - detailed info:', {
          url: fullUrl,
          baseURL: apiUrl,
          endpoint,
          currentOrigin,
          error: error.message,
          errorName: error.name,
          possibleCauses: [
            'CORS issue - backend may not allow this origin',
            'Network connectivity problem',
            'Backend server is down or unreachable',
            'Firewall or proxy blocking the request',
            'SSL/HTTPS certificate issue',
            'API URL misconfiguration',
            'Mixed content (HTTP/HTTPS) issue'
          ],
          troubleshooting: {
            checkApiUrl: `API URL should be: ${apiUrl}`,
            checkOrigin: `Current origin: ${currentOrigin}`,
            checkCors: 'Backend should allow this origin in CORS settings',
            checkNetwork: 'Check browser console Network tab for more details'
          }
        });
        
        // Provide more helpful error message with debugging info
        const networkError = new Error(
          `Connection error: Unable to reach server.\n\n` +
          `Debugging Information:\n` +
          `• API URL: ${apiUrl}\n` +
          `• Request URL: ${fullUrl}\n` +
          `• Your Origin: ${currentOrigin}\n\n` +
          `Possible Solutions:\n` +
          `1. Check your internet connection\n` +
          `2. Verify backend server is running\n` +
          `3. Check browser console (F12) for more details\n` +
          `4. Try refreshing the page\n` +
          `5. Contact support with this error message`
        );
        (networkError as any).isNetworkError = true;
        (networkError as any).url = url;
        (networkError as any).apiUrl = apiUrl;
        (networkError as any).origin = currentOrigin;
        throw networkError;
      }
      
      console.error('API request failed:', {
        url,
        endpoint,
        error,
        errorMessage: error instanceof Error ? error.message : String(error)
      });
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
