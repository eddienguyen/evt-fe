/**
 * Image Loader Component
 * 
 * Progressive image loading component with blur placeholder.
 * 
 * @module components/gallery/ImageLoader
 */

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils/cn'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { useImageLoader } from '@/hooks/useImageLoader'
import ImagePlaceholder from './ImagePlaceholder'
import type { GalleryImage } from '@/types/gallery'

export interface ImageLoaderProps {
  /** Gallery image data */
  image: GalleryImage
  /** Enable lazy loading */
  lazy?: boolean
  /** Image size variant to load */
  size?: 'thumbnail' | 'medium' | 'large' | 'original'
  /** Additional CSS classes */
  className?: string
  /** Image alt text override */
  alt?: string
  /** onClick handler */
  onClick?: () => void
}

/**
 * Image Loader Component
 * 
 * Handles progressive image loading with blur placeholder,
 * lazy loading, and error states.
 * 
 * @example
 * ```tsx
 * <ImageLoader
 *   image={galleryImage}
 *   lazy={true}
 *   size="medium"
 *   onClick={() => openLightbox(index)}
 * />
 * ```
 */
const ImageLoader: React.FC<ImageLoaderProps> = ({
  image,
  lazy = true,
  size = 'medium',
  className,
  alt,
  onClick,
}) => {
  const [shouldLoad, setShouldLoad] = useState(!lazy)

  // Lazy loading with IntersectionObserver
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.01,
    rootMargin: '50px',
    triggerOnce: true,
  })

  useEffect(() => {
    if (lazy && isIntersecting) {
      setShouldLoad(true)
    }
  }, [lazy, isIntersecting])

  // Progressive image loading
  const imageUrl = image.sizes[size]?.url || image.sizes.medium.url
  const placeholderUrl = image.sizes.thumbnail?.url

  const { currentSrc, isLoaded, isLoading, error, retry } = useImageLoader({
    src: imageUrl,
    placeholder: placeholderUrl,
    lazy: !shouldLoad,
  })

  const imageAlt = alt || image.alt || image.caption || 'Gallery image'

  return (
    <div
      ref={ref}
      className={cn('relative overflow-hidden rounded-lg bg-base', className)}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      } : undefined}
    >
      {/* Loading/Error State */}
      {!shouldLoad && (
        <ImagePlaceholder state="loading" aspectRatio={image.metadata.width / image.metadata.height} />
      )}

      {shouldLoad && error && (
        <ImagePlaceholder
          state="error"
          aspectRatio={image.metadata.width / image.metadata.height}
          onRetry={retry}
        />
      )}

      {/* Image */}
      {shouldLoad && !error && (
        <img
          src={currentSrc}
          alt={imageAlt}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
            onClick && 'cursor-pointer'
          )}
          loading={lazy ? 'lazy' : 'eager'}
          decoding="async"
        />
      )}

      {/* Loading overlay */}
      {shouldLoad && isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-base/50">
          <div className="w-6 h-6 border-2 border-accent-gold border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Hover overlay (desktop only) */}
      {onClick && (
        <div
          className={cn(
            'absolute inset-0 bg-black/0 hover:bg-black/10',
            'transition-colors duration-150',
            'hidden md:block'
          )}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

export default ImageLoader
