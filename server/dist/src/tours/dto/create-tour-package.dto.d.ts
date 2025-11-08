export declare class CreateTourPackageDto {
    name: string;
    description?: string;
    adultPrice: number;
    childPrice: number;
    infantPrice: number;
    language: string;
    capacity?: number;
    childMaxAge?: number;
    infantMaxAge?: number;
    monthlyPrices?: Record<string, {
        adultPrice?: number;
        childPrice?: number;
        infantPrice?: number;
    }>;
}
