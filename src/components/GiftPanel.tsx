/**
 * Gift Panel Component
 * 
 * Main gift panel that replaces the placeholder in FloatingCTAs.
 * Manages bank details display, QR code generation, and copy functionality.
 * 
 * @module components/GiftPanel
 */

import React, { useState, useEffect, useId } from 'react'
import { X } from 'lucide-react'
import { Button } from './ui/Button'
import { useClipboard } from '../hooks/useClipboard'
import { GIFT_LABELS, GIFT_A11Y, BANK_DETAILS } from '../lib/constants/gift'
import { generateBankQR, type QRResult } from '../lib/utils/qr'
import { announceToScreenReader } from '../lib/a11y'
import { siteConfig } from '@/config/site'

/**
 * Gift Panel Props
 */
export interface GiftPanelProps {
  /** Panel open state */
  isOpen: boolean
  /** Close panel handler */
  onClose: () => void
}

/**
 * Panel state type
 */
type PanelState = 'loading' | 'ready' | 'error'

/**
 * Gift Panel Component
 * 
 * Displays bank transfer details and QR code for monetary gifts.
 * Provides copy-to-clipboard functionality and accessibility support.
 * 
 * @example
 * ```tsx
 * <GiftPanel
 *   isOpen={activePanel === 'gift'}
 *   onClose={() => setActivePanel(null)}
 * />
 * ```
 */
const GiftPanel: React.FC<GiftPanelProps> = ({
  isOpen,
  onClose
}) => {
  // State management
  const [panelState, setPanelState] = useState<PanelState>('loading')
  const [qrResult, setQrResult] = useState<QRResult | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')
  
  // Hooks
  const { copy, isCopying } = useClipboard()
  
  // IDs for accessibility
  const panelId = useId()
  const titleId = useId()
  const descriptionId = useId()
  const bankDetailsId = useId()
  const qrSectionId = useId()

  /**
   * Initialize panel data when opened
   */
  useEffect(() => {
    if (isOpen) {
      // Announce panel opening to screen readers
      announceToScreenReader(GIFT_A11Y.panelOpened, 'polite')
      
      // Initialize QR code generation
      initializePanelData()
    }
  }, [isOpen])

  /**
   * Initialize panel data and generate QR code
   */
  const initializePanelData = async () => {
    setPanelState('loading')
    setErrorMessage('')
    
    try {
      // Generate QR code for bank details
      const qrResult = await generateBankQR(BANK_DETAILS)
      setQrResult(qrResult)
      
      if (!qrResult.success) {
        console.warn('QR generation failed:', qrResult.error)
        // Continue with text-only mode
      }
      
      setPanelState('ready')
    } catch (error) {
      console.error('Panel initialization failed:', error)
      setErrorMessage('Không thể khởi tạo panel. Vui lòng thử lại.')
      setPanelState('error')
    }
  }

  /**
   * Handle copy bank detail
   */
  const handleCopyDetail = async (field: string, value: string) => {
    const success = await copy(value, `${field} đã được sao chép`)
    
    if (!success) {
      console.error('Copy failed for field:', field)
    }
  }

  /**
   * Handle copy all bank details
   */
  const handleCopyAllDetails = async () => {
    const allDetails = [
      `${GIFT_LABELS.bankName}: ${BANK_DETAILS.bankName}`,
      `${GIFT_LABELS.accountNumber}: ${BANK_DETAILS.accountNumber}`,
      `${GIFT_LABELS.accountName}: ${BANK_DETAILS.accountName}`,
      BANK_DETAILS.branch ? `${GIFT_LABELS.branch}: ${BANK_DETAILS.branch}` : '',
      BANK_DETAILS.swiftCode ? `${GIFT_LABELS.swiftCode}: ${BANK_DETAILS.swiftCode}` : ''
    ].filter(Boolean).join('\n')
    
    await copy(allDetails, 'Thông tin tài khoản đã được sao chép')
  }

  /**
   * Handle panel close
   */
  const handleClose = () => {
    announceToScreenReader(GIFT_A11Y.panelClosed, 'polite')
    onClose()
  }

  // Don't render if not open
  if (!isOpen) return null

  return (
    <div 
      className="h-full flex flex-col bg-base-light"
      id={panelId}
      role="dialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      aria-modal="true"
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between p-6 border-b border-base-medium">
        <div>
          <h2 
            id={titleId} 
            className="text-2xl font-heading font-bold text-text"
          >
            {GIFT_LABELS.title}
          </h2>
          <p 
            id={descriptionId} 
            className="text-text-light mt-2"
          >
            {GIFT_LABELS.description}
          </p>
        </div>
        
        <Button
          variant="icon"
          onClick={handleClose}
          aria-label={GIFT_LABELS.close}
          className="ml-4 shrink-0"
        >
          <X className="w-6 h-6" />
        </Button>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {panelState === 'loading' && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-gold"></div>
            <span className="ml-3 text-text-light">Đang tải...</span>
          </div>
        )}

        {panelState === 'error' && (
          <div className="text-center py-16">
            <div className="text-error mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-text mb-2">Có lỗi xảy ra</h3>
            <p className="text-text-light mb-4">{errorMessage}</p>
            <Button onClick={initializePanelData}>
              Thử lại
            </Button>
          </div>
        )}

        {panelState === 'ready' && (
          <div className="space-y-8">
            {/* QR Code Section */}
            {qrResult?.success && (
              <section 
                id={qrSectionId}
                aria-labelledby={`${qrSectionId}-title`}
                className="text-center"
              >
                <h3 
                  id={`${qrSectionId}-title`}
                  className="text-lg font-semibold text-text mb-4"
                >
                  {GIFT_LABELS.qrCodeTitle}
                </h3>
                
                <div className="inline-block p-4 bg-white rounded-lg border border-base-medium shadow-soft">
                  <img
                    // src={qrResult.dataUrl}
                    src={siteConfig.gift.qrCodeImageUrl}
                    alt="Mã QR chuyển khoản ngân hàng cho quà cưới N & Q"
                    className="w-64 h-64 mx-auto"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>
                
                <p className="text-sm text-text-light mt-4 max-w-md mx-auto">
                  Quét mã QR bằng ứng dụng ngân hàng của bạn để chuyển khoản nhanh chóng
                </p>
              </section>
            )}

            {/* Bank Details Section */}
            <section 
              id={bankDetailsId}
              aria-labelledby={`${bankDetailsId}-title`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 
                  id={`${bankDetailsId}-title`}
                  className="text-lg font-semibold text-text"
                >
                  {GIFT_LABELS.bankDetailsTitle}
                </h3>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyAllDetails}
                  disabled={isCopying}
                  aria-label="Sao chép tất cả thông tin tài khoản"
                >
                  {GIFT_LABELS.copyAll}
                </Button>
              </div>
              
              <div className="bg-white rounded-lg border border-base-medium p-6 space-y-4">
                {/* Bank Name */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-text-light">
                      {GIFT_LABELS.bankName}
                    </label>
                    <p className="text-text font-medium">
                      {BANK_DETAILS.bankName}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyDetail(GIFT_LABELS.bankName, BANK_DETAILS.bankName)}
                    disabled={isCopying}
                    aria-label={`Sao chép ${GIFT_LABELS.bankName}`}
                  >
                    {GIFT_LABELS.copy}
                  </Button>
                </div>

                {/* Account Number */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-text-light">
                      {GIFT_LABELS.accountNumber}
                    </label>
                    <p className="text-text font-medium font-mono text-lg">
                      {BANK_DETAILS.accountNumber}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyDetail(GIFT_LABELS.accountNumber, BANK_DETAILS.accountNumber)}
                    disabled={isCopying}
                    aria-label={`Sao chép ${GIFT_LABELS.accountNumber}`}
                  >
                    {GIFT_LABELS.copy}
                  </Button>
                </div>

                {/* Account Name */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-text-light">
                      {GIFT_LABELS.accountName}
                    </label>
                    <p className="text-text font-medium">
                      {BANK_DETAILS.accountName}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyDetail(GIFT_LABELS.accountName, BANK_DETAILS.accountName)}
                    disabled={isCopying}
                    aria-label={`Sao chép ${GIFT_LABELS.accountName}`}
                  >
                    {GIFT_LABELS.copy}
                  </Button>
                </div>

                {/* Branch (if available) */}
                {BANK_DETAILS.branch && (
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-text-light">
                        {GIFT_LABELS.branch}
                      </label>
                      <p className="text-text font-medium">
                        {BANK_DETAILS.branch}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyDetail(GIFT_LABELS.branch, BANK_DETAILS.branch!)}
                      disabled={isCopying}
                      aria-label={`Sao chép ${GIFT_LABELS.branch}`}
                    >
                      {GIFT_LABELS.copy}
                    </Button>
                  </div>
                )}
              </div>
            </section>

            {/* Instructions */}
            <div className="bg-accent-gold/10 border border-accent-gold/20 rounded-lg p-4">
              <p className="text-sm text-accent-gold-dark font-medium">
                {GIFT_LABELS.instructions}
              </p>
              <p className="text-sm text-text-light mt-2">
                {GIFT_LABELS.thankYou}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GiftPanel