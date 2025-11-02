// server/src/destinations/destinations.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';

export interface DestinationFilters {
  search?: string;
  country?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class DestinationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: DestinationFilters) {
    const where: any = {};

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

  async findOne(id: string) {
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
      throw new NotFoundException('Destination not found');
    }

    return destination;
  }

  async create(createDestinationDto: CreateDestinationDto) {
    // Check if destination already exists
    const existingDestination = await this.prisma.destination.findFirst({
      where: {
        OR: [
          { name: createDestinationDto.name },
          { slug: createDestinationDto.slug },
        ],
      },
    });

    if (existingDestination) {
      throw new ConflictException('Destination with this name or slug already exists');
    }

    const destination = await this.prisma.destination.create({
      data: {
        name: createDestinationDto.name,
        slug: createDestinationDto.slug,
        country: createDestinationDto.country,
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

  async update(id: string, updateDestinationDto: UpdateDestinationDto) {
    const destination = await this.prisma.destination.findUnique({
      where: { id },
    });

    if (!destination) {
      throw new NotFoundException('Destination not found');
    }

    // Check if name or slug is being updated and if it already exists
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
        throw new ConflictException('Destination with this name or slug already exists');
      }
    }

    const updatedDestination = await this.prisma.destination.update({
      where: { id },
      data: {
        name: updateDestinationDto.name,
        slug: updateDestinationDto.slug,
        country: updateDestinationDto.country,
      },
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

  async remove(id: string) {
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
      throw new NotFoundException('Destination not found');
    }

    // Check if destination has tours
    if (destination._count.tours > 0) {
      throw new ConflictException('Cannot delete destination that has tours. Please delete or reassign tours first.');
    }

    await this.prisma.destination.delete({
      where: { id },
    });

    return { message: 'Destination deleted successfully' };
  }

  async getStats() {
    const [
      total,
      countries,
      destinationsWithTours,
    ] = await Promise.all([
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
}
