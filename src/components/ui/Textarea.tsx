/**
 * Textarea Component
 * 
 * Reusable textarea component with validation states and accessibility support.
 * Supports error/success states, required field indicators, character count, and help text.
 * 
 * @module components/ui/Textarea
 */

import React from 'react'
import { cn } from '../../lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Label text for the textarea field
   */
  label?: string
  
  /**
   * Error message to display below the textarea
   */
  error?: string
  
  /**
   * Success message to display below the textarea
   */
  success?: string
  
  /**
   * Help text to display below the textarea
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
   * Maximum character count to display counter
   */
  maxLength?: number
  
  /**
   * Whether to show character count
   * @default false
   */
  showCharCount?: boolean
}

/**
 * Textarea component with label, validation states, and accessibility support
 * 
 * @example
 * ```tsx
 * // Basic textarea
 * <Textarea
 *   label="Your Message"
 *   placeholder="Write your wedding wishes here..."
 *   rows={4}
 *   required
 * />
 * 
 * // Textarea with error
 * <Textarea
 *   label="Message"
 *   error="Message must be at least 10 characters"
 *   value={message}
 *   onChange={(e) => setMessage(e.target.value)}
 * />
 * 
 * // Textarea with character count
 * <Textarea
 *   label="Wishes"
 *   maxLength={500}
 *   showCharCount
 *   value={wishes}
 *   onChange={(e) => setWishes(e.target.value)}
 * />
 * 
 * // Textarea with helper text
 * <Textarea
 *   label="Special Requests"
 *   helperText="Please let us know about any dietary restrictions or accessibility needs"
 *   rows={3}
 * />
 * ```
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      success,
      helperText,
      required = false,
      fullWidth = true,
      maxLength,
      showCharCount = false,
      className,
      id,
      value,
      rows = 4,
      ...props
    },
    ref
  ) => {
    // Generate unique ID if not provided
    const generatedId = React.useId()
    const textareaId = id || `textarea-${generatedId}`
    const errorId = `${textareaId}-error`
    const helperId = `${textareaId}-helper`
    
    // Determine validation state
    const hasError = Boolean(error)
    const hasSuccess = Boolean(success) && !hasError
    const hasHelperText = Boolean(helperText) && !hasError && !hasSuccess

    // Calculate character count
    const currentLength = typeof value === 'string' ? value.length : 0
    const showCounter = showCharCount || (maxLength !== undefined)

    // Base textarea styles
    const baseTextareaStyles = cn(
      'w-full px-4 py-3 rounded-lg',
      'font-body text-base text-text',
      'bg-white border-2',
      'transition-all duration-150',
      'placeholder:text-text-lighter',
      'focus:outline-none focus:ring-2 focus:ring-offset-1',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-base-light',
      'resize-y' // Allow vertical resizing only
    )

    // Validation state styles
    const validationStyles = cn(
      hasError && 'border-error focus:border-error focus:ring-error',
      hasSuccess && 'border-success focus:border-success focus:ring-success',
      !hasError && !hasSuccess && 'border-text-lighter focus:border-accent-gold focus:ring-accent-gold'
    )

    // Combined textarea styles
    const textareaStyles = cn(baseTextareaStyles, validationStyles, className)

    // Helper text styles
    const getHelperTextStyles = () => {
      if (hasError) return 'text-error'
      if (hasSuccess) return 'text-success'
      return 'text-text-light'
    }

    // Character count styles
    const getCharCountStyles = () => {
      if (!maxLength) return 'text-text-light'
      const percentage = (currentLength / maxLength) * 100
      if (percentage >= 100) return 'text-error'
      if (percentage >= 90) return 'text-warning'
      return 'text-text-light'
    }

    return (
      <div className={cn('flex flex-col gap-2', fullWidth && 'w-full')}>
        {/* Label and Character Count */}
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={textareaId}
              className="block text-sm font-medium text-text"
            >
              {label}
              {required && <span className="text-error ml-1" aria-label="required">*</span>}
            </label>
          )}
          
          {showCounter && (
            <span className={cn('text-xs', getCharCountStyles())} aria-live="polite">
              {maxLength ? `${currentLength} / ${maxLength}` : `${currentLength} characters`}
            </span>
          )}
        </div>

        {/* Textarea Field */}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          maxLength={maxLength}
          className={textareaStyles}
          aria-invalid={hasError}
          aria-describedby={cn(
            hasError && errorId,
            hasSuccess && helperId,
            hasHelperText && helperId
          )}
          required={required}
          value={value}
          {...props}
        />

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

Textarea.displayName = 'Textarea'

export default Textarea
