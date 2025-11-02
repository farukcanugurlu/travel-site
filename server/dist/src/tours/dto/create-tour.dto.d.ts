export declare class CreateTourDto {
    title: string;
    slug: string;
    description?: string;
    excerpt?: string;
    featured?: boolean;
    published?: boolean;
    duration?: string;
    thumbnail?: string;
    images?: string[];
    destinationId?: string;
    included?: any;
    excluded?: any;
    highlights?: any;
    itinerary?: any;
    locationLatitude?: number;
    locationLongitude?: number;
    locationDescription?: string;
    type?: string;
    category?: string;
    groupSize?: string;
    languages?: any;
}
