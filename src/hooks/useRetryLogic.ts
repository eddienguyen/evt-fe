/**
 * useRetryLogic Hook
 * 
 * React hook for managing retry logic state and UI updates.
 * Integrates with apiRetryService for intelligent retry handling.
 * 
 * Features:
 * - Retry state management
 * - Progress tracking
 * - Vietnamese loading messages
 * - Cleanup on unmount
 * 
 * @module hooks/useRetryLogic
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import type { AxiosResponse } from 'axios'
import {
  executeWithRetry,
  type RetryAttempt,
  type RetryConfig,
  RETRY_MESSAGES,
} from '../services/apiRetryService'

/**
 * Retry State
 */
export interface RetryState {
  /** Whether a retry operation is in progress */
  isRetrying: boolean
  /** Current retry attempt number (0 if not retrying) */
  currentAttempt: number
  /** Maximum number of attempts */
  maxAttempts: number
  /** Current loading message in Vietnamese */
  loadingMessage: string
  /** Whether the operation succeeded */
  isSuccess: boolean
  /** Whether the operation failed after all retries */
  isFailed: boolean
}

/**
 * useRetryLogic Hook Return Value
 */
export interface UseRetryLogicReturn {
  /** Current retry state */
  retryState: RetryState
  /** Execute request with retry logic */
  executeWithRetry: <T = any>(
    requestFn: () => Promise<AxiosResponse<T>>,
    config?: Partial<RetryConfig>
  ) => Promise<AxiosResponse<T>>
  /** Reset retry state */
  resetRetryState: () => void
}

/**
 * Initial retry state
 */
const INITIAL_RETRY_STATE: RetryState = {
  isRetrying: false,
  currentAttempt: 0,
  maxAttempts: 3,
  loadingMessage: '',
  isSuccess: false,
  isFailed: false,
}

/**
 * useRetryLogic Hook
 * 
 * Manages retry logic state and provides retry execution function.
 * Automatically cleans up on component unmount.
 * 
 * @returns Retry state and execution function
 * 
 * @example
 * ```tsx
 * const { retryState, executeWithRetry } = useRetryLogic()
 * 
 * const handleSubmit = async (data: FormData) => {
 *   try {
 *     const response = await executeWithRetry(
 *       () => api.post('/api/rsvp', data)
 *     )
 *     // Handle success
 *   } catch (error) {
 *     // Handle failure after all retries
 *   }
 * }
 * 
 * // Show loading state
 * {retryState.isRetrying && (
 *   <p>{retryState.loadingMessage}</p>
 * )}
 * ```
 */
export function useRetryLogic(): UseRetryLogicReturn {
  const [retryState, setRetryState] = useState<RetryState>(INITIAL_RETRY_STATE)
  const isMountedRef = useRef(true)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
      // Abort any pending requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  /**
   * Handle retry progress updates
   */
  const handleRetryProgress = useCallback((attempt: RetryAttempt) => {
    if (!isMountedRef.current) return

    const { attemptNumber, maxAttempts } = attempt

    // Update state with retry progress
    setRetryState({
      isRetrying: true,
      currentAttempt: attemptNumber,
      maxAttempts,
      loadingMessage: RETRY_MESSAGES.retrying(attemptNumber, maxAttempts),
      isSuccess: false,
      isFailed: false,
    })

    console.log('[useRetryLogic] Retry progress:', {
      attempt: attemptNumber,
      max: maxAttempts,
      message: RETRY_MESSAGES.retrying(attemptNumber, maxAttempts),
    })
  }, [])

  /**
   * Execute request with retry logic
   */
  const executeRequest = useCallback(
    async <T = any>(
      requestFn: () => Promise<AxiosResponse<T>>,
      config?: Partial<RetryConfig>
    ): Promise<AxiosResponse<T>> => {
      if (!isMountedRef.current) {
        throw new Error('Component unmounted')
      }

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController()

      try {
        // Set initial loading state
        setRetryState({
          isRetrying: true,
          currentAttempt: 1,
          maxAttempts: config?.maxRetries ?? 3,
          loadingMessage: RETRY_MESSAGES.connecting,
          isSuccess: false,
          isFailed: false,
        })

        console.log('[useRetryLogic] Starting request with retry')

        // Execute with retry logic
        const response = await executeWithRetry<T>(
          requestFn,
          config,
          handleRetryProgress
        )

        // Success!
        if (isMountedRef.current) {
          setRetryState({
            isRetrying: false,
            currentAttempt: 0,
            maxAttempts: config?.maxRetries ?? 3,
            loadingMessage: RETRY_MESSAGES.success,
            isSuccess: true,
            isFailed: false,
          })

          console.log('[useRetryLogic] Request succeeded')
        }

        return response

      } catch (error) {
        // Failed after all retries
        if (isMountedRef.current) {
          setRetryState({
            isRetrying: false,
            currentAttempt: 0,
            maxAttempts: config?.maxRetries ?? 3,
            loadingMessage: RETRY_MESSAGES.failed,
            isSuccess: false,
            isFailed: true,
          })

          console.error('[useRetryLogic] Request failed after all retries:', error)
        }

        throw error
      } finally {
        abortControllerRef.current = null
      }
    },
    [handleRetryProgress]
  )

  /**
   * Reset retry state to initial values
   */
  const resetRetryState = useCallback(() => {
    if (!isMountedRef.current) return

    setRetryState(INITIAL_RETRY_STATE)
    console.log('[useRetryLogic] State reset')
  }, [])

  return {
    retryState,
    executeWithRetry: executeRequest,
    resetRetryState,
  }
}

/**
 * Hook for simple loading message based on retry state
 * 
 * Returns appropriate Vietnamese message based on retry progress.
 * 
 * @param retryState - Current retry state
 * @returns Loading message string
 */
export function useRetryMessage(retryState: RetryState): string {
  if (!retryState.isRetrying) {
    if (retryState.isSuccess) return RETRY_MESSAGES.success
    if (retryState.isFailed) return RETRY_MESSAGES.failed
    return ''
  }

  return retryState.loadingMessage
}

/**
 * Export for convenience
 */
export default useRetryLogic
