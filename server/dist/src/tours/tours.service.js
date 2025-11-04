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
exports.ToursService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ToursService = class ToursService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createTourDto) {
        const { packages, ...tourData } = createTourDto;
        console.log('Creating tour with data:', tourData);
        if (tourData.thumbnail && (!tourData.images || tourData.images.length === 0)) {
            tourData.images = [tourData.thumbnail];
            console.log('Added thumbnail to images:', tourData.images);
        }
        const tour = await this.prisma.tour.create({
            data: tourData,
            include: {
                destination: true,
                packages: true,
                reviews: true,
            },
        });
        if (packages && packages.length > 0) {
            for (const pkg of packages) {
                await this.prisma.tourPackage.create({
                    data: {
                        name: pkg.name,
                        description: pkg.description || '',
                        adultPrice: pkg.adultPrice,
                        childPrice: pkg.childPrice,
                        infantPrice: pkg.infantPrice,
                        language: pkg.language,
                        capacity: pkg.capacity || 10,
                        tourId: tour.id,
                    },
                });
            }
            return this.prisma.tour.findUnique({
                where: { id: tour.id },
                include: {
                    destination: true,
                    packages: true,
                    reviews: true,
                },
            });
        }
        return tour;
    }
    async findAll(filters) {
        const where = {};
        if (filters?.destination) {
            where.destination = { slug: filters.destination };
        }
        if (filters?.featured !== undefined) {
            where.featured = filters.featured;
        }
        if (filters?.published !== undefined) {
            where.published = filters.published;
        }
        if (filters?.search) {
            where.OR = [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
            ];
        }
        return this.prisma.tour.findMany({
            where,
            include: {
                destination: true,
                packages: true,
                reviews: {
                    where: { approved: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        return this.prisma.tour.findUnique({
            where: { id },
            include: {
                destination: true,
                packages: true,
                reviews: {
                    where: { approved: true },
                    include: { user: true },
                },
            },
        });
    }
    async findBySlug(slug) {
        return this.prisma.tour.findUnique({
            where: { slug },
            include: {
                destination: true,
                packages: true,
                reviews: {
                    where: { approved: true },
                    include: { user: true },
                },
            },
        });
    }
    async update(id, updateTourDto) {
        const data = { ...updateTourDto };
        if (data.destinationId) {
            const destination = await this.prisma.destination.findUnique({
                where: { id: data.destinationId },
            });
            if (!destination) {
                throw new Error(`Destination with ID ${data.destinationId} not found`);
            }
        }
        return this.prisma.tour.update({
            where: { id },
            data,
            include: {
                destination: true,
                packages: true,
                reviews: true,
            },
        });
    }
    async remove(id) {
        return this.prisma.tour.delete({
            where: { id },
        });
    }
    async createPackage(tourId, createPackageDto) {
        return this.prisma.tourPackage.create({
            data: {
                ...createPackageDto,
                tourId,
            },
        });
    }
    async updatePackage(id, updatePackageDto) {
        return this.prisma.tourPackage.update({
            where: { id },
            data: updatePackageDto,
        });
    }
    async removePackage(id) {
        return this.prisma.tourPackage.delete({
            where: { id },
        });
    }
    async getDestinations() {
        return this.prisma.destination.findMany({
            orderBy: { name: 'asc' },
        });
    }
    async getFeaturedTours(limit = 8) {
        return this.prisma.tour.findMany({
            where: {
                featured: true,
                published: true,
            },
            include: {
                destination: true,
                packages: true,
                reviews: {
                    where: { approved: true },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }
    async getPopularTours(limit = 8) {
        return this.prisma.tour.findMany({
            where: {
                popular: true,
                published: true,
            },
            include: {
                destination: true,
                packages: true,
                reviews: {
                    where: { approved: true },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }
    async getPopularDestinations(limit = 8) {
        return this.prisma.destination.findMany({
            include: {
                tours: {
                    where: { published: true },
                },
            },
            orderBy: {
                tours: {
                    _count: 'desc',
                },
            },
            take: limit,
        });
    }
};
exports.ToursService = ToursService;
exports.ToursService = ToursService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ToursService);
//# sourceMappingURL=tours.service.js.map