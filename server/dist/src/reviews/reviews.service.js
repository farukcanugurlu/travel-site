"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReviewsService = class ReviewsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createReviewDto) {
        const existing = await this.prisma.review.findFirst({
            where: {
                userId: createReviewDto.userId,
                tourId: createReviewDto.tourId,
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('You have already submitted a review for this tour.');
        }
        const review = await this.prisma.review.create({
            data: {
                ...createReviewDto,
                approved: true,
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
        await this.updateTourRating(createReviewDto.tourId);
        return review;
    }
    async findAll(filters) {
        const where = {};
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
    async findByTour(tourId) {
        return this.prisma.review.findMany({
            where: {
                tourId,
                approved: true,
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
    async findOne(id) {
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
    async update(id, updateReviewDto) {
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
        if (updateReviewDto.rating !== undefined) {
            await this.updateTourRating(review.tourId);
        }
        return review;
    }
    async approve(id) {
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
        await this.updateTourRating(review.tourId);
        return review;
    }
    async reject(id) {
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
    async remove(id) {
        const review = await this.prisma.review.findUnique({
            where: { id },
            select: { tourId: true },
        });
        await this.prisma.review.delete({
            where: { id },
        });
        if (review) {
            await this.updateTourRating(review.tourId);
        }
    }
    async updateTourRating(tourId) {
        const approvedReviews = await this.prisma.review.findMany({
            where: {
                tourId,
                approved: true,
            },
            select: { rating: true },
        });
        if (approvedReviews.length > 0) {
            const averageRating = approvedReviews.reduce((sum, review) => sum + review.rating, 0) / approvedReviews.length;
            console.log(`Tour ${tourId} average rating: ${averageRating.toFixed(2)} (${approvedReviews.length} reviews)`);
        }
    }
    async getTourReviewStats(tourId) {
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
        }, {});
        return {
            averageRating: Math.round(averageRating * 10) / 10,
            totalReviews: reviews.length,
            ratingDistribution,
        };
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map