// server/src/bookings/bookings.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Res, Request } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { Response } from 'express';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard) // Only authenticated users can create bookings
  async create(@Body() createBookingDto: CreateBookingDto) {
    const booking = await this.bookingsService.create(createBookingDto);
    
    // Generate and save PDF after booking creation
    try {
      console.log('Creating PDF for booking:', booking.id);
      const pdfUrl = await this.bookingsService.savePDF(booking.id);
      console.log('PDF created successfully:', pdfUrl);
    } catch (error) {
      console.error('Error generating PDF during booking creation:', error);
      console.error('Error stack:', error?.stack);
      // Don't fail the booking creation if PDF generation fails
    }
    
    return booking;
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard) // Only admins can view all bookings
  findAll(@Query('userId') userId?: string, @Query('tourId') tourId?: string, @Query('status') status?: string) {
    const filters: { userId?: string; tourId?: string; status?: string } = {};
    if (userId) filters.userId = userId;
    if (tourId) filters.tourId = tourId;
    if (status) filters.status = status;
    return this.bookingsService.findAll(filters);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard) // Users can view their own bookings
  findByUser(@Param('userId') userId: string) {
    return this.bookingsService.findByUser(userId);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, AdminGuard) // Only admins can view booking stats
  getStats() {
    return this.bookingsService.getBookingStats();
  }

  @Get(':id/pdf')
  @UseGuards(JwtAuthGuard) // Users can download their own booking PDFs
  async getPDF(@Param('id') id: string, @Request() req: any, @Res() res: Response) {
    console.log('PDF endpoint called with id:', id);
    console.log('Current user:', req.user);
    
    try {
      // Get current user from JWT
      const currentUser = req.user;
      if (!currentUser) {
        console.log('No user in request');
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Check if booking exists and belongs to user (unless admin)
      const booking = await this.bookingsService.findOne(id);
      console.log('Booking found:', booking ? 'Yes' : 'No');
      
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      // Allow admin or booking owner
      if (currentUser.role !== 'ADMIN' && booking.userId !== currentUser.id) {
        console.log('User not authorized. Booking userId:', booking.userId, 'Current userId:', currentUser.id);
        return res.status(403).json({ message: 'Forbidden: You can only download your own booking PDFs' });
      }

      console.log('Generating PDF...');
      const pdfBuffer = await this.bookingsService.generatePDF(id);
      console.log('PDF generated successfully, size:', pdfBuffer.length);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="booking-${id}.pdf"`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).json({ 
        message: 'Failed to generate PDF',
        error: error?.message || 'Unknown error'
      });
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AdminGuard) // Only admins can view single booking by ID
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, AdminGuard) // Only admins can update booking status
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.bookingsService.updateStatus(id, status);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard) // Only admins can update bookings
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard) // Only admins can delete bookings
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(id);
  }
}
