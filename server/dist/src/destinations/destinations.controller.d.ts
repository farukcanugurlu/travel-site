import { DestinationsService } from './destinations.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
export declare class DestinationsController {
    private readonly destinationsService;
    constructor(destinationsService: DestinationsService);
    findAll(search?: string, country?: string, page?: string, limit?: string): Promise<({
        _count: {
            tours: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        country: string;
        latitude: number | null;
        longitude: number | null;
    })[]>;
    getStats(): Promise<{
        total: number;
        countries: number;
        destinationsWithTours: number;
        destinationsWithoutTours: number;
    }>;
    findOne(id: string): Promise<{
        _count: {
            tours: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        country: string;
        latitude: number | null;
        longitude: number | null;
    }>;
    create(createDestinationDto: CreateDestinationDto): Promise<{
        _count: {
            tours: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        country: string;
        latitude: number | null;
        longitude: number | null;
    }>;
    update(id: string, updateDestinationDto: UpdateDestinationDto): Promise<{
        _count: {
            tours: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        country: string;
        latitude: number | null;
        longitude: number | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
