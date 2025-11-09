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
exports.FavoritesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FavoritesService = class FavoritesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createFavoriteDto) {
        const existing = await this.prisma.favorite.findFirst({
            where: {
                userId: createFavoriteDto.userId,
                tourId: createFavoriteDto.tourId,
            },
        });
        if (existing) {
            return existing;
        }
        return this.prisma.favorite.create({
            data: createFavoriteDto,
            include: {
                tour: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        thumbnail: true,
                        destination: {
                            select: {
                                name: true,
                                country: true,
                            },
                        },
                        packages: {
                            select: {
                                adultPrice: true,
                            },
                            take: 1,
                        },
                    },
                },
            },
        });
    }
    async findByUser(userId) {
        return this.prisma.favorite.findMany({
            where: { userId },
            include: {
                tour: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        thumbnail: true,
                        destination: {
                            select: {
                                name: true,
                                country: true,
                            },
                        },
                        packages: {
                            select: {
                                adultPrice: true,
                            },
                            take: 1,
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(userId, tourId) {
        const favorite = await this.prisma.favorite.findFirst({
            where: {
                userId,
                tourId,
            },
            include: {
                tour: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        thumbnail: true,
                        destination: {
                            select: {
                                name: true,
                                country: true,
                            },
                        },
                        packages: {
                            select: {
                                adultPrice: true,
                            },
                            take: 1,
                        },
                    },
                },
            },
        });
        if (!favorite) {
            throw new common_1.NotFoundException(`Favorite not found for user ${userId} and tour ${tourId}`);
        }
        return favorite;
    }
    async remove(userId, tourId) {
        return this.prisma.favorite.deleteMany({
            where: {
                userId,
                tourId,
            },
        });
    }
    async getUserFavoriteCount(userId) {
        return this.prisma.favorite.count({
            where: { userId },
        });
    }
};
exports.FavoritesService = FavoritesService;
exports.FavoritesService = FavoritesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FavoritesService);
//# sourceMappingURL=favorites.service.js.map