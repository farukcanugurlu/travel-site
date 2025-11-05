import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
export declare class ReviewsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createReviewDto: CreateReviewDto): Promise<{
        tour: {
            title: string;
            slug: string;
            id: string;
        };
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        title: string | null;
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tourId: string;
        rating: number;
        approved: boolean;
        userId: string;
    }>;
    findAll(filters?: {
        tourId?: string;
        approved?: boolean;
        userId?: string;
    }): Promise<({
        tour: {
            title: string;
            slug: string;
            id: string;
        };
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        title: string | null;
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tourId: string;
        rating: number;
        approved: boolean;
        userId: string;
    })[]>;
    findByTour(tourId: string): Promise<({
        user: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        title: string | null;
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tourId: string;
        rating: number;
        approved: boolean;
        userId: string;
    })[]>;
    findPending(): Promise<({
        tour: {
            title: string;
            slug: string;
            id: string;
        };
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        title: string | null;
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tourId: string;
        rating: number;
        approved: boolean;
        userId: string;
    })[]>;
    findOne(id: string): Promise<{
        tour: {
            title: string;
            slug: string;
            id: string;
        };
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        title: string | null;
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tourId: string;
        rating: number;
        approved: boolean;
        userId: string;
    }>;
    update(id: string, updateReviewDto: UpdateReviewDto): Promise<{
        tour: {
            title: string;
            slug: string;
            id: string;
        };
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        title: string | null;
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tourId: string;
        rating: number;
        approved: boolean;
        userId: string;
    }>;
    approve(id: string): Promise<{
        tour: {
            title: string;
            slug: string;
            id: string;
        };
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        title: string | null;
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tourId: string;
        rating: number;
        approved: boolean;
        userId: string;
    }>;
    reject(id: string): Promise<{
        tour: {
            title: string;
            slug: string;
            id: string;
        };
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        title: string | null;
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tourId: string;
        rating: number;
        approved: boolean;
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
