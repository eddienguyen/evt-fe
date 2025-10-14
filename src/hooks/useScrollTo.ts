/**
 * Scroll To Hook
 * 
 * Custom React hook for scroll-to functionality with anchor link support.
 * 
 * @module hooks/useScrollTo
 */

import { useCallback } from 'react'
import type { ScrollToOptions } from '@/types/scroll'
import { useSmoothScroll } from './useSmoothScroll'
import { getScrollOffset } from '@/lib/scroll/scrollUtils'

/**
 * Hook for scroll-to functionality
 * 
 * @example
 * ```tsx
 * const { scrollTo, scrollToElement, scrollToTop } = useScrollTo()
 * 
 * // Scroll to element by selector
 * scrollToElement('#section1')
 * 
 * // Scroll to top
 * scrollToTop()
 * 
 * // Scroll to position with options
 * scrollTo(500, { duration: 1.2, offset: 80 })
 * ```
 */
export function useScrollTo() {
  const { scrollTo: smoothScrollTo, isEnabled } = useSmoothScroll()

  /**
   * Scroll to target element or position
   */
  const scrollTo = useCallback((
    target: string | number,
    options?: ScrollToOptions
  ) => {
    if (isEnabled) {
      smoothScrollTo(target, options)
    } else {
      // Fallback to native scroll
      if (typeof target === 'number') {
        window.scrollTo({
          top: target,
          behavior: 'smooth'
        })
      } else {
        const element = document.querySelector(target)
        if (element) {
          const offset = options?.offset || getScrollOffset(element)
          const elementTop = element.getBoundingClientRect().top + window.scrollY
          
          window.scrollTo({
            top: elementTop - offset,
            behavior: 'smooth'
          })
        }
      }
    }
  }, [smoothScrollTo, isEnabled])

  /**
   * Scroll to element by selector with automatic offset calculation
   */
  const scrollToElement = useCallback((
    selector: string,
    options?: Omit<ScrollToOptions, 'offset'> & { customOffset?: number }
  ) => {
    const element = document.querySelector(selector)
    if (!element) {
      console.warn(`Element with selector "${selector}" not found`)
      return
    }

    const offset = options?.customOffset ?? getScrollOffset(element)
    
    scrollTo(selector, {
      ...options,
      offset
    })
  }, [scrollTo])

  /**
   * Scroll to top of page
   */
  const scrollToTop = useCallback((options?: ScrollToOptions) => {
    scrollTo(0, options)
  }, [scrollTo])

  /**
   * Scroll to bottom of page
   */
  const scrollToBottom = useCallback((options?: ScrollToOptions) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    scrollTo(maxScroll, options)
  }, [scrollTo])

  /**
   * Handle anchor link clicks
   */
  const handleAnchorClick = useCallback((
    event: React.MouseEvent<HTMLAnchorElement>,
    options?: ScrollToOptions
  ) => {
    const href = event.currentTarget.getAttribute('href')
    if (!href || !href.startsWith('#')) return

    event.preventDefault()
    
    const targetId = href.slice(1)
    const target = document.getElementById(targetId)
    
    if (target) {
      scrollToElement(`#${targetId}`, options)
      
      // Update URL hash
      if (window.history.replaceState) {
        window.history.replaceState(null, '', href)
      }
    }
  }, [scrollToElement])

  /**
   * Create anchor click handler with predefined options
   */
  const createAnchorHandler = useCallback((
    options?: ScrollToOptions
  ) => {
    return (event: React.MouseEvent<HTMLAnchorElement>) => {
      handleAnchorClick(event, options)
    }
  }, [handleAnchorClick])

  return {
    scrollTo,
    scrollToElement,
    scrollToTop,
    scrollToBottom,
    handleAnchorClick,
    createAnchorHandler,
    isEnabled
  }
}

/**
 * Hook for automatically handling anchor links in navigation
 * 
 * @example
 * ```tsx
 * const handleNavClick = useAnchorNavigation({ offset: 80 })
 * 
 * <nav>
 *   <a href="#section1" onClick={handleNavClick}>Section 1</a>
 *   <a href="#section2" onClick={handleNavClick}>Section 2</a>
 * </nav>
 * ```
 */
export function useAnchorNavigation(defaultOptions?: ScrollToOptions) {
  const { handleAnchorClick } = useScrollTo()

  return useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    handleAnchorClick(event, defaultOptions)
  }, [handleAnchorClick, defaultOptions])
}

/**
 * Hook for scroll-to-section functionality with section tracking
 * 
 * @example
 * ```tsx
 * const { scrollToSection, currentSection } = useScrollToSection()
 * 
 * scrollToSection('hero') // Scrolls to element with id="hero"
 * ```
 */
export function useScrollToSection() {
  const { scrollToElement } = useScrollTo()
  const { activeSection } = useSmoothScroll()

  const scrollToSection = useCallback((
    sectionId: string,
    options?: ScrollToOptions
  ) => {
    scrollToElement(`#${sectionId}`, options)
  }, [scrollToElement])

  return {
    scrollToSection,
    currentSection: activeSection
  }
}