/**
 * API Error Simulation Utilities
 * 
 * Development-only utilities to simulate various error conditions
 * for testing retry logic and error handling.
 * 
 * Usage in dev mode:
 * 1. Open browser console
 * 2. Run: window.__simulateApiError('502')
 * 3. Submit RSVP form to trigger simulated error
 * 4. Run: window.__clearApiError() to reset
 * 
 * @module utils/errorSimulation
 */

import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'

/**
 * Error simulation types
 */
export type SimulatedErrorType = 
  | '502'      // Bad Gateway (machine stopped/starting)
  | '503'      // Service Unavailable (machine waking up)
  | 'network'  // Network error (no response)
  | 'timeout'  // Request timeout
  | '500'      // Internal Server Error
  | '429'      // Rate limiting

/**
 * Error simulation state
 */
interface ErrorSimulationState {
  enabled: boolean
  errorType: SimulatedErrorType | null
  failureCount: number // Number of times to fail before succeeding
  currentAttempt: number
}

// Global simulation state
let simulationState: ErrorSimulationState = {
  enabled: false,
  errorType: null,
  failureCount: 2, // Default: fail 2 times, succeed on 3rd
  currentAttempt: 0,
}

/**
 * Enable error simulation
 */
export function simulateApiError(
  errorType: SimulatedErrorType,
  failureCount: number = 2
): void {
  if (import.meta.env.MODE !== 'development') {
    console.warn('[Error Simulation] Only available in development mode')
    return
  }

  simulationState = {
    enabled: true,
    errorType,
    failureCount,
    currentAttempt: 0,
  }

  console.log(`[Error Simulation] Enabled: ${errorType} (will fail ${failureCount} times)`)
}

/**
 * Disable error simulation
 */
export function clearApiError(): void {
  simulationState = {
    enabled: false,
    errorType: null,
    failureCount: 0,
    currentAttempt: 0,
  }

  console.log('[Error Simulation] Disabled')
}

/**
 * Get current simulation state
 */
export function getSimulationState(): Readonly<ErrorSimulationState> {
  return { ...simulationState }
}

/**
 * Create a simulated error based on error type
 */
function createSimulatedError(errorType: SimulatedErrorType): Error {
  const config: AxiosRequestConfig = {
    url: '/api/rsvp',
    method: 'POST',
  }

  switch (errorType) {
    case '502': {
      const error = new Error('Bad Gateway')
      Object.assign(error, {
        isAxiosError: true,
        config,
        response: {
          status: 502,
          statusText: 'Bad Gateway',
          data: { error: 'Bad Gateway' },
          headers: {},
          config,
        },
      })
      return error
    }

    case '503': {
      const error = new Error('Service Unavailable')
      Object.assign(error, {
        isAxiosError: true,
        config,
        response: {
          status: 503,
          statusText: 'Service Unavailable',
          data: { error: 'Service Unavailable' },
          headers: {},
          config,
        },
      })
      return error
    }

    case '500': {
      const error = new Error('Internal Server Error')
      Object.assign(error, {
        isAxiosError: true,
        config,
        response: {
          status: 500,
          statusText: 'Internal Server Error',
          data: { error: 'Internal Server Error' },
          headers: {},
          config,
        },
      })
      return error
    }

    case '429': {
      const error = new Error('Too Many Requests')
      Object.assign(error, {
        isAxiosError: true,
        config,
        response: {
          status: 429,
          statusText: 'Too Many Requests',
          data: { error: 'Rate limit exceeded' },
          headers: {},
          config,
        },
      })
      return error
    }

    case 'network': {
      const error = new Error('Network Error')
      Object.assign(error, {
        isAxiosError: true,
        config,
        code: 'ERR_NETWORK',
        request: {}, // Request was made but no response received
      })
      return error
    }

    case 'timeout': {
      const error = new Error('Request Timeout')
      Object.assign(error, {
        isAxiosError: true,
        config,
        code: 'ECONNABORTED',
        request: {},
      })
      return error
    }

    default:
      throw new Error(`Unknown error type: ${errorType}`)
  }
}

/**
 * Axios interceptor for error simulation
 * 
 * Install this interceptor to simulate errors in development mode.
 */
export function installErrorSimulationInterceptor(): void {
  if (import.meta.env.MODE !== 'development') {
    return
  }

  axios.interceptors.request.use(
    (config) => {
      // Check if simulation is enabled
      if (!simulationState.enabled || !simulationState.errorType) {
        return config
      }

      // Increment attempt counter
      simulationState.currentAttempt += 1

      console.log(`[Error Simulation] Request attempt ${simulationState.currentAttempt}/${simulationState.failureCount + 1}`)

      // Should we fail this request?
      if (simulationState.currentAttempt <= simulationState.failureCount) {
        console.warn(`[Error Simulation] Simulating ${simulationState.errorType} error`)
        
        // Create and throw the simulated error
        const error = createSimulatedError(simulationState.errorType)
        throw error
      }

      // Success! Reset simulation state
      console.log('[Error Simulation] Allowing request to succeed')
      simulationState.enabled = false
      simulationState.currentAttempt = 0

      return config
    },
    (error: Error) => {
      throw error
    }
  )

  console.log('[Error Simulation] Interceptor installed')
}

/**
 * Expose simulation controls to window object (dev mode only)
 */
export function exposeSimulationControls(): void {
  if (import.meta.env.MODE !== 'development') {
    return
  }

  // Add to window object for easy console access
  ;(globalThis as any).__simulateApiError = simulateApiError
  ;(globalThis as any).__clearApiError = clearApiError
  ;(globalThis as any).__getSimulationState = getSimulationState

  console.log(
    '%c[Error Simulation] Available commands:',
    'color: #00ff00; font-weight: bold;'
  )
  console.log(
    '%cwindow.__simulateApiError("502")   %c// Simulate 502 error',
    'color: #00aaff;',
    'color: #888;'
  )
  console.log(
    '%cwindow.__simulateApiError("503", 3) %c// Simulate 503 error, fail 3 times',
    'color: #00aaff;',
    'color: #888;'
  )
  console.log(
    '%cwindow.__clearApiError()          %c// Clear simulation',
    'color: #00aaff;',
    'color: #888;'
  )
  console.log(
    '%cwindow.__getSimulationState()      %c// Get current state',
    'color: #00aaff;',
    'color: #888;'
  )
  console.log(
    '\n%cAvailable error types:',
    'color: #00ff00; font-weight: bold;'
  )
  console.log('  "502"     - Bad Gateway (machine stopped)')
  console.log('  "503"     - Service Unavailable (machine waking)')
  console.log('  "500"     - Internal Server Error')
  console.log('  "429"     - Rate Limiting')
  console.log('  "network" - Network Error (no response)')
  console.log('  "timeout" - Request Timeout')
}

/**
 * Initialize error simulation system
 * 
 * Call this once in your app entry point (development mode only)
 */
export function initializeErrorSimulation(): void {
  if (import.meta.env.MODE !== 'development') {
    return
  }

  installErrorSimulationInterceptor()
  exposeSimulationControls()
}

/**
 * Export for convenience
 */
export default {
  simulateApiError,
  clearApiError,
  getSimulationState,
  installErrorSimulationInterceptor,
  exposeSimulationControls,
  initializeErrorSimulation,
}
