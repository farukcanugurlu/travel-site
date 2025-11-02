// server/src/favorites/favorites.controller.ts
import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createFavoriteDto: CreateFavoriteDto) {
    return this.favoritesService.create(createFavoriteDto);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  findByUser(@Param('userId') userId: string) {
    return this.favoritesService.findByUser(userId);
  }

  @Get(':userId/:tourId')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('userId') userId: string, @Param('tourId') tourId: string) {
    return this.favoritesService.findOne(userId, tourId);
  }

  @Delete(':userId/:tourId')
  @UseGuards(JwtAuthGuard)
  remove(@Param('userId') userId: string, @Param('tourId') tourId: string) {
    return this.favoritesService.remove(userId, tourId);
  }

  @Get('count/:userId')
  @UseGuards(JwtAuthGuard)
  getUserFavoriteCount(@Param('userId') userId: string) {
    return this.favoritesService.getUserFavoriteCount(userId);
  }
}
