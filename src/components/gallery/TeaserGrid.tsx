/**
 * Teaser Grid Component
 * 
 * Grid layout component for displaying featured gallery images
 * with responsive design and scroll animations.
 * 
 * @module components/gallery/TeaserGrid
 */

import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils/cn'
import { prefersReducedMotion } from '@/lib/a11y'
import TeaserImage from './TeaserImage'
import type { GalleryImage } from '@/types/gallery'

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger)

export interface TeaserGridProps {
  /** Gallery images to display */
  images: GalleryImage[]
  /** Enable GSAP scroll animations */
  enableAnimations?: boolean
  /** Image click handler */
  onImageClick: (imageId: string, index: number) => void
  /** Additional CSS classes */
  className?: string
}

/**
 * Teaser Grid Component
 * 
 * Displays featured gallery images in a responsive grid layout.
 * - Mobile: 1 column (shows first 3 images)
 * - Desktop: 3 columns (shows all 6 images)
 * 
 * @example
 * ```tsx
 * <TeaserGrid
 *   imageCount={6}
 *   enableAnimations={true}
 *   onImageClick={(id, index) => navigate('/gallery')}
 * />
 * ```
 */
const TeaserGrid: React.FC<TeaserGridProps> = ({
  images,
  enableAnimations = true,
  onImageClick,
  className
}) => {
  const gridRef = useRef<HTMLDivElement>(null)

  /**
   * Setup GSAP stagger animations for grid items
   */
  useEffect(() => {
    if (!enableAnimations || prefersReducedMotion()) return

    const grid = gridRef.current
    if (!grid) return

    // Find all image items within the grid
    const imageItems = grid.querySelectorAll('[data-teaser-image]')
    if (imageItems.length === 0) return

    // Create stagger animation
    gsap.fromTo(imageItems,
      {
        opacity: 0,
        y: 50,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: grid,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        }
      }
    )

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === grid) {
          trigger.kill()
        }
      })
    }
  }, [enableAnimations, images.length])

  if (images.length === 0) {
    return (
      <div className={cn("text-center py-12", className)}>
        <p className="text-text-lighter italic">
          Không có hình ảnh nào để hiển thị
        </p>
      </div>
    )
  }

  return (
    <div 
      ref={gridRef}
      className={cn(
        // Base grid layout
        "grid gap-6",
        // Responsive columns: 1 on mobile, 3 on desktop
        "grid-cols-1 md:grid-cols-3",
        // Mobile: show only first 3 images
        "md:grid-cols-3",
        className
      )}
      role="grid"
      aria-label="Ảnh nổi bật từ album cưới"
    >
      {images.map((image, index) => (
        <div
          key={image.id}
          className={cn(
            // Hide images beyond 3rd on mobile
            index >= 3 && "hidden md:block"
          )}
          role="gridcell"
        >
          <TeaserImage
            image={image}
            index={index}
            onClick={onImageClick}
            data-teaser-image // For GSAP animation targeting
          />
        </div>
      ))}
    </div>
  )
}

export default TeaserGrid