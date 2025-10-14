/**
 * Smooth Scroll Core Implementation
 * 
 * Core Lenis integration and smooth scroll functionality.
 * 
 * @module lib/scroll/smoothScroll
 */

import Lenis from '@studio-freight/lenis'
import type { LenisOptions } from '@studio-freight/lenis'
import type { ScrollEventData } from '@/types/scroll'
import { 
  createLenisConfig, 
  detectDevice, 
  shouldUseReducedMotion,
  createPerformanceMonitor,
  throttle,
  debounce
} from './scrollUtils'
import { SCROLL_CONSTANTS, SCROLL_CLASSES } from './scrollConfig'

/**
 * Smooth scroll manager class
 */
export class SmoothScrollManager {
  private lenis: Lenis | null = null
  private device = detectDevice()
  private performanceMonitor = createPerformanceMonitor()
  private rafId: number | null = null
  private isDestroyed = false
  private reducedMotion = shouldUseReducedMotion()
  
  // Event callbacks
  private scrollCallbacks: Array<(data: ScrollEventData) => void> = []
  private progressCallbacks: Array<(progress: number) => void> = []

  constructor() {
    this.handleScroll = throttle(this.handleScroll.bind(this), SCROLL_CONSTANTS.RAF_THROTTLE)
    this.handleResize = debounce(this.handleResize.bind(this), 250)
  }

  /**
   * Initialize smooth scroll
   */
  public init(): void {
    if (this.isDestroyed || this.lenis) return

    // Skip initialization if reduced motion is preferred
    if (this.reducedMotion) {
      this.addReducedMotionClass()
      return
    }

    try {
      // Create Lenis configuration based on device
      const config = createLenisConfig(this.device.performanceTier)
      
      // Initialize Lenis
      this.lenis = new Lenis(config)
      
      // Set up event listeners
      this.setupEventListeners()
      
      // Start animation loop
      this.startAnimationLoop()
      
      // Start performance monitoring
      this.performanceMonitor.start()
      
      // Add CSS class
      document.documentElement.classList.add(SCROLL_CLASSES.enabled)
      
      console.log('Smooth scroll initialized', {
        device: this.device,
        config
      })
    } catch (error) {
      console.error('Failed to initialize smooth scroll:', error)
      this.fallbackToNativeScroll()
    }
  }

  /**
   * Destroy smooth scroll and cleanup
   */
  public destroy(): void {
    if (this.isDestroyed) return

    this.isDestroyed = true

    // Stop animation loop
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }

    // Stop performance monitoring
    this.performanceMonitor.stop()

    // Remove event listeners
    this.removeEventListeners()

    // Destroy Lenis
    if (this.lenis) {
      this.lenis.destroy()
      this.lenis = null
    }

    // Clear callbacks
    this.scrollCallbacks = []
    this.progressCallbacks = []

    // Remove CSS classes
    document.documentElement.classList.remove(
      SCROLL_CLASSES.enabled,
      SCROLL_CLASSES.scrolling,
      SCROLL_CLASSES.scrollingUp,
      SCROLL_CLASSES.scrollingDown
    )

    console.log('Smooth scroll destroyed')
  }

  /**
   * Scroll to target element or position
   */
  public scrollTo(
    target: string | number, 
    options: { offset?: number; duration?: number; easing?: (t: number) => number } = {}
  ): void {
    if (!this.lenis || this.reducedMotion) {
      this.fallbackScrollTo(target, options)
      return
    }

    try {
      this.lenis.scrollTo(target, {
        offset: options.offset,
        duration: options.duration,
        easing: options.easing
      })
    } catch (error) {
      console.error('Scroll to target failed:', error)
      this.fallbackScrollTo(target, options)
    }
  }

  /**
   * Enable smooth scroll
   */
  public enable(): void {
    if (this.lenis) {
      this.lenis.start()
    }
  }

  /**
   * Disable smooth scroll
   */
  public disable(): void {
    if (this.lenis) {
      this.lenis.stop()
    }
  }

  /**
   * Refresh Lenis (call after layout changes)
   */
  public refresh(): void {
    if (this.lenis) {
      this.lenis.resize()
    }
  }

  /**
   * Get current scroll position
   */
  public getScroll(): number {
    return this.lenis?.scroll || window.scrollY || 0
  }

  /**
   * Get scroll progress (0-1)
   */
  public getProgress(): number {
    if (!this.lenis) return 0
    
    const scroll = this.lenis.scroll
    const limit = this.lenis.limit
    
    return limit > 0 ? Math.min(Math.max(scroll / limit, 0), 1) : 0
  }

  /**
   * Add scroll event callback
   */
  public onScroll(callback: (data: ScrollEventData) => void): () => void {
    this.scrollCallbacks.push(callback)
    
    return () => {
      const index = this.scrollCallbacks.indexOf(callback)
      if (index > -1) {
        this.scrollCallbacks.splice(index, 1)
      }
    }
  }

  /**
   * Add progress callback
   */
  public onProgress(callback: (progress: number) => void): () => void {
    this.progressCallbacks.push(callback)
    
    return () => {
      const index = this.progressCallbacks.indexOf(callback)
      if (index > -1) {
        this.progressCallbacks.splice(index, 1)
      }
    }
  }

  /**
   * Check if smooth scroll is enabled
   */
  public isEnabled(): boolean {
    return !!this.lenis && !this.reducedMotion
  }

  /**
   * Get Lenis instance (for advanced usage)
   */
  public getLenis(): Lenis | null {
    return this.lenis
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    if (!this.lenis) return

    // Lenis scroll event
    this.lenis.on('scroll', this.handleScroll)
    
    // Window resize
    window.addEventListener('resize', this.handleResize)
    
    // Visibility change (pause when tab is hidden)
    document.addEventListener('visibilitychange', this.handleVisibilityChange)
    
    // Performance degradation check
    setInterval(() => {
      this.checkPerformance()
    }, SCROLL_CONSTANTS.PERFORMANCE_CHECK_INTERVAL)
  }

  /**
   * Remove event listeners
   */
  private removeEventListeners(): void {
    if (this.lenis) {
      this.lenis.off('scroll', this.handleScroll)
    }
    
    window.removeEventListener('resize', this.handleResize)
    document.removeEventListener('visibilitychange', this.handleVisibilityChange)
  }

  /**
   * Handle scroll events
   */
  private handleScroll = (data: ScrollEventData): void => {
    // Update scroll direction classes
    this.updateScrollClasses(data.direction)
    
    // Call scroll callbacks
    this.scrollCallbacks.forEach(callback => {
      try {
        callback(data)
      } catch (error) {
        console.error('Scroll callback error:', error)
      }
    })
    
    // Call progress callbacks
    const progress = this.getProgress()
    this.progressCallbacks.forEach(callback => {
      try {
        callback(progress)
      } catch (error) {
        console.error('Progress callback error:', error)
      }
    })
  }

  /**
   * Handle window resize
   */
  private handleResize = (): void => {
    if (this.lenis) {
      this.lenis.resize()
    }
    
    // Re-detect device if screen size changed significantly
    const newDevice = detectDevice()
    if (newDevice.performanceTier !== this.device.performanceTier) {
      console.log('Device tier changed, reinitializing smooth scroll')
      this.device = newDevice
      this.reinitialize()
    }
  }

  /**
   * Handle visibility change
   */
  private handleVisibilityChange = (): void => {
    if (document.hidden) {
      this.disable()
    } else {
      this.enable()
    }
  }

  /**
   * Start animation loop
   */
  private startAnimationLoop(): void {
    if (this.isDestroyed || !this.lenis) return

    this.lenis.raf(performance.now())
    this.rafId = requestAnimationFrame(() => this.startAnimationLoop())
  }

  /**
   * Update scroll direction classes
   */
  private updateScrollClasses(direction: 'up' | 'down' | null): void {
    const { documentElement } = document
    
    // Remove existing direction classes
    documentElement.classList.remove(
      SCROLL_CLASSES.scrollingUp,
      SCROLL_CLASSES.scrollingDown
    )
    
    // Add current direction class
    if (direction === 'up') {
      documentElement.classList.add(SCROLL_CLASSES.scrollingUp)
    } else if (direction === 'down') {
      documentElement.classList.add(SCROLL_CLASSES.scrollingDown)
    }
    
    // Toggle scrolling class
    if (direction) {
      documentElement.classList.add(SCROLL_CLASSES.scrolling)
    } else {
      documentElement.classList.remove(SCROLL_CLASSES.scrolling)
    }
  }

  /**
   * Check performance and degrade if necessary
   */
  private checkPerformance(): void {
    const metrics = this.performanceMonitor.getMetrics()
    
    if (metrics.shouldDegrade && this.device.performanceTier !== 'low') {
      console.warn('Performance degradation detected, switching to low-performance mode')
      this.device.performanceTier = 'low'
      this.reinitialize()
    }
  }

  /**
   * Reinitialize with new configuration
   */
  private reinitialize(): void {
    const wasEnabled = this.isEnabled()
    this.destroy()
    
    if (wasEnabled) {
      this.init()
    }
  }

  /**
   * Add reduced motion class
   */
  private addReducedMotionClass(): void {
    document.documentElement.classList.add(SCROLL_CLASSES.reducedMotion)
  }

  /**
   * Fallback to native scroll
   */
  private fallbackToNativeScroll(): void {
    console.log('Falling back to native scroll')
    this.addReducedMotionClass()
  }

  /**
   * Fallback scroll-to implementation
   */
  private fallbackScrollTo(
    target: string | number,
    options: { offset?: number; duration?: number } = {}
  ): void {
    if (typeof target === 'number') {
      window.scrollTo({
        top: target,
        behavior: 'smooth'
      })
      return
    }

    const element = document.querySelector(target)
    if (element) {
      const offset = options.offset || 0
      const elementTop = element.getBoundingClientRect().top + window.scrollY
      
      window.scrollTo({
        top: elementTop - offset,
        behavior: 'smooth'
      })
    }
  }
}

/**
 * Global smooth scroll instance
 */
export const smoothScrollManager = new SmoothScrollManager()