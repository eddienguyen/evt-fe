/**
 * Icon Wrapper Component
 * 
 * Reusable icon container with consistent styling and size variants.
 * Provides a standardized way to display icons across the application.
 * 
 * @module components/ui/IconWrapper
 */

import React from 'react'
import { cn } from '@/lib/utils/cn'

export type IconSize = 'sm' | 'md' | 'lg'
export type IconVariant = 'default' | 'gold' | 'secondary' | 'white'

export interface IconWrapperProps {
  /** Icon element to render */
  children: React.ReactNode
  /** Size variant */
  size?: IconSize
  /** Color variant */
  variant?: IconVariant
  /** Additional CSS classes */
  className?: string
  /** ARIA label for accessibility */
  ariaLabel?: string
}

/**
 * Icon Wrapper Component
 * 
 * Wraps icons with consistent sizing and styling. Supports multiple
 * size and color variants following the design system.
 * 
 * @example
 * ```tsx
 * import { MapPin } from 'lucide-react'
 * 
 * <IconWrapper size="md" variant="gold" ariaLabel="Location">
 *   <MapPin />
 * </IconWrapper>
 * ```
 */
const IconWrapper: React.FC<IconWrapperProps> = ({
  children,
  size = 'md',
  variant = 'default',
  className,
  ariaLabel
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10 md:w-12 md:h-12',
    lg: 'w-12 h-12 md:w-14 md:h-14'
  }

  // Icon size within container
  const iconSizeClasses = {
    sm: '[&>svg]:w-4 [&>svg]:h-4',
    md: '[&>svg]:w-5 [&>svg]:h-5 md:[&>svg]:w-6 md:[&>svg]:h-6',
    lg: '[&>svg]:w-6 [&>svg]:h-6 md:[&>svg]:w-7 md:[&>svg]:h-7'
  }

  // Variant color classes
  const variantClasses = {
    default: 'bg-base-light text-text',
    gold: 'bg-accent-gold/10 text-accent-gold',
    secondary: 'bg-base-light text-text-secondary',
    white: 'bg-white/10 text-accent-white'
  }

  return (
    <div
      className={cn(
        // Base styles
        'inline-flex items-center justify-center rounded-lg shrink-0',
        // Size
        sizeClasses[size],
        // Icon size
        iconSizeClasses[size],
        // Variant
        variantClasses[variant],
        // Custom classes
        className
      )}
      aria-label={ariaLabel}
      role={ariaLabel ? 'img' : undefined}
    >
      {children}
    </div>
  )
}

export default IconWrapper
