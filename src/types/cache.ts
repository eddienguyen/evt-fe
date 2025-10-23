/**
 * Cache Type Definitions
 * 
 * Type definitions for in-memory caching system used across the application.
 * Supports TTL-based caching with stale-while-revalidate patterns.
 * 
 * @module types/cache
 */

/**
 * Cache Entry
 * 
 * Represents a single cached item with metadata
 */
export interface CacheEntry<T = any> {
  /** Cached data */
  data: T
  /** Timestamp when data was cached (milliseconds) */
  timestamp: number
  /** Time-to-live in milliseconds */
  ttl: number
  /** Cache key identifier */
  key: string
  /** Optional metadata */
  metadata?: Record<string, any>
}

/**
 * Cache Configuration
 * 
 * Configuration options for cache behavior
 */
export interface CacheConfig {
  /** Default TTL for cache entries in milliseconds (default: 5 minutes) */
  defaultTTL: number
  /** Maximum number of cache entries (default: 50) */
  maxSize: number
  /** Enable stale-while-revalidate pattern (default: true) */
  enableStaleWhileRevalidate: boolean
  /** Stale threshold in milliseconds - when to trigger background refresh (default: 2 minutes) */
  staleThreshold: number
  /** Enable automatic cleanup of expired entries (default: true) */
  enableAutoCleanup: boolean
  /** Cleanup interval in milliseconds (default: 1 minute) */
  cleanupInterval: number
}

/**
 * Cache Statistics
 * 
 * Runtime statistics for cache performance monitoring
 */
export interface CacheStats {
  /** Total number of cache hits */
  hits: number
  /** Total number of cache misses */
  misses: number
  /** Current number of cached entries */
  size: number
  /** Number of stale entries served */
  staleHits: number
  /** Number of entries evicted */
  evictions: number
}

/**
 * Cache Validity Status
 */
export type CacheStatus = 'fresh' | 'stale' | 'expired' | 'missing'

/**
 * Cache Key Builder Options
 */
export interface CacheKeyOptions {
  /** Base key prefix */
  prefix: string
  /** Additional key segments */
  segments: (string | number | undefined | null)[]
  /** Whether to normalize the key */
  normalize?: boolean
}
