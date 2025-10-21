/**
 * Wishes Service
 * 
 * Handles wishes data fetching with mock data implementation.
 * Will be replaced with real API calls when backend is ready.
 * 
 * Features:
 * - Mock data with Vietnamese and English wishes
 * - Simulated network delays
 * - Error handling with retry logic
 * - Filtering for non-empty wishes only
 * 
 * @module services/wishesService
 */

import type { WishItem, WishesResponse, WishesServiceOptions } from '../types/wishes'
// Note: When real API is implemented, import { executeWithRetry } from './apiRetryService'

/**
 * Mock wishes data for development
 */
const MOCK_WISHES: WishItem[] = [
  {
    id: 'wish-001',
    name: 'Lan Anh',
    wishes: 'Chúc hai bạn trăm năm hạnh phúc, mãi mãi bên nhau! 💕',
    createdAt: '2025-10-20T10:30:00Z',
    venue: 'hue'
  },
  {
    id: 'wish-002',
    name: 'Minh Duc',
    wishes: 'Wishing you both a lifetime of love and happiness together! May your marriage be filled with endless joy and beautiful memories.',
    createdAt: '2025-10-20T09:15:00Z',
    venue: 'hanoi'
  },
  {
    id: 'wish-003',
    name: 'Thu Hà',
    wishes: 'Chúc mừng đám cưới! Mong hai bạn luôn yêu thương và hạnh phúc như ngày hôm nay. ❤️',
    createdAt: '2025-10-20T08:45:00Z',
    venue: 'hue'
  },
  {
    id: 'wish-004',
    name: 'David Kim',
    wishes: 'Congratulations on your special day! Here\'s to a wonderful journey as life partners.',
    createdAt: '2025-10-20T07:20:00Z',
    venue: 'hanoi'
  },
  {
    id: 'wish-005',
    name: 'Mai Phương',
    wishes: 'Chúc hai bạn sống hạnh phúc, khỏe mạnh và luôn có nhau trong mọi khoảnh khắc của cuộc đời! 🌸',
    createdAt: '2025-10-20T06:30:00Z',
    venue: 'hue'
  },
  {
    id: 'wish-006',
    name: 'James Wilson',
    wishes: 'May your love story continue to unfold with grace, joy, and countless beautiful moments together.',
    createdAt: '2025-10-19T22:15:00Z',
    venue: 'hanoi'
  },
  {
    id: 'wish-007',
    name: 'Hương Giang',
    wishes: 'Chúc mừng cô dâu chú rể! Mong rằng tình yêu của hai bạn sẽ mãi bền chặt như ngày đầu. 💐',
    createdAt: '2025-10-19T21:45:00Z',
    venue: 'hue'
  },
  {
    id: 'wish-008',
    name: 'Sarah Chen',
    wishes: 'Beautiful couple, beautiful wedding! Wishing you endless love and laughter in your new chapter together.',
    createdAt: '2025-10-19T20:10:00Z',
    venue: 'hanoi'
  },
  {
    id: 'wish-009',
    name: 'Văn Hùng',
    wishes: 'Chúc hai bạn xây dựng được tổ ấm hạnh phúc, con cái thông minh và sức khỏe dồi dào! 🏠',
    createdAt: '2025-10-19T19:30:00Z',
    venue: 'hue'
  },
  {
    id: 'wish-010',
    name: 'Emily Rodriguez',
    wishes: 'Congratulations! May your marriage be everything you\'ve dreamed of and more. Cheers to your happily ever after!',
    createdAt: '2025-10-19T18:20:00Z',
    venue: 'hanoi'
  },
  {
    id: 'wish-011',
    name: 'Quốc Bảo',
    wishes: 'Chúc mừng đám cưới của hai bạn! Mong hai bạn luôn vui vẻ, hạnh phúc và thành công trong cuộc sống. 🎉',
    createdAt: '2025-10-19T17:45:00Z',
    venue: 'hue'
  },
  {
    id: 'wish-012',
    name: 'Lisa Park',
    wishes: 'Such a joy to celebrate your love! Wishing you both a marriage filled with adventure, laughter, and deep connection.',
    createdAt: '2025-10-19T16:15:00Z',
    venue: 'hanoi'
  }
]

/**
 * Simulate network delay for realistic loading experience
 */
const simulateNetworkDelay = (): Promise<void> => {
  const delay = Math.random() * 1000 + 500 // 500-1500ms delay
  return new Promise(resolve => setTimeout(resolve, delay))
}

/**
 * Get latest wishes from mock data
 * 
 * @param options - Service options
 * @returns Promise with wishes response
 */
export const getLatestWishes = async (options: WishesServiceOptions = {}): Promise<WishesResponse> => {
  console.log('🎉 [Wishes Service] Fetching latest wishes with options:', options)
  
  try {
    // Simulate network delay
    await simulateNetworkDelay()
    
    const { limit = 10, venue } = options
    
    // Filter and sort wishes
    let filteredWishes = [...MOCK_WISHES]
    
    // Filter by venue if specified
    if (venue) {
      filteredWishes = filteredWishes.filter(wish => wish.venue === venue)
    }
    
    // Sort by creation date (newest first)
    filteredWishes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    // Apply limit
    const wishes = filteredWishes.slice(0, limit)
    
    console.log(`✅ [Wishes Service] Successfully fetched ${wishes.length} wishes`)
    
    return {
      success: true,
      data: {
        wishes,
        total: filteredWishes.length
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