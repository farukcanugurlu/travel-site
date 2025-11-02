"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const PDFDocument = require('pdfkit');
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");
let BookingsService = class BookingsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createBookingDto) {
        const tourPackage = await this.prisma.tourPackage.findUnique({
            where: { id: createBookingDto.packageId },
        });
        if (!tourPackage) {
            throw new Error('Tour package not found');
        }
        const totalAmount = (createBookingDto.adultCount * Number(tourPackage.adultPrice)) +
            (createBookingDto.childCount * Number(tourPackage.childPrice)) +
            (createBookingDto.infantCount * Number(tourPackage.infantPrice));
        const bookingNo = `BK${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
        const booking = await this.prisma.booking.create({
            data: {
                ...createBookingDto,
                bookingNo,
                totalAmount,
                status: client_1.BookingStatus.PENDING,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                tour: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        thumbnail: true,
                    },
                },
                package: {
                    select: {
                        id: true,
                        name: true,
                        adultPrice: true,
                        childPrice: true,
                        infantPrice: true,
                        language: true,
                    },
                },
            },
        });
        return booking;
    }
    async findAll(filters) {
        const where = {};
        if (filters?.userId) {
            where.userId = filters.userId;
        }
        if (filters?.tourId) {
            where.tourId = filters.tourId;
        }
        if (filters?.status) {
            where.status = filters.status;
        }
        return this.prisma.booking.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                tour: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        thumbnail: true,
                    },
                },
                package: {
                    select: {
                        id: true,
                        name: true,
                        adultPrice: true,
                        childPrice: true,
                        infantPrice: true,
                        language: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findByUser(userId) {
        return this.prisma.booking.findMany({
            where: { userId },
            include: {
                tour: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        thumbnail: true,
                    },
                },
                package: {
                    select: {
                        id: true,
                        name: true,
                        adultPrice: true,
                        childPrice: true,
                        infantPrice: true,
                        language: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        return this.prisma.booking.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                tour: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        thumbnail: true,
                    },
                },
                package: {
                    select: {
                        id: true,
                        name: true,
                        adultPrice: true,
                        childPrice: true,
                        infantPrice: true,
                        language: true,
                    },
                },
            },
        });
    }
    async update(id, updateData) {
        return this.prisma.booking.update({
            where: { id },
            data: updateData,
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                tour: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        thumbnail: true,
                    },
                },
                package: {
                    select: {
                        id: true,
                        name: true,
                        adultPrice: true,
                        childPrice: true,
                        infantPrice: true,
                        language: true,
                    },
                },
            },
        });
    }
    async remove(id) {
        return this.prisma.booking.delete({
            where: { id },
        });
    }
    async updateStatus(id, status) {
        return this.prisma.booking.update({
            where: { id },
            data: { status: status },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                tour: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        thumbnail: true,
                    },
                },
                package: {
                    select: {
                        id: true,
                        name: true,
                        adultPrice: true,
                        childPrice: true,
                        infantPrice: true,
                        language: true,
                    },
                },
            },
        });
    }
    async getBookingStats() {
        const total = await this.prisma.booking.count();
        const pending = await this.prisma.booking.count({ where: { status: client_1.BookingStatus.PENDING } });
        const confirmed = await this.prisma.booking.count({ where: { status: client_1.BookingStatus.CONFIRMED } });
        const cancelled = await this.prisma.booking.count({ where: { status: client_1.BookingStatus.CANCELLED } });
        return {
            total,
            pending,
            confirmed,
            cancelled,
        };
    }
    async generatePDF(bookingId) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                tour: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        thumbnail: true,
                    },
                },
                package: {
                    select: {
                        id: true,
                        name: true,
                        adultPrice: true,
                        childPrice: true,
                        infantPrice: true,
                        language: true,
                    },
                },
            },
        });
        if (!booking) {
            throw new Error('Booking not found');
        }
        const doc = new PDFDocument({
            size: 'A4',
            margin: 50,
        });
        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        return new Promise((resolve, reject) => {
            doc.on('end', () => {
                const pdfBuffer = Buffer.concat(buffers);
                resolve(pdfBuffer);
            });
            doc.on('error', reject);
            const pageWidth = doc.page.width;
            const pageHeight = doc.page.height;
            const margin = 50;
            doc.fontSize(24)
                .fillColor('#2c3e50')
                .text('Booking Voucher', margin, margin, { align: 'center' });
            doc.moveDown(2);
            doc.fontSize(16)
                .fillColor('#3498db')
                .text(`Booking No: ${booking.bookingNo}`, margin);
            doc.moveDown();
            doc.fontSize(14)
                .fillColor('#2c3e50')
                .text('Tour Information:', margin);
            doc.fontSize(12)
                .fillColor('#34495e')
                .text(`Tour: ${booking.tour?.title || 'N/A'}`, margin + 20);
            doc.text(`Package: ${booking.package?.name || 'N/A'} - ${booking.package?.language || 'N/A'}`, margin + 20);
            const tourDate = new Date(booking.tourDate);
            doc.text(`Date: ${tourDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, margin + 20);
            doc.moveDown();
            doc.fontSize(14)
                .fillColor('#2c3e50')
                .text('Participants:', margin);
            doc.fontSize(12)
                .fillColor('#34495e');
            if (booking.adultCount > 0) {
                doc.text(`Adults: ${booking.adultCount}`, margin + 20);
            }
            if (booking.childCount > 0) {
                doc.text(`Children: ${booking.childCount}`, margin + 20);
            }
            if (booking.infantCount > 0) {
                doc.text(`Infants: ${booking.infantCount}`, margin + 20);
            }
            doc.moveDown();
            doc.fontSize(14)
                .fillColor('#2c3e50')
                .text('Total Amount:', margin);
            doc.fontSize(16)
                .fillColor('#27ae60')
                .font('Helvetica-Bold')
                .text(`$${Number(booking.totalAmount).toFixed(2)}`, margin + 20);
            doc.font('Helvetica');
            doc.moveDown(2);
            const qrCodeUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/booking/${booking.id}`;
            QRCode.toBuffer(qrCodeUrl, {
                errorCorrectionLevel: 'M',
                type: 'png',
                width: 200,
                margin: 2,
            }).then((qrBuffer) => {
                doc.fontSize(12)
                    .fillColor('#2c3e50')
                    .text('Booking QR Code:', margin);
                doc.image(qrBuffer, pageWidth / 2 - 100, doc.y + 10, {
                    width: 200,
                    height: 200,
                    align: 'center',
                });
                doc.fontSize(10)
                    .fillColor('#7f8c8d')
                    .text(`Scan QR code or visit: ${qrCodeUrl}`, margin, doc.y + 220, {
                    align: 'center',
                    width: pageWidth - 2 * margin,
                });
                doc.fontSize(10)
                    .fillColor('#95a5a6')
                    .text(`Generated on ${new Date().toLocaleString()}`, margin, pageHeight - 50, { align: 'center' });
                doc.end();
            }).catch(reject);
        });
    }
    async savePDF(bookingId) {
        const pdfBuffer = await this.generatePDF(bookingId);
        const uploadsDir = path.join(process.cwd(), 'uploads');
        const bookingsDir = path.join(uploadsDir, 'bookings');
        if (!fs.existsSync(bookingsDir)) {
            fs.mkdirSync(bookingsDir, { recursive: true });
        }
        const fileName = `booking-${bookingId}-${Date.now()}.pdf`;
        const filePath = path.join(bookingsDir, fileName);
        fs.writeFileSync(filePath, pdfBuffer);
        const pdfUrl = `/uploads/bookings/${fileName}`;
        await this.prisma.booking.update({
            where: { id: bookingId },
            data: { pdfUrl },
        });
        return pdfUrl;
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map