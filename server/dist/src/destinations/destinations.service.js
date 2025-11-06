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
exports.DestinationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DestinationsService = class DestinationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(filters) {
        const where = {};
        if (filters.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { country: { contains: filters.search, mode: 'insensitive' } },
            ];
        }
        if (filters.country) {
            where.country = { contains: filters.country, mode: 'insensitive' };
        }
        const skip = filters.page && filters.limit ? (filters.page - 1) * filters.limit : undefined;
        const take = filters.limit;
        const [destinations, total] = await Promise.all([
            this.prisma.destination.findMany({
                where,
                skip,
                take,
                include: {
                    _count: {
                        select: {
                            tours: true,
                        },
                    },
                },
                orderBy: { name: 'asc' },
            }),
            this.prisma.destination.count({ where }),
        ]);
        return destinations;
    }
    async findOne(id) {
        const destination = await this.prisma.destination.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        tours: true,
                    },
                },
            },
        });
        if (!destination) {
            throw new common_1.NotFoundException('Destination not found');
        }
        return destination;
    }
    async create(createDestinationDto) {
        const existingDestination = await this.prisma.destination.findFirst({
            where: {
                OR: [
                    { name: createDestinationDto.name },
                    { slug: createDestinationDto.slug },
                ],
            },
        });
        if (existingDestination) {
            throw new common_1.ConflictException('Destination with this name or slug already exists');
        }
        const destination = await this.prisma.destination.create({
            data: {
                name: createDestinationDto.name,
                slug: createDestinationDto.slug,
                country: createDestinationDto.country,
                image: createDestinationDto.image,
                featured: createDestinationDto.featured ?? false,
                displayOrder: createDestinationDto.displayOrder ?? 0,
            },
            include: {
                _count: {
                    select: {
                        tours: true,
                    },
                },
            },
        });
        return destination;
    }
    async update(id, updateDestinationDto) {
        const destination = await this.prisma.destination.findUnique({
            where: { id },
        });
        if (!destination) {
            throw new common_1.NotFoundException('Destination not found');
        }
        if (updateDestinationDto.name || updateDestinationDto.slug) {
            const existingDestination = await this.prisma.destination.findFirst({
                where: {
                    AND: [
                        { id: { not: id } },
                        {
                            OR: [
                                updateDestinationDto.name ? { name: updateDestinationDto.name } : {},
                                updateDestinationDto.slug ? { slug: updateDestinationDto.slug } : {},
                            ],
                        },
                    ],
                },
            });
            if (existingDestination) {
                throw new common_1.ConflictException('Destination with this name or slug already exists');
            }
        }
        const updateData = {};
        if (updateDestinationDto.name !== undefined)
            updateData.name = updateDestinationDto.name;
        if (updateDestinationDto.slug !== undefined)
            updateData.slug = updateDestinationDto.slug;
        if (updateDestinationDto.country !== undefined)
            updateData.country = updateDestinationDto.country;
        if (updateDestinationDto.image !== undefined)
            updateData.image = updateDestinationDto.image;
        if (updateDestinationDto.featured !== undefined)
            updateData.featured = updateDestinationDto.featured;
        if (updateDestinationDto.displayOrder !== undefined)
            updateData.displayOrder = updateDestinationDto.displayOrder;
        const updatedDestination = await this.prisma.destination.update({
            where: { id },
            data: updateData,
            include: {
                _count: {
                    select: {
                        tours: true,
                    },
                },
            },
        });
        return updatedDestination;
    }
    async remove(id) {
        const destination = await this.prisma.destination.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        tours: true,
                    },
                },
            },
        });
        if (!destination) {
            throw new common_1.NotFoundException('Destination not found');
        }
        if (destination._count.tours > 0) {
            throw new common_1.ConflictException('Cannot delete destination that has tours. Please delete or reassign tours first.');
        }
        await this.prisma.destination.delete({
            where: { id },
        });
        return { message: 'Destination deleted successfully' };
    }
    async getStats() {
        const [total, countries, destinationsWithTours,] = await Promise.all([
            this.prisma.destination.count(),
            this.prisma.destination.groupBy({
                by: ['country'],
                _count: {
                    country: true,
                },
            }),
            this.prisma.destination.count({
                where: {
                    tours: {
                        some: {},
                    },
                },
            }),
        ]);
        return {
            total,
            countries: countries.length,
            destinationsWithTours,
            destinationsWithoutTours: total - destinationsWithTours,
        };
    }
    async getFeaturedDestinations(limit = 8) {
        return this.prisma.destination.findMany({
            where: {
                featured: true,
            },
            include: {
                _count: {
                    select: {
                        tours: {
                            where: {
                                published: true,
                            },
                        },
                    },
                },
            },
            orderBy: [
                { displayOrder: 'asc' },
                { name: 'asc' },
            ],
            take: limit,
        });
    }
};
exports.DestinationsService = DestinationsService;
exports.DestinationsService = DestinationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DestinationsService);
//# sourceMappingURL=destinations.service.js.map