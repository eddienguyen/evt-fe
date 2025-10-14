/**
 * Smooth Scroll Hooks
 * 
 * Custom React hooks for smooth scroll functionality.
 * 
 * @module hooks/useSmoothScroll
 */

import { useContext } from 'react'
import type { SmoothScrollContextValue } from '@/types/scroll'
import { SmoothScrollContext } from '@/contexts/SmoothScrollContext'

/**
 * Hook to use smooth scroll context
 * 
 * @example
 * ```tsx
 * const { scrollTo, isEnabled, scrollProgress } = useSmoothScroll()
 * 
 * const handleScrollToTop = () => {
 *   scrollTo(0, { duration: 1, offset: 0 })
 * }
 * ```
 */
export function useSmoothScroll(): SmoothScrollContextValue {
  const context = useContext(SmoothScrollContext)
  
  if (!context) {
    throw new Error('useSmoothScroll must be used within a SmoothScrollProvider')
  }
  
  return context
}

/**
 * Hook to check if smooth scroll is available
 * 
 * @example
 * ```tsx
 * const isAvailable = useSmoothScrollAvailable()
 * 
 * if (isAvailable) {
 *   // Use smooth scroll features
 * }
 * ```
 */
export function useSmoothScrollAvailable(): boolean {
  const context = useContext(SmoothScrollContext)
  return context ? context.isEnabled : false
}