/**
 * Featured Gallery Hook
 * 
 * Custom hook for fetching featured gallery images from the API.
 * Specifically designed for GalleryTeaser component to display
 * images with the featured flag enabled.
 * 
 * @module hooks/useFeaturedGallery
 */

import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import type { GalleryImage } from '@/types/gallery'

/**
 * API base URL - consistent with other services (VITE_API_BASE_URL)
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

/**
 * Transform backend gallery item to frontend GalleryImage format
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
  }
}

/**
 * Hook options interface
 */
export interface UseFeaturedGalleryOptions {
  /** Maximum number of featured images to fetch */
  limit?: number
  /** Enable automatic loading on mount */
  autoLoad?: boolean
}

/**
 * Hook return interface
 */
export interface UseFeaturedGalleryReturn {
  /** Featured images */
  images: GalleryImage[]
  /** Loading state */
  isLoading: boolean
  /** Error state */
  error: Error | null
  /** Refresh featured images */
  refresh: () => void
}

/**
 * useFeaturedGallery Hook
 * 
 * Fetches featured gallery images from the /api/gallery/featured endpoint.
 * Results are cached server-side for 5 minutes for optimal performance.
 * 
 * @param options - Hook options
 * @returns Featured gallery state and controls
 * 
 * @example
 * ```tsx
 * const { images, isLoading, error } = useFeaturedGallery({ limit: 6 })
 * 
 * if (isLoading) return <Spinner />
 * if (error) return <ErrorMessage error={error} />
 * 
 * return <GalleryGrid images={images} />
 * ```
 */
export function useFeaturedGallery(options: UseFeaturedGalleryOptions = {}): UseFeaturedGalleryReturn {
  const { limit = 6, autoLoad = true } = options

  const [images, setImages] = useState<GalleryImage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  /**
   * Fetch featured images from API
   */
  const fetchFeaturedImages = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await axios.get(`${API_BASE_URL}/api/gallery/featured`)
      
      // Backend returns: { success: true, data: { items: [...] } }
      const backendItems = response.data.data.items
      
      // Transform and limit items
      const transformedItems = backendItems
        .map(transformGalleryItem)
        .slice(0, limit)
      
      setImages(transformedItems)
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.error || err.message
        : 'Failed to fetch featured images'
      
      setError(new Error(errorMessage))
      console.error('[useFeaturedGallery] Error fetching featured images:', err)
    } finally {
      setIsLoading(false)
    }
  }, [limit])

  /**
   * Refresh featured images
   */
  const refresh = useCallback(() => {
    fetchFeaturedImages()
  }, [fetchFeaturedImages])

  /**
   * Auto-load on mount if enabled
   */
  useEffect(() => {
    if (autoLoad) {
      fetchFeaturedImages()
    }
  }, [autoLoad, fetchFeaturedImages])

  return {
    images,
    isLoading,
    error,
    refresh,
  }
}
