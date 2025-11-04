import { PrismaService } from '../prisma/prisma.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
export declare class FavoritesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createFavoriteDto: CreateFavoriteDto): Promise<{
        id: string;
        createdAt: Date;
        tourId: string;
        userId: string;
    }>;
    findByUser(userId: string): Promise<({
        tour: {
            id: string;
            slug: string;
            destination: {
                name: string;
                country: string;
            };
            title: string;
            thumbnail: string;
            packages: {
                adultPrice: import("@prisma/client/runtime/library").Decimal;
            }[];
        };
    } & {
        id: string;
        createdAt: Date;
        tourId: string;
        userId: string;
    })[]>;
    findOne(userId: string, tourId: string): Promise<{
        tour: {
            id: string;
            slug: string;
            destination: {
                name: string;
                country: string;
            };
            title: string;
            thumbnail: string;
            packages: {
                adultPrice: import("@prisma/client/runtime/library").Decimal;
            }[];
        };
    } & {
        id: string;
        createdAt: Date;
        tourId: string;
        userId: string;
    }>;
    remove(userId: string, tourId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getUserFavoriteCount(userId: string): Promise<number>;
}
