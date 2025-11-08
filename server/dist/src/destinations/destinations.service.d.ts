import { PrismaService } from '../prisma/prisma.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
export interface DestinationFilters {
    search?: string;
    country?: string;
    page?: number;
    limit?: number;
}
export declare class DestinationsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(filters: DestinationFilters): Promise<({
        _count: {
            tours: number;
        };
    } & {
        id: string;
        slug: string;
        featured: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        country: string;
        latitude: number | null;
        longitude: number | null;
        image: string | null;
        displayOrder: number | null;
    })[]>;
    findOne(id: string): Promise<{
        _count: {
            tours: number;
        };
    } & {
        id: string;
        slug: string;
        featured: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        country: string;
        latitude: number | null;
        longitude: number | null;
        image: string | null;
        displayOrder: number | null;
    }>;
    create(createDestinationDto: CreateDestinationDto): Promise<{
        _count: {
            tours: number;
        };
    } & {
        id: string;
        slug: string;
        featured: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        country: string;
        latitude: number | null;
        longitude: number | null;
        image: string | null;
        displayOrder: number | null;
    }>;
    update(id: string, updateDestinationDto: UpdateDestinationDto): Promise<{
        _count: {
            tours: number;
        };
    } & {
        id: string;
        slug: string;
        featured: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        country: string;
        latitude: number | null;
        longitude: number | null;
        image: string | null;
        displayOrder: number | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    getStats(): Promise<{
        total: number;
        countries: number;
        destinationsWithTours: number;
        destinationsWithoutTours: number;
    }>;
    getFeaturedDestinations(limit?: number): Promise<({
        _count: {
            tours: number;
        };
    } & {
        id: string;
        slug: string;
        featured: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        country: string;
        latitude: number | null;
        longitude: number | null;
        image: string | null;
        displayOrder: number | null;
    })[]>;
}
