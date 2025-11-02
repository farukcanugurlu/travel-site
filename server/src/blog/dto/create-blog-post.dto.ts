import { IsString, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogPostDto {
  @ApiProperty({ example: 'Best Places to Visit in Turkey' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'best-places-to-visit-in-turkey' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'Turkey is a beautiful country...' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 'Discover the most beautiful places...' })
  @IsOptional()
  @IsString()
  excerpt?: string;

  @ApiProperty({ example: '/assets/img/blog/blog-1.jpg' })
  @IsOptional()
  @IsString()
  featuredImage?: string;

  @ApiProperty({ example: 'Admin' })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiProperty({ example: ['Travel', 'Tips', 'Turkey'] })
  @IsOptional()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @ApiProperty({ example: 'cat-1' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;
}
