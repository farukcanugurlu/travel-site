// server/src/upload/upload.controller.ts
import { Controller, Post, Delete, Get, Param, UseInterceptors, UploadedFile, UploadedFiles, UseGuards, Body } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder?: string
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    const result = await this.uploadService.uploadImage(file, folder);
    return {
      success: true,
      imageUrl: result.imageUrl,
      key: result.key,
    };
  }

  @Post('images')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(FilesInterceptor('images', 10)) // Max 10 files
  async uploadMultipleImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('folder') folder?: string
  ) {
    if (!files || files.length === 0) {
      throw new Error('No files uploaded');
    }

    const results = await this.uploadService.uploadMultipleImages(files, folder);
    return {
      success: true,
      images: results,
    };
  }

  @Delete('image/:key')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async deleteImage(@Param('key') key: string) {
    await this.uploadService.deleteImage(decodeURIComponent(key));
    return { 
      success: true,
      message: 'Image deleted successfully' 
    };
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getImageStats() {
    return this.uploadService.getImageStats();
  }
}
