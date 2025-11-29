// src/reviews/reviews.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AdminGuard } from '../auth/admin.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new review (Admin only)' })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reviews with filters' })
  @ApiResponse({ status: 200, description: 'Reviews retrieved successfully' })
  findAll(@Query() filters: any) {
    // Parse boolean query parameters
    const parsedFilters = { ...filters };
    if (filters.approved !== undefined) {
      parsedFilters.approved = filters.approved === 'true' || filters.approved === '1';
    }
    return this.reviewsService.findAll(parsedFilters);
  }

  @Get('tour/:tourId')
  @ApiOperation({ summary: 'Get reviews for a specific tour' })
  @ApiResponse({ status: 200, description: 'Tour reviews retrieved successfully' })
  findByTour(@Param('tourId') tourId: string) {
    return this.reviewsService.findByTour(tourId);
  }

  @Get('pending')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get pending reviews (Admin only)' })
  @ApiResponse({ status: 200, description: 'Pending reviews retrieved successfully' })
  getPending() {
    return this.reviewsService.findPending();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get review by ID' })
  @ApiResponse({ status: 200, description: 'Review retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update review (Admin only)' })
  @ApiResponse({ status: 200, description: 'Review updated successfully' })
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(id, updateReviewDto);
  }

  @Patch(':id/approve')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve review (Admin only)' })
  @ApiResponse({ status: 200, description: 'Review approved successfully' })
  approve(@Param('id') id: string) {
    return this.reviewsService.approve(id);
  }

  @Patch(':id/reject')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject review (Admin only)' })
  @ApiResponse({ status: 200, description: 'Review rejected successfully' })
  reject(@Param('id') id: string) {
    return this.reviewsService.reject(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete review (Admin only)' })
  @ApiResponse({ status: 200, description: 'Review deleted successfully' })
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }
}
