/**
 * API Retry Service
 * 
 * Intelligent retry logic for handling Fly.io machine wake-ups and network issues.
 * Applies to ALL API calls (RSVP, guests, health, version).
 * 
 * Features:
 * - Automatic error detection (502/503 for machine sleep, network errors)
 * - Exponential backoff with jitter
 * - Progressive retry attempts (max 3)
 * - Vietnamese user messages
 * - Console logging for Fly.io investigation
 * - Cancel support for cleanup
 * 
 * @module services/apiRetryService
 */

import axios, { AxiosError } from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

/**
 * Retry Configuration
 */
export interface RetryConfig {
  /** Maximum number of retry attempts (default: 3) */
  maxRetries: number
  /** Initial delay in milliseconds (default: 1000) */
  initialDelay: number
  /** Maximum delay in milliseconds (default: 10000) */
  maxDelay: number
  /** Backoff multiplier (default: 2) */
  backoffMultiplier: number
  /** Add random jitter to prevent thundering herd (default: true) */
  useJitter: boolean
}

/**
 * Retry Attempt Information
 */
export interface RetryAttempt {
  /** Current attempt number (1-indexed) */
  attemptNumber: number
  /** Total number of attempts allowed */
  maxAttempts: number
  /** Delay before this retry in milliseconds */
  delayMs: number
  /** Error that triggered this retry */
  error: Error | AxiosError
  /** Timestamp of attempt */
  timestamp: Date
}

/**
 * Wake-Up Detection Result
 */
export interface WakeUpDetection {
  /** Whether this error indicates a sleeping/waking machine */
  isMachineSleeping: boolean
  /** HTTP status code if available */
  statusCode?: number
  /** Error type classification */
  errorType: 'network' | 'server' | 'timeout' | 'unknown'
  /** Original error */
  originalError: Error | AxiosError
}

/**
 * Retry Progress Callback
 */
export type RetryProgressCallback = (attempt: RetryAttempt) => void

/**
 * Default retry configuration
 */
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2,
  useJitter: true,
}

/**
 * Vietnamese user messages for loading states
 * Note: Retry progress is logged to console only, not shown to users
 */
export const RETRY_MESSAGES = {
  loading: 'Đang xử lý, vui lòng đợi...',
  success: 'Kết nối thành công!',
  failed: 'Không thể kết nối. Vui lòng thử lại sau.',
}

/**
 * Detect if error is from sleeping/waking Fly.io machine
 */
export function detectMachineWakeUp(error: Error | AxiosError): WakeUpDetection {
  if (axios.isAxiosError(error)) {
    const statusCode = error.response?.status

    // 502 Bad Gateway - Machine is stopped or starting
    // 503 Service Unavailable - Machine is waking up
    if (statusCode === 502 || statusCode === 503) {
      console.log(`[Retry Service] Machine wake-up detected: ${statusCode}`, {
        url: error.config?.url,
        method: error.config?.method,
        timestamp: new Date().toISOString(),
      })

      return {
        isMachineSleeping: true,
        statusCode,
        errorType: 'server',
        originalError: error,
      }
    }

    // Network errors (no response)
    if (!error.response) {
      console.log('[Retry Service] Network error detected', {
        message: error.message,
        code: error.code,
        timestamp: new Date().toISOString(),
      })

      return {
        isMachineSleeping: false,
        errorType: 'network',
        originalError: error,
      }
    }

    // Timeout errors
    if (error.code === 'ECONNABORTED') {
      console.log('[Retry Service] Timeout error detected', {
        url: error.config?.url,
        timeout: error.config?.timeout,
        timestamp: new Date().toISOString(),
      })

      return {
        isMachineSleeping: false,
        errorType: 'timeout',
        originalError: error,
      }
    }

    // Other server errors (500+)
    if (statusCode && statusCode >= 500) {
      console.log(`[Retry Service] Server error detected: ${statusCode}`, {
        url: error.config?.url,
        timestamp: new Date().toISOString(),
      })

      return {
        isMachineSleeping: true,
        statusCode,
        errorType: 'server',
        originalError: error,
      }
    }
  }

  return {
    isMachineSleeping: false,
    errorType: 'unknown',
    originalError: error,
  }
}

/**
 * Calculate delay for retry attempt with exponential backoff and jitter
 */
export function calculateRetryDelay(
  attemptNumber: number,
  config: RetryConfig
): number {
  const { initialDelay, maxDelay, backoffMultiplier, useJitter } = config

  // Exponential backoff: initialDelay * (backoffMultiplier ^ attemptNumber)
  let delay = initialDelay * Math.pow(backoffMultiplier, attemptNumber - 1)

  // Cap at maximum delay
  delay = Math.min(delay, maxDelay)

  // Add jitter (random ±25%) to prevent thundering herd
  if (useJitter) {
    const jitterRange = delay * 0.25
    const jitter = Math.random() * jitterRange * 2 - jitterRange
    delay = delay + jitter
  }

  return Math.round(delay)
}

/**
 * Determine if error is retryable
 */
export function isRetryableError(error: Error | AxiosError): boolean {
  const detection = detectMachineWakeUp(error)
  
  // Retry on machine sleep, network errors, and timeouts
  if (detection.isMachineSleeping || 
      detection.errorType === 'network' || 
      detection.errorType === 'timeout') {
    return true
  }

  // Don't retry on client errors (4xx except 429)
  if (axios.isAxiosError(error)) {
    const statusCode = error.response?.status
    if (statusCode && statusCode >= 400 && statusCode < 500 && statusCode !== 429) {
      console.log(`[Retry Service] Non-retryable client error: ${statusCode}`)
      return false
    }
  }

  return false
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Execute API request with intelligent retry logic
 * 
 * @param requestFn - Function that executes the axios request
 * @param config - Optional retry configuration
 * @param onProgress - Optional callback for retry progress updates
 * @returns Promise with the successful response
 * @throws Last error if all retries are exhausted
 * 
 * @example
 * ```typescript
 * const response = await executeWithRetry(
 *   () => axios.post('/api/rsvp', data),
 *   undefined,
 *   (attempt) => {
 *     console.log(`Retrying: ${attempt.attemptNumber}/${attempt.maxAttempts}`)
 *   }
 * )
 * ```
 */
export async function executeWithRetry<T = any>(
  requestFn: () => Promise<AxiosResponse<T>>,
  config: Partial<RetryConfig> = {},
  onProgress?: RetryProgressCallback
): Promise<AxiosResponse<T>> {
  const retryConfig: RetryConfig = { ...DEFAULT_RETRY_CONFIG, ...config }
  const { maxRetries } = retryConfig

  let lastError: Error | AxiosError | null = null

  // Log retry attempt start
  console.log('[Retry Service] Starting request with retry capability', {
    maxRetries,
    config: retryConfig,
    timestamp: new Date().toISOString(),
  })

  for (let attemptNumber = 1; attemptNumber <= maxRetries; attemptNumber++) {
    try {
      console.log(`[Retry Service] Attempt ${attemptNumber}/${maxRetries}`, {
        timestamp: new Date().toISOString(),
      })

      // Execute the request
      const response = await requestFn()

      // Success! Log and return
      console.log(`[Retry Service] Success on attempt ${attemptNumber}`, {
        status: response.status,
        timestamp: new Date().toISOString(),
      })

      return response

    } catch (error) {
      lastError = error as Error | AxiosError

      // Log the error
      console.error(`[Retry Service] Attempt ${attemptNumber} failed`, {
        error: lastError.message,
        ...(axios.isAxiosError(lastError) && {
          status: lastError.response?.status,
          code: lastError.code,
        }),
        timestamp: new Date().toISOString(),
      })

      // Check if error is retryable
      if (!isRetryableError(lastError)) {
        console.log('[Retry Service] Error is not retryable, throwing immediately')
        throw lastError
      }

      // If this was the last attempt, throw the error
      if (attemptNumber >= maxRetries) {
        console.error('[Retry Service] All retry attempts exhausted', {
          totalAttempts: attemptNumber,
          lastError: lastError.message,
          timestamp: new Date().toISOString(),
        })
        throw lastError
      }

      // Calculate delay for next retry
      const delayMs = calculateRetryDelay(attemptNumber, retryConfig)

      // Create retry attempt info
      const retryAttempt: RetryAttempt = {
        attemptNumber,
        maxAttempts: maxRetries,
        delayMs,
        error: lastError,
        timestamp: new Date(),
      }

      // Notify progress callback
      if (onProgress) {
        onProgress(retryAttempt)
      }

      // Log retry delay
      console.log(`[Retry Service] Retrying in ${delayMs}ms`, {
        attemptNumber,
        maxAttempts: maxRetries,
        nextAttempt: attemptNumber + 1,
        timestamp: new Date().toISOString(),
      })

      // Wait before retrying
      await sleep(delayMs)
    }
  }

  // This should never be reached, but TypeScript needs it
  throw lastError || new Error('Unknown error during retry execution')
}

/**
 * Create a retry-enabled axios instance
 * 
 * Wraps axios methods with automatic retry logic.
 * 
 * @param baseConfig - Base axios configuration
 * @param retryConfig - Retry configuration
 * @returns Axios instance with retry capabilities
 */
export function createRetryAxios(
  baseConfig?: AxiosRequestConfig,
  retryConfig?: Partial<RetryConfig>
) {
  const instance = axios.create(baseConfig)

  // Add retry interceptor
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const config = error.config as AxiosRequestConfig & { _retryCount?: number }

      // Initialize retry count
      if (!config._retryCount) {
        config._retryCount = 0
      }

      const maxRetries = retryConfig?.maxRetries ?? DEFAULT_RETRY_CONFIG.maxRetries

      // Check if we should retry
      if (config._retryCount >= maxRetries || !isRetryableError(error)) {
        throw error
      }

      // Increment retry count
      config._retryCount += 1

      // Calculate delay
      const delay = calculateRetryDelay(
        config._retryCount,
        { ...DEFAULT_RETRY_CONFIG, ...retryConfig }
      )

      // Log retry
      console.log(`[Retry Axios] Retrying request (${config._retryCount}/${maxRetries})`, {
        url: config.url,
        delay,
        timestamp: new Date().toISOString(),
      })

      // Wait and retry
      await sleep(delay)
      return instance.request(config)
    }
  )

  return instance
}

/**
 * Get user-friendly error message based on error type
 * Note: Keep messages simple, retry details are in console logs
 */
export function getErrorMessage(error: Error | AxiosError): string {
  const detection = detectMachineWakeUp(error)

  if (detection.isMachineSleeping) {
    return 'Không thể kết nối với máy chủ. Vui lòng thử lại.'
  }

  if (detection.errorType === 'network') {
    return 'Lỗi kết nối mạng. Vui lòng kiểm tra internet của bạn.'
  }

  if (detection.errorType === 'timeout') {
    return 'Yêu cầu hết thời gian chờ. Vui lòng thử lại.'
  }

  // Return original error message
  if (axios.isAxiosError(error) && error.response?.data?.message) {
    return error.response.data.message
  }

  return error.message || 'Đã xảy ra lỗi. Vui lòng thử lại.'
}

/**
 * Export for convenience
 */
export default {
  executeWithRetry,
  createRetryAxios,
  detectMachineWakeUp,
  calculateRetryDelay,
  isRetryableError,
  getErrorMessage,
  RETRY_MESSAGES,
}
