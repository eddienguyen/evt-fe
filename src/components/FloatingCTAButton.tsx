/**
 * Floating CTA Button Component
 * 
 * Individual floating action button (FAB) for RSVP and Gift actions.
 * Supports reduced motion preferences and proper accessibility.
 * 
 * @module components/FloatingCTAButton
 */
import React from 'react'
import { cn } from '../lib/utils'
import { prefersReducedMotion } from '../lib/a11y'

export interface FloatingCTAButtonProps {
  /** Button label */
  label: string
  /** Icon component */
  icon: React.ReactNode
  /** Click handler */
  onClick: () => void
  /** Button type for styling */
  variant: 'rsvp' | 'gift'
  /** Position in stack */
  position: 'primary' | 'secondary'
  /** Reduced motion mode override */
  reducedMotion?: boolean
  /** Whether panel is currently open */
  isActive?: boolean
}

/**
 * Floating CTA Button with accessibility and motion support
 * 
 * @example
 * ```tsx
 * <FloatingCTAButton
 *   label="RSVP Now"
 *   icon={<CalendarIcon />}
 *   onClick={() => openRSVPPanel()}
 *   variant="rsvp"
 *   position="primary"
 * />
 * ```
 */
const FloatingCTAButton: React.FC<FloatingCTAButtonProps> = ({
  label,
  icon,
  onClick,
  variant,
  position,
  reducedMotion,
  isActive = false
}) => {
  // Detect motion preference
  const shouldReduceMotion = reducedMotion ?? prefersReducedMotion()

  // Variant styles
  const variantStyles = {
    rsvp: {
      base: 'bg-accent-gold text-white shadow-strong',
      hover: 'hover:bg-accent-gold-dark hover:shadow-medium',
      focus: 'focus:ring-accent-gold',
    },
    gift: {
      base: 'bg-accent-taupe text-white shadow-strong',
      hover: 'hover:bg-accent-taupe hover:shadow-medium',
      focus: 'focus:ring-accent-taupe',
    }
  }

  // Mobile positioning (responsive)
  const mobilePositionStyles = {
    primary: 'md:bottom-6 md:right-6 bottom-4 right-4',
    secondary: 'md:bottom-6 md:right-24 bottom-4 right-20'
  }

  const currentVariant = variantStyles[variant]

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Open ${label} panel`}
      aria-expanded={isActive}
      aria-haspopup="dialog"
      aria-controls={`${variant}-panel`}
      className={cn(
        // Base positioning and sizing
        'fixed z-fab',
        'w-14 h-14 md:w-16 md:h-16', // Touch-friendly sizing
        'rounded-full',
        'flex items-center justify-center',
        
        // Responsive positioning
        mobilePositionStyles[position],
        
        // Variant styling
        currentVariant.base,
        
        // Interactive states
        shouldReduceMotion ? '' : 'transition-all duration-300 ease-out',
        shouldReduceMotion ? '' : 'hover:scale-105',
        currentVariant.hover,
        
        // Focus states
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        currentVariant.focus,
        
        // Active state
        isActive && 'ring-2 ring-white ring-offset-2',
        
        // Reduced motion fallback
        shouldReduceMotion && 'transition-none hover:scale-100'
      )}
      style={{
        // Ensure button is above content but below modals
        zIndex: 40
      }}
    >
      {/* Icon with proper sizing */}
      <span className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center">
        {icon}
      </span>
      
      {/* Screen reader label */}
      <span className="sr-only">{label}</span>
    </button>
  )
}

export default FloatingCTAButton