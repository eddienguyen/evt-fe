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
  const previousImageCount = useRef<number>(0)
  const animatedIds = useRef<Set<string>>(new Set())

  // ScrollTrigger animations for gallery items - only animate NEW items
  useEffect(() => {
    if (reducedMotion || !gridRef.current || images.length === 0) return

    const grid = gridRef.current
    const allItems = grid.querySelectorAll('[role="listitem"]')
    
    // Filter out items that have already been animated
    const newItems = Array.from(allItems).filter((item) => {
      const itemId = (item as HTMLElement).dataset.imageId
      if (!itemId) return false
      
      const isNew = !animatedIds.current.has(itemId)
      if (isNew) {
        animatedIds.current.add(itemId)
      }
      return isNew
    })

    // Only animate if there are new items
    if (newItems.length === 0) return

    // For initial load, animate all items with stagger
    // For infinite scroll loads, animate only new items with simpler animation
    const isInitialLoad = previousImageCount.current === 0
    
    if (isInitialLoad) {
      // Initial load: full stagger animation
      gsap.fromTo(
        newItems,
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
    } else {
      // Infinite scroll: simple fade-in for new items only (no y-translation to prevent jump)
      gsap.fromTo(
        newItems,
        {
          opacity: 0,
          scale: 0.98,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: 'power2.out',
          stagger: 0.05, // Quick stagger for smooth appearance
        }
      )
    }

    previousImageCount.current = images.length

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === grid) {
          trigger.kill()
        }
      })
    }
  }, [images.length, reducedMotion]) // Only depend on images.length, not images array

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

  // Generate subtle random rotations for polaroid effect
  const getRandomRotation = (index: number) => {
    const rotations = ['-rotate-1', 'rotate-0', 'rotate-1', '-rotate-2', 'rotate-2']
    return rotations[index % rotations.length]
  }

  return (
    <div
      ref={gridRef}
      className={cn(
        // CSS Grid layout - fills left-to-right, row-by-row
        // Mobile: 2 columns, Tablet: 3 columns, Desktop: 4 columns
        'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
        'gap-4 sm:gap-6',
        // Auto-fit rows with content-based height
        'auto-rows-auto',
        className
      )}
      role="list"
      aria-label="Bộ sưu tập hình ảnh"
    >
      {images.map((image, index) => (
        <div 
          key={image.id}
          data-image-id={image.id}
          role="listitem"
          className={cn(
            // Grid item - each image is a self-contained grid cell
            'w-full',
            // Add random rotation for polaroid effect
            getRandomRotation(index)
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
