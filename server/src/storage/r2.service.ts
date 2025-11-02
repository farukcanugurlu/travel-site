// server/src/storage/r2.service.ts
import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as sharp from 'sharp';

@Injectable()
export class R2Service {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    this.bucketName = process.env.R2_BUCKET_NAME || 'lexor-travel-images';
    
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
      },
    });
  }

  async uploadImage(file: Express.Multer.File, folder: string = 'images'): Promise<{ url: string; key: string }> {
    try {
      // Generate unique filename
      const fileExtension = this.getFileExtension(file.originalname);
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${fileExtension}`;
      const key = `${folder}/${fileName}`;

      // Process image with Sharp (resize, optimize)
      const processedImage = await this.processImage(file.buffer);

      // Upload to R2
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: processedImage,
        ContentType: file.mimetype,
        ACL: 'public-read',
      });

      await this.s3Client.send(command);

      // Return public URL
      const url = `${process.env.R2_PUBLIC_URL}/${key}`;
      
      return { url, key };
    } catch (error) {
      console.error('R2 upload error:', error);
      throw new Error('Failed to upload image to R2');
    }
  }

  async deleteImage(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
    } catch (error) {
      console.error('R2 delete error:', error);
      throw new Error('Failed to delete image from R2');
    }
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      return await getSignedUrl(this.s3Client, command, { expiresIn });
    } catch (error) {
      console.error('R2 signed URL error:', error);
      throw new Error('Failed to generate signed URL');
    }
  }

  private async processImage(buffer: Buffer): Promise<Buffer> {
    try {
      // Resize and optimize image
      return await sharp(buffer)
        .resize(1200, 800, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .jpeg({ quality: 85 })
        .toBuffer();
    } catch (error) {
      console.error('Image processing error:', error);
      // Return original buffer if processing fails
      return buffer;
    }
  }

  private getFileExtension(filename: string): string {
    return filename.substring(filename.lastIndexOf('.'));
  }

  async uploadMultipleImages(files: Express.Multer.File[], folder: string = 'images'): Promise<{ url: string; key: string }[]> {
    const uploadPromises = files.map(file => this.uploadImage(file, folder));
    return Promise.all(uploadPromises);
  }
}
