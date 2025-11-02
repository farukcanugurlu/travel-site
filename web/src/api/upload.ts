// src/api/upload.ts
import apiService from './api';

export interface UploadResponse {
  success: boolean;
  imageUrl: string;
  key: string;
}

export interface MultipleUploadResponse {
  success: boolean;
  images: {
    imageUrl: string;
    key: string;
  }[];
}

class UploadApiService {
  async uploadImage(file: File, folder?: string): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('image', file);
    if (folder) {
      formData.append('folder', folder);
    }

    return apiService.post<UploadResponse>('/upload/image', formData);
  }

  async uploadMultipleImages(files: File[], folder?: string): Promise<MultipleUploadResponse> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    if (folder) {
      formData.append('folder', folder);
    }

    return apiService.post<MultipleUploadResponse>('/upload/images', formData);
  }

  async deleteImage(key: string): Promise<void> {
    return apiService.delete<void>(`/upload/image/${encodeURIComponent(key)}`);
  }

  async getImageStats(): Promise<{ totalImages: number; totalSize: number }> {
    return apiService.get<{ totalImages: number; totalSize: number }>('/upload/stats');
  }
}

export const uploadApiService = new UploadApiService();
export default uploadApiService;
