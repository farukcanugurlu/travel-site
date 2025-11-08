// src/components/common/ImageUpload.tsx
import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import uploadApiService from '../../api/upload';

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string, key?: string) => void;
  currentImage?: string;
  label?: string;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
  folder?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUploaded,
  currentImage,
  label = 'Upload Image',
  accept = 'image/*',
  maxSize = 5,
  className = '',
  folder = 'images',
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview when currentImage prop changes
  useEffect(() => {
    if (currentImage) {
      setPreview(currentImage);
    }
  }, [currentImage]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const result = await uploadApiService.uploadImage(file, folder);
      console.log('Upload result:', result);
      
      // Update preview with the uploaded image URL
      setPreview(result.imageUrl);
      
      // Call the callback with the uploaded URL
      onImageUploaded(result.imageUrl, result.key);
      toast.success('Image uploaded successfully!');
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error?.message || 'Failed to upload image';
      toast.error(errorMessage);
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect({ target: { files: [file] } } as any);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const removeImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageUploaded('');
  };

  return (
    <div className={`image-upload ${className}`}>
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
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {preview ? (
          <div className="image-preview">
            <img src={preview} alt="Preview" />
            <div className="preview-overlay">
              <button
                type="button"
                className="remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage();
                }}
              >
                ✕
              </button>
            </div>
          </div>
        ) : (
          <div className="upload-placeholder">
            {uploading ? (
              <div className="uploading-content">
                <div className="spinner"></div>
                <p>Uploading...</p>
              </div>
            ) : (
              <div className="upload-content">
                <div className="upload-icon">📷</div>
                <p>Click to upload or drag and drop</p>
                <p className="upload-hint">PNG, JPG, WEBP up to {maxSize}MB</p>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .image-upload {
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
          min-height: 200px;
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

        .image-preview {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 6px;
        }

        .preview-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s ease;
          border-radius: 6px;
        }

        .image-preview:hover .preview-overlay {
          opacity: 1;
        }

        .remove-btn {
          background: #e74c3c;
          color: white;
          border: none;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease;
        }

        .remove-btn:hover {
          background: #c0392b;
        }

        .upload-placeholder {
          width: 100%;
          height: 100%;
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
      `}</style>
    </div>
  );
};

export default ImageUpload;
