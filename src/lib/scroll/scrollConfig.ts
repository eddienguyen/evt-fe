/**
 * Smooth Scroll Configuration
 * 
 * Configuration constants and device-specific settings for smooth scroll behavior.
 * 
 * @module lib/scroll/scrollConfig
 */

import type { LenisConfig, DevicePerformanceTier } from '@/types/scroll'

/**
 * Default scroll durations for different device tiers
 */
export const SCROLL_DURATION = {
  high: 1.2,
  mid: 1.0,
  low: 0.8
} as const

/**
 * Easing functions for smooth scrolling
 */
export const SCROLL_EASING = {
  // Default smooth easing
  default: (t: number): number => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  // Gentle easing for reduced motion
  gentle: (t: number): number => t * (2 - t),
  // Linear for accessibility fallback
  linear: (t: number): number => t,
  // Bounce for desktop high-performance
  bounce: (t: number): number => {
    const n1 = 7.5625
    const d1 = 2.75
    if (t < 1 / d1) {
      return n1 * t * t
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375
    }
  }
} as const

/**
 * Device-specific Lenis configurations
 */
export const LENIS_CONFIGS: Record<DevicePerformanceTier, Partial<LenisConfig>> = {
  high: {
    duration: SCROLL_DURATION.high,
    easing: SCROLL_EASING.default,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    lerp: 0.1,
    smoothTouch: true,
    evenly: true
  },
  mid: {
    duration: SCROLL_DURATION.mid,
    easing: SCROLL_EASING.default,
    smoothWheel: true,
    wheelMultiplier: 1.2,
    touchMultiplier: 1.8,
    lerp: 0.15,
    smoothTouch: true,
    evenly: false
  },
  low: {
    duration: SCROLL_DURATION.low,
    easing: SCROLL_EASING.gentle,
    smoothWheel: true,
    wheelMultiplier: 1.5,
    touchMultiplier: 1.5,
    lerp: 0.2,
    smoothTouch: false,
    evenly: false
  }
}

/**
 * Base Lenis configuration
 */
export const BASE_LENIS_CONFIG: LenisConfig = {
  duration: SCROLL_DURATION.mid,
  easing: SCROLL_EASING.default,
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
  infinite: false,
  lerp: 0.1,
  smoothTouch: true,
  evenly: true
}

/**
 * Performance thresholds for device detection
 */
export const PERFORMANCE_THRESHOLDS = {
  // Memory in GB
  highMemory: 8,
  midMemory: 4,
  
  // CPU cores
  highCores: 8,
  midCores: 4,
  
  // Device pixel ratio
  highDPR: 2,
  
  // Max touch points (for touch device detection)
  touchDevice: 0
} as const

/**
 * Scroll behavior constants
 */
export const SCROLL_CONSTANTS = {
  // RAF throttling
  RAF_THROTTLE: 16.67, // ~60fps
  
  // Scroll detection debounce
  SCROLL_DEBOUNCE: 100,
  
  // Performance monitoring interval
  PERFORMANCE_CHECK_INTERVAL: 5000, // 5 seconds
  
  // Memory usage threshold (MB)
  MEMORY_THRESHOLD: 100,
  
  // FPS threshold for degradation
  FPS_THRESHOLD: 45,
  
  // Section detection offset
  SECTION_OFFSET: 100,
  
  // Default anchor scroll offset (for fixed headers)
  ANCHOR_OFFSET: 80
} as const

/**
 * CSS selectors for scroll behavior
 */
export const SCROLL_SELECTORS = {
  // Main scroll container
  wrapper: 'html',
  content: 'body',
  
  // Anchor link selectors
  anchorLinks: 'a[href^="#"]',
  
  // Section selectors for progress tracking
  sections: 'section[id], div[id]',
  
  // Skip link selectors
  skipLinks: '.skip-link, [data-skip-link]'
} as const

/**
 * Animation class names
 */
export const SCROLL_CLASSES = {
  // Smooth scroll enabled
  enabled: 'smooth-scroll-enabled',
  
  // Reduced motion
  reducedMotion: 'reduced-motion',
  
  // Scrolling state
  scrolling: 'is-scrolling',
  
  // Direction classes
  scrollingUp: 'scrolling-up',
  scrollingDown: 'scrolling-down'
} as const

/**
 * Accessibility preferences
 */
export const A11Y_CONFIG = {
  // Respect reduced motion preference
  respectReducedMotion: true,
  
  // Announce scroll progress for screen readers
  announceProgress: false,
  
  // Focus management during scroll
  manageFocus: true,
  
  // Skip link behavior
  skipLinkDuration: 0.3
} as const