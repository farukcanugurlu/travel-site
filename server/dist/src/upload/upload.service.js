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
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const r2_service_1 = require("../storage/r2.service");
const fs = require("fs");
const path = require("path");
let UploadService = class UploadService {
    constructor(r2Service) {
        this.r2Service = r2Service;
    }
    async uploadImage(file, folder = 'images') {
        try {
            this.validateImageFile(file);
            const uploadsDir = path.join(process.cwd(), 'uploads', folder);
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
            }
            const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${path.extname(file.originalname)}`;
            const filePath = path.join(uploadsDir, fileName);
            fs.writeFileSync(filePath, file.buffer);
            const imageUrl = `${process.env.BACKEND_URL || 'http://localhost:3000'}/uploads/${folder}/${fileName}`;
            const key = `${folder}/${fileName}`;
            return {
                imageUrl,
                key,
            };
        }
        catch (error) {
            console.error('Upload error:', error);
            throw new Error('Failed to upload image');
        }
    }
    async uploadMultipleImages(files, folder = 'images') {
        try {
            files.forEach(file => this.validateImageFile(file));
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
        }
        catch (error) {
            console.error('Multiple upload error:', error);
            throw new Error('Failed to upload images');
        }
    }
    async deleteImage(key) {
        try {
            const filePath = path.join(process.cwd(), 'uploads', key);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        catch (error) {
            console.error('Delete error:', error);
            throw new Error('Failed to delete image');
        }
    }
    async getImageStats() {
        return {
            totalImages: 0,
            totalSize: 0,
        };
    }
    validateImageFile(file) {
        const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
        }
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new Error('File size too large. Maximum size is 5MB.');
        }
        if (!file.buffer || file.buffer.length === 0) {
            throw new Error('File is empty or corrupted.');
        }
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [r2_service_1.R2Service])
], UploadService);
//# sourceMappingURL=upload.service.js.map