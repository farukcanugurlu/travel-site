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
        const tour = await this.prisma.tour.findUnique({
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
        if (tour) {
            console.log('ToursService - findBySlug response:', {
                id: tour.id,
                title: tour.title,
                slug: tour.slug,
                thumbnail: tour.thumbnail,
                images: tour.images,
                imagesLength: Array.isArray(tour.images) ? tour.images.length : 'not array',
                imagesType: typeof tour.images,
            });
        }
        else {
            console.log('ToursService - findBySlug: Tour not found for slug:', slug);
        }
        return tour;
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
    async remove(id, forceDelete = false) {
        try {
            const tourToDelete = await this.prisma.tour.findUnique({
                where: { id },
                include: {
                    bookings: true,
                    reviews: true,
                    packages: {
                        include: {
                            bookings: true,
                        },
                    },
                    favorites: true,
                },
            });
            if (!tourToDelete) {
                throw new common_1.NotFoundException(`Tour with ID ${id} not found`);
            }
            const totalBookings = tourToDelete.bookings?.length || 0;
            const packageBookings = tourToDelete.packages?.reduce((sum, pkg) => sum + (pkg.bookings?.length || 0), 0) || 0;
            const allBookings = totalBookings + packageBookings;
            if (allBookings > 0) {
                if (!forceDelete) {
                    throw new common_1.BadRequestException(`Cannot delete tour "${tourToDelete.title}" because it has ${allBookings} associated booking(s). Please delete or reassign the bookings first, or use force delete.`);
                }
                console.warn(`⚠️ Force deleting tour "${tourToDelete.title}" and ${allBookings} associated booking(s)`);
                if (totalBookings > 0) {
                    await this.prisma.booking.deleteMany({
                        where: { tourId: id },
                    });
                }
                if (packageBookings > 0) {
                    const packageIds = tourToDelete.packages?.map(pkg => pkg.id) || [];
                    if (packageIds.length > 0) {
                        await this.prisma.booking.deleteMany({
                            where: { packageId: { in: packageIds } },
                        });
                    }
                }
                console.log(`✅ Deleted ${allBookings} booking(s) associated with tour "${tourToDelete.title}"`);
            }
            if (tourToDelete.favorites && tourToDelete.favorites.length > 0) {
                await this.prisma.favorite.deleteMany({
                    where: { tourId: id },
                });
            }
            if (tourToDelete.reviews && tourToDelete.reviews.length > 0) {
                await this.prisma.review.deleteMany({
                    where: { tourId: id },
                });
            }
            if (tourToDelete.packages && tourToDelete.packages.length > 0) {
                await this.prisma.tourPackage.deleteMany({
                    where: { tourId: id },
                });
            }
            return await this.prisma.tour.delete({
                where: { id },
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            console.error('Error deleting tour:', error);
            throw new common_1.BadRequestException(error?.message || 'Failed to delete tour');
        }
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
    async removePackage(id, forceDelete = false) {
        try {
            const packageToDelete = await this.prisma.tourPackage.findUnique({
                where: { id },
                include: {
                    bookings: true,
                },
            });
            if (!packageToDelete) {
                throw new common_1.NotFoundException(`Package with ID ${id} not found`);
            }
            if (packageToDelete.bookings && packageToDelete.bookings.length > 0) {
                if (!forceDelete) {
                    throw new common_1.BadRequestException(`Cannot delete package "${packageToDelete.name}" because it has ${packageToDelete.bookings.length} associated booking(s). Please delete or reassign the bookings first, or use force delete.`);
                }
                console.warn(`⚠️ Force deleting package "${packageToDelete.name}" and ${packageToDelete.bookings.length} associated booking(s)`);
                await this.prisma.booking.deleteMany({
                    where: { packageId: id },
                });
                console.log(`✅ Deleted ${packageToDelete.bookings.length} booking(s) associated with package "${packageToDelete.name}"`);
            }
            return await this.prisma.tourPackage.delete({
                where: { id },
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            console.error('Error deleting package:', error);
            throw new common_1.BadRequestException(error?.message || 'Failed to delete package');
        }
    }
    async getDestinations() {
        try {
            return await this.prisma.destination.findMany({
                orderBy: { name: 'asc' },
            });
        }
        catch (error) {
            console.error('Error fetching destinations:', error);
            throw new Error('Failed to fetch destinations');
        }
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