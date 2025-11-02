// server/src/favorites/dto/create-favorite.dto.ts
import { IsString } from 'class-validator';

export class CreateFavoriteDto {
  @IsString()
  userId: string;

  @IsString()
  tourId: string;
}
