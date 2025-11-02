// src/api/favorites.ts
import apiService from './api';

export interface Favorite {
  id: string;
  userId: string;
  tourId: string;
  createdAt: string;
  tour?: {
    id: string;
    title: string;
    slug: string;
    thumbnail?: string;
    destination?: {
      name: string;
      country: string;
    };
    packages?: {
      adultPrice: number;
    }[];
  };
}

class FavoritesApiService {
  async addToFavorites(userId: string, tourId: string): Promise<Favorite> {
    return apiService.post<Favorite>('/favorites', { userId, tourId });
  }

  async removeFromFavorites(userId: string, tourId: string): Promise<void> {
    return apiService.delete<void>(`/favorites/${userId}/${tourId}`);
  }

  async getUserFavorites(userId: string): Promise<Favorite[]> {
    return apiService.get<Favorite[]>(`/favorites/user/${userId}`);
  }

  async isFavorite(userId: string, tourId: string): Promise<boolean> {
    try {
      await apiService.get<Favorite>(`/favorites/${userId}/${tourId}`);
      return true;
    } catch {
      return false;
    }
  }
}

export const favoritesApiService = new FavoritesApiService();
export default favoritesApiService;
