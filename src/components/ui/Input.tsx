/**
 * Input Component
 * 
 * Reusable text input component with validation states and accessibility support.
 * Supports error/success states, required field indicators, and help text.
 * 
 * @module components/ui/Input
 */

import React from 'react'
import { cn } from '../../lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Label text for the input field
   */
  label?: string

  /**
   * Additional class names for the input element
   */
  labelClassName?: string
  
  /**
   * Error message to display below the input
   */
  error?: string
  
  /**
   * Success message to display below the input
   */
  success?: string
  
  /**
   * Help text to display below the input
   */
  helperText?: string
  
  /**
   * Whether the field is required
   * @default false
   */
  required?: boolean
  
  /**
   * Whether to display full width
   * @default true
   */
  fullWidth?: boolean
  
  /**
   * Left icon to display inside the input
   */
  leftIcon?: React.ReactNode
  
  /**
   * Right icon to display inside the input
   */
  rightIcon?: React.ReactNode
}

/**
 * Input component with label, validation states, and accessibility support
 * 
 * @example
 * ```tsx
 * // Basic input
 * <Input
 *   label="Email Address"
 *   type="email"
 *   placeholder="you@example.com"
 *   required
 * />
 * 
 * // Input with error
 * <Input
 *   label="Full Name"
 *   error="Please enter your full name"
 *   value={name}
 *   onChange={(e) => setName(e.target.value)}
 * />
 * 
 * // Input with success
 * <Input
 *   label="Email"
 *   success="Email is valid"
 *   value={email}
 * />
 * 
 * // Input with helper text
 * <Input
 *   label="Phone Number"
 *   helperText="Format: +84 123 456 789"
 *   type="tel"
 * />
 * 
 * // Input with icons
 * <Input
 *   label="Search"
 *   leftIcon={<SearchIcon className="w-5 h-5" />}
 *   placeholder="Search guests..."
 * />
 * ```
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      labelClassName,
      error,
      success,
      helperText,
      required = false,
      fullWidth = true,
      leftIcon,
      rightIcon,
      className,
      id,
      type = 'text',
      ...props
    },
    ref
  ) => {
    // Generate unique ID if not provided
    const generatedId = React.useId()
    const inputId = id || `input-${generatedId}`
    const errorId = `${inputId}-error`
    const helperId = `${inputId}-helper`
    
    // Determine validation state
    const hasError = Boolean(error)
    const hasSuccess = Boolean(success) && !hasError
    const hasHelperText = Boolean(helperText) && !hasError && !hasSuccess

    // Base input styles
    const baseInputStyles = cn(
      'w-full px-4 py-3 rounded-lg',
      'font-body text-base text-text',
      'bg-white border-2',
      'transition-all duration-150',
      'placeholder:text-text-lighter',
      'focus:outline-none focus:ring-2 focus:ring-offset-1',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-base-light'
    )

    // Validation state styles
    const validationStyles = cn(
      hasError && 'border-error focus:border-error focus:ring-error',
      hasSuccess && 'border-success focus:border-success focus:ring-success',
      !hasError && !hasSuccess && 'border-text-lighter focus:border-accent-gold focus:ring-accent-gold'
    )

    // Combined input styles
    const inputStyles = cn(
      baseInputStyles,
      validationStyles,
      leftIcon ? 'pl-11' : '',
      rightIcon ? 'pr-11' : '',
      className
    )

    // Helper text styles
    const getHelperTextStyles = () => {
      if (hasError) return 'text-error'
      if (hasSuccess) return 'text-success'
      return 'text-text-light'
    }

    return (
      <div className={cn('flex flex-col gap-2', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn("block text-sm font-medium text-text", labelClassName)}
          >
            {label}
            {required && <span className="text-error ml-1" aria-label="required">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light pointer-events-none">
              {leftIcon}
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={inputStyles}
            aria-invalid={hasError}
            aria-describedby={cn(
              hasError && errorId,
              hasSuccess && helperId,
              hasHelperText && helperId
            )}
            required={required}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light pointer-events-none">
              {rightIcon}
            </div>
          )}

          {/* Validation Icons */}
          {hasError && !rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-error pointer-events-none">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}
          
          {hasSuccess && !rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-success pointer-events-none">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>

        {/* Helper/Error/Success Text */}
        {(error || success || helperText) && (
          <p
            id={hasError ? errorId : helperId}
            className={cn('text-sm', getHelperTextStyles())}
            role={hasError ? 'alert' : undefined}
          >
            {error || success || helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
