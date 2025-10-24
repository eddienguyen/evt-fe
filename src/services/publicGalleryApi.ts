/**
 * Public Gallery API Service
 * 
 * API client for public gallery image retrieval.
 * No authentication required - fetches published gallery media.
 * 
 * @module services/publicGalleryApi
 */

import axios, { type AxiosError } from 'axios';
import type { GalleryImage, GalleryPagination } from '../types/gallery';

/**
 * API base URL - consistent with other services (VITE_API_BASE_URL)
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

/**
 * Create axios instance with default config
 */
const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`, // Append /api to match backend routes
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Public gallery API endpoints
 */
const ENDPOINTS = {
  list: '/public/gallery',
  detail: (id: string) => `/public/gallery/${id}`,
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
 * Query parameters for public gallery
 */
export interface PublicGalleryQueryParams {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'displayOrder' | 'dateTaken' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Public gallery response interface
 */
export interface PublicGalleryResponse {
  items: GalleryImage[];
  pagination: GalleryPagination;
}

/**
 * Transform backend gallery item to frontend GalleryImage format
 * 
 * @param item - Backend gallery item with r2Urls
 * @returns Transformed GalleryImage with sizes format
 */
const transformGalleryItem = (item: any): GalleryImage => {
  return {
    id: item.id,
    filename: item.filename,
    alt: item.alt || item.filename,
    caption: item.caption,
    date: item.dateTaken || item.createdAt,
    category: item.category,
    sizes: {
      thumbnail: {
        url: item.r2Urls.thumbnail,
        width: 400,
        height: Math.round((item.metadata?.height || 400) * (400 / (item.metadata?.width || 400))),
        format: 'webp',
      },
      medium: {
        url: item.r2Urls.medium,
        width: 800,
        height: Math.round((item.metadata?.height || 800) * (800 / (item.metadata?.width || 800))),
        format: 'webp',
      },
      large: {
        url: item.r2Urls.large,
        width: 1200,
        height: Math.round((item.metadata?.height || 1200) * (1200 / (item.metadata?.width || 1200))),
        format: 'webp',
      },
      original: {
        url: item.r2Urls.original,
        width: item.metadata?.width || 2000,
        height: item.metadata?.height || 2000,
        format: item.metadata?.format || 'jpeg',
      },
    },
    metadata: {
      width: item.metadata?.width || 0,
      height: item.metadata?.height || 0,
      format: item.metadata?.format || 'unknown',
      size: item.metadata?.fileSize || 0,
      dateTaken: item.dateTaken ? new Date(item.dateTaken) : undefined,
      location: item.location,
      photographer: item.photographer,
    },
    blurhash: item.metadata?.blurhash,
  };
};

/**
 * Public Gallery API Service
 */
export const publicGalleryApi = {
  /**
   * Get public gallery images with pagination
   * 
   * @param params - Query parameters for filtering and pagination
   * @returns Promise resolving to gallery response
   */
  getGallery: async (params?: PublicGalleryQueryParams): Promise<PublicGalleryResponse> => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.list, { params });
      // Backend returns: { success: true, data: { items: [...], pagination: {...} } }
      const backendData = response.data.data;
      
      // Transform backend items to match frontend GalleryImage format
      return {
        items: backendData.items.map(transformGalleryItem),
        pagination: backendData.pagination,
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Get single public gallery image by ID
   * 
   * @param id - Image ID
   * @returns Promise resolving to gallery image
   */
  getImage: async (id: string): Promise<GalleryImage> => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.detail(id));
      const backendItem = response.data.data.image;
      return transformGalleryItem(backendItem);
    } catch (error) {
      return handleApiError(error);
    }
  },
};
