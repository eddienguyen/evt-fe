/**
 * Teaser Image Component
 * 
 * Individual image component for gallery teaser with progressive loading,
 * hover effects, and click handling.
 * 
 * @module components/gallery/TeaserImage
 */

import React from 'react'
import { cn } from '@/lib/utils/cn'
import { prefersReducedMotion } from '@/lib/a11y'
import { ImageLoader } from '@/components/gallery'
import type { GalleryImage } from '@/types/gallery'

export interface TeaserImageProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /** Gallery image data */
  image: GalleryImage
  /** Image index for navigation */
  index: number
  /** Click handler */
  onClick: (imageId: string, index: number) => void
  /** Additional CSS classes */
  className?: string
}

/**
 * Teaser Image Component
 * 
 * Displays a single gallery image with progressive loading,
 * hover effects, and click handling for navigation.
 * 
 * @example
 * ```tsx
 * <TeaserImage
 *   image={galleryImage}
 *   index={0}
 *   onClick={(id, index) => navigate('/gallery')}
 * />
 * ```
 */
const TeaserImage: React.FC<TeaserImageProps> = ({
  image,
  index,
  onClick,
  className,
  ...props
}) => {
  const reducedMotion = prefersReducedMotion()

  /**
   * Handle image click
   */
  const handleClick = () => {
    onClick(image.id, index)
  }

  /**
   * Handle keyboard interaction
   */
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick(image.id, index)
    }
  }

  return (
    <div
      className={cn(
        // Polaroid frame styling
        "relative bg-base-light p-3 pb-12 shadow-lg",
        "cursor-pointer group",
        // Hover effects (only if motion is allowed)
        !reducedMotion && [
          "transition-all duration-300 ease-smooth",
          "hover:shadow-2xl hover:-rotate-1 hover:scale-[1.02]"
        ],
        // Focus styles for accessibility
        "focus-within:ring-2 focus-within:ring-accent-gold focus-within:ring-offset-2 focus-within:outline-none",
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Xem hình ảnh: ${image.alt}`}
      {...props}
    >
      {/* Image Container - Natural dimensions for masonry */}
      <div className="relative overflow-hidden bg-base-dark/5">
        <ImageLoader
          image={image}
          size="medium"
          lazy={true}
          className={cn(
            "w-full h-auto block",
            // Subtle zoom effect on hover
            !reducedMotion && [
              "transition-transform duration-300 ease-smooth",
              "group-hover:scale-105"
            ]
          )}
          alt={image.alt}
        />
        {/* Subtle inner shadow for depth */}
        <div className="absolute rounded-lg inset-0 shadow-[inset_0_0_4px_rgba(0,0,0,.3)]" />
      </div>

      {/* Optional: Image number indicator for accessibility */}
      <div className="sr-only">
        Hình ảnh {index + 1} trong album cưới
      </div>
    </div>
  )
}

export default TeaserImage