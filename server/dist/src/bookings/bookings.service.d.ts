import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
export declare class BookingsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createBookingDto: CreateBookingDto): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        tour: {
            id: string;
            title: string;
            slug: string;
            thumbnail: string;
        };
        package: {
            id: string;
            name: string;
            adultPrice: import("@prisma/client/runtime/library").Decimal;
            childPrice: import("@prisma/client/runtime/library").Decimal;
            infantPrice: import("@prisma/client/runtime/library").Decimal;
            language: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tourId: string;
        userId: string;
        bookingNo: string;
        status: import(".prisma/client").$Enums.BookingStatus;
        adultCount: number;
        childCount: number;
        infantCount: number;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        pdfUrl: string | null;
        notes: string | null;
        tourDate: Date;
        specialRequests: string | null;
        contactPhone: string | null;
        contactEmail: string | null;
        packageId: string;
    }>;
    findAll(filters?: {
        userId?: string;
        tourId?: string;
        status?: string;
    }): Promise<({
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        tour: {
            id: string;
            title: string;
            slug: string;
            thumbnail: string;
        };
        package: {
            id: string;
            name: string;
            adultPrice: import("@prisma/client/runtime/library").Decimal;
            childPrice: import("@prisma/client/runtime/library").Decimal;
            infantPrice: import("@prisma/client/runtime/library").Decimal;
            language: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tourId: string;
        userId: string;
        bookingNo: string;
        status: import(".prisma/client").$Enums.BookingStatus;
        adultCount: number;
        childCount: number;
        infantCount: number;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        pdfUrl: string | null;
        notes: string | null;
        tourDate: Date;
        specialRequests: string | null;
        contactPhone: string | null;
        contactEmail: string | null;
        packageId: string;
    })[]>;
    findByUser(userId: string): Promise<({
        tour: {
            id: string;
            title: string;
            slug: string;
            thumbnail: string;
        };
        package: {
            id: string;
            name: string;
            adultPrice: import("@prisma/client/runtime/library").Decimal;
            childPrice: import("@prisma/client/runtime/library").Decimal;
            infantPrice: import("@prisma/client/runtime/library").Decimal;
            language: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tourId: string;
        userId: string;
        bookingNo: string;
        status: import(".prisma/client").$Enums.BookingStatus;
        adultCount: number;
        childCount: number;
        infantCount: number;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        pdfUrl: string | null;
        notes: string | null;
        tourDate: Date;
        specialRequests: string | null;
        contactPhone: string | null;
        contactEmail: string | null;
        packageId: string;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        tour: {
            id: string;
            title: string;
            slug: string;
            thumbnail: string;
        };
        package: {
            id: string;
            name: string;
            adultPrice: import("@prisma/client/runtime/library").Decimal;
            childPrice: import("@prisma/client/runtime/library").Decimal;
            infantPrice: import("@prisma/client/runtime/library").Decimal;
            language: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tourId: string;
        userId: string;
        bookingNo: string;
        status: import(".prisma/client").$Enums.BookingStatus;
        adultCount: number;
        childCount: number;
        infantCount: number;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        pdfUrl: string | null;
        notes: string | null;
        tourDate: Date;
        specialRequests: string | null;
        contactPhone: string | null;
        contactEmail: string | null;
        packageId: string;
    }>;
    update(id: string, updateData: any): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        tour: {
            id: string;
            title: string;
            slug: string;
            thumbnail: string;
        };
        package: {
            id: string;
            name: string;
            adultPrice: import("@prisma/client/runtime/library").Decimal;
            childPrice: import("@prisma/client/runtime/library").Decimal;
            infantPrice: import("@prisma/client/runtime/library").Decimal;
            language: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tourId: string;
        userId: string;
        bookingNo: string;
        status: import(".prisma/client").$Enums.BookingStatus;
        adultCount: number;
        childCount: number;
        infantCount: number;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        pdfUrl: string | null;
        notes: string | null;
        tourDate: Date;
        specialRequests: string | null;
        contactPhone: string | null;
        contactEmail: string | null;
        packageId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tourId: string;
        userId: string;
        bookingNo: string;
        status: import(".prisma/client").$Enums.BookingStatus;
        adultCount: number;
        childCount: number;
        infantCount: number;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        pdfUrl: string | null;
        notes: string | null;
        tourDate: Date;
        specialRequests: string | null;
        contactPhone: string | null;
        contactEmail: string | null;
        packageId: string;
    }>;
    updateStatus(id: string, status: string): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        tour: {
            id: string;
            title: string;
            slug: string;
            thumbnail: string;
        };
        package: {
            id: string;
            name: string;
            adultPrice: import("@prisma/client/runtime/library").Decimal;
            childPrice: import("@prisma/client/runtime/library").Decimal;
            infantPrice: import("@prisma/client/runtime/library").Decimal;
            language: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tourId: string;
        userId: string;
        bookingNo: string;
        status: import(".prisma/client").$Enums.BookingStatus;
        adultCount: number;
        childCount: number;
        infantCount: number;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        pdfUrl: string | null;
        notes: string | null;
        tourDate: Date;
        specialRequests: string | null;
        contactPhone: string | null;
        contactEmail: string | null;
        packageId: string;
    }>;
    getBookingStats(): Promise<{
        total: number;
        pending: number;
        confirmed: number;
        cancelled: number;
    }>;
    generatePDF(bookingId: string): Promise<Buffer>;
    savePDF(bookingId: string): Promise<string>;
}
