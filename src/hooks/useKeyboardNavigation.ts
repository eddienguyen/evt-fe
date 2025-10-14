/**
 * Keyboard Navigation Hook
 * 
 * Custom hook for handling keyboard shortcuts in gallery/lightbox.
 * 
 * @module hooks/useKeyboardNavigation
 */

import { useEffect, useCallback, useRef } from 'react'

export interface KeyboardHandlers {
  onNext?: () => void
  onPrev?: () => void
  onClose?: () => void
  onSelect?: () => void
  onHome?: () => void
  onEnd?: () => void
}

export interface UseKeyboardNavigationOptions extends KeyboardHandlers {
  /** Enable keyboard navigation */
  enabled?: boolean
  /** Prevent default browser behavior */
  preventDefault?: boolean
}

/**
 * useKeyboardNavigation Hook
 * 
 * Handles keyboard shortcuts for gallery/lightbox navigation.
 * 
 * @param options - Keyboard navigation options
 * 
 * @example
 * ```tsx
 * useKeyboardNavigation({
 *   enabled: isLightboxOpen,
 *   onNext: () => navigateNext(),
 *   onPrev: () => navigatePrev(),
 *   onClose: () => closeLightbox(),
 *   onSelect: () => selectImage(),
 * })
 * ```
 */
export function useKeyboardNavigation(options: UseKeyboardNavigationOptions): void {
  const {
    enabled = true,
    preventDefault = true,
    onNext,
    onPrev,
    onClose,
    onSelect,
    onHome,
    onEnd,
  } = options

  // Use refs to avoid recreating handler on every render
  const handlersRef = useRef({
    onNext,
    onPrev,
    onClose,
    onSelect,
    onHome,
    onEnd,
  })

  useEffect(() => {
    handlersRef.current = {
      onNext,
      onPrev,
      onClose,
      onSelect,
      onHome,
      onEnd,
    }
  }, [onNext, onPrev, onClose, onSelect, onHome, onEnd])

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return

    const handlers = handlersRef.current

    switch (event.key) {
      case 'ArrowRight':
      case 'Right':
        if (handlers.onNext) {
          if (preventDefault) event.preventDefault()
          handlers.onNext()
        }
        break

      case 'ArrowLeft':
      case 'Left':
        if (handlers.onPrev) {
          if (preventDefault) event.preventDefault()
          handlers.onPrev()
        }
        break

      case 'Escape':
      case 'Esc':
        if (handlers.onClose) {
          if (preventDefault) event.preventDefault()
          handlers.onClose()
        }
        break

      case 'Enter':
      case ' ':
        if (handlers.onSelect) {
          if (preventDefault) event.preventDefault()
          handlers.onSelect()
        }
        break

      case 'Home':
        if (handlers.onHome) {
          if (preventDefault) event.preventDefault()
          handlers.onHome()
        }
        break

      case 'End':
        if (handlers.onEnd) {
          if (preventDefault) event.preventDefault()
          handlers.onEnd()
        }
        break

      default:
        break
    }
  }, [enabled, preventDefault])

  useEffect(() => {
    if (!enabled) return

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enabled, handleKeyDown])
}

/**
 * useEscapeKey Hook
 * 
 * Simplified hook for handling Escape key press.
 * 
 * @param onEscape - Callback when Escape is pressed
 * @param enabled - Whether the hook is enabled
 * 
 * @example
 * ```tsx
 * useEscapeKey(() => closeModal(), isModalOpen)
 * ```
 */
export function useEscapeKey(onEscape: () => void, enabled: boolean = true): void {
  useKeyboardNavigation({
    enabled,
    onClose: onEscape,
  })
}
