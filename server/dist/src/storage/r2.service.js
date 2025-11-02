"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.R2Service = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const sharp = require("sharp");
let R2Service = class R2Service {
    constructor() {
        this.bucketName = process.env.R2_BUCKET_NAME || 'lexor-travel-images';
        this.s3Client = new client_s3_1.S3Client({
            region: 'auto',
            endpoint: process.env.R2_ENDPOINT,
            credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
            },
        });
    }
    async uploadImage(file, folder = 'images') {
        try {
            const fileExtension = this.getFileExtension(file.originalname);
            const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${fileExtension}`;
            const key = `${folder}/${fileName}`;
            const processedImage = await this.processImage(file.buffer);
            const command = new client_s3_1.PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: processedImage,
                ContentType: file.mimetype,
                ACL: 'public-read',
            });
            await this.s3Client.send(command);
            const url = `${process.env.R2_PUBLIC_URL}/${key}`;
            return { url, key };
        }
        catch (error) {
            console.error('R2 upload error:', error);
            throw new Error('Failed to upload image to R2');
        }
    }
    async deleteImage(key) {
        try {
            const command = new client_s3_1.DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });
            await this.s3Client.send(command);
        }
        catch (error) {
            console.error('R2 delete error:', error);
            throw new Error('Failed to delete image from R2');
        }
    }
    async getSignedUrl(key, expiresIn = 3600) {
        try {
            const command = new client_s3_1.GetObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });
            return await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, { expiresIn });
        }
        catch (error) {
            console.error('R2 signed URL error:', error);
            throw new Error('Failed to generate signed URL');
        }
    }
    async processImage(buffer) {
        try {
            return await sharp(buffer)
                .resize(1200, 800, {
                fit: 'inside',
                withoutEnlargement: true
            })
                .jpeg({ quality: 85 })
                .toBuffer();
        }
        catch (error) {
            console.error('Image processing error:', error);
            return buffer;
        }
    }
    getFileExtension(filename) {
        return filename.substring(filename.lastIndexOf('.'));
    }
    async uploadMultipleImages(files, folder = 'images') {
        const uploadPromises = files.map(file => this.uploadImage(file, folder));
        return Promise.all(uploadPromises);
    }
};
exports.R2Service = R2Service;
exports.R2Service = R2Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], R2Service);
//# sourceMappingURL=r2.service.js.map