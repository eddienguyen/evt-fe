/**
 * Upload Helper Utilities
 * 
 * Utilities for handling file uploads with progress tracking.
 * Provides XMLHttpRequest-based upload for progress monitoring.
 * 
 * @module utils/uploadHelpers
 */

import type { GalleryUploadResponse } from '../types/gallery';

/**
 * Upload configuration
 */
interface UploadConfig {
  url: string;
  method?: 'POST' | 'PUT';
  headers?: Record<string, string>;
  onProgress?: (progress: number) => void;
  onComplete?: (response: GalleryUploadResponse) => void;
  onError?: (error: Error) => void;
}

/**
 * Upload file with progress tracking using XMLHttpRequest
 * 
 * @param formData - Form data containing file and metadata
 * @param config - Upload configuration
 * @returns Promise resolving to upload response
 */
export const uploadWithProgress = (
  formData: FormData,
  config: UploadConfig
): Promise<GalleryUploadResponse> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    // Track upload progress
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && config.onProgress) {
        const percentComplete = (e.loaded / e.total) * 100;
        config.onProgress(percentComplete);
      }
    });
    
    // Handle completion
    xhr.addEventListener('load', () => {
      try {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response: GalleryUploadResponse = JSON.parse(xhr.responseText);
          if (config.onComplete) {
            config.onComplete(response);
          }
          resolve(response);
        } else {
          const errorResponse = JSON.parse(xhr.responseText);
          const error = new Error(errorResponse.error || `Upload failed with status ${xhr.status}`);
          if (config.onError) {
            config.onError(error);
          }
          reject(error);
        }
      } catch (error) {
        const parseError = error instanceof Error ? error : new Error('Failed to parse server response');
        if (config.onError) {
          config.onError(parseError);
        }
        reject(parseError);
      }
    });
    
    // Handle errors
    xhr.addEventListener('error', () => {
      const error = new Error('Network error occurred during upload');
      if (config.onError) {
        config.onError(error);
      }
      reject(error);
    });
    
    // Handle timeout
    xhr.addEventListener('timeout', () => {
      const error = new Error('Upload request timed out');
      if (config.onError) {
        config.onError(error);
      }
      reject(error);
    });
    
    // Configure and send request
    xhr.open(config.method || 'POST', config.url);
    
    // Set custom headers
    if (config.headers) {
      for (const [key, value] of Object.entries(config.headers)) {
        xhr.setRequestHeader(key, value);
      }
    }
    
    // Set timeout (5 minutes for large files)
    xhr.timeout = 5 * 60 * 1000;
    
    xhr.send(formData);
  });
};

/**
 * Generate unique file ID for tracking
 * 
 * @param file - File object
 * @returns Unique file identifier
 */
export const generateFileId = (file: File): string => {
  return `upload_${Date.now()}_${Math.random().toString(36).substring(2, 9)}_${file.name}`;
};

/**
 * Create FormData for file upload
 * 
 * @param file - File to upload
 * @param metadata - Additional metadata to include
 * @returns FormData ready for upload
 */
export const createUploadFormData = (
  file: File,
  metadata?: Record<string, string | number | boolean>
): FormData => {
  const formData = new FormData();
  formData.append('file', file);
  
  if (metadata) {
    for (const [key, value] of Object.entries(metadata)) {
      formData.append(key, String(value));
    }
  }
  
  return formData;
};

/**
 * Batch upload configuration
 */
interface BatchUploadConfig {
  files: File[];
  url: string;
  concurrentLimit?: number;
  onFileProgress?: (fileId: string, progress: number) => void;
  onFileComplete?: (fileId: string, response: GalleryUploadResponse) => void;
  onFileError?: (fileId: string, error: Error) => void;
  onBatchComplete?: (results: Map<string, GalleryUploadResponse>) => void;
  metadata?: Record<string, string | number | boolean>;
}

/**
 * Upload multiple files with concurrency control
 * 
 * @param config - Batch upload configuration
 * @returns Promise resolving to map of file IDs to responses
 */
export const batchUpload = async (
  config: BatchUploadConfig
): Promise<Map<string, GalleryUploadResponse>> => {
  const {
    files,
    url,
    concurrentLimit = 3,
    onFileProgress,
    onFileComplete,
    onFileError,
    onBatchComplete,
    metadata,
  } = config;
  
  const results = new Map<string, GalleryUploadResponse>();
  const fileQueue = [...files];
  const activeUploads = new Set<Promise<void>>();
  
  /**
   * Process a single file upload
   */
  const processFile = async (file: File): Promise<void> => {
    const fileId = generateFileId(file);
    const formData = createUploadFormData(file, metadata);
    
    try {
      const response = await uploadWithProgress(formData, {
        url,
        onProgress: (progress) => {
          if (onFileProgress) {
            onFileProgress(fileId, progress);
          }
        },
      });
      
      results.set(fileId, response);
      
      if (onFileComplete) {
        onFileComplete(fileId, response);
      }
    } catch (error) {
      const uploadError = error instanceof Error ? error : new Error('Upload failed');
      
      if (onFileError) {
        onFileError(fileId, uploadError);
      }
      
      // Store error response
      results.set(fileId, {
        success: false,
        error: uploadError.message,
      });
    }
  };
  
  /**
   * Process queue with concurrency control
   */
  while (fileQueue.length > 0 || activeUploads.size > 0) {
    // Start new uploads up to concurrent limit
    while (fileQueue.length > 0 && activeUploads.size < concurrentLimit) {
      const file = fileQueue.shift();
      if (file) {
        const uploadPromise = processFile(file).finally(() => {
          activeUploads.delete(uploadPromise);
        });
        activeUploads.add(uploadPromise);
      }
    }
    
    // Wait for at least one upload to complete
    if (activeUploads.size > 0) {
      await Promise.race(activeUploads);
    }
  }
  
  if (onBatchComplete) {
    onBatchComplete(results);
  }
  
  return results;
};

/**
 * Calculate total upload progress for batch
 * 
 * @param progressMap - Map of file IDs to progress percentages
 * @returns Overall progress percentage
 */
export const calculateBatchProgress = (progressMap: Record<string, number>): number => {
  const values = Object.values(progressMap);
  if (values.length === 0) return 0;
  
  const total = values.reduce((sum, progress) => sum + progress, 0);
  return total / values.length;
};

/**
 * Format upload speed
 * 
 * @param bytesPerSecond - Upload speed in bytes per second
 * @returns Formatted speed string
 */
export const formatUploadSpeed = (bytesPerSecond: number): string => {
  if (bytesPerSecond < 1024) {
    return `${bytesPerSecond.toFixed(0)} B/s`;
  }
  if (bytesPerSecond < 1024 * 1024) {
    return `${(bytesPerSecond / 1024).toFixed(1)} KB/s`;
  }
  return `${(bytesPerSecond / (1024 * 1024)).toFixed(1)} MB/s`;
};

/**
 * Estimate time remaining for upload
 * 
 * @param bytesUploaded - Bytes already uploaded
 * @param totalBytes - Total bytes to upload
 * @param bytesPerSecond - Current upload speed
 * @returns Formatted time remaining string
 */
export const estimateTimeRemaining = (
  bytesUploaded: number,
  totalBytes: number,
  bytesPerSecond: number
): string => {
  if (bytesPerSecond === 0) return 'Calculating...';
  
  const bytesRemaining = totalBytes - bytesUploaded;
  const secondsRemaining = bytesRemaining / bytesPerSecond;
  
  if (secondsRemaining < 60) {
    return `${Math.ceil(secondsRemaining)}s remaining`;
  }
  if (secondsRemaining < 3600) {
    return `${Math.ceil(secondsRemaining / 60)}m remaining`;
  }
  return `${Math.ceil(secondsRemaining / 3600)}h remaining`;
};
