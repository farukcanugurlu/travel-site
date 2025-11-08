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

  @ApiProperty({ example: 5, description: 'Maximum age for child (e.g., 5 or 6)' })
  @IsOptional()
  @IsNumber()
  childMaxAge?: number;

  @ApiProperty({ example: 2, description: 'Maximum age for infant (e.g., 2 or 3)' })
  @IsOptional()
  @IsNumber()
  infantMaxAge?: number;

  @ApiProperty({ 
    example: { "1": { "adultPrice": 150, "childPrice": 75, "infantPrice": 0 }, "2": { "adultPrice": 160, "childPrice": 80, "infantPrice": 0 } },
    description: 'Monthly prices override base prices. Keys are month numbers (1-12)',
    required: false
  })
  @IsOptional()
  monthlyPrices?: Record<string, { adultPrice?: number; childPrice?: number; infantPrice?: number }>;
}
