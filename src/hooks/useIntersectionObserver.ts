/**
 * Intersection Observer Hook
 * 
 * Detects when an element enters the viewport using Intersection Observer API.
 * Useful for lazy loading and delayed rendering of components.
 * 
 * @module hooks/useIntersectionObserver
 */

import { useEffect, useState, useRef } from 'react'
import type { RefObject } from 'react'

export interface UseIntersectionObserverOptions {
  /**
   * The margin around the root element
   * @default '0px'
   */
  rootMargin?: string
  
  /**
   * Threshold at which to trigger (0-1)
   * @default 0.1
   */
  threshold?: number | number[]
  
  /**
   * Trigger only once and then disconnect
   * @default true
   */
  triggerOnce?: boolean
  
  /**
   * Root element for intersection (null = viewport)
   * @default null
   */
  root?: Element | null
}

export interface UseIntersectionObserverResult<T extends Element> {
  /**
   * Ref to attach to the element to observe
   */
  ref: RefObject<T>
  
  /**
   * Whether the element is currently intersecting
   */
  isIntersecting: boolean
  
  /**
   * Whether the element has ever intersected
   */
  hasIntersected: boolean
  
  /**
   * The IntersectionObserverEntry if available
   */
  entry?: IntersectionObserverEntry
}

/**
 * Hook to detect when an element enters the viewport
 * 
 * @param options - Configuration options for the observer
 * @returns Observer result with ref and intersection state
 * 
 * @example
 * ```tsx
 * const MyComponent: React.FC = () => {
 *   const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
 *     threshold: 0.5,
 *     triggerOnce: true
 *   })
 *   
 *   return (
 *     <div ref={ref}>
 *       {isIntersecting && <HeavyComponent />}
 *     </div>
 *   )
 * }
 * ```
 */
export function useIntersectionObserver<T extends Element = Element>(
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverResult<T> {
  const {
    rootMargin = '0px',
    threshold = 0.1,
    triggerOnce = true,
    root = null
  } = options

  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const [entry, setEntry] = useState<IntersectionObserverEntry>()
  
  const ref = useRef<T>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const element = ref.current
    
    if (!element) return

    // Check if IntersectionObserver is supported
    if (typeof IntersectionObserver === 'undefined') {
      // Fallback: assume always intersecting if not supported
      setIsIntersecting(true)
      setHasIntersected(true)
      return
    }

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const [observerEntry] = entries
      setEntry(observerEntry)
      setIsIntersecting(observerEntry.isIntersecting)
      
      if (observerEntry.isIntersecting) {
        setHasIntersected(true)
        
        // Disconnect if triggerOnce is enabled
        if (triggerOnce && observerRef.current) {
          observerRef.current.disconnect()
          observerRef.current = null
        }
      }
    }

    observerRef.current = new IntersectionObserver(handleIntersection, {
      root,
      rootMargin,
      threshold
    })

    observerRef.current.observe(element)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
    }
  }, [root, rootMargin, threshold, triggerOnce])

  return {
    ref: ref as RefObject<T>,
    isIntersecting,
    hasIntersected,
    entry
  }
}

export default useIntersectionObserver
