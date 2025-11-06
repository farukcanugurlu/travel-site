// server/src/destinations/dto/create-destination.dto.ts
import { IsString, IsNotEmpty, MinLength, Matches, IsOptional, IsBoolean, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDestinationDto {
  @ApiProperty({ description: 'Destination name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @ApiProperty({ description: 'Destination slug (URL-friendly version)' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })
  slug: string;

  @ApiProperty({ description: 'Country name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  country: string;

  @ApiProperty({ description: 'Featured image URL', required: false })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ description: 'Show on homepage', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiProperty({ description: 'Display order on homepage', required: false, default: 0 })
  @IsOptional()
  @IsInt()
  displayOrder?: number;
}
