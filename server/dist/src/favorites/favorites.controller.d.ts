import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
export declare class FavoritesController {
    private readonly favoritesService;
    constructor(favoritesService: FavoritesService);
    create(createFavoriteDto: CreateFavoriteDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        tourId: string;
    }>;
    findByUser(userId: string): Promise<({
        tour: {
            id: string;
            title: string;
            slug: string;
            thumbnail: string;
            destination: {
                name: string;
                country: string;
            };
            packages: {
                adultPrice: import("@prisma/client/runtime/library").Decimal;
            }[];
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        tourId: string;
    })[]>;
    findOne(userId: string, tourId: string): Promise<{
        tour: {
            id: string;
            title: string;
            slug: string;
            thumbnail: string;
            destination: {
                name: string;
                country: string;
            };
            packages: {
                adultPrice: import("@prisma/client/runtime/library").Decimal;
            }[];
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        tourId: string;
    }>;
    remove(userId: string, tourId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getUserFavoriteCount(userId: string): Promise<number>;
}
