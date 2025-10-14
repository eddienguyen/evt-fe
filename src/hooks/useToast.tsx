import React from 'react'
import { ToastContainer, type ToastProps } from '@/components/ui/Toast'

/**
 * useToast Hook
 * 
 * Provides toast notification functionality with automatic management.
 * 
 * Features:
 * - Multiple toast variants (success, error, warning, info)
 * - Auto-dismiss with configurable duration
 * - Screen reader announcements
 * - Keyboard accessible (Escape to close)
 * 
 * @returns Object with toast methods and ToastComponent
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { toast, ToastComponent } = useToast()
 *   
 *   function handleSubmit() {
 *     try {
 *       // ... form submission logic
 *       toast.success('RSVP submitted successfully!')
 *     } catch (error) {
 *       toast.error('Failed to submit RSVP. Please try again.')
 *     }
 *   }
 *   
 *   return (
 *     <>
 *       <form onSubmit={handleSubmit}>
 *         <button type="submit">Submit RSVP</button>
 *       </form>
 *       {ToastComponent}
 *     </>
 *   )
 * }
 * ```
 */
export function useToast() {
  const [toasts, setToasts] = React.useState<Array<ToastProps & { id: string }>>([])

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const addToast = React.useCallback((toast: Omit<ToastProps, 'onClose'>) => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { ...toast, id, onClose: () => removeToast(id) }])
  }, [removeToast])

  const toast = React.useMemo(() => ({
    /**
     * Show a success toast notification
     * @param message - Message to display
     * @param duration - Auto-dismiss duration in ms (default: 5000)
     */
    success: (message: string, duration?: number) => addToast({ message, variant: 'success', duration }),
    
    /**
     * Show an error toast notification
     * @param message - Message to display
     * @param duration - Auto-dismiss duration in ms (default: 5000)
     */
    error: (message: string, duration?: number) => addToast({ message, variant: 'error', duration }),
    
    /**
     * Show a warning toast notification
     * @param message - Message to display
     * @param duration - Auto-dismiss duration in ms (default: 5000)
     */
    warning: (message: string, duration?: number) => addToast({ message, variant: 'warning', duration }),
    
    /**
     * Show an info toast notification
     * @param message - Message to display
     * @param duration - Auto-dismiss duration in ms (default: 5000)
     */
    info: (message: string, duration?: number) => addToast({ message, variant: 'info', duration }),
  }), [addToast])

  const ToastComponent = <ToastContainer toasts={toasts} />

  return { toast, ToastComponent }
}
