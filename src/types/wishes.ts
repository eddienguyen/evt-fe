/**
 * Wishes Type Definitions
 * 
 * Type definitions for wishes display feature including
 * wish items, API responses, component states, and caching.
 * 
 * @module types/wishes
 */

/**
 * Individual wish item from RSVP submission
 */
export interface WishItem {
  /** Unique identifier */
  id: string
  /** Name of the person who submitted the wish */
  name: string
  /** The wish message content */
  wishes: string
  /** When the wish was submitted */
  createdAt: string
  /** Optional venue identifier */
  venue?: 'hue' | 'hanoi'
}

/**
 * Pagination Metadata
 */
export interface PaginationMetadata {
  currentPage: number
  totalPages: number
  totalCount: number
  limit: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

/**
 * Wishes API Response
 */
export interface WishesResponse {
  success: boolean
  data: {
    wishes: WishItem[]
    total: number
    pagination?: PaginationMetadata
  }
  message?: string
  /** Cache metadata (added by service layer) */
  cache?: {
    /** Whether data came from cache */
    isCached: boolean
    /** Cache age in milliseconds */
    cacheAge?: number
    /** Cache status */
    status?: 'fresh' | 'stale' | 'expired' | 'missing'
    /** When data was last fetched */
    lastFetch?: Date
  }
}

/**
 * Wishes Error Response
 */
export interface WishesError {
  success: false
  error: string
  message: string
}

/**
 * Wishes Hook State
 */
export interface WishesState {
  /** Array of wish items */
  wishes: WishItem[]
  /** Pagination metadata */
  pagination: PaginationMetadata | null
  /** Total count of wishes */
  total: number
  /** Loading state */
  isLoading: boolean
  /** Refetching state (background refresh) */
  isRefetching: boolean
  /** Loading more state (pagination) */
  isLoadingMore: boolean
  /** Error message if any */
  error: string | null
  /** Last error object */
  lastError: Error | null
  /** Whether data has been loaded */
  hasData: boolean
  /** Whether currently retrying after error */
  isRetrying: boolean
  /** Number of retry attempts */
  retryCount: number
  /** Maximum retry attempts */
  maxRetries: number
  /** Whether data came from cache */
  isCached: boolean
  /** Cache age in milliseconds */
  cacheAge: number
  /** When data was last fetched */
  lastFetch: Date | null
}

/**
 * Wishes Service Options
 */
export interface WishesServiceOptions {
  /** Maximum number of wishes to fetch */
  limit?: number
  /** Venue filter */
  venue?: 'hue' | 'hanoi'
  /** Page number for pagination */
  page?: number
  /** Bypass cache and force fresh fetch */
  bypassCache?: boolean
}

/**
 * Stacked Animation Mode
 */
export type AnimationMode = 'grid' | 'stacked'

/**
 * Stacked Animation Configuration
 */
export interface StackedAnimationConfig {
  /** Enable stacked animation */
  enabled: boolean
  /** Card spacing in pixels */
  cardSpacing?: number
  /** Animation duration in seconds */
  animationDuration?: number
  /** GSAP easing function name */
  easingFunction?: string
}
