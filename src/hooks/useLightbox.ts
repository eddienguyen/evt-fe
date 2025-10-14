/**
 * Lightbox Hook
 * 
 * Custom hook for managing lightbox state and navigation.
 * 
 * @module hooks/useLightbox
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import type { GalleryImage, LightboxState } from '@/types/gallery'

export interface UseLightboxOptions {
  /** Initial images array */
  images: GalleryImage[]
  /** Enable keyboard navigation */
  enableKeyboard?: boolean
  /** Enable wrap-around navigation */
  wrapAround?: boolean
  /** On close callback */
  onClose?: () => void
  /** On navigate callback */
  onNavigate?: (index: number) => void
}

export interface UseLightboxReturn extends LightboxState {
  /** Open lightbox at specific index */
  open: (index: number) => void
  /** Close lightbox */
  close: () => void
  /** Navigate to next image */
  next: () => void
  /** Navigate to previous image */
  prev: () => void
  /** Navigate to specific index */
  goTo: (index: number) => void
  /** Current image */
  currentImage: GalleryImage | null
  /** Has next image */
  hasNext: boolean
  /** Has previous image */
  hasPrev: boolean
}

/**
 * useLightbox Hook
 * 
 * Manages lightbox state, navigation, and keyboard controls.
 * 
 * @param options - Lightbox options
 * @returns Lightbox state and controls
 * 
 * @example
 * ```tsx
 * const lightbox = useLightbox({
 *   images: galleryImages,
 *   enableKeyboard: true,
 *   wrapAround: false
 * })
 * 
 * <button onClick={() => lightbox.open(0)}>Open Gallery</button>
 * 
 * {lightbox.isOpen && (
 *   <Lightbox
 *     image={lightbox.currentImage}
 *     onClose={lightbox.close}
 *     onNext={lightbox.next}
 *     onPrev={lightbox.prev}
 *   />
 * )}
 * ```
 */
export function useLightbox(options: UseLightboxOptions): UseLightboxReturn {
  const {
    images,
    enableKeyboard = true,
    wrapAround = true,
    onClose,
    onNavigate,
  } = options

  const [state, setState] = useState<LightboxState>({
    isOpen: false,
    currentIndex: 0,
    images,
  })

  // Store images in ref to avoid infinite updates
  const imagesRef = useRef(images)
  const imagesLengthRef = useRef(images.length)
  
  // Update images ref when prop changes
  useEffect(() => {
    imagesRef.current = images
    // Only update state if length changed to avoid unnecessary re-renders
    if (imagesLengthRef.current !== images.length) {
      imagesLengthRef.current = images.length
      setState(prev => ({ ...prev, images }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length]) // Intentionally only track length to avoid infinite loop

  const open = useCallback((index: number) => {
    if (index < 0 || index >= images.length) return

    setState({
      isOpen: true,
      currentIndex: index,
      images,
    })

    // Prevent body scroll
    document.body.style.overflow = 'hidden'
  }, [images])

  const close = useCallback(() => {
    setState(prev => ({
      ...prev,
      isOpen: false,
    }))

    // Restore body scroll
    document.body.style.overflow = ''

    onClose?.()
  }, [onClose])

  const goTo = useCallback((index: number) => {
    if (index < 0 || index >= images.length) return

    setState(prev => ({
      ...prev,
      currentIndex: index,
    }))

    onNavigate?.(index)
  }, [images.length, onNavigate])

  const next = useCallback(() => {
    setState(prev => {
      const nextIndex = prev.currentIndex + 1

      if (nextIndex >= images.length) {
        return wrapAround
          ? { ...prev, currentIndex: 0 }
          : prev
      }

      onNavigate?.(nextIndex)
      return { ...prev, currentIndex: nextIndex }
    })
  }, [images.length, wrapAround, onNavigate])

  const prev = useCallback(() => {
    setState(prev => {
      const prevIndex = prev.currentIndex - 1

      if (prevIndex < 0) {
        return wrapAround
          ? { ...prev, currentIndex: images.length - 1 }
          : prev
      }

      onNavigate?.(prevIndex)
      return { ...prev, currentIndex: prevIndex }
    })
  }, [images.length, wrapAround, onNavigate])

  // Keyboard navigation
  useEffect(() => {
    if (!enableKeyboard || !state.isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          close()
          break
        case 'ArrowLeft':
          prev()
          break
        case 'ArrowRight':
          next()
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enableKeyboard, state.isOpen, close, prev, next])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const currentImage = state.isOpen && state.currentIndex >= 0
    ? images[state.currentIndex] || null
    : null

  const hasNext = wrapAround || state.currentIndex < images.length - 1
  const hasPrev = wrapAround || state.currentIndex > 0

  return {
    ...state,
    open,
    close,
    next,
    prev,
    goTo,
    currentImage,
    hasNext,
    hasPrev,
  }
}
