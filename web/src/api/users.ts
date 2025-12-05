// src/api/users.ts
import apiService from './api';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'ADMIN' | 'EDITOR' | 'USER';
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  isActive: boolean;
}

export interface UserFilters {
  search?: string;
  role?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateUserData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: 'ADMIN' | 'EDITOR' | 'USER';
}

export interface UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: 'ADMIN' | 'EDITOR' | 'USER';
  isActive?: boolean;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  admins: number;
  editors: number;
  users: number;
}

class UsersApiService {
  // Get all users with optional filters
  async getUsers(filters?: UserFilters): Promise<User[]> {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.role) params.append('role', filters.role);
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const endpoint = queryString ? `/users?${queryString}` : '/users';
    return apiService.get<User[]>(endpoint);
  }

  // Get user by ID
  async getUserById(id: string): Promise<User> {
    return apiService.get<User>(`/users/${id}`);
  }

  // Create new user
  async createUser(userData: CreateUserData): Promise<User> {
    return apiService.post<User>('/users', userData);
  }

  // Update user
  async updateUser(id: string, userData: UpdateUserData): Promise<User> {
    return apiService.patch<User>(`/users/${id}`, userData);
  }

  // Delete user
  async deleteUser(id: string, forceDelete: boolean = false): Promise<void> {
    const params = forceDelete ? '?force=true' : '';
    return apiService.delete<void>(`/users/${id}${params}`);
  }

  // Get user statistics
  async getUserStats(): Promise<UserStats> {
    return apiService.get<UserStats>('/users/stats');
  }

  // Toggle user active status
  async toggleUserStatus(id: string): Promise<User> {
    return apiService.patch<User>(`/users/${id}/toggle-status`);
  }

  // Reset user password (Admin only)
  async resetUserPassword(id: string, newPassword: string): Promise<void> {
    return apiService.patch<void>(`/users/${id}/reset-password`, { password: newPassword });
  }
}

export const usersApiService = new UsersApiService();
export default usersApiService;
