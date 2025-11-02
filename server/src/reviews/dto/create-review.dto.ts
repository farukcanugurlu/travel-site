// src/reviews/dto/create-review.dto.ts
import { IsString, IsNumber, Min, Max, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 'Amazing experience!' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 'The tour was fantastic. Great guide and beautiful locations.' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 'tour-id-123' })
  @IsString()
  @IsNotEmpty()
  tourId: string;

  @ApiProperty({ example: 'user-id-123' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
