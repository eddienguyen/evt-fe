/**
 * useReducedMotion Hook
 * 
 * Detects user's reduced motion preference for accessibility.
 * Respects prefers-reduced-motion media query.
 * 
 * @module components/wishes/hooks/useReducedMotion
 */

import { useState, useEffect } from 'react'

/**
 * useReducedMotion Hook
 * 
 * Checks if user prefers reduced motion for accessibility.
 * 
 * @returns Whether reduced motion is preferred
 * 
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion()
 * 
 * if (prefersReducedMotion) {
 *   return <StaticLayout />
 * }
 * return <AnimatedLayout />
 * ```
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Check if browser supports matchMedia
    if (!globalThis.window?.matchMedia) {
      return
    }

    const mediaQuery = globalThis.window.matchMedia('(prefers-reduced-motion: reduce)')
    
    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches)

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    // Add listener
    mediaQuery.addEventListener('change', handleChange)

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return prefersReducedMotion
}

export default useReducedMotion
