import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
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
    findAll(filters: any): Promise<({
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
    getPending(): Promise<({
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
}
