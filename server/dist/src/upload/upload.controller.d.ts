import { UploadService } from './upload.service';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadImage(file: Express.Multer.File, folder?: string): Promise<{
        success: boolean;
        imageUrl: string;
        key: string;
    }>;
    uploadMultipleImages(files: Express.Multer.File[], folder?: string): Promise<{
        success: boolean;
        images: {
            imageUrl: string;
            key: string;
        }[];
    }>;
    deleteImage(key: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getImageStats(): Promise<{
        totalImages: number;
        totalSize: number;
    }>;
}
