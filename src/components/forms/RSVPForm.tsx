/**
 * RSVP Form Component
 * 
 * Main RSVP form with React Hook Form integration, Zod validation,
 * and comprehensive accessibility support.
 * 
 * @module components/forms/RSVPForm
 */

import React, { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Minus, Plus } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { cn } from '@/lib/utils'
import { announceToScreenReader } from '@/lib/a11y'
import { 
  rsvpSchema, 
  rsvpDefaultValues, 
  type RSVPFormData 
} from '@/lib/schemas/rsvpSchema'
import { 
  RSVP_LABELS, 
  RSVP_PLACEHOLDERS, 
  RSVP_HELP_TEXT, 
  RSVP_BUTTONS,
  RSVP_A11Y 
} from '@/lib/constants/rsvp'

/**
 * RSVP Form Props
 */
export interface RSVPFormProps {
  /** Form submission handler */
  onSubmit: (data: RSVPFormData) => Promise<void>
  /** Loading state during submission */
  isSubmitting?: boolean
  /** Server error message */
  error?: string
  /** Form disabled state */
  disabled?: boolean
}

/**
 * Guest Count Input Component
 */
interface GuestCountInputProps {
  value: number
  onChange: (value: number) => void
  error?: string
  disabled?: boolean
}

const GuestCountInput: React.FC<GuestCountInputProps> = ({
  value,
  onChange,
  error,
  disabled = false
}) => {
  const inputId = useId()
  const errorId = useId()

  const increment = () => {
    if (value < 10) {
      onChange(value + 1)
    }
  }

  const decrement = () => {
    if (value > 1) {
      onChange(value - 1)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(e.target.value) || 1
    onChange(Math.max(1, Math.min(10, num)))
  }

  return (
    <div className="space-y-2">
      <label 
        htmlFor={inputId}
        className="block text-sm font-medium text-text"
      >
        {RSVP_LABELS.guestCount} <span className="text-error">*</span>
      </label>
      
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={decrement}
          disabled={disabled || value <= 1}
          aria-label="Giảm số lượng khách"
          className="w-10 h-10 p-0"
        >
          <Minus className="w-4 h-4" />
        </Button>
        
        <input
          id={inputId}
          type="number"
          min="1"
          max="10"
          value={value}
          onChange={handleInputChange}
          disabled={disabled}
          className={cn(
            'w-20 text-center rounded-lg border border-gray-300 px-3 py-2',
            'focus:ring-2 focus:ring-accent-gold focus:border-accent-gold',
            'disabled:bg-gray-100 disabled:cursor-not-allowed',
            error && 'border-error focus:ring-error focus:border-error'
          )}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={!!error}
        />
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={increment}
          disabled={disabled || value >= 10}
          aria-label="Tăng số lượng khách"
          className="w-10 h-10 p-0"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      <p className="text-sm text-text-light">
        {RSVP_HELP_TEXT.guestCount}
      </p>
      
      {error && (
        <p id={errorId} className="text-sm text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

/**
 * RSVP Form Component
 */
const RSVPForm: React.FC<RSVPFormProps> = ({
  onSubmit,
  isSubmitting = false,
  error,
  disabled = false
}) => {
  const formId = useId()
  const honeypotId = useId()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    reset
  } = useForm<RSVPFormData>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: rsvpDefaultValues,
    mode: 'onChange'
  })

  const guestCount = watch('guestCount')

  // Handle form submission
  const handleFormSubmit = async (data: RSVPFormData) => {
    try {
      await onSubmit(data)
      announceToScreenReader(RSVP_A11Y.formSubmitted)
      reset() // Reset form on success
    } catch {
      announceToScreenReader(RSVP_A11Y.formError, 'assertive')
    }
  }

  // Announce validation errors
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      announceToScreenReader(RSVP_A11Y.formError, 'assertive')
    }
  }, [errors])

  const isFormDisabled = disabled || isSubmitting

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6"
      aria-label={RSVP_A11Y.formLabel}
      noValidate
    >
      {/* Server Error Display */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200" role="alert">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Name Field */}
      <Input
        {...register('name')}
        label={RSVP_LABELS.name}
        placeholder={RSVP_PLACEHOLDERS.name}
        error={errors.name?.message}
        helperText={RSVP_HELP_TEXT.name}
        required
        disabled={isFormDisabled}
        autoComplete="name"
      />

      {/* Guest Count Field */}
      <GuestCountInput
        value={guestCount}
        onChange={(value) => setValue('guestCount', value, { shouldValidate: true })}
        error={errors.guestCount?.message}
        disabled={isFormDisabled}
      />

      {/* Phone Field */}
      <Input
        {...register('phone')}
        label={RSVP_LABELS.phone}
        placeholder={RSVP_PLACEHOLDERS.phone}
        error={errors.phone?.message}
        helperText={RSVP_HELP_TEXT.phone}
        type="tel"
        disabled={isFormDisabled}
        autoComplete="tel"
      />

      {/* Wishes Field */}
      <Textarea
        {...register('wishes')}
        label={RSVP_LABELS.wishes}
        placeholder={RSVP_PLACEHOLDERS.wishes}
        error={errors.wishes?.message}
        helperText={RSVP_HELP_TEXT.wishes}
        required
        rows={4}
        maxLength={500}
        showCharCount
        disabled={isFormDisabled}
      />

      {/* Honeypot Field (Hidden) */}
      <div style={{ position: 'absolute', left: '-9999px' }}>
        <label htmlFor={honeypotId} className="sr-only">
          {RSVP_A11Y.honeypotField}
        </label>
        <input
          id={honeypotId}
          {...register('honeypot')}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={isFormDisabled || !isValid}
          aria-label={RSVP_A11Y.submitButton}
          className="min-w-32"
        >
          {isSubmitting ? RSVP_BUTTONS.submitting : RSVP_BUTTONS.submit}
        </Button>
      </div>
    </form>
  )
}

export default RSVPForm