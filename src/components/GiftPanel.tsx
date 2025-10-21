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
import { GIFT_LABELS, GIFT_A11Y, BANK_DETAILS_LIST } from '../lib/constants/gift'
import { type BankDetails } from '../lib/utils/qr'
import { announceToScreenReader } from '../lib/a11y'

/**
 * Gift Panel Props
 */
export interface GiftPanelProps {
  /** Panel open state */
  isOpen: boolean
  /** Close panel handler */
  onClose: () => void
  /** Inline mode (no close button, always visible) - for mobile sections */
  inline?: boolean
  /** Bank accounts to display - defaults to all accounts */
  bankAccounts?: BankDetails[]
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
  onClose,
  inline = false,
  bankAccounts = BANK_DETAILS_LIST
}) => {
  // State management
  const [panelState, setPanelState] = useState<PanelState>('loading')
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
      // For now, just set ready state
      // QR codes are handled via static images from bankAccounts
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
   * Handle copy all bank details for a specific account
   */
  const handleCopyAllDetails = async (bankDetail: BankDetails) => {
    const allDetails = [
      `${GIFT_LABELS.bankName}: ${bankDetail.bankName}`,
      `${GIFT_LABELS.accountNumber}: ${bankDetail.accountNumber}`,
      `${GIFT_LABELS.accountName}: ${bankDetail.accountName}`,
      bankDetail.branch ? `${GIFT_LABELS.branch}: ${bankDetail.branch}` : '',
      bankDetail.swiftCode ? `${GIFT_LABELS.swiftCode}: ${bankDetail.swiftCode}` : ''
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
        
        {/* Close button - hidden in inline mode */}
        {!inline && (
          <Button
            variant="icon"
            onClick={handleClose}
            aria-label={GIFT_LABELS.close}
            className="ml-4 shrink-0"
          >
            <X className="w-6 h-6" />
          </Button>
        )}
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto p-6 max-h-full">
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
            {/* Render each bank account */}
            {bankAccounts.map((bankDetail, index) => (
              <div key={bankDetail.accountNumber} className="space-y-6">
                {/* QR Code Section */}
                {bankDetail.qrCodeImageUrl && (
                  <section 
                    id={`${qrSectionId}-${index}`}
                    aria-labelledby={`${qrSectionId}-title-${index}`}
                    className="text-center"
                  >
                    <h3 
                      id={`${qrSectionId}-title-${index}`}
                      className="text-lg font-semibold text-text mb-4"
                    >
                      {GIFT_LABELS.qrCodeTitle}
                    </h3>
                    
                    <div className="inline-block p-4 bg-white rounded-lg border border-base-medium shadow-soft">
                      <img
                        src={bankDetail.qrCodeImageUrl}
                        alt={`Mã QR chuyển khoản ngân hàng ${bankDetail.accountName}`}
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
                  id={`${bankDetailsId}-${index}`}
                  aria-labelledby={`${bankDetailsId}-title-${index}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 
                      id={`${bankDetailsId}-title-${index}`}
                      className="text-lg font-semibold text-text"
                    >
                      {GIFT_LABELS.bankDetailsTitle}
                    </h3>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyAllDetails(bankDetail)}
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
                          {bankDetail.bankName}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyDetail(GIFT_LABELS.bankName, bankDetail.bankName)}
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
                          {bankDetail.accountNumber}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyDetail(GIFT_LABELS.accountNumber, bankDetail.accountNumber)}
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
                          {bankDetail.accountName}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyDetail(GIFT_LABELS.accountName, bankDetail.accountName)}
                        disabled={isCopying}
                        aria-label={`Sao chép ${GIFT_LABELS.accountName}`}
                      >
                        {GIFT_LABELS.copy}
                      </Button>
                    </div>

                    {/* Branch (if available) */}
                    {bankDetail.branch && (
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <label className="text-sm font-medium text-text-light">
                            {GIFT_LABELS.branch}
                          </label>
                          <p className="text-text font-medium">
                            {bankDetail.branch}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyDetail(GIFT_LABELS.branch, bankDetail.branch!)}
                          disabled={isCopying}
                          aria-label={`Sao chép ${GIFT_LABELS.branch}`}
                        >
                          {GIFT_LABELS.copy}
                        </Button>
                      </div>
                    )}
                  </div>
                </section>

                {/* Divider between accounts if multiple */}
                {bankAccounts.length > 1 && index < bankAccounts.length - 1 && (
                  <hr className="border-t border-base-medium my-8" />
                )}
              </div>
            ))}

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