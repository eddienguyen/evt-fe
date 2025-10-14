/**
 * Smooth Scroll Utilities
 * 
 * Helper functions for device detection, performance monitoring,
 * and scroll behavior optimization.
 * 
 * @module lib/scroll/scrollUtils
 */

import type { 
  DeviceDetection, 
  DevicePerformanceTier, 
  PerformanceMetrics
} from '@/types/scroll'
import { 
  PERFORMANCE_THRESHOLDS, 
  LENIS_CONFIGS, 
  SCROLL_CONSTANTS,
  SCROLL_DURATION,
  SCROLL_EASING
} from './scrollConfig'
import { prefersReducedMotion } from '@/lib/a11y'

/**
 * Detect device capabilities and performance tier
 */
export function detectDevice(): DeviceDetection {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      performanceTier: 'mid',
      supportsGPU: false,
      maxTouchPoints: 0
    }
  }

  const { navigator, screen } = window
  const maxTouchPoints = navigator.maxTouchPoints || 0
  const isMobile = maxTouchPoints > 0 && screen.width < 768
  const isTablet = maxTouchPoints > 0 && screen.width >= 768 && screen.width < 1024
  const isDesktop = !isMobile && !isTablet

  // Performance tier detection
  const performanceTier = getPerformanceTier()
  
  // GPU acceleration support
  const supportsGPU = checkGPUSupport()

  return {
    isMobile,
    isTablet,
    isDesktop,
    performanceTier,
    supportsGPU,
    maxTouchPoints
  }
}

/**
 * Determine device performance tier
 */
export function getPerformanceTier(): DevicePerformanceTier {
  if (typeof window === 'undefined') return 'mid'

  try {
    // Check available memory (Chrome only)
    const memory = (navigator as { deviceMemory?: number }).deviceMemory
    if (memory) {
      if (memory >= PERFORMANCE_THRESHOLDS.highMemory) return 'high'
      if (memory >= PERFORMANCE_THRESHOLDS.midMemory) return 'mid'
      return 'low'
    }

    // Check CPU cores
    const cores = navigator.hardwareConcurrency || 4
    if (cores >= PERFORMANCE_THRESHOLDS.highCores) return 'high'
    if (cores >= PERFORMANCE_THRESHOLDS.midCores) return 'mid'
    return 'low'
  } catch {
    // Fallback to mid-tier
    return 'mid'
  }
}

/**
 * Check GPU acceleration support
 */
export function checkGPUSupport(): boolean {
  if (typeof window === 'undefined') return false

  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    return !!gl
  } catch {
    return false
  }
}

/**
 * Generate device-optimized Lenis configuration
 */
export function createLenisConfig(deviceTier: DevicePerformanceTier) {
  const tierConfig = LENIS_CONFIGS[deviceTier]
  
  return {
    duration: tierConfig.duration || SCROLL_DURATION.mid,
    easing: tierConfig.easing || SCROLL_EASING.default,
    orientation: 'vertical' as const,
    gestureOrientation: 'vertical' as const,
    smoothWheel: tierConfig.smoothWheel ?? true,
    wheelMultiplier: tierConfig.wheelMultiplier || 1,
    touchMultiplier: tierConfig.touchMultiplier || 2,
    infinite: false,
    lerp: tierConfig.lerp || 0.1,
    smoothTouch: tierConfig.smoothTouch ?? true,
    evenly: tierConfig.evenly ?? true
  }
}

/**
 * Check if reduced motion is preferred
 */
export function shouldUseReducedMotion(): boolean {
  return prefersReducedMotion()
}

/**
 * Get scroll offset for anchor navigation
 */
export function getScrollOffset(target?: Element): number {
  // Default offset for fixed headers
  let offset: number = SCROLL_CONSTANTS.ANCHOR_OFFSET

  // Check for custom offset attribute
  if (target) {
    const customOffset = target.getAttribute('data-scroll-offset')
    if (customOffset) {
      const parsedOffset = parseInt(customOffset, 10)
      if (!isNaN(parsedOffset)) {
        offset = parsedOffset
      }
    }
  }

  // Check for header height
  const header = document.querySelector('header, [data-header]')
  if (header) {
    const headerHeight = header.getBoundingClientRect().height
    offset = Math.max(offset, headerHeight + 20) // 20px buffer
  }

  return offset
}

/**
 * Normalize scroll target (element selector or position)
 */
export function normalizeScrollTarget(target: string | number): Element | number {
  if (typeof target === 'number') {
    return target
  }

  // Handle anchor links
  if (target.startsWith('#')) {
    const element = document.querySelector(target)
    if (element) return element
  }

  // Handle other selectors
  const element = document.querySelector(target)
  if (element) return element

  // Fallback to top
  console.warn(`Scroll target "${target}" not found, scrolling to top`)
  return 0
}

/**
 * Calculate scroll progress (0-1)
 */
export function calculateScrollProgress(scrollY: number, maxScroll: number): number {
  if (maxScroll <= 0) return 0
  return Math.min(Math.max(scrollY / maxScroll, 0), 1)
}

/**
 * Determine scroll direction
 */
export function getScrollDirection(
  currentScrollY: number, 
  previousScrollY: number
): 'up' | 'down' | null {
  const threshold = 5 // Minimum scroll distance to register direction
  const delta = currentScrollY - previousScrollY

  if (Math.abs(delta) < threshold) return null
  return delta > 0 ? 'down' : 'up'
}

/**
 * Performance monitoring
 */
export function createPerformanceMonitor(): {
  start: () => void
  stop: () => void
  getMetrics: () => PerformanceMetrics
} {
  let frameCount = 0
  let startTime = 0
  let isRunning = false
  let animationId: number

  const updateFPS = () => {
    frameCount++
    if (isRunning) {
      animationId = requestAnimationFrame(updateFPS)
    }
  }

  const start = () => {
    if (isRunning) return
    
    isRunning = true
    frameCount = 0
    startTime = performance.now()
    animationId = requestAnimationFrame(updateFPS)
  }

  const stop = () => {
    if (!isRunning) return
    
    isRunning = false
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
  }

  const getMetrics = (): PerformanceMetrics => {
    const currentTime = performance.now()
    const elapsed = currentTime - startTime
    const fps = elapsed > 0 ? Math.round((frameCount * 1000) / elapsed) : 0
    
    // Memory usage (Chrome only)
    let memoryUsage = 0
    if ('memory' in performance) {
      const memory = (performance as { memory?: { usedJSHeapSize: number } }).memory
      if (memory) {
        memoryUsage = memory.usedJSHeapSize / 1024 / 1024 // Convert to MB
      }
    }

    const isOptimal = fps >= SCROLL_CONSTANTS.FPS_THRESHOLD
    const shouldDegrade = !isOptimal || memoryUsage > SCROLL_CONSTANTS.MEMORY_THRESHOLD

    return {
      fps,
      memoryUsage,
      isOptimal,
      shouldDegrade
    }
  }

  return { start, stop, getMetrics }
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: never[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null
  let lastExecTime = 0

  return (...args: Parameters<T>) => {
    const currentTime = Date.now()

    if (currentTime - lastExecTime > delay) {
      func(...args)
      lastExecTime = currentTime
    } else {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        func(...args)
        lastExecTime = Date.now()
      }, delay - (currentTime - lastExecTime))
    }
  }
}

/**
 * Debounce function for scroll events
 */
export function debounce<T extends (...args: never[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * Check if element is in viewport
 */
export function isElementInViewport(
  element: Element,
  offset: number = 0
): boolean {
  const rect = element.getBoundingClientRect()
  const windowHeight = window.innerHeight || document.documentElement.clientHeight

  return (
    rect.top >= -offset &&
    rect.bottom <= windowHeight + offset
  )
}

/**
 * Find active section based on scroll position
 */
export function findActiveSection(
  sections: NodeListOf<Element>,
  offset: number = SCROLL_CONSTANTS.SECTION_OFFSET
): string | null {
  for (let i = sections.length - 1; i >= 0; i--) {
    const section = sections[i]
    const rect = section.getBoundingClientRect()
    
    if (rect.top <= offset) {
      return section.id || null
    }
  }
  
  return null
}