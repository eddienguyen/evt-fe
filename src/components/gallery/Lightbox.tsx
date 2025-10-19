/**
 * Lightbox Component
 * 
 * Full-screen image viewer with navigation and animations.
 * 
 * @module components/gallery/Lightbox
 */

import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { cn } from '@/lib/utils/cn'
import { prefersReducedMotion } from '@/lib/a11y'
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation'
import LightboxControls from './LightboxControls'
import type { GalleryImage } from '@/types/gallery'

export interface LightboxProps {
  /** Current image to display */
  image: GalleryImage
  /** All images in gallery */
  images: GalleryImage[]
  /** Current image index */
  currentIndex: number
  /** Close handler */
  onClose: () => void
  /** Previous image handler */
  onPrev?: () => void
  /** Next image handler */
  onNext?: () => void
  /** Has previous image */
  hasPrev?: boolean
  /** Has next image */
  hasNext?: boolean
}

/**
 * Lightbox Component
 * 
 * Displays full-screen image with navigation controls and animations.
 * Uses GSAP for smooth open/close animations.
 * 
 * @example
 * ```tsx
 * <Lightbox
 *   image={currentImage}
 *   images={allImages}
 *   currentIndex={2}
 *   onClose={closeLightbox}
 *   onNext={nextImage}
 *   onPrev={prevImage}
 *   hasNext={true}
 *   hasPrev={true}
 * />
 * ```
 */
const Lightbox: React.FC<LightboxProps> = ({
  image,
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
  hasPrev = true,
  hasNext = true,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const reducedMotion = prefersReducedMotion()

  // Keyboard navigation
  useKeyboardNavigation({
    enabled: true,
    onClose,
    onNext: hasNext ? onNext : undefined,
    onPrev: hasPrev ? onPrev : undefined,
  })

  // Open animation
  useEffect(() => {
    if (reducedMotion || !overlayRef.current || !imageRef.current) return

    const tl = gsap.timeline()

    tl.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.25, ease: 'power2.out' }
    ).fromTo(
      imageRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.25, ease: 'power2.out' },
      '-=0.1'
    )

    return () => {
      tl.kill()
    }
  }, [reducedMotion])

  // Close with animation
  const handleClose = () => {
    if (reducedMotion || !overlayRef.current || !imageRef.current) {
      onClose()
      return
    }

    const tl = gsap.timeline({
      onComplete: onClose,
    })

    tl.to(imageRef.current, {
      opacity: 0,
      scale: 0.9,
      duration: 0.2,
      ease: 'power2.in',
    }).to(
      overlayRef.current,
      { opacity: 0, duration: 0.2, ease: 'power2.in' },
      '-=0.1'
    )
  }

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // Focus management
  useEffect(() => {
    const handleFocusTrap = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        // Simple focus trap - could be enhanced
        const focusableElements = overlayRef.current?.querySelectorAll(
          'button, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusableElements || focusableElements.length === 0) return

        const firstElement = focusableElements[0] as HTMLElement
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    window.addEventListener('keydown', handleFocusTrap)
    return () => window.removeEventListener('keydown', handleFocusTrap)
  }, [])

  const lightboxContent = (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      {/* Navigation Arrows */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onPrev?.()
          }}
          disabled={!hasPrev}
          className={cn(
            'fixed left-4 top-1/2 -translate-y-1/2 z-[10000]',
            'w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm',
            'flex items-center justify-center',
            'text-white hover:bg-black/70 transition-colors',
            'disabled:opacity-30 disabled:cursor-not-allowed',
            'focus:outline-none focus:ring-2 focus:ring-white/50'
          )}
          aria-label="Previous image"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onNext?.()
          }}
          disabled={!hasNext}
          className={cn(
            'fixed right-4 top-1/2 -translate-y-1/2 z-[10000]',
            'w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm',
            'flex items-center justify-center',
            'text-white hover:bg-black/70 transition-colors',
            'disabled:opacity-30 disabled:cursor-not-allowed',
            'focus:outline-none focus:ring-2 focus:ring-white/50'
          )}
          aria-label="Next image"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleClose()
          }}
          className={cn(
            'fixed top-4 right-4 z-[10000]',
            'w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm',
            'flex items-center justify-center',
            'text-white hover:bg-black/70 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-white/50'
          )}
          aria-label="Close lightbox"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Image Container */}
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center',
          // Mobile: minimal horizontal padding (touch areas are only 64px wide)
          'p-0',
          // Desktop: more generous padding
          'md:p-8 md:pt-20 md:pb-24'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          ref={imageRef}
          src={image.sizes.large.url}
          alt={image.alt}
          className={cn(
            // Ensure full image is visible without cropping
            'w-full h-full object-contain',
            'rounded-lg shadow-2xl'
          )}
          style={{
            // Prevent image from being cut off
            maxWidth: '100%',
            maxHeight: '100%',
          }}
          loading="eager"
        />
      </div>

      {/* Metadata removed - images only in lightbox */}

      {/* Screen reader announcements */}
      <div className="sr-only" role="status" aria-live="polite">
        Đang xem ảnh {currentIndex + 1} của {images.length}.{' '}
        {image.alt}
        {image.caption && `. ${image.caption}`}
      </div>
    </div>
  )

  // Render to portal
  return createPortal(lightboxContent, document.body)
}

export default Lightbox
