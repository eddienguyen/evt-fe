/**
 * Smooth Scroll Provider Component
 * 
 * React Context provider for smooth scroll functionality.
 * Manages Lenis instance and provides scroll state to child components.
 * 
 * @module components/providers/SmoothScrollProvider
 */

import React, { useEffect, useRef, useState } from 'react'
import type { 
  SmoothScrollContextValue,
  SmoothScrollState,
  ScrollToOptions,
  ScrollEventData
} from '@/types/scroll'
import { SmoothScrollContext } from '@/contexts/SmoothScrollContext'
import { smoothScrollManager } from '@/lib/scroll'
import { SCROLL_CONSTANTS } from '@/lib/scroll/scrollConfig'
import { 
  detectDevice, 
  shouldUseReducedMotion, 
  getScrollDirection, 
  calculateScrollProgress,
  findActiveSection,
  debounce
} from '@/lib/scroll/scrollUtils'

/**
 * Provider props
 */
export interface SmoothScrollProviderProps {
  children: React.ReactNode
  /** Enable automatic initialization on mount */
  autoInit?: boolean
  /** Enable section tracking */
  enableSectionTracking?: boolean
}

/**
 * Smooth Scroll Provider Component
 * 
 * Provides smooth scroll functionality to the entire application.
 * 
 * @example
 * ```tsx
 * <SmoothScrollProvider autoInit={true}>
 *   <App />
 * </SmoothScrollProvider>
 * ```
 */
export const SmoothScrollProvider: React.FC<SmoothScrollProviderProps> = ({
  children,
  autoInit = true,
  enableSectionTracking = true
}) => {
  // Check if current route is admin page
  const isAdminRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')
  
  const [state, setState] = useState<SmoothScrollState>(() => {
    const device = detectDevice()
    
    return {
      isEnabled: false,
      isScrolling: false,
      scrollProgress: 0,
      isInitialized: false,
      reducedMotion: shouldUseReducedMotion(),
      isMobile: device.isMobile,
      deviceTier: device.performanceTier,
      activeSection: null,
      scrollDirection: null,
      lastScrollY: 0
    }
  })

  // Refs for tracking
  const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const sectionsRef = useRef<NodeListOf<Element> | undefined>(undefined)
  const unsubscribeScrollRef = useRef<(() => void) | null>(null)

  // Store enableSectionTracking in ref to avoid recreating callback
  const enableSectionTrackingRef = useRef(enableSectionTracking)
  
  useEffect(() => {
    enableSectionTrackingRef.current = enableSectionTracking
  }, [enableSectionTracking])

  /**
   * Update scroll state from Lenis events
   */
  const handleScrollUpdate = React.useCallback((data: ScrollEventData) => {
    setState(prevState => {
      const newDirection = getScrollDirection(data.scroll, prevState.lastScrollY)
      const progress = calculateScrollProgress(data.scroll, data.limit)
      
      // Clear existing scroll timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      
      // Set new timeout to detect scroll end
      scrollTimeoutRef.current = setTimeout(() => {
        setState(prev => ({ ...prev, isScrolling: false }))
      }, SCROLL_CONSTANTS.SCROLL_DEBOUNCE)

      return {
        ...prevState,
        isScrolling: true,
        scrollProgress: progress,
        scrollDirection: newDirection,
        lastScrollY: data.scroll,
        activeSection: enableSectionTrackingRef.current ? 
          findActiveSection(sectionsRef.current || document.querySelectorAll('section[id]')) : 
          prevState.activeSection
      }
    })
  }, [])

  /**
   * Initialize smooth scroll
   */
  const init = React.useCallback(() => {
    // Skip initialization for admin routes
    if (isAdminRoute) {
      setState(prev => ({
        ...prev,
        isInitialized: true,
        isEnabled: false
      }))
      return
    }
    
    try {
      smoothScrollManager.init()
      
      // Subscribe to scroll events
      unsubscribeScrollRef.current = smoothScrollManager.onScroll(handleScrollUpdate)
      
      // Update sections reference if tracking is enabled
      if (enableSectionTrackingRef.current) {
        sectionsRef.current = document.querySelectorAll('section[id], div[id]')
      }

      setState(prev => ({
        ...prev,
        isInitialized: true,
        isEnabled: smoothScrollManager.isEnabled()
      }))

      console.log('SmoothScrollProvider: Initialized')
    } catch (error) {
      console.error('SmoothScrollProvider: Failed to initialize', error)
    }
  }, [handleScrollUpdate])

  /**
   * Cleanup and destroy
   */
  const destroy = React.useCallback(() => {
    // Clear timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    // Unsubscribe from scroll events
    if (unsubscribeScrollRef.current) {
      unsubscribeScrollRef.current()
      unsubscribeScrollRef.current = null
    }

    // Destroy manager
    smoothScrollManager.destroy()

    setState(prev => ({
      ...prev,
      isInitialized: false,
      isEnabled: false,
      isScrolling: false
    }))

    console.log('SmoothScrollProvider: Destroyed')
  }, [])

  /**
   * Scroll to target with options
   */
  const scrollTo = React.useCallback((
    target: string | number, 
    options?: ScrollToOptions
  ) => {
    smoothScrollManager.scrollTo(target, options)
  }, [])

  /**
   * Enable smooth scroll
   */
  const enable = React.useCallback(() => {
    smoothScrollManager.enable()
    setState(prev => ({ ...prev, isEnabled: true }))
  }, [])

  /**
   * Disable smooth scroll
   */
  const disable = React.useCallback(() => {
    smoothScrollManager.disable()
    setState(prev => ({ ...prev, isEnabled: false }))
  }, [])

  /**
   * Refresh smooth scroll (call after layout changes)
   */
  const refresh = React.useCallback(() => {
    smoothScrollManager.refresh()
    
    // Update sections if tracking is enabled
    if (enableSectionTrackingRef.current) {
      sectionsRef.current = document.querySelectorAll('section[id], div[id]')
    }
  }, [])

  /**
   * Update scroll progress manually
   */
  const update = React.useCallback(() => {
    smoothScrollManager.refresh()
  }, [])

  // Auto-initialize on mount
  useEffect(() => {
    if (autoInit && !state.isInitialized) {
      init()
    }

    // Cleanup on unmount
    return () => {
      destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run on mount/unmount

  // Handle window resize with debouncing
  useEffect(() => {
    const handleResize = debounce(() => {
      refresh()
    }, 250)

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [refresh])

  // Context value
  const contextValue: SmoothScrollContextValue = {
    // State
    ...state,
    
    // Actions
    scrollTo,
    enable,
    disable,
    refresh,
    destroy,
    update,
    
    // Lenis instance (for advanced usage)
    lenis: smoothScrollManager.getLenis()
  }

  return (
    <SmoothScrollContext.Provider value={contextValue}>
      {children}
    </SmoothScrollContext.Provider>
  )
}