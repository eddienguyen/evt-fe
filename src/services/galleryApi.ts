/**
 * Gallery API Service
 * 
 * API client for gallery media management.
 * Handles all gallery-related API calls with proper error handling.
 * 
 * @module services/galleryApi
 */

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
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Gallery API endpoints
 */
const ENDPOINTS = {
  list: `${API_BASE_URL}/gallery`,
  upload: `${API_BASE_URL}/gallery`,
  detail: (id: string) => `${API_BASE_URL}/gallery/${id}`,
  update: (id: string) => `${API_BASE_URL}/gallery/${id}`,
  delete: (id: string) => `${API_BASE_URL}/gallery/${id}`,
  bulkDelete: `${API_BASE_URL}/gallery/bulk/delete`,
} as const;

/**
 * Build URL query parameters from gallery query params
 * 
 * @param params - Gallery query parameters
 * @returns URLSearchParams object
 */
const buildQueryParams = (params?: GalleryQueryParams): URLSearchParams => {
  const queryParams = new URLSearchParams();
  
  if (!params) return queryParams;
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.category) queryParams.append('category', params.category);
  if (params.featured !== undefined) queryParams.append('featured', params.featured.toString());
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
  
  return queryParams;
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
    const queryParams = buildQueryParams(params);
    const queryString = queryParams.toString();
    const url = queryString ? `${ENDPOINTS.list}?${queryString}` : ENDPOINTS.list;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for auth
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to fetch media' }));
      throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  },

  /**
   * Get single media item by ID
   * 
   * @param id - Media item ID
   * @returns Promise resolving to media item
   */
  getMediaById: async (id: string): Promise<GalleryMediaItem> => {
    const response = await fetch(ENDPOINTS.detail(id), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to fetch media' }));
      throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.mediaItem;
  },

  /**
   * Upload media file (Note: Progress tracking should use uploadWithProgress from uploadHelpers)
   * This method is for simple uploads without progress tracking.
   * 
   * @param formData - Form data containing file and metadata
   * @returns Promise resolving to upload response
   */
  uploadMedia: async (formData: FormData): Promise<GalleryUploadResponse> => {
    const response = await fetch(ENDPOINTS.upload, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  },

  /**
   * Update media metadata
   * 
   * @param id - Media item ID
   * @param metadata - Updated metadata
   * @returns Promise resolving to updated media item
   */
  updateMedia: async (id: string, metadata: Partial<MediaMetadata>): Promise<GalleryMediaItem> => {
    const response = await fetch(ENDPOINTS.update(id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadata),
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Update failed' }));
      throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.mediaItem;
  },

  /**
   * Delete single media item
   * 
   * @param id - Media item ID
   * @returns Promise resolving to success response
   */
  deleteMedia: async (id: string): Promise<{ success: boolean }> => {
    const response = await fetch(ENDPOINTS.delete(id), {
      method: 'DELETE',
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Delete failed' }));
      throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  },

  /**
   * Delete multiple media items
   * 
   * @param ids - Array of media item IDs
   * @returns Promise resolving to bulk operation result
   */
  bulkDelete: async (ids: string[]): Promise<BulkOperationResult> => {
    const response = await fetch(ENDPOINTS.bulkDelete, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids }),
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Bulk delete failed' }));
      throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
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
    const response = await fetch(`${API_BASE_URL}/gallery/reorder`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Reorder failed' }));
      throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
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
        category: 'general',
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
      category: metadata.category || 'general',
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
