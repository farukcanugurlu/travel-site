// src/api/auth.ts
import apiService from './api';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'ADMIN' | 'EDITOR' | 'USER';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

class AuthApiService {
  // Login
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/login', credentials);
    
    // Store token in localStorage
    if (response.access_token) {
      localStorage.setItem('authToken', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  // Register
  async register(userData: RegisterRequest): Promise<User> {
    return apiService.post<User>('/auth/register', userData);
  }

  // Get current user profile
  async getProfile(): Promise<User> {
    return apiService.get<User>('/auth/profile');
  }

  // Logout
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Get current user from localStorage
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Clear all auth data
  clearAuthData(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  // Request password change - returns verification code
  async requestPasswordChange(): Promise<{ code: string }> {
    return apiService.post<{ code: string }>('/auth/password/request-change', {});
  }

  // Change password with verification code
  async changePasswordWithCode(email: string, code: string, newPassword: string): Promise<{ message: string }> {
    return apiService.patch<{ message: string }>('/auth/password/change', {
      email,
      code,
      newPassword,
    });
  }
}

export const authApiService = new AuthApiService();
export default authApiService;
