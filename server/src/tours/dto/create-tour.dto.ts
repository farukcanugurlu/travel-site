import { IsString, IsOptional, IsBoolean, IsArray, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTourDto {
  @ApiProperty({ example: 'Antalya City Highlights' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'antalya-city-highlights' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'Explore the beautiful city of Antalya...' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Discover Antalya...' })
  @IsOptional()
  @IsString()
  excerpt?: string;

  @ApiProperty({ example: false })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiProperty({ example: false })
  @IsOptional()
  @IsBoolean()
  popular?: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @ApiProperty({ example: '1 Day' })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiProperty({ example: '/assets/img/listing/listing-1.jpg' })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiProperty({ example: ['/assets/img/listing/listing-1.jpg', '/assets/img/listing/listing-2.jpg'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({ example: 'dest-1' })
  @IsString()
  @IsNotEmpty()
  destinationId?: string;

  // New dynamic fields
  @ApiProperty({ example: ['Pick and Drop Service', '1 Meal Per Day'] })
  @IsOptional()
  @IsArray()
  included?: any;

  @ApiProperty({ example: ['Gratuities', 'Travel insurance'] })
  @IsOptional()
  @IsArray()
  excluded?: any;

  @ApiProperty({ example: ['Hot air balloon experience', 'Explore ancient cities'] })
  @IsOptional()
  @IsArray()
  highlights?: any;

  @ApiProperty({ example: [{ day: 'Day 1', title: 'Arrival', description: '...' }] })
  @IsOptional()
  @IsArray()
  itinerary?: any;

  @ApiProperty({ example: 36.8841 })
  @IsOptional()
  @IsNumber()
  locationLatitude?: number;

  @ApiProperty({ example: 30.7056 })
  @IsOptional()
  @IsNumber()
  locationLongitude?: number;

  @ApiProperty({ example: 'Antalya is a beautiful coastal city...' })
  @IsOptional()
  @IsString()
  locationDescription?: string;

  @ApiProperty({ example: 'Hotel Pickup or Main Square' })
  @IsOptional()
  @IsString()
  meetingPointAddress?: string;

  @ApiProperty({ example: 'https://www.google.com/maps/embed?pb=...' })
  @IsOptional()
  @IsString()
  meetingPointMapUrl?: string;

  @ApiProperty({ example: 'Adventure' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({ example: 'Small Group (Max 12 People)' })
  @IsOptional()
  @IsString()
  groupSize?: string;

  @ApiProperty({ example: ['English', 'Turkish'] })
  @IsOptional()
  @IsArray()
  languages?: any;

  @ApiProperty({ example: ['09:00', '14:00', '18:00'] })
  @IsOptional()
  @IsArray()
  availableTimes?: any;
}
