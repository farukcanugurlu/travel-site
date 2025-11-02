import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<{
        tours: number;
        bookings: number;
        reviews: number;
        users: number;
    }>;
}
