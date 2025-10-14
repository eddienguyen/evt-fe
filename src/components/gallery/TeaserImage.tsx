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
        // Base styling
        "relative bg-white rounded-lg shadow-soft overflow-hidden",
        "cursor-pointer group",
        // Hover effects (only if motion is allowed)
        !reducedMotion && [
          "transition-all duration-250 ease-smooth",
          "hover:scale-105 hover:shadow-medium"
        ],
        // Focus styles for accessibility
        "focus-within:ring-2 focus-within:ring-accent-gold focus-within:ring-offset-2",
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Xem hình ảnh: ${image.alt}`}
      {...props}
    >
      {/* Image Container */}
      <div className="aspect-[4/3] overflow-hidden">
        <ImageLoader
          image={image}
          size="medium"
          lazy={true}
          className={cn(
            "w-full h-full object-cover",
            // Subtle zoom effect on hover
            !reducedMotion && [
              "transition-transform duration-250 ease-smooth",
              "group-hover:scale-110"
            ]
          )}
          alt={image.alt}
        />
      </div>

      {/* Overlay for better hover indication */}
      <div 
        className={cn(
          "absolute inset-0 bg-black/0 transition-colors duration-250",
          !reducedMotion && "group-hover:bg-black/10"
        )}
        aria-hidden="true"
      />

      {/* Optional: Image number indicator for accessibility */}
      <div className="sr-only">
        Hình ảnh {index + 1} trong album cưới
      </div>
    </div>
  )
}

export default TeaserImage