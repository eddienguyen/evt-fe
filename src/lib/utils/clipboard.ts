/**
 * Clipboard Utilities
 * 
 * Helper functions for copying text to clipboard with proper error handling
 * and accessibility announcements.
 * 
 * @module lib/utils/clipboard
 */

/**
 * Copy text to clipboard result
 */
export interface ClipboardResult {
  success: boolean
  error?: string
}

/**
 * Copy text to clipboard using modern Clipboard API with fallback
 * 
 * @param text - Text to copy to clipboard
 * @returns Promise resolving to copy result
 */
export async function copyToClipboard(text: string): Promise<ClipboardResult> {
  try {
    // Modern Clipboard API (preferred)
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return { success: true }
    }
    
    // Fallback for older browsers
    if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      const success = document.execCommand('copy')
      document.body.removeChild(textArea)
      
      if (success) {
        return { success: true }
      } else {
        return { success: false, error: 'Copy command failed' }
      }
    }
    
    // No clipboard support
    return { success: false, error: 'Clipboard not supported' }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Check if clipboard API is supported
 * 
 * @returns True if clipboard operations are supported
 */
export function isClipboardSupported(): boolean {
  return !!(
    (navigator.clipboard && window.isSecureContext) ||
    (document.queryCommandSupported && document.queryCommandSupported('copy'))
  )
}

/**
 * Format bank detail for clipboard
 * 
 * @param label - Field label
 * @param value - Field value
 * @returns Formatted string for clipboard
 */
export function formatBankDetailForClipboard(label: string, value: string): string {
  return `${label}: ${value}`
}

/**
 * Format all bank details for clipboard
 * 
 * @param bankDetails - Bank details object
 * @returns Formatted multi-line string for clipboard
 */
export function formatAllBankDetailsForClipboard(bankDetails: {
  bankName: string
  accountNumber: string
  accountName: string
  branch?: string
  swiftCode?: string
}): string {
  const lines = [
    `Ngân hàng: ${bankDetails.bankName}`,
    `Số tài khoản: ${bankDetails.accountNumber}`,
    `Tên tài khoản: ${bankDetails.accountName}`
  ]
  
  if (bankDetails.branch) {
    lines.push(`Chi nhánh: ${bankDetails.branch}`)
  }
  
  if (bankDetails.swiftCode) {
    lines.push(`Mã SWIFT: ${bankDetails.swiftCode}`)
  }
  
  return lines.join('\n')
}