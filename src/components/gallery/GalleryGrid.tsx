/**
 * Gallery Grid Component
 * 
 * Responsive grid layout for gallery images with ScrollTrigger animations.
 * 
 * @module components/gallery/GalleryGrid
 */

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils/cn'
import { prefersReducedMotion } from '@/lib/a11y'
import GalleryItem from './GalleryItem'
import type { GalleryImage } from '@/types/gallery'

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger)

export interface GalleryGridProps {
  /** Array of gallery images */
  images: GalleryImage[]
  /** Enable lazy loading */
  lazy?: boolean
  /** Click handler for images */
  onImageClick?: (index: number) => void
  /** Additional CSS classes */
  className?: string
}

/**
 * Gallery Grid Component
 * 
 * Displays gallery images in a responsive grid layout.
 * - Mobile: 1 column
 * - Tablet: 2-3 columns
 * - Desktop: 3-4 columns
 * 
 * @example
 * ```tsx
 * <GalleryGrid
 *   images={galleryImages}
 *   lazy={true}
 *   showMetadata={true}
 *   onImageClick={(index) => openLightbox(index)}
 * />
 * ```
 */
const GalleryGrid: React.FC<GalleryGridProps> = ({
  images,
  lazy = true,
  onImageClick,
  className,
}) => {
  const gridRef = useRef<HTMLDivElement>(null)
  const reducedMotion = prefersReducedMotion()

  // ScrollTrigger animations for gallery items
  useEffect(() => {
    if (reducedMotion || !gridRef.current || images.length === 0) return

    const grid = gridRef.current
    const items = grid.querySelectorAll('[role="listitem"]')
    
    // Stagger animation for grid items
    gsap.fromTo(
      items,
      {
        opacity: 0,
        y: 50,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'power2.out',
        stagger: {
          amount: 0.4,
          from: 'start',
        },
        scrollTrigger: {
          trigger: grid,
          start: 'top bottom-=100',
          end: 'bottom center',
          toggleActions: 'play none none none',
        },
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === grid) {
          trigger.kill()
        }
      })
    }
  }, [images, reducedMotion])

  if (images.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 px-4 text-center"
        role="status"
        aria-live="polite"
      >
        <p className="text-text-muted text-lg">Không có hình ảnh nào</p>
        <p className="text-text-secondary text-sm mt-2">
          Hình ảnh sẽ được cập nhật sớm
        </p>
      </div>
    )
  }

  return (
    <div
      ref={gridRef}
      className={cn(
        // Column-based masonry layout (Pinterest-style)
        'columns-2 sm:columns-3 lg:columns-4',
        'gap-3 sm:gap-4',
        className
      )}
      role="list"
      aria-label="Bộ sưu tập hình ảnh"
    >
      {images.map((image, index) => (
        <div 
          key={image.id} 
          role="listitem"
          className={cn(
            // Break-inside-avoid keeps items intact in columns
            'break-inside-avoid',
            'mb-3 sm:mb-4'
          )}
        >
          <GalleryItem
            image={image}
            index={index}
            lazy={lazy}
            showMetadata={false} // Hide metadata on cards
            onClick={onImageClick}
          />
        </div>
      ))}
    </div>
  )
}

export default GalleryGrid
