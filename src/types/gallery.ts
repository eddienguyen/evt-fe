/**
 * Gallery Type Definitions
 * 
 * Type definitions for gallery images, metadata, and state management.
 * 
 * @module types/gallery
 */

/**
 * Image size variant interface
 */
export interface ImageSize {
  url: string
  width: number
  height: number
  format: string
}

/**
 * Image metadata interface
 */
export interface ImageMetadata {
  width: number
  height: number
  format: string
  size?: number
  capturedDate?: string
  dateTaken?: Date
  location?: string
  photographer?: string
}

/**
 * Gallery image interface
 */
export interface GalleryImage {
  id: string
  filename: string
  alt: string
  caption?: string
  date: string
  category: string
  sizes: {
    thumbnail: ImageSize
    medium: ImageSize
    large: ImageSize
    original: ImageSize
  }
  metadata: ImageMetadata
  blurhash?: string
}

/**
 * Pagination interface
 */
export interface GalleryPagination {
  page: number
  limit: number
  total: number
  hasNext: boolean
}

/**
 * Gallery API response interface
 */
export interface GalleryAPIResponse {
  images: GalleryImage[]
  pagination: GalleryPagination
}

/**
 * Gallery state interface
 */
export interface GalleryState {
  // Data States
  images: GalleryImage[]
  isLoading: boolean
  error: string | null
  hasMore: boolean
  currentPage: number
  
  // UI States
  selectedImageIndex: number | null
  lightboxOpen: boolean
  viewMode: 'grid' | 'masonry'
  
  // Filter/Search States
  searchQuery: string
  selectedCategory: string | null
  sortBy: 'date' | 'name' | 'size'
}

/**
 * Lightbox state interface
 */
export interface LightboxState {
  isOpen: boolean
  currentIndex: number
  images: GalleryImage[]
}

/**
 * Image loading state
 */
export type ImageLoadState = 'idle' | 'loading' | 'loaded' | 'error'
