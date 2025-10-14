import React from 'react'
import { announceToScreenReader } from '@/lib/a11y'
import { cn } from '@/lib/utils'

/**
 * Toast Component
 * 
 * Displays temporary notifications with screen reader announcements.
 * Implements WCAG 2.1 AA accessibility standards with aria-live regions.
 * 
 * Features:
 * - Auto-dismiss with configurable duration
 * - Screen reader announcements
 * - Multiple variants (success, error, warning, info)
 * - Manual dismiss with close button
 * - Keyboard accessible (Escape to close)
 * 
 * @example
 * ```tsx
 * <Toast 
 *   message="RSVP submitted successfully!" 
 *   variant="success"
 *   onClose={() => setShowToast(false)}
 * />
 * ```
 */

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export interface ToastProps {
  /** Message to display and announce to screen readers */
  message: string
  /** Visual variant */
  variant?: ToastVariant
  /** Auto-dismiss duration in milliseconds (default: 5000, 0 to disable) */
  duration?: number
  /** Callback when toast is closed */
  onClose: () => void
  /** ARIA live priority (default: 'polite' for success/info, 'assertive' for error/warning) */
  ariaPriority?: 'polite' | 'assertive'
}

export function Toast({
  message,
  variant = 'info',
  duration = 5000,
  onClose,
  ariaPriority,
}: ToastProps) {
  const [isVisible, setIsVisible] = React.useState(false)

  // Determine ARIA priority based on variant if not provided
  const priority = ariaPriority || (variant === 'error' || variant === 'warning' ? 'assertive' : 'polite')

  React.useEffect(() => {
    // Announce to screen readers
    announceToScreenReader(message, priority)

    // Trigger entry animation
    setIsVisible(true)

    // Auto-dismiss if duration is set
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        // Wait for exit animation before calling onClose
        setTimeout(onClose, 300)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [message, priority, duration, onClose])

  // Handle escape key
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsVisible(false)
        setTimeout(onClose, 300)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Variant styles
  const variantStyles: Record<ToastVariant, string> = {
    success: 'bg-utility-success/95 text-white border-utility-success',
    error: 'bg-utility-error/95 text-white border-utility-error',
    warning: 'bg-utility-warning/95 text-utility-error border-utility-warning',
    info: 'bg-base-white/95 text-text border-accent-gold',
  }

  // Icon for each variant
  const icons: Record<ToastVariant, React.ReactNode> = {
    success: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  }

  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className={cn(
        'fixed bottom-6 right-6 z-[200]',
        'flex items-center gap-3 px-6 py-4 rounded-lg border-2 shadow-strong',
        'transition-all duration-300 ease-in-out',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none',
        variantStyles[variant]
      )}
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        {icons[variant]}
      </div>

      {/* Message */}
      <div className="flex-1 text-sm font-medium">
        {message}
      </div>

      {/* Close button */}
      <button
        type="button"
        onClick={() => {
          setIsVisible(false)
          setTimeout(onClose, 300)
        }}
        className={cn(
          'flex-shrink-0 p-1 rounded-md transition-colors duration-200',
          'hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          variant === 'info' ? 'focus-visible:ring-accent-gold' : 'focus-visible:ring-white'
        )}
        aria-label="Close notification"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

/**
 * Toast Container Component
 * 
 * Manages multiple toast notifications with stacking.
 * 
 * @example
 * ```tsx
 * const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([])
 * 
 * function addToast(toast: Omit<ToastProps, 'onClose'>) {
 *   const id = Date.now().toString()
 *   setToasts(prev => [...prev, { ...toast, id, onClose: () => removeToast(id) }])
 * }
 * 
 * function removeToast(id: string) {
 *   setToasts(prev => prev.filter(t => t.id !== id))
 * }
 * 
 * <ToastContainer toasts={toasts} />
 * ```
 */
export interface ToastContainerProps {
  toasts: Array<ToastProps & { id: string }>
}

export function ToastContainer({ toasts }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast, index) => (
        <div 
          key={toast.id}
          style={{ transform: `translateY(${index * -60}px)` }}
          className="pointer-events-auto transition-transform duration-300"
        >
          <Toast {...toast} />
        </div>
      ))}
    </div>
  )
}
