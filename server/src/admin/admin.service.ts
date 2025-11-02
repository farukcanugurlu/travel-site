import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // Admin operations will be implemented here
  async getDashboardStats() {
    const [tours, bookings, reviews, users] = await Promise.all([
      this.prisma.tour.count(),
      this.prisma.booking.count(),
      this.prisma.review.count(),
      this.prisma.user.count(),
    ]);

    return {
      tours,
      bookings,
      reviews,
      users,
    };
  }
}
