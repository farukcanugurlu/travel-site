import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewDto) {
    // Prevent duplicate reviews by the same user for the same tour
    const existing = await this.prisma.review.findFirst({
      where: {
        userId: createReviewDto.userId,
        tourId: createReviewDto.tourId,
      },
    });

    if (existing) {
      throw new BadRequestException('You have already submitted a review for this tour.');
    }

    const review = await this.prisma.review.create({
      data: {
        ...createReviewDto,
        approved: true, // auto-approve new reviews so they show immediately
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        tour: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    // Update tour rating after creating review
    await this.updateTourRating(createReviewDto.tourId);

    return review;
  }

  async findAll(filters?: { tourId?: string; approved?: boolean; userId?: string }) {
    const where: any = {};

    if (filters?.tourId) {
      where.tourId = filters.tourId;
    }

    if (filters?.approved !== undefined) {
      where.approved = filters.approved;
    }

    if (filters?.userId) {
      where.userId = filters.userId;
    }

    return this.prisma.review.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        tour: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByTour(tourId: string) {
    return this.prisma.review.findMany({
      where: {
        tourId,
        approved: true, // Only show approved reviews
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPending() {
    return this.prisma.review.findMany({
      where: { approved: false },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        tour: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        tour: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    const review = await this.prisma.review.update({
      where: { id },
      data: updateReviewDto,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        tour: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    // Update tour rating if rating changed
    if (updateReviewDto.rating !== undefined) {
      await this.updateTourRating(review.tourId);
    }

    return review;
  }

  async approve(id: string) {
    const review = await this.prisma.review.update({
      where: { id },
      data: { approved: true },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        tour: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    // Update tour rating after approval
    await this.updateTourRating(review.tourId);

    return review;
  }

  async reject(id: string) {
    return this.prisma.review.update({
      where: { id },
      data: { approved: false },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        tour: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      select: { tourId: true },
    });

    await this.prisma.review.delete({
      where: { id },
    });

    // Update tour rating after deletion
    if (review) {
      await this.updateTourRating(review.tourId);
    }
  }

  // Helper method to update tour rating
  private async updateTourRating(tourId: string) {
    const approvedReviews = await this.prisma.review.findMany({
      where: {
        tourId,
        approved: true,
      },
      select: { rating: true },
    });

    if (approvedReviews.length > 0) {
      const averageRating = approvedReviews.reduce((sum, review) => sum + review.rating, 0) / approvedReviews.length;
      
      // Update tour with calculated rating (we'll add this to tour model later)
      // For now, we'll just log it
      console.log(`Tour ${tourId} average rating: ${averageRating.toFixed(2)} (${approvedReviews.length} reviews)`);
    }
  }

  // Get review statistics for a tour
  async getTourReviewStats(tourId: string) {
    const reviews = await this.prisma.review.findMany({
      where: {
        tourId,
        approved: true,
      },
      select: { rating: true },
    });

    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    
    const ratingDistribution = reviews.reduce((dist, review) => {
      dist[review.rating] = (dist[review.rating] || 0) + 1;
      return dist;
    }, {} as Record<number, number>);

    return {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalReviews: reviews.length,
      ratingDistribution,
    };
  }
}
