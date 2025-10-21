/**
 * RSVP Form Component
 * 
 * Main RSVP form with React Hook Form integration, Zod validation,
 * and comprehensive accessibility support. Updated for Story #17.
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
import { useGuest } from '@/contexts/GuestContext'
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
  /** Default venue based on current page */
  defaultVenue?: 'hue' | 'hanoi'
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
        {RSVP_LABELS.guestCount}
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
  disabled = false,
  defaultVenue
}) => {
  const honeypotId = useId()
  const { guest } = useGuest()

  const {
    register,
    watch,
    setValue,
    trigger,
    formState: { errors },
    reset
  } = useForm<RSVPFormData>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: rsvpDefaultValues,
    mode: 'onChange'
  })

  const guestCount = watch('guestCount')

  // Auto-fill form with guest data if available, or use defaultVenue from current page
  useEffect(() => {
    if (guest) {
      setValue('guestId', guest.id)
      setValue('name', guest.name)
      setValue('venue', guest.venue)
    } else if (defaultVenue) {
      // Set venue based on current page (HN.tsx or Hue.tsx)
      setValue('venue', defaultVenue)
    }
  }, [guest, defaultVenue, setValue])

  // Handle form submission with explicit willAttend value
  const handleFormSubmitWithAttendance = async (willAttendValue: boolean) => {
    // Trigger validation for all fields except willAttend
    const isValidForm = await trigger(['name', 'guestCount', 'wishes', 'venue', 'honeypot'])
    
    if (!isValidForm) {
      announceToScreenReader(RSVP_A11Y.formError, 'assertive')
      return
    }
    
    // Get current form values
    const formData = watch()
    
    try {
      const submitData = {
        ...formData,
        willAttend: willAttendValue
      }
      await onSubmit(submitData)
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
  // Disable name and venue if guest is present (personalized invitation)
  const isNameDisabled = isFormDisabled || !!guest
  const isVenueDisabled = isFormDisabled || !!guest

  return (
    <div className="space-y-6">
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
        // helperText={guest ? 'Tên được lấy từ thiệp mời cá nhân' : RSVP_HELP_TEXT.name}
        required
        disabled={isNameDisabled}
        autoComplete="name"
      />

      {/* Guest Count Field */}
      <GuestCountInput
        value={guestCount}
        onChange={(value) => setValue('guestCount', value, { shouldValidate: true })}
        error={errors.guestCount?.message}
        disabled={isFormDisabled}
      />

      {/* Venue Field (Dropdown) */}
      <div className="space-y-2">
        <label htmlFor="venue-select" className="block text-sm font-medium text-text">
          {RSVP_LABELS.venue}
        </label>
        <select
          id="venue-select"
          {...register('venue')}
          disabled={isVenueDisabled}
          className={cn(
            'w-full rounded-lg border border-gray-300 px-3 py-2',
            'focus:ring-2 focus:ring-accent-gold focus:border-accent-gold',
            'disabled:bg-gray-100 disabled:cursor-not-allowed',
            errors.venue && 'border-error focus:ring-error focus:border-error'
          )}
        >
          <option value="hue">{RSVP_LABELS.venueHue}</option>
          <option value="hanoi">{RSVP_LABELS.venueHanoi}</option>
        </select>
        {errors.venue?.message && (
          <p className="text-sm text-error">{errors.venue.message}</p>
        )}
        {/* <p className="text-xs text-text-light">
          {guest ? 'Địa điểm được lấy từ thiệp mời cá nhân' : RSVP_HELP_TEXT.venue}
        </p> */}
      </div>

      {/* Wishes Field */}
      <Textarea
        {...register('wishes')}
        label={RSVP_LABELS.wishes}
        placeholder={RSVP_PLACEHOLDERS.wishes}
        error={errors.wishes?.message}
        // helperText={RSVP_HELP_TEXT.wishes}
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

      {/* Attendance Action Buttons */}
      <div className="flex flex-col gap-3 pt-4">
        <Button
          type="button"
          onClick={() => handleFormSubmitWithAttendance(true)}
          isLoading={isSubmitting}
          disabled={isFormDisabled}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white"
        >
          {isSubmitting ? RSVP_BUTTONS.submitting : RSVP_LABELS.attendingYes}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => handleFormSubmitWithAttendance(false)}
          isLoading={isSubmitting}
          disabled={isFormDisabled}
          className="w-full"
        >
          {isSubmitting ? RSVP_BUTTONS.submitting : RSVP_LABELS.attendingNo}
        </Button>
      </div>
    </div>
  )
}

export default RSVPForm