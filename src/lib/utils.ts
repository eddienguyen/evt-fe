/**
 * Utility Functions
 * 
 * Helper functions for common operations throughout the application.
 * 
 * @module lib/utils
 */

/**
 * Combines multiple class names into a single string, filtering out falsy values.
 * Useful for conditional className application with Tailwind CSS.
 * 
 * @param classes - Array of class names or falsy values
 * @returns Combined class string
 * 
 * @example
 * ```tsx
 * <div className={cn(
 *   'base-class',
 *   isActive && 'active-class',
 *   isDisabled && 'disabled-class'
 * )} />
 * ```
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Design System Color Token Helpers
 * 
 * These functions provide type-safe access to design system color tokens.
 * They ensure consistent color usage across components.
 */

/**
 * Get a text color class from the design system
 * 
 * @param variant - Text color variant
 * @returns Tailwind text color class
 * 
 * @example
 * ```tsx
 * <p className={getTextColor('light')}>Light text</p>
 * ```
 */
export function getTextColor(
  variant: 'default' | 'light' | 'lighter' | 'white' = 'default'
): string {
  const colors = {
    default: 'text-text',
    light: 'text-text-light',
    lighter: 'text-text-lighter',
    white: 'text-text-white',
  }
  return colors[variant]
}

/**
 * Get a background color class from the design system
 * 
 * @param variant - Background color variant
 * @returns Tailwind background color class
 * 
 * @example
 * ```tsx
 * <div className={getBackgroundColor('light')}>Content</div>
 * ```
 */
export function getBackgroundColor(
  variant: 'light' | 'default' | 'white' = 'default'
): string {
  const colors = {
    light: 'bg-base-light',
    default: 'bg-base',
    white: 'bg-base-white',
  }
  return colors[variant]
}

/**
 * Get an accent color class from the design system
 * 
 * @param variant - Accent color variant
 * @param type - Color type (text, bg, border)
 * @returns Tailwind color class
 * 
 * @example
 * ```tsx
 * <button className={getAccentColor('gold', 'bg')}>Click me</button>
 * ```
 */
export function getAccentColor(
  variant: 'white' | 'gold' | 'gold-light' | 'gold-dark' | 'taupe' | 'taupe-light',
  type: 'text' | 'bg' | 'border' = 'text'
): string {
  const prefix = type === 'text' ? 'text-' : type === 'bg' ? 'bg-' : 'border-'
  return `${prefix}accent-${variant}`
}

/**
 * Format a date string for display
 * 
 * @param dateString - ISO date string
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 * 
 * @example
 * ```tsx
 * formatDate('2025-11-01') // "November 1, 2025"
 * ```
 */
export function formatDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', options).format(date)
  } catch {
    return dateString
  }
}

/**
 * Check if a date is in the past
 * 
 * @param dateString - ISO date string
 * @returns True if date is in the past
 * 
 * @example
 * ```tsx
 * if (isPastDate(event.date)) {
 *   // Show "Event has passed" message
 * }
 * ```
 */
export function isPastDate(dateString: string): boolean {
  try {
    const date = new Date(dateString)
    return date < new Date()
  } catch {
    return false
  }
}

/**
 * Calculate days until a date
 * 
 * @param dateString - ISO date string
 * @returns Number of days until the date (negative if past)
 * 
 * @example
 * ```tsx
 * const daysUntil = getDaysUntil(event.date)
 * // Show countdown: "5 days until the wedding!"
 * ```
 */
export function getDaysUntil(dateString: string): number {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  } catch {
    return 0
  }
}

/**
 * Truncate text to a maximum length with ellipsis
 * 
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 * 
 * @example
 * ```tsx
 * truncate('This is a long message', 10) // "This is..."
 * ```
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

/**
 * Debounce a function to limit execution rate
 * 
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 * 
 * @example
 * ```tsx
 * const handleSearch = debounce((query) => {
 *   // API call
 * }, 300)
 * ```
 */
export function debounce<T extends (...args: never[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Check if code is running in browser environment
 * 
 * @returns True if running in browser
 * 
 * @example
 * ```tsx
 * if (isBrowser()) {
 *   localStorage.setItem('key', 'value')
 * }
 * ```
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

/**
 * Validate email format
 * 
 * @param email - Email string to validate
 * @returns True if email format is valid
 * 
 * @example
 * ```tsx
 * if (!isValidEmail(email)) {
 *   setError('Invalid email format')
 * }
 * ```
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Sleep/delay execution for specified milliseconds
 * 
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after delay
 * 
 * @example
 * ```tsx
 * await sleep(1000) // Wait 1 second
 * ```
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
