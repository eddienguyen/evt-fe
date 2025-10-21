/**
 * Wishes Type Definitions
 * 
 * Type definitions for wishes display feature including
 * wish items, API responses, and component states.
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
 * Wishes API Response
 */
export interface WishesResponse {
  success: boolean
  data: {
    wishes: WishItem[]
    total: number
  }
  message?: string
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
  /** Loading state */
  isLoading: boolean
  /** Error message if any */
  error: string | null
  /** Whether data has been loaded */
  hasData: boolean
  /** Whether currently retrying after error */
  isRetrying: boolean
  /** Number of retry attempts */
  retryCount: number
}

/**
 * Wishes Service Options
 */
export interface WishesServiceOptions {
  /** Maximum number of wishes to fetch */
  limit?: number
  /** Venue filter */
  venue?: 'hue' | 'hanoi'
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
