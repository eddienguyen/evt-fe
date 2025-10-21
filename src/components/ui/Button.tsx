/**
 * Button Component
 * 
 * Reusable button component with multiple variants following the design system.
 * Supports 5 variants: primary, secondary, outline, ghost, and icon.
 * Includes proper accessibility attributes and loading states.
 * 
 * @module components/ui/Button
 */

import React from 'react'
import { cn } from '../../lib/utils'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'icon'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual variant of the button
   * @default 'primary'
   */
  variant?: ButtonVariant
  
  /**
   * Size of the button
   * @default 'md'
   */
  size?: ButtonSize
  
  /**
   * Whether the button is in a loading state
   * @default false
   */
  isLoading?: boolean
  
  /**
   * Whether the button should take full width
   * @default false
   */
  fullWidth?: boolean
  
  /**
   * Icon to display before the button text (React element or SVG)
   */
  leftIcon?: React.ReactNode
  
  /**
   * Icon to display after the button text (React element or SVG)
   */
  rightIcon?: React.ReactNode
  
  /**
   * Children to render inside the button
   */
  children?: React.ReactNode
}

/**
 * Button component with multiple variants and accessibility support
 * 
 * @example
 * ```tsx
 * // Primary button (default)
 * <Button onClick={handleSubmit}>Submit RSVP</Button>
 * 
 * // Secondary button
 * <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
 * 
 * // Outline button
 * <Button variant="outline">View More</Button>
 * 
 * // Ghost button
 * <Button variant="ghost" onClick={handleClose}>Close</Button>
 * 
 * // Icon button
 * <Button variant="icon" aria-label="Close panel">
 *   <XIcon className="w-6 h-6" />
 * </Button>
 * 
 * // Loading state
 * <Button isLoading disabled>Processing...</Button>
 * 
 * // With icons
 * <Button leftIcon={<HeartIcon />}>Add to Favorites</Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      className,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    // Base styles applied to all buttons
    const baseStyles = cn(
      'inline-flex items-center justify-center',
      'font-medium transition-all',
      'focus:outline-none focus:ring-2 focus:ring-accent-gold focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      fullWidth && 'w-full'
    )

    // Variant-specific styles
    const variantStyles = {
      primary: cn(
        'bg-accent-gold text-white',
        'hover:bg-accent-gold-dark',
        'shadow-soft hover:shadow-medium',
        'duration-250'
      ),
      secondary: cn(
        'bg-white text-accent-gold',
        'border-2 border-accent-gold',
        'hover:bg-accent-gold hover:text-white',
        'shadow-soft hover:shadow-medium',
        'duration-250'
      ),
      outline: cn(
        'bg-transparent text-accent-gold-light',
        'border border-text-light',
        'hover:bg-base hover:border-accent-gold hover:text-accent-gold',
        'duration-250'
      ),
      ghost: cn(
        'bg-transparent text-accent-gold',
        'hover:bg-base-light',
        'duration-150'
      ),
      icon: cn(
        'bg-transparent text-text',
        'hover:bg-base-light',
        'duration-150'
      ),
    }

    // Size-specific styles
    const sizeStyles = {
      sm: variant === 'icon' ? 'p-1.5' : 'px-4 py-2 text-sm rounded-md gap-2',
      md: variant === 'icon' ? 'p-2' : 'px-6 py-3  rounded-lg gap-2',
      lg: variant === 'icon' ? 'p-3' : 'px-8 py-4 text-lg rounded-xl gap-3',
    }

    // Combine all styles
    const buttonStyles = cn(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      className
    )

    // Loading spinner SVG
    const LoadingSpinner = () => (
      <svg
        className="animate-spin h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    )

    return (
      <button
        ref={ref}
        type={type}
        className={buttonStyles}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <LoadingSpinner />
            {children && <span>{children}</span>}
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0" aria-hidden="true">{leftIcon}</span>}
            {children && <span>{children}</span>}
            {rightIcon && <span className="flex-shrink-0" aria-hidden="true">{rightIcon}</span>}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
