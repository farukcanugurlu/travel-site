import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    create(createReviewDto: CreateReviewDto): Promise<{
        tour: {
            id: string;
            slug: string;
            title: string;
        };
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        title: string | null;
        createdAt: Date;
        updatedAt: Date;
        tourId: string;
        rating: number;
        content: string;
        approved: boolean;
        userId: string;
    }>;
    findAll(filters: any): Promise<({
        tour: {
            id: string;
            slug: string;
            title: string;
        };
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        title: string | null;
        createdAt: Date;
        updatedAt: Date;
        tourId: string;
        rating: number;
        content: string;
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
        id: string;
        title: string | null;
        createdAt: Date;
        updatedAt: Date;
        tourId: string;
        rating: number;
        content: string;
        approved: boolean;
        userId: string;
    })[]>;
    getPending(): Promise<({
        tour: {
            id: string;
            slug: string;
            title: string;
        };
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        title: string | null;
        createdAt: Date;
        updatedAt: Date;
        tourId: string;
        rating: number;
        content: string;
        approved: boolean;
        userId: string;
    })[]>;
    findOne(id: string): Promise<{
        tour: {
            id: string;
            slug: string;
            title: string;
        };
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        title: string | null;
        createdAt: Date;
        updatedAt: Date;
        tourId: string;
        rating: number;
        content: string;
        approved: boolean;
        userId: string;
    }>;
    update(id: string, updateReviewDto: UpdateReviewDto): Promise<{
        tour: {
            id: string;
            slug: string;
            title: string;
        };
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        title: string | null;
        createdAt: Date;
        updatedAt: Date;
        tourId: string;
        rating: number;
        content: string;
        approved: boolean;
        userId: string;
    }>;
    approve(id: string): Promise<{
        tour: {
            id: string;
            slug: string;
            title: string;
        };
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        title: string | null;
        createdAt: Date;
        updatedAt: Date;
        tourId: string;
        rating: number;
        content: string;
        approved: boolean;
        userId: string;
    }>;
    reject(id: string): Promise<{
        tour: {
            id: string;
            slug: string;
            title: string;
        };
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        title: string | null;
        createdAt: Date;
        updatedAt: Date;
        tourId: string;
        rating: number;
        content: string;
        approved: boolean;
        userId: string;
    }>;
    remove(id: string): Promise<void>;
}
