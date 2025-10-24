/**
 * Media Upload Zone Component
 * 
 * Drag-and-drop file upload interface with metadata form.
 * Supports multiple file uploads with progress tracking.
 * 
 * @module pages/admin/gallery/_components/MediaUploadZone
 */

import React, { useState, useCallback, useRef } from 'react';
import { X, Upload, Image, Video, FileText, AlertCircle } from 'lucide-react';
import { validateFile } from '../../../../utils/fileValidation';
import { generateFileId } from '../../../../utils/uploadHelpers';
import type { MediaCategory, UploadProgressItem } from '../../../../types/gallery';

/**
 * Upload zone props interface
 */
interface MediaUploadZoneProps {
  onClose: () => void;
  onUpload: (files: File[], metadata: UploadMetadata) => Promise<void>;
  uploadProgress: Record<string, UploadProgressItem>;
  uploadErrors: Record<string, string>;
  isUploading: boolean;
}

/**
 * Upload metadata interface
 */
interface UploadMetadata {
  category: MediaCategory;
  location?: string;
  photographer?: string;
  dateTaken?: Date;
}

/**
 * File preview item
 */
interface FilePreview {
  id: string;
  file: File;
  preview?: string;
  valid: boolean;
  error?: string;
}

/**
 * MediaUploadZone Component
 * 
 * Provides drag-and-drop file upload with metadata form and progress tracking.
 */
export const MediaUploadZone: React.FC<MediaUploadZoneProps> = ({
  onClose,
  onUpload,
  uploadProgress,
  uploadErrors,
  isUploading,
}) => {
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [metadata, setMetadata] = useState<UploadMetadata>({
    category: 'ceremony',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handle file selection
   */
  const handleFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;

    const newFiles: FilePreview[] = [];
    
    Array.from(fileList).forEach((file) => {
      const validation = validateFile(file);
      const fileId = generateFileId(file);
      
      // Create preview for images
      let preview: string | undefined;
      if (file.type.startsWith('image/')) {
        preview = URL.createObjectURL(file);
      }

      newFiles.push({
        id: fileId,
        file,
        preview,
        valid: validation.valid,
        error: validation.error,
      });
    });

    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  /**
   * Handle drag over
   */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  /**
   * Handle drag leave
   */
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  /**
   * Handle drop
   */
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFiles = e.dataTransfer.files;
      handleFiles(droppedFiles);
    },
    [handleFiles]
  );

  /**
   * Handle file input change
   */
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
    },
    [handleFiles]
  );

  /**
   * Remove file from list
   */
  const removeFile = useCallback((fileId: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.id !== fileId);
    });
  }, []);

  /**
   * Handle upload
   */
  const handleUpload = useCallback(async () => {
    const validFiles = files.filter((f) => f.valid).map((f) => f.file);
    if (validFiles.length === 0) return;

    await onUpload(validFiles, metadata);
    
    // Clear files after successful upload
    files.forEach((f) => {
      if (f.preview) URL.revokeObjectURL(f.preview);
    });
    setFiles([]);
  }, [files, metadata, onUpload]);

  /**
   * Get file icon
   */
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-6 h-6" />;
    if (file.type.startsWith('video/')) return <Video className="w-6 h-6" />;
    return <FileText className="w-6 h-6" />;
  };

  /**
   * Format file size
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const validFileCount = files.filter((f) => f.valid).length;
  const invalidFileCount = files.filter((f) => !f.valid).length;
  const hasFiles = files.length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Upload Media
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Upload photos and videos to your gallery
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            disabled={isUploading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
              ${
                isDragging
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
              }
            `}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {isDragging ? 'Drop files here' : 'Drag and drop files here'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              or click to browse
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Supported formats: JPEG, PNG, WebP, MP4, MOV • Max size: 10MB (images), 100MB (videos)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>

          {/* File List */}
          {hasFiles && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Selected Files ({files.length})
                </h3>
                {invalidFileCount > 0 && (
                  <span className="text-xs text-red-600 dark:text-red-400">
                    {invalidFileCount} invalid file{invalidFileCount !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {files.map((fileItem) => {
                  const progress = uploadProgress[fileItem.id];
                  const error = uploadErrors[fileItem.id];

                  return (
                    <div
                      key={fileItem.id}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg border
                        ${
                          fileItem.valid
                            ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50'
                            : 'border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20'
                        }
                      `}
                    >
                      {/* Preview/Icon */}
                      <div className="flex-shrink-0">
                        {fileItem.preview ? (
                          <img
                            src={fileItem.preview}
                            alt={fileItem.file.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-gray-500">
                            {getFileIcon(fileItem.file)}
                          </div>
                        )}
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {fileItem.file.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatFileSize(fileItem.file.size)}
                        </p>

                        {/* Error Message */}
                        {fileItem.error && (
                          <div className="flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3 h-3 text-red-600" />
                            <p className="text-xs text-red-600 dark:text-red-400">
                              {fileItem.error}
                            </p>
                          </div>
                        )}

                        {/* Upload Progress */}
                        {progress && (
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                              <div
                                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${progress.progress}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {progress.progress}% • {progress.status}
                            </p>
                          </div>
                        )}

                        {/* Upload Error */}
                        {error && (
                          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                            Upload failed: {error}
                          </p>
                        )}
                      </div>

                      {/* Remove Button */}
                      {!progress && (
                        <button
                          onClick={() => removeFile(fileItem.id)}
                          className="flex-shrink-0 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          disabled={isUploading}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Metadata Form */}
          {hasFiles && validFileCount > 0 && (
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Media Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={metadata.category}
                    onChange={(e) =>
                      setMetadata((prev) => ({ ...prev, category: e.target.value as MediaCategory }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isUploading}
                  >
                    <option value="ceremony">Ceremony</option>
                    <option value="reception">Reception</option>
                    <option value="venue">Venue</option>
                    <option value="portraits">Portraits</option>
                    <option value="details">Details</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={metadata.location || ''}
                    onChange={(e) =>
                      setMetadata((prev) => ({ ...prev, location: e.target.value }))
                    }
                    placeholder="e.g., Grand Ballroom, HCMC"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isUploading}
                  />
                </div>

                {/* Photographer */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Photographer
                  </label>
                  <input
                    type="text"
                    value={metadata.photographer || ''}
                    onChange={(e) =>
                      setMetadata((prev) => ({ ...prev, photographer: e.target.value }))
                    }
                    placeholder="e.g., John Doe Photography"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isUploading}
                  />
                </div>

                {/* Date Taken */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date Taken
                  </label>
                  <input
                    type="date"
                    value={
                      metadata.dateTaken
                        ? metadata.dateTaken.toISOString().split('T')[0]
                        : ''
                    }
                    onChange={(e) =>
                      setMetadata((prev) => ({
                        ...prev,
                        dateTaken: e.target.value ? new Date(e.target.value) : undefined,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isUploading}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {validFileCount > 0 && (
              <span>
                {validFileCount} file{validFileCount !== 1 ? 's' : ''} ready to upload
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={validFileCount === 0 || isUploading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
            >
              {isUploading ? 'Uploading...' : `Upload ${validFileCount > 0 ? `(${validFileCount})` : ''}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
