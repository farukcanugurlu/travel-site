import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
export declare class ReviewsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createReviewDto: CreateReviewDto): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        tour: {
            id: string;
            title: string;
            slug: string;
        };
    } & {
        id: string;
        title: string | null;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        approved: boolean;
        tourId: string;
        rating: number;
        userId: string;
    }>;
    findAll(filters?: {
        tourId?: string;
        approved?: boolean;
        userId?: string;
    }): Promise<({
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        tour: {
            id: string;
            title: string;
            slug: string;
        };
    } & {
        id: string;
        title: string | null;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        approved: boolean;
        tourId: string;
        rating: number;
        userId: string;
    })[]>;
    findByTour(tourId: string): Promise<({
        user: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        title: string | null;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        approved: boolean;
        tourId: string;
        rating: number;
        userId: string;
    })[]>;
    findPending(): Promise<({
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        tour: {
            id: string;
            title: string;
            slug: string;
        };
    } & {
        id: string;
        title: string | null;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        approved: boolean;
        tourId: string;
        rating: number;
        userId: string;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        tour: {
            id: string;
            title: string;
            slug: string;
        };
    } & {
        id: string;
        title: string | null;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        approved: boolean;
        tourId: string;
        rating: number;
        userId: string;
    }>;
    update(id: string, updateReviewDto: UpdateReviewDto): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        tour: {
            id: string;
            title: string;
            slug: string;
        };
    } & {
        id: string;
        title: string | null;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        approved: boolean;
        tourId: string;
        rating: number;
        userId: string;
    }>;
    approve(id: string): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        tour: {
            id: string;
            title: string;
            slug: string;
        };
    } & {
        id: string;
        title: string | null;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        approved: boolean;
        tourId: string;
        rating: number;
        userId: string;
    }>;
    reject(id: string): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        tour: {
            id: string;
            title: string;
            slug: string;
        };
    } & {
        id: string;
        title: string | null;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        approved: boolean;
        tourId: string;
        rating: number;
        userId: string;
    }>;
    remove(id: string): Promise<void>;
    private updateTourRating;
    getTourReviewStats(tourId: string): Promise<{
        averageRating: number;
        totalReviews: number;
        ratingDistribution: Record<number, number>;
    }>;
}
