// web/src/api/destinations.ts
import apiService from './api';

const DESTINATIONS_CACHE_KEY = 'featured_destinations_cache';
const DESTINATIONS_CACHE_TIMESTAMP_KEY = 'featured_destinations_cache_timestamp';
const CACHE_DURATION = 5 * 60 * 1000; // 5 dakika

export interface Destination {
  id: string;
  name: string;
  slug: string;
  country: string;
  image?: string;
  featured?: boolean;
  displayOrder?: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    tours: number;
  };
}

export interface DestinationFilters {
  search?: string;
  country?: string;
  page?: number;
  limit?: number;
}

export interface CreateDestinationPayload {
  name: string;
  slug: string;
  country: string;
  image?: string;
  featured?: boolean;
  displayOrder?: number;
}

export interface UpdateDestinationPayload {
  name?: string;
  slug?: string;
  country?: string;
  image?: string;
  featured?: boolean;
  displayOrder?: number;
}

class DestinationsApiService {
  async getDestinations(filters?: DestinationFilters): Promise<Destination[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const queryString = params.toString();
    const endpoint = queryString ? `/destinations?${queryString}` : '/destinations';
    return apiService.get<Destination[]>(endpoint);
  }

  async getDestinationById(id: string): Promise<Destination> {
    return apiService.get<Destination>(`/destinations/${id}`);
  }

  async createDestination(destinationData: CreateDestinationPayload): Promise<Destination> {
    return apiService.post<Destination>('/destinations', destinationData);
  }

  async updateDestination(id: string, destinationData: UpdateDestinationPayload): Promise<Destination> {
    return apiService.patch<Destination>(`/destinations/${id}`, destinationData);
  }

  async deleteDestination(id: string): Promise<void> {
    return apiService.delete<void>(`/destinations/${id}`);
  }

  async getDestinationStats(): Promise<any> {
    return apiService.get<any>('/destinations/stats');
  }

  // Cache'den featured destinations'i oku
  private getCachedFeaturedDestinations(): Destination[] | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const cached = localStorage.getItem(DESTINATIONS_CACHE_KEY);
      const timestamp = localStorage.getItem(DESTINATIONS_CACHE_TIMESTAMP_KEY);
      
      if (cached && timestamp) {
        const cacheTime = parseInt(timestamp, 10);
        const now = Date.now();
        
        // Cache hala geçerli mi? (5 dakika)
        if (now - cacheTime < CACHE_DURATION) {
          return JSON.parse(cached);
        }
      }
    } catch (e) {
      console.error('Error reading destinations cache:', e);
    }
    
    return null;
  }

  // Featured destinations'i cache'e kaydet
  private setCachedFeaturedDestinations(data: Destination[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(DESTINATIONS_CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(DESTINATIONS_CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (e) {
      console.error('Error saving destinations cache:', e);
    }
  }

  // İlk render için cache'den oku (senkron)
  getCachedFeaturedDestinationsSync(): Destination[] | null {
    return this.getCachedFeaturedDestinations();
  }

  async getFeaturedDestinations(limit: number = 8): Promise<Destination[]> {
    try {
      // Önce cache'den oku
      const cached = this.getCachedFeaturedDestinations();
      
      // API'den güncel veriyi çek
      const result = await apiService.get<Destination[]>(`/destinations/featured?limit=${limit}`);
      const destinations = result || [];
      
      // Cache'i güncelle
      this.setCachedFeaturedDestinations(destinations);
      
      return destinations;
    } catch (error) {
      console.error('Error fetching featured destinations:', error);
      // API hatası varsa cache'den döndür
      const cached = this.getCachedFeaturedDestinations();
      if (cached) {
        console.warn('Destinations API error, using cache:', error);
        return cached;
      }
      return [];
    }
  }
}

export const destinationsApiService = new DestinationsApiService();
