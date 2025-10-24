/**
 * Gallery API Service
 * 
 * API client for gallery media management.
 * Handles all gallery-related API calls with proper error handling.
 * Uses axios for better mobile device compatibility.
 * 
 * @module services/galleryApi
 */

import axios, { type AxiosError } from 'axios';
import type {
  GalleryMediaItem,
  GalleryQueryParams,
  GalleryListResponse,
  GalleryUploadResponse,
  MediaMetadata,
  BulkOperationResult,
} from '../types/gallery';

/**
 * API base URL - will be configured based on environment
 * Uses VITE_API_BASE_URL (without /api suffix) for consistency with other services
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

/**
 * Create axios instance with default config
 */
const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`, // Append /api to match backend routes
  withCredentials: true, // Include cookies for auth
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Gallery API endpoints
 */
const ENDPOINTS = {
  list: '/admin/gallery',
  upload: '/admin/gallery',
  detail: (id: string) => `/admin/gallery/${id}`,
  update: (id: string) => `/admin/gallery/${id}`,
  delete: (id: string) => `/admin/gallery/${id}`,
  bulkDelete: '/admin/gallery/bulk/delete',
  reorder: '/admin/gallery/reorder',
} as const;

/**
 * Handle API errors
 */
const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ error?: string; message?: string }>;
    const errorMessage = axiosError.response?.data?.error 
      || axiosError.response?.data?.message 
      || axiosError.message 
      || 'An error occurred';
    throw new Error(errorMessage);
  }
  throw error;
};

/**
 * Gallery API Service
 */
export const galleryApi = {
  /**
   * Get list of gallery media with filtering and pagination
   * 
   * @param params - Query parameters for filtering
   * @returns Promise resolving to gallery list response
   */
  getMedia: async (params?: GalleryQueryParams): Promise<GalleryListResponse> => {
    try {
      // Transform page-based pagination to offset-based for admin API
      const page = params?.page || 1;
      const limit = params?.limit || 20;
      const offset = (page - 1) * limit;
      
      // Build query params for admin API (uses offset instead of page)
      const queryParams = {
        ...params,
        limit,
        offset,
      };
      delete queryParams.page; // Remove page param, admin API doesn't use it
      
      const response = await axiosInstance.get(ENDPOINTS.list, { params: queryParams });
      
      // Admin endpoint returns: { success: true, data: { items, total, limit, offset } }
      // Transform to: { success, items, pagination: { total, totalPages, page, limit } }
      const data = response.data.data;
      const totalPages = Math.ceil(data.total / limit);
      
      return {
        success: response.data.success,
        items: data.items,
        pagination: {
          total: data.total,
          page: page,
          limit: limit,
          totalPages: totalPages,
        },
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Get single media item by ID
   * 
   * @param id - Media item ID
   * @returns Promise resolving to media item
   */
  getMediaById: async (id: string): Promise<GalleryMediaItem> => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.detail(id));
      return response.data.data.mediaItem;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Upload media file (Note: Progress tracking should use uploadWithProgress from uploadHelpers)
   * This method is for simple uploads without progress tracking.
   * 
   * @param formData - Form data containing file and metadata
   * @returns Promise resolving to upload response
   */
  uploadMedia: async (formData: FormData): Promise<GalleryUploadResponse> => {
    try {
      const response = await axiosInstance.post(ENDPOINTS.upload, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Update media metadata
   * 
   * @param id - Media item ID
   * @param metadata - Updated metadata
   * @returns Promise resolving to updated media item
   */
  updateMedia: async (id: string, metadata: Partial<MediaMetadata>): Promise<GalleryMediaItem> => {
    try {
      console.log('🔄 updateMedia called for ID:', id);
      console.log('📦 Metadata:', metadata);
      console.log('📤 Sending PATCH to:', ENDPOINTS.update(id));
      
      const response = await axiosInstance.patch(ENDPOINTS.update(id), metadata);
      
      console.log('✅ Response received:', response.data);
      return response.data.data.mediaItem;
    } catch (error) {
      console.error('❌ updateMedia error:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
      }
      return handleApiError(error);
    }
  },

  /**
   * Delete single media item
   * 
   * @param id - Media item ID
   * @returns Promise resolving to success response
   */
  deleteMedia: async (id: string): Promise<{ success: boolean }> => {
    try {
      const response = await axiosInstance.delete(ENDPOINTS.delete(id));
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Delete multiple media items
   * 
   * @param ids - Array of media item IDs
   * @returns Promise resolving to bulk operation result
   */
  bulkDelete: async (ids: string[]): Promise<BulkOperationResult> => {
    try {
      const response = await axiosInstance.post(ENDPOINTS.bulkDelete, { ids });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Reorder media items in bulk
   * 
   * @param items - Array of items with id and displayOrder
   * @returns Promise resolving to reorder result
   */
  reorderMedia: async (items: Array<{ id: string; displayOrder: number }>): Promise<{
    success: boolean;
    message: string;
    data: { updated: number };
  }> => {
    try {
      console.log('🔄 reorderMedia called with items:', items);
      console.log('📤 Sending request to:', ENDPOINTS.reorder);
      console.log('📦 Request body:', { items });
      
      const response = await axiosInstance.put(ENDPOINTS.reorder, { items });
      
      console.log('✅ Response received:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ reorderMedia error:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
      }
      return handleApiError(error);
    }
  },
};

/**
 * Mock gallery API for development (until backend is ready)
 * 
 * This will be removed once backend APIs are implemented.
 */
export const mockGalleryApi = {
  /**
   * Mock get media list
   */
  getMedia: async (params?: GalleryQueryParams): Promise<GalleryListResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      items: [],
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || 20,
        total: 0,
        totalPages: 0,
      },
    };
  },

  /**
   * Mock upload media
   */
  uploadMedia: async (_formData: FormData): Promise<GalleryUploadResponse> => {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      success: true,
      mediaItem: {
        id: `mock_${Date.now()}`,
        filename: 'mock-upload.jpg',
        alt: 'Mock upload',
        mediaType: 'image',
        category: 'other',
        r2ObjectKey: 'mock-key',
        r2Urls: {
          thumbnail: '/placeholder-thumbnail.jpg',
          medium: '/placeholder-medium.jpg',
          large: '/placeholder-large.jpg',
          original: '/placeholder-original.jpg',
        },
        featured: false,
        displayOrder: 0,
        metadata: {
          width: 1920,
          height: 1080,
          fileSize: 1024000,
          format: 'jpeg',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };
  },

  /**
   * Mock delete media
   */
  deleteMedia: async (_id: string): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },

  /**
   * Mock update media
   */
  updateMedia: async (id: string, metadata: Partial<MediaMetadata>): Promise<GalleryMediaItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      id,
      filename: 'mock-updated.jpg',
      alt: metadata.alt || 'Mock upload',
      title: metadata.title,
      caption: metadata.caption,
      mediaType: 'image',
      category: metadata.category || 'other',
      r2ObjectKey: 'mock-key',
      r2Urls: {
        thumbnail: '/placeholder-thumbnail.jpg',
        medium: '/placeholder-medium.jpg',
        large: '/placeholder-large.jpg',
        original: '/placeholder-original.jpg',
      },
      featured: metadata.featured || false,
      displayOrder: metadata.displayOrder || 0,
      metadata: {
        width: 1920,
        height: 1080,
        fileSize: 1024000,
        format: 'jpeg',
      },
      location: metadata.location,
      photographer: metadata.photographer,
      dateTaken: metadata.dateTaken,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  },
};

/**
 * Export appropriate API based on environment
 * Use real API in both development and production
 * Set VITE_USE_MOCK_API=true to use mock data
 */
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';
export const api = USE_MOCK_API ? mockGalleryApi : galleryApi;
