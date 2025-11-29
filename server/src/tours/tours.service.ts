import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { CreateTourPackageDto } from './dto/create-tour-package.dto';
import { UpdateTourPackageDto } from './dto/update-tour-package.dto';

@Injectable()
export class ToursService {
  constructor(private prisma: PrismaService) {}

  // Tours CRUD
  async create(createTourDto: CreateTourDto & { packages?: any[] }) {
    const { packages, ...tourData } = createTourDto;
    
    console.log('Creating tour with data:', tourData);
    
    // Check if slug already exists
    if (tourData.slug) {
      const existingTour = await this.prisma.tour.findUnique({
        where: { slug: tourData.slug },
      });
      
      if (existingTour) {
        throw new BadRequestException(
          `A tour with the slug "${tourData.slug}" already exists. Please use a different slug.`
        );
      }
    }
    
    // If thumbnail is provided, add it to images array if images is empty
    if (tourData.thumbnail && (!tourData.images || tourData.images.length === 0)) {
      tourData.images = [tourData.thumbnail];
      console.log('Added thumbnail to images:', tourData.images);
    }
    
    const tour = await this.prisma.tour.create({
      data: tourData as any,
      include: {
        destination: true,
        packages: true,
        reviews: true,
      },
    });

    // Create packages if provided
    if (packages && packages.length > 0) {
      for (const pkg of packages) {
        await this.prisma.tourPackage.create({
          data: {
            name: pkg.name,
            description: pkg.description || '',
            adultPrice: pkg.adultPrice,
            childPrice: pkg.childPrice,
            infantPrice: pkg.infantPrice,
            language: pkg.language,
            capacity: pkg.capacity || 10,
            tourId: tour.id,
          },
        });
      }
      
      // Re-fetch tour with packages
      return this.prisma.tour.findUnique({
        where: { id: tour.id },
        include: {
          destination: true,
          packages: true,
          reviews: true,
        },
      });
    }

    return tour;
  }

  async findAll(filters?: {
    destination?: string;
    featured?: boolean;
    published?: boolean;
    search?: string;
  }) {
    const where: any = {};

    if (filters?.destination) {
      where.destination = { slug: filters.destination };
    }

    if (filters?.featured !== undefined) {
      where.featured = filters.featured;
    }

    if (filters?.published !== undefined) {
      where.published = filters.published;
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.tour.findMany({
      where,
      include: {
        destination: true,
        packages: true,
        reviews: {
          where: { approved: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.tour.findUnique({
      where: { id },
      include: {
        destination: true,
        packages: true,
        reviews: {
          where: { approved: true },
          include: { user: true },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    const tour = await this.prisma.tour.findUnique({
      where: { slug },
      include: {
        destination: true,
        packages: true,
        reviews: {
          where: { approved: true },
          include: { user: true },
        },
      },
    });
    
    // Debug: API'den dönen veriyi logla
    if (tour) {
      console.log('ToursService - findBySlug response:', {
        id: tour.id,
        title: tour.title,
        slug: tour.slug,
        thumbnail: tour.thumbnail,
        images: tour.images,
        imagesLength: Array.isArray(tour.images) ? tour.images.length : 'not array',
        imagesType: typeof tour.images,
      });
    } else {
      console.log('ToursService - findBySlug: Tour not found for slug:', slug);
    }
    
    return tour;
  }

  async update(id: string, updateTourDto: UpdateTourDto) {
    const data: any = { ...updateTourDto };
    
    // If slug is being updated, check if it already exists (excluding current tour)
    if (data.slug) {
      const existingTour = await this.prisma.tour.findUnique({
        where: { slug: data.slug },
      });
      
      if (existingTour && existingTour.id !== id) {
        throw new BadRequestException(
          `A tour with the slug "${data.slug}" already exists. Please use a different slug.`
        );
      }
    }
    
    // If destinationId is provided, verify it exists
    if (data.destinationId) {
      const destination = await this.prisma.destination.findUnique({
        where: { id: data.destinationId },
      });
      
      if (!destination) {
        throw new Error(`Destination with ID ${data.destinationId} not found`);
      }
    }
    
    return this.prisma.tour.update({
      where: { id },
      data,
      include: {
        destination: true,
        packages: true,
        reviews: true,
      },
    });
  }

  async remove(id: string, forceDelete: boolean = false) {
    try {
      // Check if tour exists
      const tourToDelete = await this.prisma.tour.findUnique({
        where: { id },
        include: {
          bookings: true,
          reviews: true,
          packages: {
            include: {
              bookings: true,
            },
          },
          favorites: true,
        },
      });

      if (!tourToDelete) {
        throw new NotFoundException(`Tour with ID ${id} not found`);
      }

      // Check if there are any bookings associated with this tour
      const totalBookings = tourToDelete.bookings?.length || 0;
      const packageBookings = tourToDelete.packages?.reduce((sum, pkg) => sum + (pkg.bookings?.length || 0), 0) || 0;
      const allBookings = totalBookings + packageBookings;

      if (allBookings > 0) {
        if (!forceDelete) {
          throw new BadRequestException(
            `Cannot delete tour "${tourToDelete.title}" because it has ${allBookings} associated booking(s). Please delete or reassign the bookings first, or use force delete.`
          );
        }
        
        // Force delete: Delete all associated bookings first
        console.warn(`⚠️ Force deleting tour "${tourToDelete.title}" and ${allBookings} associated booking(s)`);
        
        // Delete bookings directly associated with tour
        if (totalBookings > 0) {
          await this.prisma.booking.deleteMany({
            where: { tourId: id },
          });
        }
        
        // Delete bookings associated with tour packages
        if (packageBookings > 0) {
          const packageIds = tourToDelete.packages?.map(pkg => pkg.id) || [];
          if (packageIds.length > 0) {
            await this.prisma.booking.deleteMany({
              where: { packageId: { in: packageIds } },
            });
          }
        }
        
        console.log(`✅ Deleted ${allBookings} booking(s) associated with tour "${tourToDelete.title}"`);
      }

      // Delete favorites
      if (tourToDelete.favorites && tourToDelete.favorites.length > 0) {
        await this.prisma.favorite.deleteMany({
          where: { tourId: id },
        });
      }

      // Delete reviews
      if (tourToDelete.reviews && tourToDelete.reviews.length > 0) {
        await this.prisma.review.deleteMany({
          where: { tourId: id },
        });
      }

      // Delete packages (cascade will handle this, but we'll do it explicitly for clarity)
      if (tourToDelete.packages && tourToDelete.packages.length > 0) {
        await this.prisma.tourPackage.deleteMany({
          where: { tourId: id },
        });
      }

      // Delete the tour
      return await this.prisma.tour.delete({
        where: { id },
      });
    } catch (error) {
      // If it's already a NestJS exception, re-throw it
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      // Otherwise, wrap it in a BadRequestException
      console.error('Error deleting tour:', error);
      throw new BadRequestException(error?.message || 'Failed to delete tour');
    }
  }

  // Tour Packages CRUD
  async createPackage(tourId: string, createPackageDto: CreateTourPackageDto) {
    return this.prisma.tourPackage.create({
      data: {
        ...createPackageDto,
        tourId,
      },
    });
  }

  async updatePackage(id: string, updatePackageDto: UpdateTourPackageDto) {
    return this.prisma.tourPackage.update({
      where: { id },
      data: updatePackageDto,
    });
  }

  async removePackage(id: string, forceDelete: boolean = false) {
    try {
      // Check if package exists
      const packageToDelete = await this.prisma.tourPackage.findUnique({
        where: { id },
        include: {
          bookings: true,
        },
      });

      if (!packageToDelete) {
        throw new NotFoundException(`Package with ID ${id} not found`);
      }

      // Check if there are any bookings associated with this package
      if (packageToDelete.bookings && packageToDelete.bookings.length > 0) {
        if (!forceDelete) {
          throw new BadRequestException(
            `Cannot delete package "${packageToDelete.name}" because it has ${packageToDelete.bookings.length} associated booking(s). Please delete or reassign the bookings first, or use force delete.`
          );
        }
        
        // Force delete: Delete all associated bookings first
        console.warn(`⚠️ Force deleting package "${packageToDelete.name}" and ${packageToDelete.bookings.length} associated booking(s)`);
        await this.prisma.booking.deleteMany({
          where: { packageId: id },
        });
        console.log(`✅ Deleted ${packageToDelete.bookings.length} booking(s) associated with package "${packageToDelete.name}"`);
      }

      // Delete the package
      return await this.prisma.tourPackage.delete({
        where: { id },
      });
    } catch (error) {
      // If it's already a NestJS exception, re-throw it
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      // Otherwise, wrap it in a BadRequestException
      console.error('Error deleting package:', error);
      throw new BadRequestException(error?.message || 'Failed to delete package');
    }
  }

  // Destinations
  async getDestinations() {
    try {
      return await this.prisma.destination.findMany({
        orderBy: { name: 'asc' },
      });
    } catch (error) {
      console.error('Error fetching destinations:', error);
      throw new Error('Failed to fetch destinations');
    }
  }

  async getFeaturedTours(limit: number = 8) {
    return this.prisma.tour.findMany({
      where: {
        featured: true,
        published: true,
      },
      include: {
        destination: true,
        packages: true,
        reviews: {
          where: { approved: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getPopularTours(limit: number = 8) {
    return this.prisma.tour.findMany({
      where: {
        popular: true,
        published: true,
      },
      include: {
        destination: true,
        packages: true,
        reviews: {
          where: { approved: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getPopularDestinations(limit: number = 8) {
    return this.prisma.destination.findMany({
      include: {
        tours: {
          where: { published: true },
        },
      },
      orderBy: {
        tours: {
          _count: 'desc',
        },
      },
      take: limit,
    });
  }
}
