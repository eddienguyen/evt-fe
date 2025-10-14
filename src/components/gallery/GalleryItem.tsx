/**
 * Gallery Item Component
 * 
 * Individual gallery image card with metadata and click handling.
 * 
 * @module components/gallery/GalleryItem
 */

import React from 'react'
import { cn } from '@/lib/utils/cn'
import ImageLoader from './ImageLoader'
import type { GalleryImage } from '@/types/gallery'

export interface GalleryItemProps {
  /** Gallery image data */
  image: GalleryImage
  /** Item index */
  index: number
  /** Enable lazy loading */
  lazy?: boolean
  /** Show metadata overlay */
  showMetadata?: boolean
  /** Click handler */
  onClick?: (index: number) => void
  /** Additional CSS classes */
  className?: string
}

/**
 * Gallery Item Component
 * 
 * Displays a single gallery image with optional metadata overlay
 * and click handling for lightbox.
 * 
 * @example
 * ```tsx
 * <GalleryItem
 *   image={galleryImage}
 *   index={0}
 *   lazy={true}
 *   showMetadata={true}
 *   onClick={(index) => openLightbox(index)}
 * />
 * ```
 */
const GalleryItem: React.FC<GalleryItemProps> = ({
  image,
  index,
  lazy = true,
  showMetadata = false,
  onClick,
  className,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(index)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && onClick) {
      e.preventDefault()
      onClick(index)
    }
  }

  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded-lg bg-white shadow-md',
        'hover:shadow-lg transition-shadow duration-150',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick ? handleClick : undefined}
      onKeyPress={onClick ? handleKeyPress : undefined}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      aria-label={`Xem ảnh: ${image.caption || image.alt}`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <ImageLoader
          image={image}
          lazy={lazy}
          size="medium"
          className="w-full h-full"
        />

        {/* Metadata Overlay (Desktop only) */}
        {showMetadata && image.caption && (
          <div
            className={cn(
              'absolute bottom-0 left-0 right-0 p-3',
              'bg-gradient-to-t from-black/70 to-transparent',
              'transform translate-y-full group-hover:translate-y-0',
              'transition-transform duration-200 ease-out',
              'hidden md:block'
            )}
          >
            <p className="text-sm text-white font-medium line-clamp-2">
              {image.caption}
            </p>
            {image.metadata.location && (
              <p className="text-xs text-white/80 mt-1">
                {image.metadata.location}
              </p>
            )}
          </div>
        )}

        {/* Focus indicator */}
        {onClick && (
          <div
            className={cn(
              'absolute inset-0 pointer-events-none',
              'ring-2 ring-accent-gold ring-offset-2 ring-offset-white',
              'opacity-0 focus-visible:opacity-100',
              'transition-opacity duration-150'
            )}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Mobile metadata (always visible) */}
      {showMetadata && image.caption && (
        <div className="p-3 md:hidden">
          <p className="text-sm text-text font-medium line-clamp-2">
            {image.caption}
          </p>
          {image.metadata.location && (
            <p className="text-xs text-text-muted mt-1">
              {image.metadata.location}
            </p>
          )}
        </div>
      )}

      {/* Screen reader only content */}
      <div className="sr-only">
        <p>{image.alt}</p>
        {image.caption && <p>{image.caption}</p>}
        {image.metadata.location && <p>Địa điểm: {image.metadata.location}</p>}
        {image.metadata.capturedDate && <p>Ngày chụp: {image.metadata.capturedDate}</p>}
      </div>
    </article>
  )
}

export default GalleryItem
