/**
 * RSVP Success State Component
 * 
 * Displays success confirmation after RSVP submission with
 * calendar download functionality.
 * 
 * @module components/forms/RSVPSuccessState
 */

import React from 'react'
import { Check, Calendar, Download } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { announceToScreenReader } from '@/lib/a11y'
import { downloadWeddingCalendar, isCalendarDownloadSupported } from '@/lib/calendar'
import { 
  RSVP_SUCCESS, 
  RSVP_BUTTONS,
  RSVP_A11Y 
} from '@/lib/constants/rsvp'

/**
 * RSVP Success State Props
 */
export interface RSVPSuccessStateProps {
  /** Close panel handler */
  onClose: () => void
  /** RSVP submission ID (optional) */
  rsvpId?: string
  /** Guest name from submission */
  guestName?: string
}

/**
 * RSVP Success State Component
 */
const RSVPSuccessState: React.FC<RSVPSuccessStateProps> = ({
  onClose,
  rsvpId,
  guestName
}) => {
  // Handle calendar download
  const handleCalendarDownload = () => {
    try {
      downloadWeddingCalendar()
      announceToScreenReader('Tệp lịch đã được tải xuống thành công')
    } catch (error) {
      console.error('Calendar download failed:', error)
      announceToScreenReader('Không thể tải lịch. Vui lòng thử lại.', 'assertive')
    }
  }

  const showCalendarDownload = isCalendarDownloadSupported()

  return (
    <div className="p-6 h-full flex flex-col items-center justify-center text-center space-y-6">
      {/* Success Icon */}
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        <Check className="w-8 h-8 text-green-600" aria-hidden="true" />
      </div>

      {/* Success Title */}
      <div className="space-y-2">
        <h2 className="text-2xl font-heading font-bold text-text">
          {RSVP_SUCCESS.title}
        </h2>
        
        {guestName && (
          <p className="text-lg text-text-light">
            Cảm ơn {guestName}!
          </p>
        )}
      </div>

      {/* Success Message */}
      <div className="space-y-4 max-w-md">
        <p className="text-text-light leading-relaxed">
          {RSVP_SUCCESS.message}
        </p>
        
        <div className="space-y-2">
          <p className="text-sm text-text-light">
            {RSVP_SUCCESS.nextSteps}
          </p>
          
          {rsvpId && (
            <p className="text-xs text-text-lighter">
              Mã xác nhận: {rsvpId}
            </p>
          )}
        </div>
      </div>

      {/* Calendar Download Section */}
      {showCalendarDownload && (
        <div className="space-y-3 w-full max-w-sm">
          <p className="text-sm font-medium text-text">
            {RSVP_SUCCESS.calendarHint}
          </p>
          
          <Button
            variant="outline"
            onClick={handleCalendarDownload}
            leftIcon={<Calendar className="w-4 h-4" />}
            rightIcon={<Download className="w-4 h-4" />}
            aria-label={RSVP_A11Y.downloadButton}
            className="w-full"
          >
            {RSVP_BUTTONS.downloadCalendar}
          </Button>
        </div>
      )}

      {/* Close Button */}
      <div className="flex-grow flex items-end w-full max-w-sm">
        <Button
          variant="primary"
          onClick={onClose}
          aria-label={RSVP_A11Y.closeButton}
          className="w-full"
        >
          {RSVP_BUTTONS.close}
        </Button>
      </div>
    </div>
  )
}

export default RSVPSuccessState