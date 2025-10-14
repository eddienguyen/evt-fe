/**
 * Timeline Animation Hook
 * 
 * Centralized GSAP ScrollTrigger animations for timeline components.
 * Provides reusable animation configurations with reduced-motion support.
 * 
 * @module hooks/useTimelineAnimation
 */

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '../lib/a11y'

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger)

export interface TimelineAnimationConfig {
  /** Layout variant */
  layout?: 'vertical' | 'horizontal'
  /** Position for horizontal layout */
  position?: 'left' | 'right'
  /** Enable animations */
  enabled?: boolean
  /** Animation duration in seconds */
  duration?: number
  /** Animation ease function */
  ease?: string
  /** Stagger delay for multiple items */
  stagger?: number
}

export interface TimelineAnimationRefs {
  /** Main container ref */
  containerRef: React.RefObject<HTMLElement | null>
  /** Image ref */
  imageRef: React.RefObject<HTMLDivElement | null>
  /** Content ref */
  contentRef: React.RefObject<HTMLDivElement | null>
}

/**
 * Default animation configuration
 */
const DEFAULT_CONFIG: Required<TimelineAnimationConfig> = {
  layout: 'vertical',
  position: 'left',
  enabled: true,
  duration: 0.6,
  ease: 'power2.out',
  stagger: 0.2
}

/**
 * Timeline Animation Hook
 * 
 * Applies GSAP ScrollTrigger animations to timeline items based on layout and position.
 * Automatically handles reduced-motion preferences.
 * 
 * @param config - Animation configuration
 * @returns Animation refs for container, image, and content elements
 * 
 * @example
 * ```tsx
 * const { containerRef, imageRef, contentRef } = useTimelineAnimation({
 *   layout: 'horizontal',
 *   position: 'left',
 *   enabled: true
 * })
 * 
 * return (
 *   <article ref={containerRef}>
 *     <div ref={imageRef}>Image</div>
 *     <div ref={contentRef}>Content</div>
 *   </article>
 * )
 * ```
 */
export function useTimelineAnimation(
  config: TimelineAnimationConfig = {}
): TimelineAnimationRefs {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config }
  const { layout, position, enabled, duration, ease } = mergedConfig

  // Refs
  const containerRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const shouldAnimate = enabled && !prefersReducedMotion()
  const isVertical = layout === 'vertical'
  const isLeft = position === 'left'

  useEffect(() => {
    if (!shouldAnimate || !containerRef.current) return

    const container = containerRef.current
    const image = imageRef.current
    const content = contentRef.current

    // Vertical Layout: Simple fade + slide up
    if (isVertical) {
      gsap.set(container, { opacity: 0, y: 30 })

      const trigger = ScrollTrigger.create({
        trigger: container,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(container, {
            opacity: 1,
            y: 0,
            duration: duration,
            ease: ease
          })
        },
        once: true
      })

      return () => {
        trigger.kill()
      }
    }

    // Horizontal Layout: Image slide horizontally + content slide vertically
    if (!isVertical && image && content) {
      // Set initial states
      gsap.set(image, {
        x: isLeft ? -100 : 100,
        opacity: 0
      })
      gsap.set(content, {
        y: isLeft ? -50 : 50,
        opacity: 0
      })

      const trigger = ScrollTrigger.create({
        trigger: container,
        start: 'top 70%',
        onEnter: () => {
          // Animate image horizontally
          gsap.to(image, {
            x: 0,
            opacity: 1,
            duration: duration * 1.3, // Slightly longer for image
            ease: ease
          })

          // Animate content vertically with slight delay
          gsap.to(content, {
            y: 0,
            opacity: 1,
            duration: duration,
            delay: 0.2,
            ease: ease
          })
        },
        once: true
      })

      return () => {
        trigger.kill()
      }
    }
  }, [shouldAnimate, isVertical, isLeft, duration, ease])

  return {
    containerRef,
    imageRef,
    contentRef
  }
}

/**
 * Staggered Timeline Animation Hook
 * 
 * Applies staggered entrance animations to multiple timeline items.
 * Useful for animating all items in a timeline section with sequential delays.
 * 
 * @param config - Animation configuration with stagger delay
 * @returns Container ref for the timeline section
 * 
 * @example
 * ```tsx
 * const { containerRef } = useStaggeredTimelineAnimation({
 *   layout: 'vertical',
 *   stagger: 0.15
 * })
 * 
 * return (
 *   <section ref={containerRef}>
 *     {items.map(item => <TimelineItem key={item.id} {...item} />)}
 *   </section>
 * )
 * ```
 */
export function useStaggeredTimelineAnimation(
  config: TimelineAnimationConfig = {}
): { containerRef: React.RefObject<HTMLElement | null> } {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config }
  const { enabled, duration, ease, stagger } = mergedConfig

  const containerRef = useRef<HTMLElement>(null)
  const shouldAnimate = enabled && !prefersReducedMotion()

  useEffect(() => {
    if (!shouldAnimate || !containerRef.current) return

    const container = containerRef.current
    const items = container.querySelectorAll('.timeline-item')

    if (items.length === 0) return

    // Set initial states
    gsap.set(items, { opacity: 0, y: 30 })

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top 80%',
      onEnter: () => {
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: duration,
          ease: ease,
          stagger: stagger
        })
      },
      once: true
    })

    return () => {
      trigger.kill()
    }
  }, [shouldAnimate, duration, ease, stagger])

  return { containerRef }
}

/**
 * Scroll Progress Animation Hook
 * 
 * Creates a scroll progress indicator for the timeline section.
 * Shows visual feedback as user scrolls through the timeline.
 * 
 * @param containerRef - Ref to the timeline container element
 * @param enabled - Enable/disable the progress animation
 * @returns Progress ref for the progress indicator element
 * 
 * @example
 * ```tsx
 * const containerRef = useRef<HTMLElement>(null)
 * const { progressRef } = useTimelineScrollProgress(containerRef)
 * 
 * return (
 *   <section ref={containerRef}>
 *     <div ref={progressRef} className="progress-bar" />
 *     {timeline items}
 *   </section>
 * )
 * ```
 */
export function useTimelineScrollProgress(
  containerRef: React.RefObject<HTMLElement | null>,
  enabled: boolean = true
): { progressRef: React.RefObject<HTMLDivElement | null> } {
  const progressRef = useRef<HTMLDivElement>(null)
  const shouldAnimate = enabled && !prefersReducedMotion()

  useEffect(() => {
    if (!shouldAnimate || !containerRef.current || !progressRef.current) return

    const container = containerRef.current
    const progress = progressRef.current

    // Set initial state
    gsap.set(progress, { scaleY: 0, transformOrigin: 'top' })

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top center',
      end: 'bottom center',
      scrub: true,
      onUpdate: (self) => {
        gsap.to(progress, {
          scaleY: self.progress,
          duration: 0.1,
          ease: 'none'
        })
      }
    })

    return () => {
      trigger.kill()
    }
  }, [shouldAnimate, containerRef])

  return { progressRef }
}

/**
 * Cleanup all ScrollTriggers
 * 
 * Utility function to cleanup all ScrollTrigger instances.
 * Useful for unmounting or resetting animations.
 */
export function cleanupTimelineAnimations(): void {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
}
