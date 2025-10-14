/**
 * Date Formatting Utilities
 * 
 * Helper functions for formatting dates in Vietnamese locale
 * with proper screen reader support.
 * 
 * @module lib/utils/date
 */

/**
 * Vietnamese month names
 */
const VIETNAMESE_MONTHS = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
  'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
  'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
]

/**
 * Format date for Vietnamese display
 * 
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @returns Formatted date string (e.g., "15 Tháng 3, 2020")
 * 
 * @example
 * ```ts
 * formatVietnameseDate('2020-03-15') // "15 Tháng 3, 2020"
 * ```
 */
export function formatVietnameseDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = VIETNAMESE_MONTHS[date.getMonth()]
    const year = date.getFullYear()
    
    return `${day} ${month}, ${year}`
  } catch (error) {
    console.error('Error formatting date:', error)
    return dateString
  }
}

/**
 * Format date for screen readers
 * 
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @returns Screen reader friendly date string
 * 
 * @example
 * ```ts
 * formatDateForScreenReader('2020-03-15') // "15 Tháng 3 năm 2020"
 * ```
 */
export function formatDateForScreenReader(dateString: string): string {
  try {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = VIETNAMESE_MONTHS[date.getMonth()]
    const year = date.getFullYear()
    
    return `${day} ${month} năm ${year}`
  } catch (error) {
    console.error('Error formatting date for screen reader:', error)
    return dateString
  }
}

/**
 * Parse ISO date string to Date object
 * 
 * @param dateString - ISO date string
 * @returns Date object
 */
export function parseDate(dateString: string): Date {
  return new Date(dateString)
}

/**
 * Get relative time string (e.g., "2 years ago")
 * 
 * @param dateString - ISO date string
 * @returns Relative time string in Vietnamese
 */
export function getRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Hôm nay'
    if (diffInDays === 1) return 'Hôm qua'
    if (diffInDays < 30) return `${diffInDays} ngày trước`
    if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30)
      return `${months} tháng trước`
    }
    
    const years = Math.floor(diffInDays / 365)
    return `${years} năm trước`
  } catch (error) {
    console.error('Error getting relative time:', error)
    return ''
  }
}
