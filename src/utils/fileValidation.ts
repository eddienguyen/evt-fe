/**
 * File Validation Utilities
 * 
 * Utilities for validating file uploads in the gallery admin panel.
 * Handles file type, size, and format validation.
 * 
 * @module utils/fileValidation
 */

import type { FileValidationResult, MediaType } from '../types/gallery';

/**
 * File size limits in bytes
 */
export const FILE_SIZE_LIMITS = {
  image: 5 * 1024 * 1024, // 5MB
  video: 50 * 1024 * 1024, // 50MB
} as const;

/**
 * Allowed file types
 */
export const ALLOWED_FILE_TYPES = {
  image: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  video: ['video/mp4', 'video/quicktime', 'video/x-msvideo'], // mp4, mov, avi
} as const;

/**
 * File extensions mapping
 */
export const FILE_EXTENSIONS = {
  image: ['.jpg', '.jpeg', '.png', '.webp'],
  video: ['.mp4', '.mov', '.avi'],
} as const;

/**
 * Determine media type from file
 * 
 * @param file - File to check
 * @returns Media type or null if invalid
 */
export const getMediaType = (file: File): MediaType | null => {
  if ((ALLOWED_FILE_TYPES.image as readonly string[]).includes(file.type)) {
    return 'image';
  }
  if ((ALLOWED_FILE_TYPES.video as readonly string[]).includes(file.type)) {
    return 'video';
  }
  return null;
};

/**
 * Validate file type
 * 
 * @param file - File to validate
 * @returns True if file type is allowed
 */
export const validateFileType = (file: File): boolean => {
  const mediaType = getMediaType(file);
  return mediaType !== null;
};

/**
 * Validate file size
 * 
 * @param file - File to validate
 * @returns Validation result with error message if invalid
 */
export const validateFileSize = (file: File): FileValidationResult => {
  const mediaType = getMediaType(file);
  
  if (!mediaType) {
    return {
      valid: false,
      error: 'Unable to determine file type',
    };
  }
  
  const limit = FILE_SIZE_LIMITS[mediaType];
  const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
  const limitMB = (limit / (1024 * 1024)).toFixed(0);
  
  if (file.size > limit) {
    return {
      valid: false,
      error: `File size (${sizeMB}MB) exceeds limit of ${limitMB}MB for ${mediaType}s`,
    };
  }
  
  return { valid: true };
};

/**
 * Validate file name
 * 
 * @param filename - File name to validate
 * @returns Validation result with warnings for problematic names
 */
export const validateFileName = (filename: string): FileValidationResult => {
  const warnings: string[] = [];
  
  // Check for special characters that might cause issues
  if (/[<>:"/\\|?*]/.test(filename)) {
    warnings.push('File name contains special characters that may cause issues');
  }
  
  // Check for very long file names
  if (filename.length > 255) {
    return {
      valid: false,
      error: 'File name is too long (max 255 characters)',
    };
  }
  
  // Check for leading/trailing spaces
  if (filename !== filename.trim()) {
    warnings.push('File name has leading or trailing spaces');
  }
  
  return {
    valid: true,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
};

/**
 * Comprehensive file validation
 * 
 * @param file - File to validate
 * @returns Validation result with all checks
 */
export const validateFile = (file: File): FileValidationResult => {
  // Check file type
  if (!validateFileType(file)) {
    return {
      valid: false,
      error: `File type "${file.type}" is not supported. Allowed types: JPEG, PNG, WebP, MP4, MOV`,
    };
  }
  
  // Check file size
  const sizeValidation = validateFileSize(file);
  if (!sizeValidation.valid) {
    return sizeValidation;
  }
  
  // Check file name
  const nameValidation = validateFileName(file.name);
  if (!nameValidation.valid) {
    return nameValidation;
  }
  
  return {
    valid: true,
    warnings: nameValidation.warnings,
  };
};

/**
 * Validate multiple files
 * 
 * @param files - Array of files to validate
 * @returns Map of file names to validation results
 */
export const validateFiles = (files: File[]): Map<string, FileValidationResult> => {
  const results = new Map<string, FileValidationResult>();
  
  for (const file of files) {
    results.set(file.name, validateFile(file));
  }
  
  return results;
};

/**
 * Format file size for display
 * 
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Get file extension
 * 
 * @param filename - File name
 * @returns File extension with dot
 */
export const getFileExtension = (filename: string): string => {
  const lastDot = filename.lastIndexOf('.');
  return lastDot === -1 ? '' : filename.substring(lastDot);
};

/**
 * Generate safe filename
 * 
 * @param filename - Original filename
 * @returns Sanitized filename
 */
export const sanitizeFileName = (filename: string): string => {
  // Remove special characters and replace spaces with underscores
  const name = filename.replaceAll(/[<>:"/\\|?*]/g, '').replaceAll(/\s+/g, '_');
  
  // Trim to reasonable length while preserving extension
  const extension = getFileExtension(name);
  const nameWithoutExt = name.substring(0, name.length - extension.length);
  const maxNameLength = 200;
  
  if (nameWithoutExt.length > maxNameLength) {
    return nameWithoutExt.substring(0, maxNameLength) + extension;
  }
  
  return name;
};
