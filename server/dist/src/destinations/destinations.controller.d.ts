import { DestinationsService } from './destinations.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
export declare class DestinationsController {
    private readonly destinationsService;
    constructor(destinationsService: DestinationsService);
    getFeatured(limit?: string): Promise<({
        _count: {
            tours: number;
        };
    } & {
        id: string;
        name: string;
        slug: string;
        country: string;
        latitude: number | null;
        longitude: number | null;
        image: string | null;
        featured: boolean;
        displayOrder: number | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getStats(): Promise<{
        total: number;
        countries: number;
        destinationsWithTours: number;
        destinationsWithoutTours: number;
    }>;
    findAll(search?: string, country?: string, page?: string, limit?: string): Promise<({
        _count: {
            tours: number;
        };
    } & {
        id: string;
        name: string;
        slug: string;
        country: string;
        latitude: number | null;
        longitude: number | null;
        image: string | null;
        featured: boolean;
        displayOrder: number | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): Promise<{
        _count: {
            tours: number;
        };
    } & {
        id: string;
        name: string;
        slug: string;
        country: string;
        latitude: number | null;
        longitude: number | null;
        image: string | null;
        featured: boolean;
        displayOrder: number | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(createDestinationDto: CreateDestinationDto): Promise<{
        _count: {
            tours: number;
        };
    } & {
        id: string;
        name: string;
        slug: string;
        country: string;
        latitude: number | null;
        longitude: number | null;
        image: string | null;
        featured: boolean;
        displayOrder: number | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateDestinationDto: UpdateDestinationDto): Promise<{
        _count: {
            tours: number;
        };
    } & {
        id: string;
        name: string;
        slug: string;
        country: string;
        latitude: number | null;
        longitude: number | null;
        image: string | null;
        featured: boolean;
        displayOrder: number | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
