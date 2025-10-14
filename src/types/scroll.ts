/**
 * Smooth Scroll Type Definitions
 * 
 * TypeScript interfaces and types for smooth scroll functionality.
 * 
 * @module types/scroll
 */

import type Lenis from '@studio-freight/lenis'

/**
 * Scroll direction enum
 */
export type ScrollDirection = 'up' | 'down' | null

/**
 * Device performance tiers for optimization
 */
export type DevicePerformanceTier = 'high' | 'mid' | 'low'

/**
 * Smooth scroll state interface
 */
export interface SmoothScrollState {
  // Core States
  isEnabled: boolean
  isScrolling: boolean
  scrollProgress: number
  
  // Performance States
  isInitialized: boolean
  reducedMotion: boolean
  isMobile: boolean
  deviceTier: DevicePerformanceTier
  
  // Navigation States
  activeSection: string | null
  scrollDirection: ScrollDirection
  lastScrollY: number
}

/**
 * Scroll-to options for anchor navigation
 */
export interface ScrollToOptions {
  /** Offset from target element (e.g., for fixed headers) */
  offset?: number
  /** Animation duration in seconds */
  duration?: number
  /** Custom easing function */
  easing?: (t: number) => number
  /** Callback when scroll completes */
  onComplete?: () => void
  /** Callback during scroll progress */
  onUpdate?: (progress: number) => void
}

/**
 * Smooth scroll actions interface
 */
export interface SmoothScrollActions {
  /** Scroll to target element or position */
  scrollTo: (target: string | number, options?: ScrollToOptions) => void
  /** Enable smooth scrolling */
  enable: () => void
  /** Disable smooth scrolling */
  disable: () => void
  /** Refresh Lenis instance (e.g., after layout changes) */
  refresh: () => void
  /** Destroy Lenis instance and cleanup */
  destroy: () => void
  /** Update scroll progress manually */
  update: () => void
}

/**
 * Complete smooth scroll context interface
 */
export interface SmoothScrollContextValue extends SmoothScrollState, SmoothScrollActions {
  /** Lenis instance (internal use) */
  lenis: Lenis | null
}

/**
 * Lenis configuration interface
 */
export interface LenisConfig {
  /** Animation duration in seconds */
  duration: number
  /** Custom easing function */
  easing: (t: number) => number
  /** Scroll orientation */
  orientation: 'vertical' | 'horizontal'
  /** Gesture orientation */
  gestureOrientation: 'vertical' | 'horizontal' | 'both'
  /** Enable smooth wheel events */
  smoothWheel: boolean
  /** Wheel sensitivity multiplier */
  wheelMultiplier: number
  /** Touch sensitivity multiplier */
  touchMultiplier: number
  /** Enable infinite scroll */
  infinite: boolean
  /** Wrapper element selector */
  wrapper?: string
  /** Content element selector */
  content?: string
  /** Enable evenly distributed events */
  evenly?: boolean
  /** Custom lerp value */
  lerp?: number
  /** Custom smoothTouch value */
  smoothTouch?: boolean
}

/**
 * Device detection result interface
 */
export interface DeviceDetection {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  performanceTier: DevicePerformanceTier
  supportsGPU: boolean
  maxTouchPoints: number
}

/**
 * Performance monitoring interface
 */
export interface PerformanceMetrics {
  fps: number
  memoryUsage: number
  isOptimal: boolean
  shouldDegrade: boolean
}

/**
 * Scroll event data interface
 */
export interface ScrollEventData {
  scroll: number
  limit: number
  velocity: number
  direction: ScrollDirection
  progress: number
}