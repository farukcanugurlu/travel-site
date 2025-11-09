// server/src/favorites/favorites.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async create(createFavoriteDto: CreateFavoriteDto) {
    // Check if already exists
    const existing = await this.prisma.favorite.findFirst({
      where: {
        userId: createFavoriteDto.userId,
        tourId: createFavoriteDto.tourId,
      },
    });

    if (existing) {
      return existing; // Return existing if already favorited
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

  async findByUser(userId: string) {
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

  async findOne(userId: string, tourId: string) {
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
    
    // If favorite not found, throw NotFoundException (404)
    // This ensures frontend can properly detect when a tour is not in favorites
    if (!favorite) {
      throw new NotFoundException(`Favorite not found for user ${userId} and tour ${tourId}`);
    }
    
    return favorite;
  }

  async remove(userId: string, tourId: string) {
    return this.prisma.favorite.deleteMany({
      where: {
        userId,
        tourId,
      },
    });
  }

  async getUserFavoriteCount(userId: string) {
    return this.prisma.favorite.count({
      where: { userId },
    });
  }
}
