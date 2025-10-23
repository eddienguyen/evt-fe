/**
 * Cache Configuration
 * 
 * Default configuration values for in-memory caching system.
 * Used by cache services throughout the application.
 * 
 * @module config/cache
 */

import type { CacheConfig } from '@/types/cache'

/**
 * Default Cache Configuration
 * 
 * Optimized for wishes data caching with reasonable defaults:
 * - 5 minute TTL for fresh data
 * - 2 minute stale threshold for background refresh
 * - Max 50 entries to prevent memory bloat
 * - Auto cleanup every minute
 */
export const DEFAULT_CACHE_CONFIG: CacheConfig = {
  /** 5 minutes in milliseconds */
  defaultTTL: 5 * 60 * 1000,
  
  /** Maximum 50 cache entries */
  maxSize: 50,
  
  /** Enable stale-while-revalidate pattern */
  enableStaleWhileRevalidate: true,
  
  /** 2 minutes in milliseconds - when data becomes stale */
  staleThreshold: 2 * 60 * 1000,
  
  /** Enable automatic cleanup of expired entries */
  enableAutoCleanup: true,
  
  /** Run cleanup every minute */
  cleanupInterval: 60 * 1000,
}

/**
 * Cache Configuration Presets
 */
export const CACHE_PRESETS = {
  /** Short-lived cache (1 minute TTL, 30 second stale) */
  SHORT: {
    ...DEFAULT_CACHE_CONFIG,
    defaultTTL: 60 * 1000,
    staleThreshold: 30 * 1000,
  },
  
  /** Medium-lived cache (5 minutes TTL, 2 minute stale) - Default */
  MEDIUM: DEFAULT_CACHE_CONFIG,
  
  /** Long-lived cache (15 minutes TTL, 5 minute stale) */
  LONG: {
    ...DEFAULT_CACHE_CONFIG,
    defaultTTL: 15 * 60 * 1000,
    staleThreshold: 5 * 60 * 1000,
  },
  
  /** Aggressive cache (30 minutes TTL, 10 minute stale) */
  AGGRESSIVE: {
    ...DEFAULT_CACHE_CONFIG,
    defaultTTL: 30 * 60 * 1000,
    staleThreshold: 10 * 60 * 1000,
    maxSize: 100,
  },
} as const

/**
 * Cache Key Prefixes
 * 
 * Standardized prefixes for different data types
 */
export const CACHE_KEY_PREFIXES = {
  WISHES: 'wishes',
  RSVP: 'rsvp',
  GUEST: 'guest',
  ADMIN: 'admin',
} as const
