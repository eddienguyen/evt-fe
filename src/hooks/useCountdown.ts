/**
 * Countdown Hook
 * 
 * Custom React hook for countdown timer logic with automatic updates.
 * Handles timezone conversion, expired state, and cleanup.
 * 
 * @module hooks/useCountdown
 */

import { useState, useEffect, useRef, useMemo } from 'react'
import { 
  calculateTimeRemaining, 
  padZero, 
  formatTimeForScreenReader,
  type TimeRemaining 
} from '@/lib/utils/countdown'

/**
 * Countdown state interface
 */
export interface CountdownState extends TimeRemaining {
  /** Zero-padded days display */
  displayDays: string
  /** Zero-padded hours display */
  displayHours: string
  /** Zero-padded minutes display */
  displayMinutes: string
  /** Zero-padded seconds display */
  displaySeconds: string
  /** Screen reader announcement text */
  announcementText: string
}

/**
 * Countdown hook options
 */
export interface UseCountdownOptions {
  /** Target date (ISO format or Date object) */
  targetDate: string | Date
  /** Update interval in milliseconds (default: 1000) */
  updateInterval?: number
  /** Callback when countdown expires */
  onExpire?: () => void
  /** Callback on each update */
  onUpdate?: (state: CountdownState) => void
}

/**
 * Custom hook for countdown timer
 * 
 * Provides real-time countdown with automatic cleanup and timezone handling.
 * 
 * @param options - Countdown configuration options
 * @returns Countdown state with formatted display values
 * 
 * @example
 * ```tsx
 * const countdown = useCountdown({
 *   targetDate: '2025-11-01T07:00:00+07:00',
 *   onExpire: () => console.log('Event started!')
 * })
 * 
 * return (
 *   <div>
 *     <span>{countdown.displayDays} days</span>
 *     <span>{countdown.displayHours} hours</span>
 *   </div>
 * )
 * ```
 */
export function useCountdown(options: UseCountdownOptions): CountdownState {
  const {
    targetDate,
    updateInterval = 1000,
    onExpire,
    onUpdate
  } = options

  // Use ref for callbacks to avoid effect dependencies
  const onExpireRef = useRef(onExpire)
  const onUpdateRef = useRef(onUpdate)
  
  useEffect(() => {
    onExpireRef.current = onExpire
    onUpdateRef.current = onUpdate
  }, [onExpire, onUpdate])

  // Initial calculation
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() => 
    calculateTimeRemaining(targetDate)
  )

  // Check if previous state was not expired (for onExpire callback)
  const wasNotExpiredRef = useRef(!timeRemaining.isExpired)

  // Store isExpired in ref to avoid recreating interval
  const isExpiredRef = useRef(timeRemaining.isExpired)
  
  useEffect(() => {
    isExpiredRef.current = timeRemaining.isExpired
  }, [timeRemaining.isExpired])

  useEffect(() => {
    // If already expired, don't start interval
    if (isExpiredRef.current) {
      if (wasNotExpiredRef.current && onExpireRef.current) {
        onExpireRef.current()
      }
      return
    }

    // Update countdown every interval
    const intervalId = setInterval(() => {
      const newTime = calculateTimeRemaining(targetDate)
      setTimeRemaining(newTime)

      // Call onUpdate callback
      if (onUpdateRef.current) {
        const state = createCountdownState(newTime)
        onUpdateRef.current(state)
      }

      // Check if just expired
      if (newTime.isExpired && wasNotExpiredRef.current) {
        wasNotExpiredRef.current = false
        if (onExpireRef.current) {
          onExpireRef.current()
        }
      }
    }, updateInterval)

    // Cleanup interval on unmount
    return () => {
      clearInterval(intervalId)
    }
  }, [targetDate, updateInterval]) // Removed timeRemaining.isExpired dependency

  // Create formatted state
  const countdownState = useMemo(() => 
    createCountdownState(timeRemaining),
    [timeRemaining]
  )

  return countdownState
}

/**
 * Create countdown state with formatted display values
 */
function createCountdownState(timeRemaining: TimeRemaining): CountdownState {
  return {
    ...timeRemaining,
    displayDays: padZero(timeRemaining.days),
    displayHours: padZero(timeRemaining.hours),
    displayMinutes: padZero(timeRemaining.minutes),
    displaySeconds: padZero(timeRemaining.seconds),
    announcementText: formatTimeForScreenReader(timeRemaining)
  }
}

/**
 * Hook for periodic screen reader announcements
 * 
 * Announces time remaining every minute to screen readers.
 * 
 * @param countdown - Countdown state
 * @param enabled - Whether announcements are enabled
 * @returns Announcement trigger state
 */
export function useCountdownAnnouncement(
  countdown: CountdownState,
  enabled: boolean = true
): { shouldAnnounce: boolean } {
  const [shouldAnnounce, setShouldAnnounce] = useState(false)
  const lastAnnouncedMinute = useRef<number>(-1)

  useEffect(() => {
    if (!enabled || countdown.isExpired) {
      return
    }

    // Announce every minute (when seconds reach 0)
    if (countdown.seconds === 0 && lastAnnouncedMinute.current !== countdown.minutes) {
      lastAnnouncedMinute.current = countdown.minutes
      setShouldAnnounce(true)
      
      // Reset after announcement
      const timeout = setTimeout(() => setShouldAnnounce(false), 100)
      return () => clearTimeout(timeout)
    }
  }, [countdown.seconds, countdown.minutes, countdown.isExpired, enabled])

  return { shouldAnnounce }
}
