/**
 * Clipboard Hook
 * 
 * Custom React hook for clipboard operations with loading states,
 * error handling, and accessibility announcements.
 * 
 * @module hooks/useClipboard
 */

import { useState, useCallback } from 'react'
import { copyToClipboard, isClipboardSupported } from '../lib/utils/clipboard'
import { announceToScreenReader } from '../lib/a11y'

/**
 * Clipboard hook state
 */
export interface UseClipboardState {
  /** Whether clipboard is supported */
  isSupported: boolean
  /** Whether a copy operation is in progress */
  isCopying: boolean
  /** Last copy operation status */
  copyStatus: 'idle' | 'success' | 'error'
  /** Last copy error message */
  lastError: string | null
}

/**
 * Clipboard hook return value
 */
export interface UseClipboardReturn extends UseClipboardState {
  /** Copy text to clipboard */
  copy: (text: string, successMessage?: string) => Promise<boolean>
  /** Reset copy status */
  reset: () => void
}

/**
 * Custom hook for clipboard operations
 * 
 * @example
 * ```tsx
 * const { copy, isCopying, copyStatus, isSupported } = useClipboard()
 * 
 * const handleCopy = async () => {
 *   const success = await copy('Text to copy', 'Copied successfully!')
 *   if (success) {
 *     toast.success('Copied to clipboard')
 *   }
 * }
 * ```
 */
export function useClipboard(): UseClipboardReturn {
  const [isCopying, setIsCopying] = useState(false)
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [lastError, setLastError] = useState<string | null>(null)
  const [isSupported] = useState(isClipboardSupported())

  /**
   * Copy text to clipboard with loading state and accessibility
   */
  const copy = useCallback(async (
    text: string, 
    successMessage: string = 'Đã sao chép'
  ): Promise<boolean> => {
    if (!isSupported) {
      setCopyStatus('error')
      setLastError('Clipboard not supported')
      return false
    }

    setIsCopying(true)
    setCopyStatus('idle')
    setLastError(null)

    try {
      const result = await copyToClipboard(text)
      
      if (result.success) {
        setCopyStatus('success')
        setLastError(null)
        
        // Announce to screen readers
        announceToScreenReader(successMessage, 'polite')
        
        // Auto-reset status after 3 seconds
        setTimeout(() => {
          setCopyStatus('idle')
        }, 3000)
        
        return true
      } else {
        setCopyStatus('error')
        setLastError(result.error || 'Copy failed')
        
        // Announce error to screen readers
        announceToScreenReader('Sao chép thất bại', 'assertive')
        
        return false
      }
    } catch (error) {
      setCopyStatus('error')
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setLastError(errorMessage)
      
      // Announce error to screen readers
      announceToScreenReader('Sao chép thất bại', 'assertive')
      
      return false
    } finally {
      setIsCopying(false)
    }
  }, [isSupported])

  /**
   * Reset copy status and errors
   */
  const reset = useCallback(() => {
    setCopyStatus('idle')
    setLastError(null)
    setIsCopying(false)
  }, [])

  return {
    isSupported,
    isCopying,
    copyStatus,
    lastError,
    copy,
    reset
  }
}