// src/api/bookings.ts
import apiService from './api';

export interface Booking {
  id: string;
  userId: string;
  tourId: string;
  packageId: string;
  adultCount: number;
  childCount: number;
  infantCount: number;
  tourDate: string;
  specialRequests?: string;
  contactPhone?: string;
  contactEmail?: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  tour?: {
    id: string;
    title: string;
    slug: string;
    thumbnail?: string;
  };
  package?: {
    id: string;
    name: string;
    adultPrice: number;
    childPrice: number;
    infantPrice: number;
    language: string;
  };
}

export interface CreateBookingPayload {
  userId: string;
  tourId: string;
  packageId: string;
  adultCount: number;
  childCount: number;
  infantCount: number;
  tourDate: string;
  specialRequests?: string;
  contactPhone?: string;
  contactEmail?: string;
}

export interface UpdateBookingPayload {
  adultCount?: number;
  childCount?: number;
  infantCount?: number;
  tourDate?: string;
  specialRequests?: string;
  contactPhone?: string;
  contactEmail?: string;
  status?: string;
}

export interface BookingFilters {
  userId?: string;
  tourId?: string;
  status?: string;
}

export interface BookingStats {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
}

class BookingsApiService {
  async createBooking(payload: CreateBookingPayload): Promise<Booking> {
    return apiService.post<Booking>('/bookings', payload);
  }

  async getBookings(filters?: BookingFilters): Promise<Booking[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const queryString = params.toString();
    const endpoint = queryString ? `/bookings?${queryString}` : '/bookings';
    return apiService.get<Booking[]>(endpoint);
  }

  async getBookingsByUser(userId: string): Promise<Booking[]> {
    return apiService.get<Booking[]>(`/bookings/user/${userId}`);
  }

  async getBookingById(id: string): Promise<Booking> {
    return apiService.get<Booking>(`/bookings/${id}`);
  }

  async getBookingStats(): Promise<BookingStats> {
    return apiService.get<BookingStats>('/bookings/stats');
  }

  async updateBooking(id: string, payload: UpdateBookingPayload): Promise<Booking> {
    return apiService.patch<Booking>(`/bookings/${id}`, payload);
  }

  async updateBookingStatus(id: string, status: string): Promise<Booking> {
    return apiService.patch<Booking>(`/bookings/${id}/status`, { status });
  }

  async deleteBooking(id: string): Promise<void> {
    return apiService.delete<void>(`/bookings/${id}`);
  }

  async downloadPDF(bookingId: string): Promise<void> {
    const token = localStorage.getItem('authToken');
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/pdf`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to download PDF');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `booking-${bookingId}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}

export const bookingsApiService = new BookingsApiService();
export default bookingsApiService;
