// web/src/api/destinations.ts
import apiService from './api';

export interface Destination {
  id: string;
  name: string;
  slug: string;
  country: string;
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
}

export interface UpdateDestinationPayload {
  name?: string;
  slug?: string;
  country?: string;
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
}

export const destinationsApiService = new DestinationsApiService();
