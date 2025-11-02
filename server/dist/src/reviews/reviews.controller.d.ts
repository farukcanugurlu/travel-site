import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
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
    findAll(filters: any): Promise<({
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
    getPending(): Promise<({
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
}
