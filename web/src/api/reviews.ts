// src/api/reviews.ts
import apiService from './api';

export interface Review {
  id: string;
  rating: number;
  title?: string;
  content: string;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  tourId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  tour: {
    id: string;
    title: string;
    slug: string;
  };
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<number, number>;
}

export interface CreateReviewData {
  rating: number;
  title?: string;
  content: string;
  tourId: string;
  userId?: string; // backend currently requires userId; supplied from frontend auth
}

export interface ReviewFilters {
  tourId?: string;
  approved?: boolean;
  userId?: string;
}

class ReviewsApiService {
  // Get all reviews with optional filters
  async getReviews(filters?: ReviewFilters): Promise<Review[]> {
    const params = new URLSearchParams();
    
    if (filters?.tourId) params.append('tourId', filters.tourId);
    if (filters?.approved !== undefined) params.append('approved', filters.approved.toString());
    if (filters?.userId) params.append('userId', filters.userId);

    return apiService.get<Review[]>(`/reviews?${params.toString()}`);
  }

  // Get reviews for a specific tour
  async getTourReviews(tourId: string): Promise<Review[]> {
    return apiService.get<Review[]>(`/reviews/tour/${tourId}`);
  }

  // Get pending reviews (Admin only)
  async getPendingReviews(): Promise<Review[]> {
    return apiService.get<Review[]>('/reviews/pending');
  }

  // Get review by ID
  async getReviewById(id: string): Promise<Review> {
    return apiService.get<Review>(`/reviews/${id}`);
  }

  // Create a new review
  async createReview(data: CreateReviewData): Promise<Review> {
    return apiService.post<Review>('/reviews', data);
  }

  // Update review (Admin only)
  async updateReview(id: string, data: Partial<CreateReviewData>): Promise<Review> {
    return apiService.patch<Review>(`/reviews/${id}`, data);
  }

  // Approve review (Admin only)
  async approveReview(id: string): Promise<Review> {
    return apiService.patch<Review>(`/reviews/${id}/approve`);
  }

  // Reject review (Admin only)
  async rejectReview(id: string): Promise<Review> {
    return apiService.patch<Review>(`/reviews/${id}/reject`);
  }

  // Delete review (Admin only)
  async deleteReview(id: string): Promise<void> {
    await apiService.delete<void>(`/reviews/${id}`);
  }

  // Get review statistics for a tour
  async getTourReviewStats(tourId: string): Promise<ReviewStats> {
    return apiService.get<ReviewStats>(`/reviews/tour/${tourId}/stats`);
  }
}

export default new ReviewsApiService();
