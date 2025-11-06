import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
export declare class FavoritesController {
    private readonly favoritesService;
    constructor(favoritesService: FavoritesService);
    create(createFavoriteDto: CreateFavoriteDto): Promise<{
        id: string;
        createdAt: Date;
        tourId: string;
        userId: string;
    }>;
    findByUser(userId: string): Promise<({
        tour: {
            destination: {
                name: string;
                country: string;
            };
            id: string;
            slug: string;
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
            destination: {
                name: string;
                country: string;
            };
            id: string;
            slug: string;
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
