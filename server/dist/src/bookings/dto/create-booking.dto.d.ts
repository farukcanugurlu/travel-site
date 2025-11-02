export declare class CreateBookingDto {
    userId: string;
    tourId: string;
    packageId: string;
    adultCount: number;
    childCount: number;
    infantCount: number;
    tourDate: string;
    specialRequests?: string;
    contactPhone?: string;
    contactEmail?: string;
}
