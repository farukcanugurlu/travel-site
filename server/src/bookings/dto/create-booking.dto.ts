// server/src/bookings/dto/create-booking.dto.ts
import { IsString, IsInt, Min, IsOptional, IsDateString, Length } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @Length(1, 100)
  userId: string;

  @IsString()
  @Length(1, 100)
  tourId: string;

  @IsString()
  @Length(1, 100)
  packageId: string;

  @IsInt()
  @Min(1)
  adultCount: number;

  @IsInt()
  @Min(0)
  childCount: number;

  @IsInt()
  @Min(0)
  infantCount: number;

  @IsDateString()
  tourDate: string;

  @IsOptional()
  @IsString()
  specialRequests?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsString()
  contactEmail?: string;
}
