// src/components/common/MultipleImageUpload.tsx
import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import uploadApiService from '../../api/upload';

interface MultipleImageUploadProps {
  onImagesChange: (imageUrls: string[]) => void;
  currentImages?: string[];
  label?: string;
  accept?: string;
  maxSize?: number; // in MB
  maxFiles?: number;
  className?: string;
  folder?: string;
}

const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  onImagesChange,
  currentImages = [],
  label = 'Upload Images',
  accept = 'image/*',
  maxSize = 5,
  maxFiles = 20,
  className = '',
  folder = 'images',
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [images, setImages] = useState<string[]>(currentImages || []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Check max files limit
    if (images.length + files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} images allowed. You can upload ${maxFiles - images.length} more.`);
      return;
    }

    // Validate and upload files
    const filesArray = Array.from(files);
    const validFiles: File[] = [];

    // Validate each file
    for (const file of filesArray) {
      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is ${maxSize}MB`);
        continue;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not a valid image file`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    // Upload files one by one
    setUploading(true);
    const newImageUrls: string[] = [];

    for (let i = 0; i < validFiles.length; i++) {
      setUploadingIndex(i);
      try {
        const result = await uploadApiService.uploadImage(validFiles[i], folder);
        newImageUrls.push(result.imageUrl);
      } catch (error: any) {
        console.error(`Upload error for ${validFiles[i].name}:`, error);
        toast.error(`Failed to upload ${validFiles[i].name}`);
      }
    }

    // Update images state
    const updatedImages = [...images, ...newImageUrls];
    setImages(updatedImages);
    onImagesChange(updatedImages);

    setUploading(false);
    setUploadingIndex(null);
    toast.success(`Successfully uploaded ${newImageUrls.length} image(s)`);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect({ target: { files } } as any);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onImagesChange(updatedImages);
    toast.success('Image removed');
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === images.length - 1) return;

    const updatedImages = [...images];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [updatedImages[index], updatedImages[newIndex]] = [updatedImages[newIndex], updatedImages[index]];
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  return (
    <div className={`multiple-image-upload ${className}`}>
      <label className="upload-label">{label}</label>
      
      <div
        className={`upload-area ${uploading ? 'uploading' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        <div className="upload-placeholder">
          {uploading ? (
            <div className="uploading-content">
              <div className="spinner"></div>
              <p>Uploading {uploadingIndex !== null ? `${uploadingIndex + 1} of ${images.length + 1}...` : '...'}</p>
            </div>
          ) : (
            <div className="upload-content">
              <div className="upload-icon">📷</div>
              <p>Click to upload or drag and drop</p>
              <p className="upload-hint">PNG, JPG, WEBP up to {maxSize}MB each</p>
              <p className="upload-hint">Maximum {maxFiles} images ({images.length}/{maxFiles} uploaded)</p>
            </div>
          )}
        </div>
      </div>

      {/* Image Gallery */}
      {images.length > 0 && (
        <div className="image-gallery">
          <h4 className="gallery-title">Gallery Images ({images.length})</h4>
          <div className="gallery-grid">
            {images.map((imageUrl, index) => (
              <div key={index} className="gallery-item">
                <div className="gallery-image-wrapper">
                  <img src={imageUrl} alt={`Gallery ${index + 1}`} />
                  <div className="gallery-overlay">
                    <button
                      type="button"
                      className="gallery-btn move-up"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveImage(index, 'up');
                      }}
                      disabled={index === 0}
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="gallery-btn remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                      title="Remove"
                    >
                      ✕
                    </button>
                    <button
                      type="button"
                      className="gallery-btn move-down"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveImage(index, 'down');
                      }}
                      disabled={index === images.length - 1}
                      title="Move down"
                    >
                      ↓
                    </button>
                  </div>
                  {index === 0 && (
                    <div className="thumbnail-badge">Thumbnail</div>
                  )}
                </div>
                <div className="gallery-index">{index + 1}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .multiple-image-upload {
          width: 100%;
        }

        .upload-label {
          display: block;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 10px;
          font-size: 14px;
        }

        .upload-area {
          border: 2px dashed #ddd;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          background: #f8f9fa;
          min-height: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .upload-area:hover {
          border-color: #3498db;
          background: #f0f8ff;
        }

        .upload-area.uploading {
          border-color: #f39c12;
          background: #fef9e7;
        }

        .upload-placeholder {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .upload-content {
          text-align: center;
        }

        .upload-icon {
          font-size: 48px;
          margin-bottom: 15px;
          color: #95a5a6;
        }

        .upload-content p {
          margin: 5px 0;
          color: #666;
          font-size: 14px;
        }

        .upload-hint {
          font-size: 12px !important;
          color: #999 !important;
        }

        .uploading-content {
          text-align: center;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 15px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .uploading-content p {
          color: #f39c12;
          font-weight: 500;
          margin: 0;
        }

        .image-gallery {
          margin-top: 20px;
        }

        .gallery-title {
          font-size: 16px;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 15px;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 15px;
        }

        .gallery-item {
          position: relative;
        }

        .gallery-image-wrapper {
          position: relative;
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;
          border: 2px solid #ddd;
          background: #f8f9fa;
        }

        .gallery-image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .gallery-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .gallery-image-wrapper:hover .gallery-overlay {
          opacity: 1;
        }

        .gallery-btn {
          background: rgba(255, 255, 255, 0.9);
          color: #2c3e50;
          border: none;
          border-radius: 4px;
          width: 32px;
          height: 32px;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          font-weight: bold;
        }

        .gallery-btn:hover:not(:disabled) {
          background: #fff;
          transform: scale(1.1);
        }

        .gallery-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .remove-btn {
          background: #e74c3c;
          color: white;
        }

        .remove-btn:hover:not(:disabled) {
          background: #c0392b;
        }

        .thumbnail-badge {
          position: absolute;
          top: 5px;
          left: 5px;
          background: #7f0af5;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
        }

        .gallery-index {
          text-align: center;
          margin-top: 5px;
          font-size: 12px;
          color: #666;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default MultipleImageUpload;

