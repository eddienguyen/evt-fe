/**
 * Image Loader Hook
 * 
 * Custom hook for progressive image loading with blur placeholders.
 * 
 * @module hooks/useImageLoader
 */

import { useState, useEffect } from 'react'
import type { ImageLoadState } from '@/types/gallery'
import { preloadImage } from '@/lib/imageUtils'

export interface UseImageLoaderOptions {
  /** Image URL to load */
  src: string
  /** Placeholder URL (blur or thumbnail) */
  placeholder?: string
  /** Delay before loading (ms) */
  delay?: number
  /** Enable lazy loading */
  lazy?: boolean
}

export interface UseImageLoaderReturn {
  /** Current image source (placeholder or loaded) */
  currentSrc: string
  /** Loading state */
  loadState: ImageLoadState
  /** Whether image is loaded */
  isLoaded: boolean
  /** Whether image is loading */
  isLoading: boolean
  /** Error message if failed */
  error: string | null
  /** Retry loading */
  retry: () => void
}

/**
 * useImageLoader Hook
 * 
 * Handles progressive image loading with placeholders and error handling.
 * 
 * @param options - Image loader options
 * @returns Image loader state and controls
 * 
 * @example
 * ```tsx
 * const { currentSrc, isLoaded, retry } = useImageLoader({
 *   src: 'https://example.com/image.jpg',
 *   placeholder: 'data:image/svg...',
 *   lazy: true
 * })
 * 
 * <img src={currentSrc} className={isLoaded ? 'loaded' : 'loading'} />
 * ```
 */
export function useImageLoader(options: UseImageLoaderOptions): UseImageLoaderReturn {
  const { src, placeholder, delay = 0, lazy = false } = options

  const [loadState, setLoadState] = useState<ImageLoadState>(lazy ? 'idle' : 'loading')
  const [currentSrc, setCurrentSrc] = useState<string>(placeholder || src)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!src) {
      setError('No image source provided')
      setLoadState('error')
      return
    }

    if (lazy) {
      return
    }

    setLoadState('loading')
    setError(null)

    const timer = setTimeout(() => {
      preloadImage(src)
        .then(() => {
          setCurrentSrc(src)
          setLoadState('loaded')
        })
        .catch((err) => {
          setError(err.message || 'Failed to load image')
          setLoadState('error')
        })
    }, delay)

    return () => clearTimeout(timer)
  }, [src, lazy, delay])

  const retry = () => {
    if (!src) return

    setLoadState('loading')
    setError(null)

    preloadImage(src)
      .then(() => {
        setCurrentSrc(src)
        setLoadState('loaded')
      })
      .catch((err) => {
        setError(err.message || 'Failed to load image')
        setLoadState('error')
      })
  }

  return {
    currentSrc,
    loadState,
    isLoaded: loadState === 'loaded',
    isLoading: loadState === 'loading',
    error,
    retry,
  }
}

/**
 * useProgressiveImage Hook
 * 
 * Simplified hook for progressive image loading.
 * 
 * @param src - Image URL
 * @param placeholder - Placeholder URL
 * @returns Current image source and loaded state
 */
export function useProgressiveImage(src: string, placeholder?: string) {
  const { currentSrc, isLoaded } = useImageLoader({
    src,
    placeholder,
    lazy: false,
  })

  return {
    src: currentSrc,
    isLoaded,
  }
}
