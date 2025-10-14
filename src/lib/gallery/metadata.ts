/**
 * Gallery Metadata Utilities
 * 
 * Utilities for handling image metadata, captions, and EXIF data.
 * 
 * @module lib/gallery/metadata
 */

import type { GalleryImage } from '@/types/gallery'

/**
 * Format image date for display
 * 
 * @param dateString - ISO date string
 * @param locale - Locale string (default: 'vi-VN')
 * @returns Formatted date string
 */
export function formatImageDate(dateString: string, locale: string = 'vi-VN'): string {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  } catch {
    return dateString
  }
}

/**
 * Generate alt text from image metadata
 * 
 * @param image - Gallery image
 * @returns Alt text string
 */
export function generateAltText(image: GalleryImage): string {
  if (image.alt) return image.alt
  
  const parts: string[] = []
  
  if (image.category) {
    parts.push(image.category)
  }
  
  if (image.caption) {
    parts.push(image.caption)
  } else {
    parts.push('Wedding photo')
  }
  
  if (image.metadata.location) {
    parts.push(`at ${image.metadata.location}`)
  }
  
  return parts.join(' ')
}

/**
 * Extract category display name
 * 
 * @param category - Category slug
 * @returns Display name
 */
export function getCategoryDisplayName(category: string): string {
  const categoryMap: Record<string, string> = {
    'engagement': 'Chụp Ảnh Cưới',
    'ceremony': 'Lễ Cưới',
    'reception': 'Tiệc Cưới',
    'candid': 'Khoảnh Khắc',
    'family': 'Gia Đình',
    'couple': 'Cô Dâu & Chú Rể',
    'guests': 'Khách Mời',
    'venue': 'Địa Điểm',
    'details': 'Chi Tiết',
  }
  
  return categoryMap[category] || category
}

/**
 * Format metadata for screen readers
 * 
 * @param image - Gallery image
 * @returns Screen reader text
 */
export function formatMetadataForScreenReader(image: GalleryImage): string {
  const parts: string[] = []
  
  if (image.caption) {
    parts.push(image.caption)
  }
  
  if (image.metadata.capturedDate) {
    parts.push(`Chụp ngày ${formatImageDate(image.metadata.capturedDate)}`)
  }
  
  if (image.metadata.location) {
    parts.push(`tại ${image.metadata.location}`)
  }
  
  parts.push(`Kích thước: ${image.metadata.width}x${image.metadata.height} pixels`)
  
  return parts.join('. ')
}

/**
 * Group images by category
 * 
 * @param images - Array of gallery images
 * @returns Record of category to images
 */
export function groupImagesByCategory(images: GalleryImage[]): Record<string, GalleryImage[]> {
  return images.reduce((acc, image) => {
    const category = image.category || 'uncategorized'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(image)
    return acc
  }, {} as Record<string, GalleryImage[]>)
}

/**
 * Sort images by date
 * 
 * @param images - Array of gallery images
 * @param direction - Sort direction ('asc' | 'desc')
 * @returns Sorted images
 */
export function sortImagesByDate(
  images: GalleryImage[],
  direction: 'asc' | 'desc' = 'desc'
): GalleryImage[] {
  return [...images].sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return direction === 'asc' ? dateA - dateB : dateB - dateA
  })
}

/**
 * Filter images by search query
 * 
 * @param images - Array of gallery images
 * @param query - Search query
 * @returns Filtered images
 */
export function filterImagesByQuery(images: GalleryImage[], query: string): GalleryImage[] {
  if (!query || query.trim() === '') return images
  
  const lowerQuery = query.toLowerCase()
  
  return images.filter(image => {
    return (
      image.alt.toLowerCase().includes(lowerQuery) ||
      image.caption?.toLowerCase().includes(lowerQuery) ||
      image.category.toLowerCase().includes(lowerQuery) ||
      image.metadata.location?.toLowerCase().includes(lowerQuery)
    )
  })
}

/**
 * Get unique categories from images
 * 
 * @param images - Array of gallery images
 * @returns Array of unique categories
 */
export function getUniqueCategories(images: GalleryImage[]): string[] {
  const categories = new Set(images.map(img => img.category))
  return Array.from(categories).sort()
}

/**
 * Calculate image index in filtered/sorted array
 * 
 * @param image - Gallery image
 * @param images - Array of all images
 * @returns Image index or -1
 */
export function getImageIndex(image: GalleryImage, images: GalleryImage[]): number {
  return images.findIndex(img => img.id === image.id)
}
