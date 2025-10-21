/**
 * useWishes Hook
 * 
 * Custom hook for managing wishes data fetching, loading states, and error handling.
 * Provides retry functionality and optimistic loading patterns.
 * 
 * @module components/wishes/hooks/useWishes
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { getWishesWithRetry } from '../../../services/wishesService'
import type { WishesState, WishesServiceOptions } from '../../../types/wishes'

export interface UseWishesOptions extends WishesServiceOptions {
  /** Auto-load wishes on mount */
  autoLoad?: boolean
  /** Enable automatic retry on error */
  enableRetry?: boolean
}

export interface UseWishesReturn extends WishesState {
  /** Manually fetch wishes */
  fetchWishes: () => Promise<void>
  /** Retry after error */
  retry: () => Promise<void>
  /** Reset state */
  reset: () => void
}

/**
 * useWishes Hook
 * 
 * Manages wishes data fetching with loading states, error handling, and retry logic.
 * 
 * @param options - Hook options
 * @returns Wishes state and control functions
 * 
 * @example
 * ```tsx
 * const { wishes, isLoading, error, retry } = useWishes({
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

  // State management
  const [state, setState] = useState<WishesState>({
    wishes: [],
    isLoading: false,
    error: null,
    hasData: false,
    isRetrying: false,
    retryCount: 0
  })

  /**
   * Fetch wishes data with error handling
   */
  const fetchWishes = useCallback(async (): Promise<void> => {
    try {
      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null,
        isRetrying: false
      }))

      console.log('🎉 [useWishes] Fetching wishes...')

      const response = await getWishesWithRetry({
        limit,
        venue
      })

      if (response.success) {
        setState(prev => ({
          ...prev,
          wishes: response.data.wishes,
          isLoading: false,
          hasData: response.data.wishes.length > 0,
          error: null,
          retryCount: 0
        }))

        console.log(`✅ [useWishes] Successfully loaded ${response.data.wishes.length} wishes`)
      } else {
        throw new Error(response.message || 'Failed to fetch wishes')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load wishes'
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        isRetrying: false,
        error: errorMessage,
        retryCount: prev.retryCount + 1
      }))

      console.error('❌ [useWishes] Error fetching wishes:', error)
    }
  }, [limit, venue])

  /**
   * Retry fetching wishes after error
   */
  const retry = useCallback(async (): Promise<void> => {
    if (state.retryCount >= 3) {
      console.warn('⚠️ [useWishes] Max retry attempts reached')
      return
    }

    setState(prev => ({
      ...prev,
      isRetrying: true,
      error: null
    }))

    console.log(`🔄 [useWishes] Retrying... (attempt ${state.retryCount + 1})`)

    try {
      await fetchWishes()
    } catch (error) {
      console.error('❌ [useWishes] Retry failed:', error)
    }
  }, [fetchWishes, state.retryCount])

  /**
   * Reset state to initial values
   */
  const reset = useCallback((): void => {
    setState({
      wishes: [],
      isLoading: false,
      error: null,
      hasData: false,
      isRetrying: false,
      retryCount: 0
    })
    hasInitiallyLoaded.current = false
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
    retry,
    reset
  }
}