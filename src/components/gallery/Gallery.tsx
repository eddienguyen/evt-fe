/**
 * Gallery Container Component
 * 
 * Main gallery component with data fetching, state management, and lightbox.
 * 
 * @module components/gallery/Gallery
 */

import React, { useEffect, useRef, useCallback } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useGalleryData } from '@/hooks/useGalleryData'
import { useLightbox } from '@/hooks/useLightbox'
import GalleryGrid from './GalleryGrid'
import Lightbox from './Lightbox'
import type { GalleryImage } from '@/types/gallery'

export interface GalleryProps {
  /** Pre-loaded images (optional) */
  images?: GalleryImage[]
  /** Enable lazy loading */
  lazy?: boolean
  /** Items per page */
  limit?: number
  /** Additional CSS classes */
  className?: string
}

/**
 * Gallery Component
 * 
 * Complete gallery with image grid, lazy loading, and lightbox.
 * 
 * @example
 * ```tsx
 * <Gallery
 *   lazy={true}
 *   showMetadata={true}
 *   limit={20}
 * />
 * ```
 */
const Gallery: React.FC<GalleryProps> = ({
  images: initialImages,
  lazy = true,
  limit = 20,
  className,
}) => {
  // Gallery data management
  const gallery = useGalleryData({
    limit,
    autoLoad: !initialImages,
  })

  // Use provided images or fetched images
  const images = initialImages || gallery.images

  // Lightbox management
  const lightbox = useLightbox({
    images,
    enableKeyboard: true,
    wrapAround: true,
  })

  // Infinite scroll - load more when reaching bottom
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      if (entry.isIntersecting && gallery.hasMore && !gallery.isLoading) {
        gallery.loadMore()
      }
    },
    [gallery]
  )

  useEffect(() => {
    if (!initialImages && gallery.hasMore) {
      const observer = new IntersectionObserver(handleIntersection, {
        root: null,
        rootMargin: '200px', // Start loading 200px before reaching the sentinel
        threshold: 0,
      })

      const sentinel = loadMoreRef.current
      if (sentinel) {
        observer.observe(sentinel)
      }

      return () => {
        if (sentinel) {
          observer.unobserve(sentinel)
        }
      }
    }
  }, [initialImages, gallery.hasMore, handleIntersection])

  return (
    <div className={cn('w-full', className)}>
      {/* Loading State */}
      {gallery.isLoading && images.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-16 gap-4"
          role="status"
          aria-live="polite"
        >
          <Loader2 className="w-10 h-10 animate-spin text-accent-gold" aria-hidden="true" />
          <p className="text-text-muted">Đang tải hình ảnh...</p>
        </div>
      )}

      {/* Error State */}
      {gallery.error && images.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-16 px-4 text-center"
          role="alert"
        >
          <p className="text-text-muted text-lg mb-2">Không thể tải hình ảnh</p>
          <p className="text-text-secondary text-sm mb-4">{gallery.error}</p>
          <button
            onClick={gallery.refresh}
            className={cn(
              'px-4 py-2 bg-accent-gold text-white rounded-lg',
              'hover:bg-accent-gold-dark transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2'
            )}
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Gallery Grid */}
      {images.length > 0 && (
        <>
          <GalleryGrid
            images={images}
            lazy={lazy}
            onImageClick={lightbox.open}
          />

          {/* Infinite Scroll Sentinel + Loading Indicator */}
          {!initialImages && gallery.hasMore && (
            <div 
              ref={loadMoreRef}
              className="flex justify-center mt-8 py-8"
              role="status"
              aria-live="polite"
            >
              {gallery.isLoading ? (
                <div className="flex items-center gap-2 text-text-muted">
                  <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                  <span>Đang tải thêm hình ảnh...</span>
                </div>
              ) : (
                <div className="text-text-muted text-sm">
                  Cuộn xuống để xem thêm
                </div>
              )}
            </div>
          )}

          {/* End of Gallery Message */}
          {!initialImages && !gallery.hasMore && images.length > 0 && (
            <div className="text-center mt-8 py-4 text-text-muted text-sm">
              Đã hiển thị tất cả {images.length} hình ảnh
            </div>
          )}
        </>
      )}

      {/* Lightbox */}
      {lightbox.isOpen && lightbox.currentImage && (
        <Lightbox
          image={lightbox.currentImage}
          images={images}
          currentIndex={lightbox.currentIndex}
          onClose={lightbox.close}
          onNext={lightbox.next}
          onPrev={lightbox.prev}
          hasNext={lightbox.hasNext}
          hasPrev={lightbox.hasPrev}
        />
      )}
    </div>
  )
}

export default Gallery
