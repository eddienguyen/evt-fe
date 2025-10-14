/**
 * Countdown Utilities
 * 
 * Helper functions for countdown timer calculations with timezone support.
 * Uses native Date API for lightweight implementation.
 * 
 * @module lib/utils/countdown
 */

/**
 * Time remaining interface
 */
export interface TimeRemaining {
  /** Days remaining */
  days: number
  /** Hours remaining (0-23) */
  hours: number
  /** Minutes remaining (0-59) */
  minutes: number
  /** Seconds remaining (0-59) */
  seconds: number
  /** Total seconds remaining */
  totalSeconds: number
  /** Whether the target date has passed */
  isExpired: boolean
}

/**
 * Countdown configuration
 */
export interface CountdownConfig {
  /** Target date in ISO format or Date object */
  targetDate: string | Date
  /** Timezone offset in hours (default: 7 for Vietnam UTC+7) */
  timezoneOffset?: number
  /** Update interval in milliseconds (default: 1000ms) */
  updateInterval?: number
}

/**
 * Calculate time remaining until target date
 * 
 * @param targetDate - Target date string (ISO format) or Date object
 * @returns TimeRemaining object with days, hours, minutes, seconds
 * 
 * @example
 * ```ts
 * const remaining = calculateTimeRemaining('2025-11-01T07:00:00+07:00')
 * console.log(`${remaining.days} days, ${remaining.hours} hours`)
 * ```
 */
export function calculateTimeRemaining(targetDate: string | Date): TimeRemaining {
  const now = new Date()
  const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate
  
  // Calculate difference in milliseconds
  const diffMs = target.getTime() - now.getTime()
  
  // Check if expired
  if (diffMs <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      isExpired: true
    }
  }
  
  // Convert to time units
  const totalSeconds = Math.floor(diffMs / 1000)
  const days = Math.floor(totalSeconds / (24 * 60 * 60))
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60))
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60)
  const seconds = totalSeconds % 60
  
  return {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
    isExpired: false
  }
}

/**
 * Format number with zero padding
 * 
 * @param num - Number to format
 * @param digits - Number of digits (default: 2)
 * @returns Zero-padded string
 * 
 * @example
 * ```ts
 * padZero(5) // '05'
 * padZero(15) // '15'
 * padZero(3, 3) // '003'
 * ```
 */
export function padZero(num: number, digits: number = 2): string {
  return num.toString().padStart(digits, '0')
}

/**
 * Check if date has passed
 * 
 * @param targetDate - Target date string or Date object
 * @returns True if date has passed
 * 
 * @example
 * ```ts
 * isDateExpired('2024-11-01T07:00:00+07:00') // true
 * isDateExpired('2025-11-01T07:00:00+07:00') // false
 * ```
 */
export function isDateExpired(targetDate: string | Date): boolean {
  const now = new Date()
  const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate
  return target.getTime() <= now.getTime()
}

/**
 * Convert date to Vietnam timezone (UTC+7)
 * 
 * @param date - Date object
 * @returns Date adjusted to Vietnam timezone
 * 
 * @example
 * ```ts
 * const vnTime = toVietnamTime(new Date())
 * ```
 */
export function toVietnamTime(date: Date): Date {
  // Get UTC time
  const utcTime = date.getTime() + (date.getTimezoneOffset() * 60000)
  // Add Vietnam offset (UTC+7)
  return new Date(utcTime + (7 * 3600000))
}

/**
 * Get display text for expired countdown
 * 
 * @param eventLocation - Event location name
 * @returns Celebratory message
 * 
 * @example
 * ```ts
 * getExpiredMessage('Huế') // 'Ngày cưới ở Huế đã đến! 🎉'
 * ```
 */
export function getExpiredMessage(eventLocation: string): string {
  return `Ngày cưới ở ${eventLocation} đã đến! 🎉`
}

/**
 * Format countdown time for screen reader announcement
 * 
 * @param timeRemaining - TimeRemaining object
 * @returns Vietnamese announcement text
 * 
 * @example
 * ```ts
 * formatTimeForScreenReader({ days: 10, hours: 5, minutes: 30, seconds: 45, totalSeconds: 0, isExpired: false })
 * // '10 ngày, 5 giờ, 30 phút còn lại đến ngày cưới'
 * ```
 */
export function formatTimeForScreenReader(timeRemaining: TimeRemaining): string {
  if (timeRemaining.isExpired) {
    return 'Ngày cưới đã đến'
  }
  
  const parts: string[] = []
  
  if (timeRemaining.days > 0) {
    parts.push(`${timeRemaining.days} ngày`)
  }
  if (timeRemaining.hours > 0) {
    parts.push(`${timeRemaining.hours} giờ`)
  }
  if (timeRemaining.minutes > 0) {
    parts.push(`${timeRemaining.minutes} phút`)
  }
  
  return `${parts.join(', ')} còn lại đến ngày cưới`
}

/**
 * Validate if a date string is valid
 * 
 * @param dateString - Date string to validate
 * @returns True if valid
 */
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString)
  return !isNaN(date.getTime())
}

/**
 * Get the earliest upcoming event from multiple dates
 * 
 * @param dates - Array of date strings
 * @returns Earliest upcoming date or null if all expired
 */
export function getEarliestUpcomingDate(dates: (string | Date)[]): Date | null {
  const now = new Date()
  const upcomingDates = dates
    .map(d => typeof d === 'string' ? new Date(d) : d)
    .filter(d => d.getTime() > now.getTime())
    .sort((a, b) => a.getTime() - b.getTime())
  
  return upcomingDates.length > 0 ? upcomingDates[0] : null
}
