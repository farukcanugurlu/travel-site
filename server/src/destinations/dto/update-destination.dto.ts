// server/src/destinations/dto/update-destination.dto.ts
import { IsString, IsOptional, MinLength, Matches, IsBoolean, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDestinationDto {
  @ApiProperty({ description: 'Destination name', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiProperty({ description: 'Destination slug (URL-friendly version)', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })
  slug?: string;

  @ApiProperty({ description: 'Country name', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  country?: string;

  @ApiProperty({ description: 'Featured image URL', required: false })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ description: 'Show on homepage', required: false })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiProperty({ description: 'Display order on homepage', required: false })
  @IsOptional()
  @IsInt()
  displayOrder?: number;
}
