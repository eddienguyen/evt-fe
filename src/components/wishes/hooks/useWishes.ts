/**
 * useWishes Hook
 * 
 * Custom hook for managing wishes data fetching, loading states, error handling,
 * and cache management with integrated retry logic.
 * 
 * Features:
 * - Auto-loading with cache support
 * - Pagination with loadMore functionality
 * - Manual refresh bypassing cache
 * - Cache state tracking
 * - Retry functionality
 * - Vietnamese error messages
 * 
 * @module components/wishes/hooks/useWishes
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { getLatestWishes, clearCache } from '../../../services/wishesService'
import type { WishesState, WishesServiceOptions } from '../../../types/wishes'

export interface UseWishesOptions extends WishesServiceOptions {
  /** Auto-load wishes on mount */
  autoLoad?: boolean
  /** Enable automatic retry on error */
  enableRetry?: boolean
}

export interface UseWishesReturn extends WishesState {
  /** Manually fetch wishes */
  fetchWishes: (opts?: WishesServiceOptions) => Promise<void>
  /** Load more wishes (pagination) */
  loadMore: () => Promise<void>
  /** Refresh wishes bypassing cache */
  refresh: () => Promise<void>
  /** Retry after error */
  retry: () => Promise<void>
  /** Reset state */
  reset: () => void
  /** Clear cache */
  clearCache: (keyPrefix?: string) => void
}

/**
 * useWishes Hook
 * 
 * Manages wishes data fetching with loading states, error handling, retry logic,
 * caching, and pagination support.
 * 
 * @param options - Hook options
 * @returns Wishes state and control functions
 * 
 * @example
 * ```tsx
 * const { wishes, isLoading, error, retry, loadMore } = useWishes({
 *   limit: 10,
 *   autoLoad: true
 * })
 * 
 * if (isLoading) return <WishesLoading />
 * if (error) return <WishesError onRetry={retry} />
 * return <WishesGrid wishes={wishes} />
 * ```
 */
export function useWishes(options: UseWishesOptions = {}): UseWishesReturn {
  const {
    autoLoad = true,
    limit = 10,
    venue
  } = options

  // Track if initial load has been completed to prevent double loading
  const hasInitiallyLoaded = useRef(false)

  // Initial state matching enhanced WishesState interface
  const initialState: WishesState = {
    wishes: [],
    pagination: null,
    total: 0,
    isLoading: false,
    isRefetching: false,
    isLoadingMore: false,
    error: null,
    lastError: null,
    hasData: false,
    isRetrying: false,
    retryCount: 0,
    maxRetries: 3,
    isCached: false,
    cacheAge: 0,
    lastFetch: null,
  }

  // State management
  const [state, setState] = useState<WishesState>(initialState)

  /**
   * Fetch wishes data with error handling and caching
   */
  const fetchWishes = useCallback(async (opts?: WishesServiceOptions): Promise<void> => {
    const fetchOptions = { ...options, ...opts, limit, venue }
    
    try {
      setState(prev => ({
        ...prev,
        isLoading: !prev.hasData, // Only show loading if no data yet
        isRefetching: prev.hasData, // Show refetching if already has data
        error: null,
        lastError: null,
        isRetrying: false
      }))

      console.log('🎉 [useWishes] Fetching wishes...', fetchOptions)

      const response = await getLatestWishes(fetchOptions)

      if (response.success) {
        setState(prev => ({
          ...prev,
          wishes: response.data.wishes,
          pagination: response.data.pagination || null,
          total: response.data.total,
          isLoading: false,
          isRefetching: false,
          hasData: response.data.wishes.length > 0,
          error: null,
          lastError: null,
          retryCount: 0,
          isCached: response.cache?.isCached || false,
          cacheAge: response.cache?.cacheAge || 0,
          lastFetch: response.cache?.lastFetch || new Date(),
        }))

        console.log(`✅ [useWishes] Successfully loaded ${response.data.wishes.length} wishes`)
      } else {
        throw new Error(response.message || 'Failed to fetch wishes')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load wishes'
      const errorObj = error instanceof Error ? error : new Error(errorMessage)
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        isRefetching: false,
        isRetrying: false,
        error: errorMessage,
        lastError: errorObj,
        retryCount: prev.retryCount + 1
      }))

      console.error('❌ [useWishes] Error fetching wishes:', error)
    }
  }, [limit, venue, options])

  /**
   * Load more wishes (pagination)
   */
  const loadMore = useCallback(async (): Promise<void> => {
    if (!state.pagination?.hasNextPage || state.isLoadingMore) {
      console.log('⚠️ [useWishes] Cannot load more:', {
        hasNextPage: state.pagination?.hasNextPage,
        isLoadingMore: state.isLoadingMore
      })
      return
    }

    try {
      setState(prev => ({
        ...prev,
        isLoadingMore: true,
        error: null
      }))

      const nextPage = (state.pagination?.currentPage || 1) + 1
      console.log(`🎉 [useWishes] Loading more wishes (page ${nextPage})`)

      const response = await getLatestWishes({
        limit,
        venue,
        page: nextPage
      })

      if (response.success) {
        setState(prev => ({
          ...prev,
          wishes: [...prev.wishes, ...response.data.wishes],
          pagination: response.data.pagination || null,
          total: response.data.total,
          isLoadingMore: false,
          error: null
        }))

        console.log(`✅ [useWishes] Loaded ${response.data.wishes.length} more wishes`)
      } else {
        throw new Error(response.message || 'Failed to load more wishes')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load more wishes'
      
      setState(prev => ({
        ...prev,
        isLoadingMore: false,
        error: errorMessage
      }))

      console.error('❌ [useWishes] Error loading more wishes:', error)
    }
  }, [limit, venue, state.pagination, state.isLoadingMore])

  /**
   * Refresh wishes bypassing cache
   */
  const refresh = useCallback(async (): Promise<void> => {
    console.log('🔄 [useWishes] Refreshing wishes (bypassing cache)')
    await fetchWishes({ bypassCache: true })
  }, [fetchWishes])

  /**
   * Retry fetching wishes after error
   */
  const retry = useCallback(async (): Promise<void> => {
    if (state.retryCount >= state.maxRetries) {
      console.warn(`⚠️ [useWishes] Max retry attempts reached (${state.maxRetries})`)
      return
    }

    setState(prev => ({
      ...prev,
      isRetrying: true,
      error: null
    }))

    console.log(`🔄 [useWishes] Retrying... (attempt ${state.retryCount + 1}/${state.maxRetries})`)

    await fetchWishes()
  }, [fetchWishes, state.retryCount, state.maxRetries])

  /**
   * Reset state to initial values
   */
  const reset = useCallback((): void => {
    setState(initialState)
    hasInitiallyLoaded.current = false
    console.log('🔄 [useWishes] State reset')
  }, [initialState])

  /**
   * Clear wishes cache
   */
  const handleClearCache = useCallback((keyPrefix?: string): void => {
    clearCache(keyPrefix)
    console.log('🗑️ [useWishes] Cache cleared', { keyPrefix })
  }, [])

  /**
   * Auto-load wishes on mount if enabled
   */
  useEffect(() => {
    if (autoLoad && !hasInitiallyLoaded.current) {
      hasInitiallyLoaded.current = true
      fetchWishes()
    }
  }, [autoLoad, fetchWishes])

  return {
    ...state,
    fetchWishes,
    loadMore,
    refresh,
    retry,
    reset,
    clearCache: handleClearCache
  }
}