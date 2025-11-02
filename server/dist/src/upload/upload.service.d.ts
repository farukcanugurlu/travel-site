import { R2Service } from '../storage/r2.service';
export declare class UploadService {
    private r2Service;
    constructor(r2Service: R2Service);
    uploadImage(file: Express.Multer.File, folder?: string): Promise<{
        imageUrl: string;
        key: string;
    }>;
    uploadMultipleImages(files: Express.Multer.File[], folder?: string): Promise<{
        imageUrl: string;
        key: string;
    }[]>;
    deleteImage(key: string): Promise<void>;
    getImageStats(): Promise<{
        totalImages: number;
        totalSize: number;
    }>;
    private validateImageFile;
}
