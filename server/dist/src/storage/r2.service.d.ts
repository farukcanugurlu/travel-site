export declare class R2Service {
    private s3Client;
    private bucketName;
    constructor();
    uploadImage(file: Express.Multer.File, folder?: string): Promise<{
        url: string;
        key: string;
    }>;
    deleteImage(key: string): Promise<void>;
    getSignedUrl(key: string, expiresIn?: number): Promise<string>;
    private processImage;
    private getFileExtension;
    uploadMultipleImages(files: Express.Multer.File[], folder?: string): Promise<{
        url: string;
        key: string;
    }[]>;
}
