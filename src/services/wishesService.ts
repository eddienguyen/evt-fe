/**
 * Wishes Service
 * 
 * Handles wishes data fetching from the backend API.
 * 
 * Features:
 * - Real API integration with GET /api/wishes
 * - Pagination support
 * - Venue filtering
 * - Error handling with retry logic
 * - Rate limiting awareness (100 req/15min)
 * 
 * @module services/wishesService
 */

import type { WishesResponse, WishesServiceOptions } from '../types/wishes'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

/**
 * Get latest wishes from API
 * 
 * @param options - Service options
 * @returns Promise with wishes response
 */
export const getLatestWishes = async (options: WishesServiceOptions = {}): Promise<WishesResponse> => {
  console.log('🎉 [Wishes Service] Fetching latest wishes with options:', options)
  
  try {
    const { limit = 10, venue, page = 1 } = options
    
    // Build query parameters
    const params = new URLSearchParams({
      limit: limit.toString(),
      page: page.toString()
    })
    
    if (venue) {
      params.append('venue', venue)
    }
    
    // Make API request
    const response = await fetch(
      `${API_BASE_URL}/api/wishes?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP ${response.status}: Failed to fetch wishes`)
    }
    
    const result = await response.json()
    
    console.log(`✅ [Wishes Service] Successfully fetched ${result.data.wishes.length} wishes`)
    
    return {
      success: true,
      data: {
        wishes: result.data.wishes,
        total: result.data.pagination.totalCount,
        pagination: result.data.pagination
      },
      message: 'Wishes retrieved successfully'
    }
  } catch (error) {
    console.error('❌ [Wishes Service] Error fetching wishes:', error)
    throw error instanceof Error ? error : new Error('Failed to fetch wishes')
  }
}

/**
 * Get wishes with retry logic for mock data
 * 
 * @param options - Service options
 * @returns Promise with wishes response
 */
export const getWishesWithRetry = async (options: WishesServiceOptions = {}): Promise<WishesResponse> => {
  const maxRetries = 3
  let retryCount = 0
  
  while (retryCount < maxRetries) {
    try {
      return await getLatestWishes(options)
    } catch (error) {
      retryCount++
      if (retryCount >= maxRetries) {
        throw error
      }
      // Wait before retrying (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, retryCount - 1), 5000)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw new Error('Max retries exceeded')
}