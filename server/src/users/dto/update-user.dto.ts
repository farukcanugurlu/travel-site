// server/src/users/dto/update-user.dto.ts
import { IsEmail, IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: 'User email address', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'User first name', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ description: 'User last name', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ description: 'User role', enum: ['ADMIN', 'EDITOR', 'USER'], required: false })
  @IsOptional()
  @IsEnum(['ADMIN', 'EDITOR', 'USER'])
  role?: 'ADMIN' | 'EDITOR' | 'USER';

  @ApiProperty({ description: 'User active status', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

