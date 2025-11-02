// src/api/tours.ts
import apiService from './api';

export interface Tour {
  id: string;
  title: string;
  slug: string;
  description?: string;
  excerpt?: string;
  featured: boolean;
  published: boolean;
  duration?: string;
  thumbnail?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
  destination: {
    id: string;
    name: string;
    slug: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };
  packages: TourPackage[];
  reviews: Review[];
  // New dynamic fields
  included?: string[];
  excluded?: string[];
  highlights?: string[];
  itinerary?: Array<{
    day: string;
    title: string;
    description: string;
  }>;
  location?: {
    latitude?: number;
    longitude?: number;
    description?: string;
  };
  category?: string;
  type?: string; // "Adventure", "Cultural", "Beach", etc.
  groupSize?: string;
  languages?: string[];
  rating?: {
    average: number;
    total: number;
  };
}

export interface TourPackage {
  id: string;
  name: string;
  description?: string;
  adultPrice: number;
  childPrice: number;
  infantPrice: number;
  language: string;
  capacity?: number;
  tourId: string;
}

export interface Review {
  id: string;
  rating: number;
  title?: string;
  content: string;
  approved: boolean;
  createdAt: string;
  user: {
    id: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface TourFilters {
  category?: string;
  destination?: string;
  featured?: boolean;
  published?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  language?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  country: string;
}

// Transform backend response to frontend format
const transformTour = (tour: any): Tour => {
  return {
    ...tour,
    location: tour.locationLatitude || tour.locationLongitude || tour.locationDescription
      ? {
          latitude: tour.locationLatitude,
          longitude: tour.locationLongitude,
          description: tour.locationDescription,
        }
      : undefined,
  };
};

const transformTours = (tours: any[]): Tour[] => {
  return tours.map(transformTour);
};

class ToursApiService {
  // Get all tours with filters
  async getTours(filters?: TourFilters): Promise<Tour[]> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/tours?${queryString}` : '/tours';
    
    const tours = await apiService.get<any[]>(endpoint);
    return transformTours(tours);
  }

  // Get single tour by ID
  async getTourById(id: string): Promise<Tour> {
    const tour = await apiService.get<any>(`/tours/${id}`);
    return transformTour(tour);
  }

  // Get single tour by slug
  async getTourBySlug(slug: string): Promise<Tour> {
    const tour = await apiService.get<any>(`/tours/slug/${slug}`);
    return transformTour(tour);
  }

  // Get featured tours
  async getFeaturedTours(limit: number = 8): Promise<Tour[]> {
    const tours = await apiService.get<any[]>(`/tours/featured?limit=${limit}`);
    return transformTours(tours);
  }

  // Get popular destinations
  async getPopularDestinations(limit: number = 8): Promise<Destination[]> {
    return apiService.get<Destination[]>(`/tours/destinations?limit=${limit}`);
  }

  // Get all categories
  async getCategories(): Promise<Category[]> {
    return apiService.get<Category[]>('/tours/categories');
  }

  // Get all destinations
  async getDestinations(): Promise<Destination[]> {
    return apiService.get<Destination[]>('/tours/destinations-list');
  }

  // Transform frontend format to backend format
  private transformTourForBackend(tourData: Partial<Tour>): any {
    const { location, ...rest } = tourData as any;
    
    const backendData: any = { ...rest };
    
    // Convert location object to separate fields
    if (location) {
      if (location.latitude !== undefined) {
        backendData.locationLatitude = location.latitude;
      }
      if (location.longitude !== undefined) {
        backendData.locationLongitude = location.longitude;
      }
      if (location.description !== undefined) {
        backendData.locationDescription = location.description;
      }
    }
    
    return backendData;
  }

  // Create tour (Admin only)
  async createTour(tourData: Partial<Tour>): Promise<Tour> {
    const backendData = this.transformTourForBackend(tourData);
    const tour = await apiService.post<any>('/tours', backendData);
    return transformTour(tour);
  }

  // Update tour (Admin only)
  async updateTour(id: string, tourData: Partial<Tour>): Promise<Tour> {
    const backendData = this.transformTourForBackend(tourData);
    const tour = await apiService.patch<any>(`/tours/${id}`, backendData);
    return transformTour(tour);
  }

  // Delete tour (Admin only)
  async deleteTour(id: string): Promise<void> {
    return apiService.delete<void>(`/tours/${id}`);
  }

  // Create tour package (Admin only)
  async createTourPackage(tourId: string, packageData: Partial<TourPackage>): Promise<TourPackage> {
    return apiService.post<TourPackage>(`/tours/${tourId}/packages`, packageData);
  }

  // Update tour package (Admin only)
  async updateTourPackage(id: string, packageData: Partial<TourPackage>): Promise<TourPackage> {
    return apiService.patch<TourPackage>(`/tours/packages/${id}`, packageData);
  }

  // Delete tour package (Admin only)
  async deleteTourPackage(id: string): Promise<void> {
    return apiService.delete<void>(`/tours/packages/${id}`);
  }
}

export const toursApiService = new ToursApiService();
export default toursApiService;