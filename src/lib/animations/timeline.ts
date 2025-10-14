/**
 * Timeline Animation Utilities
 * 
 * Helper functions and constants for GSAP timeline animations.
 * 
 * @module lib/animations/timeline
 */

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger)

/**
 * Animation Easing Presets
 */
export const ANIMATION_EASING = {
  smooth: 'power2.out',
  bounce: 'back.out(1.7)',
  elastic: 'elastic.out(1, 0.5)',
  snap: 'power4.out',
  gentle: 'sine.inOut'
} as const

/**
 * Animation Duration Presets (in seconds)
 */
export const ANIMATION_DURATION = {
  fast: 0.3,
  normal: 0.6,
  slow: 0.9,
  verySlow: 1.2
} as const

/**
 * ScrollTrigger Start Position Presets
 */
export const SCROLL_START = {
  early: 'top 90%',
  normal: 'top 80%',
  late: 'top 70%',
  center: 'top 50%'
} as const

/**
 * Animation variant configurations
 */
export const ANIMATION_VARIANTS = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 }
  },
  slideUp: {
    from: { opacity: 0, y: 30 },
    to: { opacity: 1, y: 0 }
  },
  slideDown: {
    from: { opacity: 0, y: -30 },
    to: { opacity: 1, y: 0 }
  },
  slideLeft: {
    from: { opacity: 0, x: 100 },
    to: { opacity: 1, x: 0 }
  },
  slideRight: {
    from: { opacity: 0, x: -100 },
    to: { opacity: 1, x: 0 }
  },
  scale: {
    from: { opacity: 0, scale: 0.8 },
    to: { opacity: 1, scale: 1 }
  }
} as const

/**
 * Create a simple fade-in animation
 */
export function animateFadeIn(
  element: HTMLElement,
  options: {
    duration?: number
    delay?: number
    ease?: string
  } = {}
): gsap.core.Tween {
  const { duration = ANIMATION_DURATION.normal, delay = 0, ease = ANIMATION_EASING.smooth } = options

  return gsap.fromTo(
    element,
    ANIMATION_VARIANTS.fadeIn.from,
    {
      ...ANIMATION_VARIANTS.fadeIn.to,
      duration,
      delay,
      ease
    }
  )
}

/**
 * Create a slide-up animation with ScrollTrigger
 */
export function animateSlideUp(
  element: HTMLElement,
  options: {
    duration?: number
    delay?: number
    ease?: string
    start?: string
    once?: boolean
  } = {}
): ScrollTrigger {
  const {
    duration = ANIMATION_DURATION.normal,
    delay = 0,
    ease = ANIMATION_EASING.smooth,
    start = SCROLL_START.normal,
    once = true
  } = options

  gsap.set(element, ANIMATION_VARIANTS.slideUp.from)

  return ScrollTrigger.create({
    trigger: element,
    start,
    onEnter: () => {
      gsap.to(element, {
        ...ANIMATION_VARIANTS.slideUp.to,
        duration,
        delay,
        ease
      })
    },
    once
  })
}

/**
 * Create a staggered animation for multiple elements
 */
export function animateStagger(
  elements: HTMLElement[] | NodeListOf<Element>,
  options: {
    variant?: keyof typeof ANIMATION_VARIANTS
    duration?: number
    stagger?: number
    ease?: string
    start?: string
    once?: boolean
  } = {}
): ScrollTrigger {
  const {
    variant = 'slideUp',
    duration = ANIMATION_DURATION.normal,
    stagger = 0.15,
    ease = ANIMATION_EASING.smooth,
    start = SCROLL_START.normal,
    once = true
  } = options

  const variantConfig = ANIMATION_VARIANTS[variant]
  const firstElement = elements[0] as HTMLElement

  gsap.set(elements, variantConfig.from)

  return ScrollTrigger.create({
    trigger: firstElement,
    start,
    onEnter: () => {
      gsap.to(elements, {
        ...variantConfig.to,
        duration,
        stagger,
        ease
      })
    },
    once
  })
}

/**
 * Create a parallax scroll effect
 */
export function animateParallax(
  element: HTMLElement,
  options: {
    speed?: number
    start?: string
    end?: string
  } = {}
): ScrollTrigger {
  const {
    speed = 0.5,
    start = 'top bottom',
    end = 'bottom top'
  } = options

  return ScrollTrigger.create({
    trigger: element,
    start,
    end,
    scrub: true,
    onUpdate: (self) => {
      const yPos = self.progress * 100 * speed
      gsap.set(element, { y: yPos })
    }
  })
}

/**
 * Create a scroll progress indicator animation
 */
export function animateScrollProgress(
  progressElement: HTMLElement,
  containerElement: HTMLElement,
  options: {
    start?: string
    end?: string
    axis?: 'x' | 'y'
  } = {}
): ScrollTrigger {
  const {
    start = 'top center',
    end = 'bottom center',
    axis = 'y'
  } = options

  const property = axis === 'x' ? 'scaleX' : 'scaleY'
  const transformOrigin = axis === 'x' ? 'left' : 'top'

  gsap.set(progressElement, { [property]: 0, transformOrigin })

  return ScrollTrigger.create({
    trigger: containerElement,
    start,
    end,
    scrub: true,
    onUpdate: (self) => {
      gsap.to(progressElement, {
        [property]: self.progress,
        duration: 0.1,
        ease: 'none'
      })
    }
  })
}

/**
 * Cleanup specific ScrollTrigger instances by trigger element
 */
export function cleanupScrollTriggers(triggerElement: HTMLElement): void {
  ScrollTrigger.getAll().forEach(trigger => {
    if (trigger.vars.trigger === triggerElement) {
      trigger.kill()
    }
  })
}

/**
 * Cleanup all ScrollTrigger instances
 */
export function cleanupAllScrollTriggers(): void {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
}

/**
 * Refresh all ScrollTrigger instances
 * Useful after layout changes or window resize
 */
export function refreshScrollTriggers(): void {
  ScrollTrigger.refresh()
}

/**
 * Batch create ScrollTrigger animations for multiple elements
 */
export function batchAnimate(
  elements: HTMLElement[] | NodeListOf<Element>,
  options: {
    variant?: keyof typeof ANIMATION_VARIANTS
    duration?: number
    ease?: string
    start?: string
    once?: boolean
    interval?: number
    batchMax?: number
  } = {}
): void {
  const {
    variant = 'slideUp',
    duration = ANIMATION_DURATION.normal,
    ease = ANIMATION_EASING.smooth,
    start = SCROLL_START.normal,
    once = true,
    interval = 0.1,
    batchMax = 3
  } = options

  const variantConfig = ANIMATION_VARIANTS[variant]

  gsap.set(elements, variantConfig.from)

  ScrollTrigger.batch(elements, {
    onEnter: (batch) => {
      gsap.to(batch, {
        ...variantConfig.to,
        duration,
        ease,
        stagger: interval,
        overwrite: true
      })
    },
    start,
    once,
    interval,
    batchMax
  })
}
