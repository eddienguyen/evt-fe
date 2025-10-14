/**
 * Countdown Card Component
 * 
 * Individual time unit display card with number and label.
 * Supports smooth transitions and accessibility features.
 * 
 * @module components/countdown/CountdownCard
 */

import React from 'react'
import { cn } from '@/lib/utils/cn'

export interface CountdownCardProps {
  /** Numeric value to display */
  value: number
  /** Display label (e.g., "NGÀY", "GIỜ") */
  label: string
  /** Enable smooth number transitions */
  enableTransition?: boolean
  /** Custom CSS classes */
  className?: string
  /** Accessible description */
  ariaLabel?: string
}

/**
 * Countdown Card Component
 * 
 * Displays a single time unit (days, hours, minutes, or seconds)
 * in a card format with large numbers and labels.
 * 
 * @example
 * ```tsx
 * <CountdownCard
 *   value={120}
 *   label="NGÀY"
 *   enableTransition={true}
 *   ariaLabel="120 ngày"
 * />
 * ```
 */
const CountdownCard: React.FC<CountdownCardProps> = ({
  value,
  label,
  enableTransition = true,
  className,
  ariaLabel
}) => {
  return (
    <div
      className={cn(
        // Base styles
        'flex flex-col items-center justify-center',
        'bg-white rounded-lg shadow-md',
        'p-4 md:p-6',
        'border border-gray-100',
        // Hover effect
        'hover:shadow-lg hover:scale-105',
        'transition-all duration-300',
        className
      )}
      role="timer"
      aria-label={ariaLabel || `${value} ${label.toLowerCase()}`}
    >
      {/* Number Display */}
      <div
        className={cn(
          'font-heading text-4xl md:text-5xl lg:text-6xl font-bold',
          'text-accent-gold',
          'mb-1 md:mb-2',
          // Smooth transition for number changes
          enableTransition && 'transition-all duration-300 ease-in-out'
        )}
      >
        {value.toString().padStart(2, '0')}
      </div>

      {/* Label */}
      <div
        className={cn(
          'font-sans text-xs md:text-sm uppercase tracking-wide',
          'text-text-secondary',
          'font-semibold'
        )}
      >
        {label}
      </div>
    </div>
  )
}

export default CountdownCard
