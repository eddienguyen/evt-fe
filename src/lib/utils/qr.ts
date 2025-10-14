/**
 * QR Code Generation Utilities
 * 
 * Helper functions for generating QR codes for bank transfer details
 * with proper error handling and caching.
 * 
 * @module lib/utils/qr
 */

import QRCode from 'qrcode'

/**
 * Bank details interface
 */
export interface BankDetails {
  bankName: string
  accountNumber: string
  accountName: string
  branch?: string
  swiftCode?: string
}

/**
 * QR generation options
 */
export interface QROptions {
  width?: number
  margin?: number
  color?: {
    dark?: string
    light?: string
  }
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
}

/**
 * QR generation result
 */
export interface QRResult {
  success: boolean
  dataUrl?: string
  error?: string
}

/**
 * Default QR code options following design system
 */
const DEFAULT_QR_OPTIONS: QROptions = {
  width: 256,
  margin: 2,
  color: {
    dark: '#1F2937',  // Design system dark color
    light: '#FFFFFF'
  },
  errorCorrectionLevel: 'M'
}

/**
 * Cache for generated QR codes
 */
const qrCache = new Map<string, string>()

/**
 * Format bank details for QR code content
 * Using Vietnamese banking format
 * 
 * @param bankDetails - Bank details to encode
 * @returns Formatted string for QR code
 */
export function formatBankDetailsForQR(bankDetails: BankDetails): string {
  const lines = [
    `Ngân hàng: ${bankDetails.bankName}`,
    `Số TK: ${bankDetails.accountNumber}`,
    `Tên TK: ${bankDetails.accountName}`
  ]
  
  if (bankDetails.branch) {
    lines.push(`Chi nhánh: ${bankDetails.branch}`)
  }
  
  return lines.join('\n')
}

/**
 * Generate QR code data URL from bank details
 * 
 * @param bankDetails - Bank details to encode
 * @param options - QR generation options
 * @returns Promise resolving to QR generation result
 */
export async function generateBankQR(
  bankDetails: BankDetails, 
  options: QROptions = {}
): Promise<QRResult> {
  try {
    const qrContent = formatBankDetailsForQR(bankDetails)
    const cacheKey = `${qrContent}-${JSON.stringify(options)}`
    
    // Check cache first
    if (qrCache.has(cacheKey)) {
      return {
        success: true,
        dataUrl: qrCache.get(cacheKey)
      }
    }
    
    // Merge with default options
    const qrOptions = {
      ...DEFAULT_QR_OPTIONS,
      ...options
    }
    
    // Generate QR code
    const dataUrl = await QRCode.toDataURL(qrContent, qrOptions)
    
    // Cache the result
    qrCache.set(cacheKey, dataUrl)
    
    return {
      success: true,
      dataUrl
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'QR generation failed'
    }
  }
}

/**
 * Clear QR code cache
 */
export function clearQRCache(): void {
  qrCache.clear()
}

/**
 * Get QR cache size
 * 
 * @returns Number of cached QR codes
 */
export function getQRCacheSize(): number {
  return qrCache.size
}

/**
 * Validate bank details for QR generation
 * 
 * @param bankDetails - Bank details to validate
 * @returns True if valid for QR generation
 */
export function validateBankDetailsForQR(bankDetails: BankDetails): boolean {
  return !!(
    bankDetails.bankName?.trim() &&
    bankDetails.accountNumber?.trim() &&
    bankDetails.accountName?.trim()
  )
}