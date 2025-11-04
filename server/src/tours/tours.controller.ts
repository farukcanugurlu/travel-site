import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ToursService } from './tours.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { CreateTourPackageDto } from './dto/create-tour-package.dto';
import { UpdateTourPackageDto } from './dto/update-tour-package.dto';

@ApiTags('Tours')
@Controller('tours')
export class ToursController {
  constructor(private readonly toursService: ToursService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new tour' })
  @ApiResponse({ status: 201, description: 'Tour created successfully' })
  create(@Body() createTourDto: any) {
    console.log('Received tour data:', createTourDto);
    return this.toursService.create(createTourDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tours with filters' })
  @ApiResponse({ status: 200, description: 'Tours retrieved successfully' })
  findAll(@Query() filters: any) {
    return this.toursService.findAll(filters);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured tours' })
  @ApiResponse({ status: 200, description: 'Featured tours retrieved successfully' })
  getFeatured(@Query('limit') limit?: string) {
    return this.toursService.getFeaturedTours(limit ? parseInt(limit) : 8);
  }

  @Get('popular')
  @ApiOperation({ summary: 'Get popular tours' })
  @ApiResponse({ status: 200, description: 'Popular tours retrieved successfully' })
  getPopular(@Query('limit') limit?: string) {
    return this.toursService.getPopularTours(limit ? parseInt(limit) : 8);
  }

  @Get('destinations')
  @ApiOperation({ summary: 'Get popular destinations' })
  @ApiResponse({ status: 200, description: 'Destinations retrieved successfully' })
  getDestinations(@Query('limit') limit?: string) {
    return this.toursService.getPopularDestinations(limit ? parseInt(limit) : 8);
  }

  @Get('destinations-list')
  @ApiOperation({ summary: 'Get all destinations' })
  @ApiResponse({ status: 200, description: 'Destinations retrieved successfully' })
  getDestinationsList() {
    return this.toursService.getDestinations();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tour by ID' })
  @ApiResponse({ status: 200, description: 'Tour retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Tour not found' })
  findOne(@Param('id') id: string) {
    return this.toursService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get tour by slug' })
  @ApiResponse({ status: 200, description: 'Tour retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Tour not found' })
  findBySlug(@Param('slug') slug: string) {
    return this.toursService.findBySlug(slug);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update tour' })
  @ApiResponse({ status: 200, description: 'Tour updated successfully' })
  update(@Param('id') id: string, @Body() updateTourDto: UpdateTourDto) {
    return this.toursService.update(id, updateTourDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete tour' })
  @ApiResponse({ status: 200, description: 'Tour deleted successfully' })
  remove(@Param('id') id: string) {
    return this.toursService.remove(id);
  }

  // Tour Packages endpoints
  @Post(':tourId/packages')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create tour package' })
  @ApiResponse({ status: 201, description: 'Package created successfully' })
  createPackage(@Param('tourId') tourId: string, @Body() createPackageDto: CreateTourPackageDto) {
    return this.toursService.createPackage(tourId, createPackageDto);
  }

  @Patch('packages/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update tour package' })
  @ApiResponse({ status: 200, description: 'Package updated successfully' })
  updatePackage(@Param('id') id: string, @Body() updatePackageDto: UpdateTourPackageDto) {
    return this.toursService.updatePackage(id, updatePackageDto);
  }

  @Delete('packages/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete tour package' })
  @ApiResponse({ status: 200, description: 'Package deleted successfully' })
  removePackage(@Param('id') id: string) {
    return this.toursService.removePackage(id);
  }
}
