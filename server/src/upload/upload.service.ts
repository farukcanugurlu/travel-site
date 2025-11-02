// server/src/upload/upload.service.ts
import { Injectable } from '@nestjs/common';
import { R2Service } from '../storage/r2.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  constructor(private r2Service: R2Service) {}

  async uploadImage(file: Express.Multer.File, folder: string = 'images'): Promise<{ imageUrl: string; key: string }> {
    try {
      // Validate file
      this.validateImageFile(file);

      // For now, save to local filesystem until R2 is configured
      const uploadsDir = path.join(process.cwd(), 'uploads', folder);
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${path.extname(file.originalname)}`;
      const filePath = path.join(uploadsDir, fileName);
      
      fs.writeFileSync(filePath, file.buffer);

      // Return public URL
      const imageUrl = `${process.env.BACKEND_URL || 'http://localhost:3000'}/uploads/${folder}/${fileName}`;
      const key = `${folder}/${fileName}`;

      return {
        imageUrl,
        key,
      };
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('Failed to upload image');
    }
  }

  async uploadMultipleImages(files: Express.Multer.File[], folder: string = 'images'): Promise<{ imageUrl: string; key: string }[]> {
    try {
      // Validate all files
      files.forEach(file => this.validateImageFile(file));

      // Upload to local filesystem
      const uploadsDir = path.join(process.cwd(), 'uploads', folder);
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const uploadPromises = files.map(async (file) => {
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${path.extname(file.originalname)}`;
        const filePath = path.join(uploadsDir, fileName);
        fs.writeFileSync(filePath, file.buffer);

        const imageUrl = `${process.env.BACKEND_URL || 'http://localhost:3000'}/uploads/${folder}/${fileName}`;
        const key = `${folder}/${fileName}`;

        return { imageUrl, key };
      });

      return Promise.all(uploadPromises);
    } catch (error) {
      console.error('Multiple upload error:', error);
      throw new Error('Failed to upload images');
    }
  }

  async deleteImage(key: string): Promise<void> {
    try {
      // Delete from local filesystem
      const filePath = path.join(process.cwd(), 'uploads', key);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('Delete error:', error);
      throw new Error('Failed to delete image');
    }
  }

  async getImageStats(): Promise<{ totalImages: number; totalSize: number }> {
    // This would require listing objects from R2, which is more complex
    // For now, return mock data
    return {
      totalImages: 0,
      totalSize: 0,
    };
  }

  private validateImageFile(file: Express.Multer.File): void {
    // Check file type
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File size too large. Maximum size is 5MB.');
    }

    // Check if file has content
    if (!file.buffer || file.buffer.length === 0) {
      throw new Error('File is empty or corrupted.');
    }
  }
}
