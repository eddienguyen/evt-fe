/**
 * Floating CTAs Container Component
 * 
 * Main container for floating action buttons (FABs) and slide-over panels.
 * Manages state, keyboard navigation, and responsive positioning.
 * 
 * @module components/FloatingCTAs
 */
import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { Calendar, Gift } from 'lucide-react'
import FloatingCTAButton from './FloatingCTAButton'
import RSVPPanel from './RSVPPanel'
import GiftPanel from './GiftPanel'
import { prefersReducedMotion, trapFocus, focusElement } from '../lib/a11y'

export interface FloatingCTAsProps {
  /** Override visibility (for testing) */
  hidden?: boolean
}

/**
 * Panel Loading Component
 */
const PanelLoader: React.FC = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-gold"></div>
  </div>
)

/**
 * Floating CTAs with persistent visibility and slide-over panels
 * 
 * Provides unobtrusive access to RSVP and Gift functionality from any page.
 * Manages panel state, animations, and accessibility features.
 * 
 * @example
 * ```tsx
 * // In RootLayout.tsx
 * <FloatingCTAs />
 * ```
 */
const FloatingCTAs: React.FC<FloatingCTAsProps> = ({
  hidden = false
}) => {
  // State management
  const [activePanel, setActivePanel] = useState<'rsvp' | 'gift' | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  
  // Refs for focus management
  const panelContainerRef = useRef<HTMLDivElement>(null)
  const lastFocusedElement = useRef<HTMLElement | null>(null)

  // Motion preferences
  const shouldReduceMotion = prefersReducedMotion()

  /**
   * Open a panel and manage focus
   */
  const openPanel = (panelType: 'rsvp' | 'gift') => {
    if (isAnimating) return

    // Store current focus for restoration
    lastFocusedElement.current = document.activeElement as HTMLElement

    setIsAnimating(true)
    setActivePanel(panelType)

    // Focus management after animation
    setTimeout(() => {
      setIsAnimating(false)
      if (panelContainerRef.current) {
        focusElement(panelContainerRef.current)
      }
    }, shouldReduceMotion ? 0 : 300)
  }

  /**
   * Close active panel and restore focus
   */
  const closePanel = useCallback(() => {
    if (isAnimating) return

    setIsAnimating(true)
    setActivePanel(null)

    // Restore focus after animation
    setTimeout(() => {
      setIsAnimating(false)
      if (lastFocusedElement.current) {
        focusElement(lastFocusedElement.current)
      }
    }, shouldReduceMotion ? 0 : 300)
  }, [isAnimating, shouldReduceMotion])

  /**
   * Keyboard event handler
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Close panel on Escape
      if (event.key === 'Escape' && activePanel) {
        event.preventDefault()
        closePanel()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [activePanel, closePanel])

  /**
   * Body scroll lock when panel is open
   */
  useEffect(() => {
    if (activePanel) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = ''
    }
  }, [activePanel])

  /**
   * Focus trap for open panels
   */
  useEffect(() => {
    if (activePanel && panelContainerRef.current) {
      const releaseTrap = trapFocus(panelContainerRef.current)
      return releaseTrap
    }
  }, [activePanel])

  // Hide if explicitly hidden
  if (hidden) return null

  return (
    <>
      {/* RSVP FAB - Hidden on mobile (md:block = show on ≥768px) */}
      <div className="hidden md:block">
        <FloatingCTAButton
          label="RSVP Now"
          icon={<Calendar className="w-full h-full" />}
          onClick={() => openPanel('rsvp')}
          variant="rsvp"
          position="primary"
          isActive={activePanel === 'rsvp'}
          reducedMotion={shouldReduceMotion}
        />
      </div>

      {/* Gift FAB - Hidden on mobile (md:block = show on ≥768px) */}
      <div className="hidden md:block">
        <FloatingCTAButton
          label="Wedding Gift"
          icon={<Gift className="w-full h-full" />}
          onClick={() => openPanel('gift')}
          variant="gift"
          position="secondary"
          isActive={activePanel === 'gift'}
          reducedMotion={shouldReduceMotion}
        />
      </div>

      {/* Panel Backdrop and Container */}
      {activePanel && (
        <div
          className={`fixed inset-0 z-modal transition-opacity duration-300 ${
            shouldReduceMotion ? 'transition-none' : ''
          }`}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          {/* Backdrop - Click to close */}
          <div
            className="absolute inset-0"
            onClick={closePanel}
            aria-hidden="true"
          />

          {/* Panel Container */}
          <div
            ref={panelContainerRef}
            className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ${
              shouldReduceMotion ? 'transition-none' : ''
            } ${activePanel ? 'translate-x-0' : 'translate-x-full'}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${activePanel}-panel-title`}
            aria-describedby={`${activePanel}-panel-description`}
          >
            {/* Panel Content */}
            <Suspense fallback={<PanelLoader />}>
              {activePanel === 'rsvp' && (
                <RSVPPanel 
                  isOpen={true} 
                  onClose={closePanel}
                />
              )}
              {activePanel === 'gift' && (
                <GiftPanel 
                  isOpen={true} 
                  onClose={closePanel}
                />
              )}
            </Suspense>
          </div>
        </div>
      )}
    </>
  )
}

export default FloatingCTAs