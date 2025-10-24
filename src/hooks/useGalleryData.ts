/**
 * Gallery Data Hook
 * 
 * Custom hook for fetching and managing gallery image data from the API.
 * 
 * @module hooks/useGalleryData
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import type { GalleryState } from '@/types/gallery'
import { publicGalleryApi, type PublicGalleryQueryParams } from '@/services/publicGalleryApi'

export interface UseGalleryDataOptions {
  /** Initial page to load */
  initialPage?: number
  /** Items per page */
  limit?: number
  /** Enable auto-loading */
  autoLoad?: boolean
  /** Sort field */
  sortBy?: 'createdAt' | 'displayOrder' | 'dateTaken' | 'updatedAt'
  /** Sort order */
  sortOrder?: 'asc' | 'desc'
}

export interface UseGalleryDataReturn extends Omit<GalleryState, 'lightboxOpen' | 'selectedImageIndex' | 'viewMode'> {
  /** Load more images */
  loadMore: () => void
  /** Refresh gallery */
  refresh: () => void
  /** Set category filter */
  setCategory: (category: string | null) => void
  /** Set search query */
  setSearchQuery: (query: string) => void
  /** Set sort order */
  setSortBy: (sortBy: 'date' | 'name' | 'size') => void
}

/**
 * useGalleryData Hook
 * 
 * Manages gallery data fetching, pagination, and filtering.
 * 
 * @param options - Gallery data options
 * @returns Gallery state and controls
 * 
 * @example
 * ```tsx
 * const gallery = useGalleryData({
 *   limit: 20,
 *   initialCategory: 'engagement'
 * })
 * 
 * <GalleryGrid images={gallery.images} loading={gallery.isLoading} />
 * {gallery.hasMore && (
 *   <button onClick={gallery.loadMore}>Load More</button>
 * )}
 * ```
 */
export function useGalleryData(options: UseGalleryDataOptions = {}): UseGalleryDataReturn {
  const {
    initialPage = 1,
    limit = 20,
    autoLoad = true,
    sortBy = 'displayOrder',
    sortOrder = 'asc',
  } = options

  // Track if initial load has been completed to prevent double loading
  const hasInitiallyLoaded = useRef(false)

  const [state, setState] = useState<Omit<GalleryState, 'lightboxOpen' | 'selectedImageIndex' | 'viewMode'>>({
    images: [],
    isLoading: false,
    error: null,
    hasMore: true,
    currentPage: initialPage,
    searchQuery: '',
    selectedCategory: null,
    sortBy: 'date',
  })

  const loadImages = useCallback(async (page: number, append: boolean = false) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const params: PublicGalleryQueryParams = {
        page,
        limit,
        sortBy,
        sortOrder,
      }

      const response = await publicGalleryApi.getGallery(params)

      setState(prev => ({
        ...prev,
        images: append ? [...prev.images, ...response.items] : response.items,
        hasMore: response.pagination.hasMore,
        currentPage: page,
        isLoading: false,
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load images',
        isLoading: false,
      }))
    }
  }, [limit, sortBy, sortOrder])

  const loadMore = useCallback(() => {
    if (state.hasMore && !state.isLoading) {
      loadImages(state.currentPage + 1, true)
    }
  }, [state.hasMore, state.isLoading, state.currentPage, loadImages])

  const refresh = useCallback(() => {
    loadImages(1, false)
  }, [loadImages])

  const setCategory = useCallback((category: string | null) => {
    setState(prev => ({ ...prev, selectedCategory: category }))
    // In real implementation, this would trigger a new fetch with the category filter
  }, [])

  const setSearchQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }))
    // In real implementation, this would trigger a new fetch with the search query
  }, [])

  const setSortBy = useCallback((sortBy: 'date' | 'name' | 'size') => {
    setState(prev => ({ ...prev, sortBy }))
    // In real implementation, this would trigger a new fetch with the sort order
  }, [])

  useEffect(() => {
    // Only load once on mount if autoLoad is true and we haven't loaded yet
    if (autoLoad && !hasInitiallyLoaded.current) {
      hasInitiallyLoaded.current = true
      loadImages(initialPage, false)
    }
  }, [autoLoad, initialPage, loadImages])

  return {
    ...state,
    loadMore,
    refresh,
    setCategory,
    setSearchQuery,
    setSortBy,
  }
}
