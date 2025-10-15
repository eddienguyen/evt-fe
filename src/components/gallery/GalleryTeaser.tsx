/**
 * Gallery Teaser Component
 * 
 * Main teaser section displaying featured photos from the wedding gallery
 * with lightbox preview and CTA to view full gallery with GSAP scroll animations.
 * 
 * @module components/gallery/GalleryTeaser
 */

import React, { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils/cn'
import { prefersReducedMotion } from '@/lib/a11y'
import { Button } from '@/components/ui/Button'
import { useLightbox } from '@/hooks/useLightbox'
import { getFeaturedImages } from '@/config/album'
import TeaserGrid from './TeaserGrid'
import Lightbox from './Lightbox'

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger)

export interface GalleryTeaserProps {
  /** Number of images to display (3-6) */
  imageCount?: number
  /** Enable GSAP scroll animations */
  enableAnimations?: boolean
  /** Custom featured image IDs to override default selection */
  featuredImages?: string[]
  /** Additional CSS classes */
  className?: string
}

/**
 * Gallery Teaser Component
 * 
 * Displays a preview of featured wedding photos with responsive grid layout
 * and CTA button to navigate to the full gallery page.
 * 
 * @example
 * ```tsx
 * <GalleryTeaser
 *   imageCount={6}
 *   enableAnimations={true}
 * />
 * ```
 */
const GalleryTeaser: React.FC<GalleryTeaserProps> = ({
  imageCount = 6,
  enableAnimations = true,
  featuredImages,
  className
}) => {
  const navigate = useNavigate()
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  // Get featured images for lightbox
  const images = getFeaturedImages(imageCount, featuredImages)

  // Setup lightbox with featured images
  const lightbox = useLightbox({
    images,
    enableKeyboard: true,
    wrapAround: true,
  })

  /**
   * Handle CTA button click - navigate to full gallery page
   */
  const handleViewGallery = () => {
    navigate('/gallery')
  }

  /**
   * Handle image click - open lightbox at clicked image
   */
  const handleImageClick = (_imageId: string, index: number) => {
    lightbox.open(index)
  }

  /**
   * Setup GSAP scroll animations
   */
  useEffect(() => {
    if (!enableAnimations || prefersReducedMotion()) return

    const section = sectionRef.current
    const heading = headingRef.current
    const description = descriptionRef.current
    const cta = ctaRef.current

    if (!section || !heading || !description || !cta) return

    // Create timeline for section animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      }
    })

    // Animate section elements with stagger
    tl.fromTo(heading, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    )
    .fromTo(description,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      '-=0.3'
    )
    .fromTo(cta,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      '-=0.2'
    )

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === section) {
          trigger.kill()
        }
      })
    }
  }, [enableAnimations])

  return (
    <section 
      ref={sectionRef}
      className={cn(
        "container mx-auto px-4 py-16 bg-base-light",
        className
      )}
      aria-labelledby="gallery-teaser-heading"
    >
      <div className="text-center max-w-6xl mx-auto">
        {/* Section Header */}
        <h2 
          ref={headingRef}
          id="gallery-teaser-heading" 
          className="font-heading text-3xl md:text-4xl font-bold text-text mb-6"
        >
          📸 Album ảnh cưới
        </h2>
        
        <p 
          ref={descriptionRef}
          className="text-text-light text-lg mb-12 max-w-2xl mx-auto"
        >
          Khám phá những khoảnh khắc đáng nhớ của chúng tôi qua những bức ảnh đẹp nhất
        </p>

        {/* Gallery Grid */}
        <TeaserGrid
          images={images}
          enableAnimations={enableAnimations}
          onImageClick={handleImageClick}
          className="mb-12"
        />

        {/* CTA Button */}
        <div ref={ctaRef} className="flex justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={handleViewGallery}
            className="px-8 py-3 text-lg"
            aria-label="Xem toàn bộ album ảnh cưới"
          >
            Xem toàn bộ album
          </Button>
        </div>
      </div>

      {/* Lightbox for image preview */}
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
    </section>
  )
}

export default GalleryTeaser