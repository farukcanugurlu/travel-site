import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogCategoryDto {
  @ApiProperty({ example: 'Travel Tips' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'travel-tips' })
  @IsString()
  slug: string;

  @ApiProperty({ example: 'Tips and advice for travelers' })
  @IsOptional()
  @IsString()
  description?: string;
}
