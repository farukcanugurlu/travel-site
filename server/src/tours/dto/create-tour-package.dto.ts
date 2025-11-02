import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTourPackageDto {
  @ApiProperty({ example: 'Standard Package' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Standard tour package...' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 150.00 })
  @IsNumber()
  adultPrice: number;

  @ApiProperty({ example: 75.00 })
  @IsNumber()
  childPrice: number;

  @ApiProperty({ example: 0.00 })
  @IsNumber()
  infantPrice: number;

  @ApiProperty({ example: 'English' })
  @IsString()
  @IsNotEmpty()
  language: string;

  @ApiProperty({ example: 20 })
  @IsOptional()
  @IsNumber()
  capacity?: number;
}
