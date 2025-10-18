/**
 * RSVP Service
 * 
 * Handles all RSVP-related API calls with proper error handling,
 * rate limiting detection, response parsing, and intelligent retry logic.
 * 
 * Features:
 * - Automatic retry on 502/503 (machine wake-up)
 * - Exponential backoff
 * - Vietnamese error messages
 * - Console logging for debugging
 * 
 * @module services/rsvpService
 */

import axios, { AxiosError } from 'axios'
import type { RSVPFormData } from '../lib/schemas/rsvpSchema'
import { executeWithRetry, getErrorMessage } from './apiRetryService'

// Get API base URL from environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

/**
 * API Response interfaces
 */
export interface RSVPSuccessResponse {
  success: true
  data: {
    id: string
    message: string
    rsvp?: {
      id: string
      name: string
      guestCount: number
      willAttend: boolean
      venue: string
      wishes: string
      createdAt: string
    }
  }
}

export interface RSVPErrorResponse {
  success: false
  error: string
  errors?: Array<{
    type: string
    value?: unknown
    msg: string
    path: string
    location: string
  }>
}

export type RSVPResponse = RSVPSuccessResponse | RSVPErrorResponse

/**
 * Custom error class for RSVP errors
 */
export class RSVPError extends Error {
  public statusCode?: number
  public validationErrors?: RSVPErrorResponse['errors']

  constructor(message: string, statusCode?: number, validationErrors?: RSVPErrorResponse['errors']) {
    super(message)
    this.name = 'RSVPError'
    this.statusCode = statusCode
    this.validationErrors = validationErrors
  }
}

/**
 * Submit RSVP form data to the API
 * 
 * Includes intelligent retry logic for handling machine wake-up scenarios.
 * All retry progress is logged to console for debugging.
 * 
 * @param data - RSVP form data to submit
 * @returns Promise with the API response containing RSVP confirmation details
 * @throws RSVPError with user-friendly message if submission fails
 */
export const submitRSVP = async (
  data: RSVPFormData
): Promise<RSVPSuccessResponse> => {
  try {
    console.log('📤 [RSVP Service] Submitting RSVP:', {
      name: data.name,
      guestCount: data.guestCount,
      willAttend: data.willAttend,
      venue: data.venue,
      hasGuestId: !!data.guestId
    })

    // Execute with retry logic
    const response = await executeWithRetry<RSVPResponse>(
      () => axios.post<RSVPResponse>(
        `${API_BASE_URL}/api/rsvp`,
        {
          guestId: data.guestId,
          name: data.name,
          guestCount: data.guestCount,
          willAttend: data.willAttend,
          wishes: data.wishes,
          venue: data.venue,
          honeypot: data.honeypot
        },
        {
          timeout: 15000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      ),
      {
        maxRetries: 3,
        initialDelay: 1000,
        maxDelay: 10000,
        backoffMultiplier: 2,
        useJitter: true,
      }
    )

    console.log('✅ [RSVP Service] API response:', response.data)

    if (response.data.success) {
      return response.data
    } else {
      const errorResponse = response.data
      throw new RSVPError(
        errorResponse.error || 'Có lỗi xảy ra khi gửi RSVP',
        response.status,
        errorResponse.errors
      )
    }
  } catch (error) {
    console.error('❌ [RSVP Service] Error after all retries:', error)

    // Handle axios errors
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<RSVPErrorResponse>

      // Get user-friendly error message
      const userMessage = getErrorMessage(axiosError)

      // Rate limiting error (429)
      if (axiosError.response?.status === 429) {
        throw new RSVPError(
          'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau 15 phút.',
          429
        )
      }

      // Validation error (400)
      if (axiosError.response?.status === 400) {
        const errorData = axiosError.response.data
        throw new RSVPError(
          errorData.error || 'Dữ liệu không hợp lệ',
          400,
          errorData.errors
        )
      }

      // Server error (500+) - Already retried
      if (axiosError.response?.status && axiosError.response.status >= 500) {
        throw new RSVPError(
          userMessage + ' (Đã thử lại 3 lần)',
          axiosError.response.status
        )
      }

      // Network error (no response) - Already retried
      if (axiosError.request && !axiosError.response) {
        throw new RSVPError(
          userMessage + ' (Đã thử lại 3 lần)',
          0
        )
      }

      // Other axios errors
      throw new RSVPError(
        axiosError.response?.data?.error || userMessage,
        axiosError.response?.status
      )
    }

    // Handle RSVPError instances
    if (error instanceof RSVPError) {
      throw error
    }

    // Generic error
    throw new RSVPError(
      error instanceof Error ? error.message : 'Có lỗi không xác định xảy ra'
    )
  }
}

/**
 * Get RSVP statistics for a venue
 * 
 * @param venue - Venue name ('hue' or 'hanoi')
 * @returns Promise with statistics
 */
export const getRSVPStats = async (venue: 'hue' | 'hanoi'): Promise<{
  total: number
  attending: number
  notAttending: number
  totalGuests: number
}> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/rsvp/stats/${venue}`,
      { timeout: 10000 }
    )

    if (response.data.success) {
      return response.data.data
    }

    throw new Error('Failed to fetch statistics')
  } catch (error) {
    console.error('❌ [RSVP Service] Failed to fetch stats:', error)
    throw error
  }
}
