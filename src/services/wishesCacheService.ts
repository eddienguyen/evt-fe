/**
 * Wishes Cache Service
 * 
 * In-memory caching implementation for wishes data with TTL support,
 * stale-while-revalidate pattern, and automatic cleanup.
 * 
 * Features:
 * - Venue-specific cache keys
 * - Configurable TTL with stale threshold
 * - Automatic cleanup of expired entries
 * - Cache statistics tracking
 * - Memory-efficient Map storage
 * 
 * @module services/wishesCacheService
 */

import type { CacheEntry, CacheConfig, CacheStats, CacheStatus } from '@/types/cache'
import type { WishesResponse } from '@/types/wishes'
import { DEFAULT_CACHE_CONFIG, CACHE_KEY_PREFIXES } from '@/config/cache'

/**
 * Wishes Cache Service Class
 * 
 * Manages in-memory caching for wishes data with intelligent
 * TTL-based invalidation and stale-while-revalidate support.
 */
class WishesCacheService {
  private readonly cache: Map<string, CacheEntry<WishesResponse>>
  private readonly config: CacheConfig
  private readonly stats: CacheStats
  private cleanupTimer: NodeJS.Timeout | null = null

  constructor(config: Partial<CacheConfig> = {}) {
    this.cache = new Map()
    this.config = { ...DEFAULT_CACHE_CONFIG, ...config }
    this.stats = {
      hits: 0,
      misses: 0,
      size: 0,
      staleHits: 0,
      evictions: 0,
    }

    // Start automatic cleanup if enabled
    if (this.config.enableAutoCleanup) {
      this.startAutoCleanup()
    }

    console.log('[WishesCache] Initialized', {
      config: this.config,
      autoCleanup: this.config.enableAutoCleanup,
    })
  }

  /**
   * Build cache key from options
   * 
   * Format: wishes:{venue}:{limit}:{page}
   * Examples:
   * - wishes:all:10:1
   * - wishes:hue:10:1
   * - wishes:hanoi:10:2
   */
  buildKey(options: { venue?: string; limit?: number; page?: number } = {}): string {
    const venue = options.venue || 'all'
    const limit = options.limit || 10
    const page = options.page || 1
    
    return `${CACHE_KEY_PREFIXES.WISHES}:${venue}:${limit}:${page}`
  }

  /**
   * Get cache status for a key
   */
  getStatus(key: string): CacheStatus {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return 'missing'
    }

    const age = Date.now() - entry.timestamp
    
    if (age >= entry.ttl) {
      return 'expired'
    }
    
    if (age >= this.config.staleThreshold) {
      return 'stale'
    }
    
    return 'fresh'
  }

  /**
   * Check if cached data is valid (not expired)
   */
  isValid(key: string): boolean {
    const status = this.getStatus(key)
    return status === 'fresh' || status === 'stale'
  }

  /**
   * Check if cached data is stale but not expired
   */
  isStale(key: string): boolean {
    return this.getStatus(key) === 'stale'
  }

  /**
   * Get cached data
   * 
   * Returns null if cache miss or expired.
   * Updates statistics.
   */
  get(key: string): WishesResponse | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      this.stats.misses++
      return null
    }

    const status = this.getStatus(key)
    
    if (status === 'expired') {
      this.stats.misses++
      this.delete(key)
      return null
    }
    
    // Track stale hits separately
    if (status === 'stale') {
      this.stats.staleHits++
    }
    
    this.stats.hits++
    
    console.log('[WishesCache] Cache hit', {
      key,
      status,
      age: Date.now() - entry.timestamp,
      data: entry.data,
    })
    
    return entry.data
  }

  /**
   * Set cached data with TTL
   * 
   * Enforces max size by evicting oldest entries.
   */
  set(key: string, data: WishesResponse, ttl?: number): void {
    // Enforce max size by evicting oldest entry
    if (this.cache.size >= this.config.maxSize) {
      const oldestKey = this.cache.keys().next().value
      if (oldestKey) {
        this.delete(oldestKey)
        this.stats.evictions++
      }
    }

    const entry: CacheEntry<WishesResponse> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.defaultTTL,
      key,
    }

    this.cache.set(key, entry)
    this.stats.size = this.cache.size
    
    console.log('[WishesCache] Cached data', {
      key,
      ttl: entry.ttl,
      expiresAt: new Date(entry.timestamp + entry.ttl).toISOString(),
    })
  }

  /**
   * Delete cached entry
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key)
    this.stats.size = this.cache.size
    
    if (deleted) {
      console.log('[WishesCache] Deleted entry', { key })
    }
    
    return deleted
  }

  /**
   * Clear entire cache or entries matching prefix
   */
  clear(keyPrefix?: string): void {
    if (!keyPrefix) {
      this.cache.clear()
      this.stats.size = 0
      console.log('[WishesCache] Cleared all entries')
      return
    }

    let deletedCount = 0
    for (const key of this.cache.keys()) {
      if (key.startsWith(keyPrefix)) {
        this.cache.delete(key)
        deletedCount++
      }
    }
    
    this.stats.size = this.cache.size
    console.log('[WishesCache] Cleared entries with prefix', { keyPrefix, deletedCount })
  }

  /**
   * Cleanup expired entries
   * 
   * Removes all entries that have exceeded their TTL.
   * Returns number of entries removed.
   */
  cleanup(): number {
    let removedCount = 0
    
    for (const [key, entry] of this.cache.entries()) {
      const age = Date.now() - entry.timestamp
      if (age >= entry.ttl) {
        this.cache.delete(key)
        removedCount++
      }
    }
    
    this.stats.size = this.cache.size
    
    if (removedCount > 0) {
      console.log('[WishesCache] Cleanup completed', { removedCount, remainingSize: this.stats.size })
    }
    
    return removedCount
  }

  /**
   * Start automatic cleanup timer
   */
  private startAutoCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
    }

    this.cleanupTimer = setInterval(() => {
      this.cleanup()
    }, this.config.cleanupInterval)

    console.log('[WishesCache] Auto cleanup started', {
      interval: this.config.cleanupInterval,
    })
  }

  /**
   * Stop automatic cleanup timer
   */
  stopAutoCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
      this.cleanupTimer = null
      console.log('[WishesCache] Auto cleanup stopped')
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats }
  }

  /**
   * Get cache age for a key in milliseconds
   */
  getCacheAge(key: string): number | null {
    const entry = this.cache.get(key)
    return entry ? Date.now() - entry.timestamp : null
  }

  /**
   * Get all cache keys
   */
  getKeys(): string[] {
    return Array.from(this.cache.keys())
  }

  /**
   * Get cache size
   */
  getSize(): number {
    return this.cache.size
  }

  /**
   * Destroy cache service (cleanup resources)
   */
  destroy(): void {
    this.stopAutoCleanup()
    this.cache.clear()
    this.stats.size = 0
    console.log('[WishesCache] Service destroyed')
  }
}

/**
 * Singleton instance
 */
export const wishesCacheService = new WishesCacheService()

/**
 * Export class for testing
 */
export { WishesCacheService }
