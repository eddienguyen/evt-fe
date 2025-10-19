/**
 * DirectionsButton Component
 * 
 * Button component for opening directions to venue in
 * user's preferred map application.
 * 
 * @module pages/_components/DirectionsButton
 */

import React from 'react'
import { Navigation } from 'lucide-react'
import type { VenueDetails } from '@/config/events'
import { cn } from '@/lib/utils/cn'

export interface DirectionsButtonProps {
  /** Venue to get directions to */
  venue: VenueDetails
  /** Click handler */
  onClick: (venue: VenueDetails) => void
  /** Additional CSS classes */
  className?: string
  /** Button variant */
  variant?: 'primary' | 'secondary'
  /** Full width button */
  fullWidth?: boolean
}

/**
 * DirectionsButton Component
 * 
 * Opens directions in user's map app with platform detection
 */
export const DirectionsButton: React.FC<DirectionsButtonProps> = ({
  venue,
  onClick,
  className,
  variant = 'primary',
  fullWidth = false
}) => {
  const handleClick = () => {
    onClick(venue)
  }

  const baseClasses = cn(
    'inline-flex items-center justify-center gap-2',
    'px-6 py-3 rounded-lg font-medium',
    'transition-all duration-150',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  )

  const variantClasses = {
    primary: cn(
      'bg-blue-600 hover:bg-blue-700 active:bg-blue-800',
      'text-white',
      'focus:ring-blue-500',
      'shadow-md hover:shadow-lg'
    ),
    secondary: cn(
      'bg-white hover:bg-gray-50 active:bg-gray-100',
      'text-gray-900 border border-gray-300',
      'focus:ring-gray-500',
      'dark:bg-gray-800 dark:hover:bg-gray-700',
      'dark:text-white dark:border-gray-600'
    )
  }

  const widthClasses = fullWidth ? 'w-full' : ''

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        baseClasses,
        variantClasses[variant],
        widthClasses,
        className
      )}
      aria-label={`Get directions to ${venue.name}`}
    >
      <Navigation className="w-5 h-5" aria-hidden="true" />
      <span>Get Directions</span>
    </button>
  )
}
