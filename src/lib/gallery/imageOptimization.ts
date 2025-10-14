/**
 * Gallery Image Optimization Utilities
 * 
 * Utilities for optimizing image delivery and responsive image handling.
 * 
 * @module lib/gallery/imageOptimization
 */

import type { GalleryImage } from '@/types/gallery'

/**
 * Get responsive image URL based on viewport size
 * 
 * @param image - Gallery image
 * @param viewportWidth - Current viewport width
 * @returns Optimized image URL
 */
export function getResponsiveImageUrl(image: GalleryImage, viewportWidth: number): string {
  const { sizes } = image
  
  if (viewportWidth < 640) {
    return sizes.thumbnail.url
  } else if (viewportWidth < 1024) {
    return sizes.medium.url
  } else if (viewportWidth < 1920) {
    return sizes.large.url
  }
  
  return sizes.large.url
}

/**
 * Build srcset attribute for responsive images
 * 
 * @param sizes - Image size variants
 * @returns srcset string
 */
export function buildSrcSet(sizes: GalleryImage['sizes']): string {
  const entries: string[] = []
  
  if (sizes.thumbnail) {
    entries.push(`${sizes.thumbnail.url} ${sizes.thumbnail.width}w`)
  }
  if (sizes.medium) {
    entries.push(`${sizes.medium.url} ${sizes.medium.width}w`)
  }
  if (sizes.large) {
    entries.push(`${sizes.large.url} ${sizes.large.width}w`)
  }
  if (sizes.original) {
    entries.push(`${sizes.original.url} ${sizes.original.width}w`)
  }
  
  return entries.join(', ')
}

/**
 * Build sizes attribute for responsive images
 * 
 * @param breakpoints - Custom breakpoints (optional)
 * @returns sizes attribute string
 */
export function buildSizesAttribute(breakpoints?: {
  mobile?: number
  tablet?: number
  desktop?: number
}): string {
  const bp = {
    mobile: breakpoints?.mobile || 768,
    tablet: breakpoints?.tablet || 1024,
    desktop: breakpoints?.desktop || 1920,
  }
  
  return [
    `(max-width: ${bp.mobile}px) 100vw`,
    `(max-width: ${bp.tablet}px) 50vw`,
    `33vw`,
  ].join(', ')
}

/**
 * Determine optimal image quality based on connection speed
 * 
 * @returns 'high' | 'medium' | 'low'
 */
export function getOptimalQuality(): 'high' | 'medium' | 'low' {
  // Check if Network Information API is available
  if ('connection' in navigator) {
    const connection = (navigator as { connection?: { effectiveType?: string } }).connection
    
    if (connection) {
      // Slow connection (2G, slow-2g)
      if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
        return 'low'
      }
      
      // Medium connection (3G)
      if (connection.effectiveType === '3g') {
        return 'medium'
      }
      
      // Fast connection (4G, 5G)
      return 'high'
    }
  }
  
  // Default to medium quality
  return 'medium'
}

/**
 * Should preload image based on viewport position
 * 
 * @param index - Image index in grid
 * @param currentViewport - Current viewport position
 * @param threshold - Preload threshold (default: 2)
 * @returns boolean
 */
export function shouldPreloadImage(
  index: number,
  currentViewport: number,
  threshold: number = 2
): boolean {
  return Math.abs(index - currentViewport) <= threshold
}

/**
 * Calculate loading priority for images
 * 
 * @param index - Image index
 * @param viewportSize - Number of images visible in viewport
 * @returns 'high' | 'low' | 'auto'
 */
export function getLoadingPriority(
  index: number,
  viewportSize: number = 6
): 'high' | 'low' | 'auto' {
  // First screen of images gets high priority
  if (index < viewportSize) {
    return 'high'
  }
  
  // Second screen gets auto
  if (index < viewportSize * 2) {
    return 'auto'
  }
  
  // Rest gets low priority
  return 'low'
}

/**
 * Generate blur data URL from base64
 * 
 * @param blurhash - Blurhash string or base64
 * @returns data URL
 */
export function generateBlurDataUrl(blurhash?: string): string {
  if (!blurhash) {
    // Default blur placeholder
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Cfilter id="b"%3E%3CfeGaussianBlur stdDeviation="20"/%3E%3C/filter%3E%3Crect width="400" height="300" fill="%23F7ECEA" filter="url(%23b)"/%3E%3C/svg%3E'
  }
  
  return `data:image/svg+xml,${blurhash}`
}

/**
 * Estimate image load time based on size and connection
 * 
 * @param fileSize - File size in bytes
 * @returns Estimated load time in ms
 */
export function estimateLoadTime(fileSize: number): number {
  const quality = getOptimalQuality()
  
  // Estimated download speeds (bytes per ms)
  const speeds = {
    high: 1000, // ~1 MB/s (4G)
    medium: 375, // ~375 KB/s (3G)
    low: 31, // ~31 KB/s (2G)
  }
  
  return Math.ceil(fileSize / speeds[quality])
}
