/**
 * Lightbox Controls Component
 * 
 * Navigation controls for lightbox (prev, next, close).
 * 
 * @module components/gallery/LightboxControls
 */

import React from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export interface LightboxControlsProps {
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
  /** Current index */
  currentIndex: number
  /** Total images */
  totalImages: number
}

/**
 * Lightbox Controls Component
 * 
 * Renders navigation buttons for lightbox.
 * 
 * @example
 * ```tsx
 * <LightboxControls
 *   onClose={closeLightbox}
 *   onPrev={prevImage}
 *   onNext={nextImage}
 *   hasPrev={true}
 *   hasNext={true}
 *   currentIndex={2}
 *   totalImages={10}
 * />
 * ```
 */
const LightboxControls: React.FC<LightboxControlsProps> = ({
  onClose,
  onPrev,
  onNext,
  hasPrev = true,
  hasNext = true,
  currentIndex,
  totalImages,
}) => {
  const buttonClasses = cn(
    'p-3 bg-black/50 backdrop-blur-sm text-white rounded-full',
    'hover:bg-black/70 transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black',
    'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-black/50'
  )

  return (
    <>
      {/* Close Button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        className={cn(
          buttonClasses,
          'fixed top-4 right-4 z-50'
        )}
        aria-label="Đóng"
      >
        <X className="w-6 h-6" aria-hidden="true" />
      </button>

      {/* Previous Button */}
      {onPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onPrev()
          }}
          disabled={!hasPrev}
          className={cn(
            buttonClasses,
            'fixed left-4 top-1/2 -translate-y-1/2 z-50',
            'hidden md:block'
          )}
          aria-label="Ảnh trước"
        >
          <ChevronLeft className="w-6 h-6" aria-hidden="true" />
        </button>
      )}

      {/* Next Button */}
      {onNext && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onNext()
          }}
          disabled={!hasNext}
          className={cn(
            buttonClasses,
            'fixed right-4 top-1/2 -translate-y-1/2 z-50',
            'hidden md:block'
          )}
          aria-label="Ảnh tiếp theo"
        >
          <ChevronRight className="w-6 h-6" aria-hidden="true" />
        </button>
      )}

      {/* Image Counter */}
      <div
        className={cn(
          'fixed bottom-4 left-1/2 -translate-x-1/2 z-50',
          'px-4 py-2 bg-black/50 backdrop-blur-sm text-white rounded-full',
          'text-sm font-medium'
        )}
        role="status"
        aria-live="polite"
      >
        {currentIndex + 1} / {totalImages}
      </div>

      {/* Mobile Touch Areas */}
      <div className="md:hidden">
        {/* Left Touch Area */}
        {onPrev && hasPrev && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onPrev()
            }}
            className="fixed left-0 top-0 bottom-0 w-1/3 z-40"
            aria-label="Ảnh trước"
          >
            <span className="sr-only">Ảnh trước</span>
          </button>
        )}

        {/* Right Touch Area */}
        {onNext && hasNext && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onNext()
            }}
            className="fixed right-0 top-0 bottom-0 w-1/3 z-40"
            aria-label="Ảnh tiếp theo"
          >
            <span className="sr-only">Ảnh tiếp theo</span>
          </button>
        )}
      </div>
    </>
  )
}

export default LightboxControls
