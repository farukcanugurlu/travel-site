// server/src/destinations/destinations.controller.ts
import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DestinationsService } from './destinations.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@ApiTags('Destinations')
@Controller('destinations')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all destinations' })
  @ApiResponse({ status: 200, description: 'Destinations retrieved successfully' })
  findAll(
    @Query('search') search?: string,
    @Query('country') country?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const filters = {
      search,
      country,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    };
    return this.destinationsService.findAll(filters);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get destination statistics' })
  @ApiResponse({ status: 200, description: 'Destination statistics retrieved successfully' })
  getStats() {
    return this.destinationsService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get destination by ID' })
  @ApiResponse({ status: 200, description: 'Destination retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Destination not found' })
  findOne(@Param('id') id: string) {
    return this.destinationsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new destination' })
  @ApiResponse({ status: 201, description: 'Destination created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createDestinationDto: CreateDestinationDto) {
    return this.destinationsService.create(createDestinationDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update destination' })
  @ApiResponse({ status: 200, description: 'Destination updated successfully' })
  @ApiResponse({ status: 404, description: 'Destination not found' })
  update(@Param('id') id: string, @Body() updateDestinationDto: UpdateDestinationDto) {
    return this.destinationsService.update(id, updateDestinationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete destination' })
  @ApiResponse({ status: 200, description: 'Destination deleted successfully' })
  @ApiResponse({ status: 404, description: 'Destination not found' })
  remove(@Param('id') id: string) {
    return this.destinationsService.remove(id);
  }
}
