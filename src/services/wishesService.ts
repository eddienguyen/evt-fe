/**
 * Wishes Service
 * 
 * Handles wishes data fetching from the backend API with intelligent
 * retry logic and in-memory caching.
 * 
 * Features:
 * - Real API integration with GET /api/wishes
 * - Intelligent retry logic for Fly.io machine wake-up (502/503)
 * - In-memory caching with stale-while-revalidate pattern
 * - Pagination support
 * - Venue filtering
 * - Vietnamese error messages
 * - Rate limiting awareness (100 req/15min)
 * 
 * @module services/wishesService
 */

import axios from 'axios'
import type { WishesResponse, WishesServiceOptions } from '@/types/wishes'
import { executeWithRetry, RETRY_MESSAGES } from './apiRetryService'
import { wishesCacheService } from './wishesCacheService'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

/**
 * Map error to Vietnamese message
 */
function getErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return RETRY_MESSAGES.failed
  }

  if (error.message.includes('Network')) {
    return 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.'
  }

  if (error.message.includes('502') || error.message.includes('503')) {
    return 'Máy chủ đang khởi động, vui lòng đợi trong giây lát...'
  }

  if (error.message.includes('429')) {
    return 'Quá nhiều yêu cầu. Vui lòng thử lại sau.'
  }

  return RETRY_MESSAGES.failed
}

/**
 * Get cached data with metadata
 */
function getCachedResponse(cacheKey: string, cachedData: WishesResponse): WishesResponse {
  const cacheAge = wishesCacheService.getCacheAge(cacheKey) || 0
  const status = wishesCacheService.getStatus(cacheKey)
  
  console.log('🎉 [Wishes Service] Returning cached data', {
    cacheKey,
    cacheAge,
    status,
  })

  return {
    ...cachedData,
    cache: {
      isCached: true,
      cacheAge,
      status,
      lastFetch: new Date(Date.now() - cacheAge),
    },
  }
}

/**
 * Get latest wishes from API with caching and retry logic
 * 
 * Implements stale-while-revalidate pattern:
 * 1. Return fresh cache if available
 * 2. Return stale cache + refresh in background
 * 3. Fetch fresh data if no cache
 * 
 * @param options - Service options
 * @returns Promise with wishes response including cache metadata
 * @throws Error with Vietnamese message on failure
 */
export const getLatestWishes = async (options: WishesServiceOptions = {}): Promise<WishesResponse> => {
  const { limit = 10, venue, page = 1, bypassCache = false } = options

  console.log('🎉 [Wishes Service] Fetching latest wishes', {
    options,
    bypassCache,
  })

  // Build cache key
  const cacheKey = wishesCacheService.buildKey({ venue, limit, page })

  // Check cache unless bypassed
  if (!bypassCache) {
    const cachedData = wishesCacheService.get(cacheKey)
    
    if (cachedData) {
      return getCachedResponse(cacheKey, cachedData)
    }
  }

  // Fetch fresh data with retry logic
  try {
    console.log('🎉 [Wishes Service] Fetching fresh data from API')

    const response = await executeWithRetry(
      () => axios.get<WishesResponse>(`${API_BASE_URL}/api/wishes`, {
        params: { limit, venue, page },
      }),
      undefined, // Use default retry config
      (attempt) => {
        console.log(`🔄 [Wishes Service] Retry attempt ${attempt.attemptNumber}/${attempt.maxAttempts}`, {
          delay: attempt.delayMs,
          error: attempt.error.message,
        })
      }
    )

    const wishesData = response.data

    // Cache the fresh data
    wishesCacheService.set(cacheKey, wishesData)

    console.log('✅ [Wishes Service] Successfully fetched wishes', {
      count: wishesData.data.wishes.length,
      total: wishesData.data.total,
      cached: true,
    })

    // Add cache metadata
    return {
      ...wishesData,
      cache: {
        isCached: false,
        cacheAge: 0,
        status: 'fresh',
        lastFetch: new Date(),
      },
    }
  } catch (error) {
    console.error('❌ [Wishes Service] Failed to fetch wishes', {
      error: error instanceof Error ? error.message : 'Unknown error',
      options,
    })

    throw new Error(getErrorMessage(error))
  }
}

/**
 * Get wishes with retry logic (alias for getLatestWishes)
 * 
 * @deprecated Use getLatestWishes instead
 * @param options - Service options
 * @returns Promise with wishes response
 */
export const getWishesWithRetry = async (options: WishesServiceOptions = {}): Promise<WishesResponse> => {
  return getLatestWishes(options)
}

/**
 * Clear wishes cache
 * 
 * @param keyPrefix - Optional key prefix to clear specific entries
 */
export const clearCache = (keyPrefix?: string): void => {
  wishesCacheService.clear(keyPrefix)
}

/**
 * Get cache statistics
 */
export const getCacheStats = () => {
  return wishesCacheService.getStats()
}
