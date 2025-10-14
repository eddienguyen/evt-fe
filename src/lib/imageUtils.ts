/**
 * Image Utilities
 * 
 * Utility functions for image processing, URL generation, and optimization.
 * 
 * @module lib/imageUtils
 */

import type { ImageSize, GalleryImage } from '@/types/gallery'

/**
 * Generate srcset string from image sizes
 * 
 * @param sizes - Image size variants
 * @returns srcset string
 */
export function generateSrcSet(sizes: GalleryImage['sizes']): string {
  return [
    `${sizes.thumbnail.url} ${sizes.thumbnail.width}w`,
    `${sizes.medium.url} ${sizes.medium.width}w`,
    `${sizes.large.url} ${sizes.large.width}w`,
    `${sizes.original.url} ${sizes.original.width}w`,
  ].join(', ')
}

/**
 * Generate sizes attribute for responsive images
 * 
 * @returns sizes attribute string
 */
export function generateSizesAttribute(): string {
  return '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
}

/**
 * Get optimal image size based on viewport width
 * 
 * @param sizes - Image size variants
 * @param viewportWidth - Current viewport width
 * @returns Optimal image size
 */
export function getOptimalImageSize(
  sizes: GalleryImage['sizes'],
  viewportWidth: number
): ImageSize {
  if (viewportWidth < 768) {
    return sizes.medium
  } else if (viewportWidth < 1024) {
    return sizes.medium
  } else if (viewportWidth < 1920) {
    return sizes.large
  }
  return sizes.large
}

/**
 * Check if browser supports WebP format
 * 
 * @returns Promise<boolean> - WebP support status
 */
export function supportsWebP(): Promise<boolean> {
  return new Promise((resolve) => {
    const webp = new Image()
    webp.onload = webp.onerror = () => {
      resolve(webp.height === 2)
    }
    webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
  })
}

/**
 * Check if browser supports AVIF format
 * 
 * @returns Promise<boolean> - AVIF support status
 */
export function supportsAVIF(): Promise<boolean> {
  return new Promise((resolve) => {
    const avif = new Image()
    avif.onload = avif.onerror = () => {
      resolve(avif.height === 2)
    }
    avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI='
  })
}

/**
 * Preload image
 * 
 * @param url - Image URL to preload
 * @returns Promise<void>
 */
export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = url
  })
}

/**
 * Get image dimensions from URL
 * 
 * @param url - Image URL
 * @returns Promise<{width: number, height: number}>
 */
export function getImageDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.onerror = reject
    img.src = url
  })
}

/**
 * Calculate aspect ratio
 * 
 * @param width - Image width
 * @param height - Image height
 * @returns Aspect ratio string
 */
export function calculateAspectRatio(width: number, height: number): string {
  const ratio = width / height
  return `${ratio.toFixed(2)} / 1`
}

/**
 * Format file size
 * 
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * Generate blur placeholder data URL
 * 
 * @param width - Placeholder width
 * @param height - Placeholder height
 * @returns Data URL for blur placeholder
 */
export function generateBlurPlaceholder(width: number = 10, height: number = 10): string {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  
  // Create gradient placeholder
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#F7ECEA')
  gradient.addColorStop(1, '#FFF8F3')
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  
  return canvas.toDataURL()
}

/**
 * Check if image is loaded
 * 
 * @param img - HTMLImageElement
 * @returns boolean - Load status
 */
export function isImageLoaded(img: HTMLImageElement): boolean {
  return img.complete && img.naturalHeight !== 0
}
