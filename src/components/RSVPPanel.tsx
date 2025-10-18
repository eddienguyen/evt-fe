/**
 * RSVP Panel Component
 * 
 * Main RSVP panel that handles form submission to the backend API.
 * Manages form submission flow and state transitions.
 * 
 * Features:
 * - Intelligent retry logic for machine wake-up (logged to console)
 * - Simple loading indicator for users
 * - Enhanced error handling
 * 
 * @module components/RSVPPanel
 */

import React, { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { X, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import RSVPForm from '@/components/forms/RSVPForm'
import RSVPSuccessState from '@/components/forms/RSVPSuccessState'
import { announceToScreenReader, focusElement } from '@/lib/a11y'
import type { RSVPFormData } from '@/lib/schemas/rsvpSchema'
import { submitRSVP as submitRSVPAPI, RSVPError } from '@/services/rsvpService'
import { 
  RSVP_LABELS, 
  RSVP_ERRORS,
  RSVP_BUTTONS,
  RSVP_A11Y 
} from '@/lib/constants/rsvp'

/**
 * RSVP Panel Props
 */
export interface RSVPPanelProps {
  /** Panel open state */
  isOpen: boolean
  /** Close panel handler */
  onClose: () => void
}

/**
 * Submission state type
 */
type SubmissionState = 'idle' | 'submitting' | 'success' | 'error'

/**
 * API Response interface
 */
interface APIResponse {
  success: boolean
  data?: {
    id: string
    message: string
    guestName: string
  }
  error?: string
}

/**
 * Submit RSVP using real API
 * Note: Retry progress is logged to console, not shown to users
 */
const submitRSVP = async (
  data: RSVPFormData
): Promise<APIResponse> => {
  try {
    const response = await submitRSVPAPI(data)
    
    return {
      success: true,
      data: {
        id: response.data.id,
        message: response.data.message,
        guestName: data.name
      }
    }
  } catch (error) {
    if (error instanceof RSVPError) {
      throw new Error(error.message)
    }
    throw error
  }
}

/**
 * RSVP Panel Component
 */
const RSVPPanel: React.FC<RSVPPanelProps> = ({
  isOpen,
  onClose
}) => {
  const location = useLocation()
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [successData, setSuccessData] = useState<{ id: string; guestName: string } | null>(null)
  
  // Refs for focus management
  const panelRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  
  // Detect venue from current route
  const getDefaultVenue = (): 'hue' | 'hanoi' | undefined => {
    if (location.pathname.startsWith('/hn')) return 'hanoi'
    if (location.pathname.startsWith('/hue')) return 'hue'
    return undefined
  }
  const defaultVenue = getDefaultVenue()

  // Focus management when panel opens
  useEffect(() => {
    if (isOpen && titleRef.current) {
      // Small delay to ensure panel is fully rendered
      setTimeout(() => {
        if (titleRef.current) {
          focusElement(titleRef.current)
        }
      }, 100)
    }
  }, [isOpen])

  // Reset state when panel closes
  useEffect(() => {
    if (!isOpen) {
      setSubmissionState('idle')
      setErrorMessage('')
      setSuccessData(null)
    }
  }, [isOpen])

  // Handle form submission
  // Note: Retry logic is handled automatically in the background
  // Progress is logged to console, users see simple loading state
  const handleSubmit = async (data: RSVPFormData): Promise<void> => {
    setSubmissionState('submitting')
    setErrorMessage('')

    try {
      const response = await submitRSVP(data)
      
      if (response.success && response.data) {
        setSubmissionState('success')
        setSuccessData({
          id: response.data.id,
          guestName: data.name
        })
        announceToScreenReader('Xác nhận tham dự đã được gửi thành công')
      } else {
        throw new Error(response.error || RSVP_ERRORS.unexpectedError)
      }
    } catch (error) {
      setSubmissionState('error')
      
      // Handle different error types
      if (error instanceof Error) {
        if (error.message.includes('network') || error.message.includes('fetch')) {
          setErrorMessage(RSVP_ERRORS.networkError)
        } else if (error.message.includes('timeout')) {
          setErrorMessage(RSVP_ERRORS.timeout)
        } else if (error.message.includes('rate limit')) {
          setErrorMessage(RSVP_ERRORS.rateLimited)
        } else if (error.message.includes('spam')) {
          setErrorMessage(RSVP_ERRORS.spamDetected)
        } else {
          setErrorMessage(error.message || RSVP_ERRORS.unexpectedError)
        }
      } else {
        setErrorMessage(RSVP_ERRORS.unexpectedError)
      }

      announceToScreenReader(`Có lỗi xảy ra: ${errorMessage}`, 'assertive')
    }
  }

  // Handle successful close
  const handleSuccessClose = () => {
    announceToScreenReader('Đóng bảng xác nhận tham dự')
    onClose()
  }

  // Render success state
  if (submissionState === 'success' && successData) {
    return (
      <div className="p-6 h-full flex flex-col">
        <RSVPSuccessState
          onClose={handleSuccessClose}
          rsvpId={successData.id}
          guestName={successData.guestName}
        />
      </div>
    )
  }

  // Render form state
  return (
    <div ref={panelRef} className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 
          ref={titleRef}
          id="rsvp-panel-title" 
          className="text-2xl font-heading font-bold text-text"
          tabIndex={-1}
        >
          {RSVP_LABELS.title}
        </h2>
        
        <Button
          ref={closeButtonRef}
          variant="ghost"
          size="sm"
          onClick={onClose}
          aria-label={RSVP_A11Y.closeButton}
          className="w-10 h-10 p-0"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Description */}
      <p id="rsvp-panel-description" className="text-text-light mb-6">
        {RSVP_LABELS.description}
      </p>

      {/* Form Container */}
      <div className="flex-grow overflow-y-auto">
        <RSVPForm
          onSubmit={handleSubmit}
          isSubmitting={submissionState === 'submitting'}
          error={submissionState === 'error' ? errorMessage : undefined}
          disabled={submissionState === 'submitting'}
          defaultVenue={defaultVenue}
        />
      </div>

      {/* Retry Button for Error State */}
      {submissionState === 'error' && (
        <div className="mt-4 pt-4 border-t">
          <div className="mb-3 p-3 bg-error-light/10 border border-error-light rounded-lg">
            <p className="text-sm text-error">
              <strong>Lỗi:</strong> {errorMessage}
            </p>
            {errorMessage.includes('Đã thử lại 3 lần') && (
              <p className="text-xs text-text-light mt-2">
                Hệ thống đã tự động thử kết nối lại 3 lần nhưng không thành công. 
                Vui lòng kiểm tra kết nối internet hoặc thử lại sau ít phút.
              </p>
            )}
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setSubmissionState('idle')
              setErrorMessage('')
            }}
            className="w-full"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {RSVP_BUTTONS.tryAgain}
          </Button>
        </div>
      )}
    </div>
  )
}

export default RSVPPanel