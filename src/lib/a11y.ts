/**
 * Accessibility Utilities
 * 
 * Helper functions and components for improving accessibility.
 * Includes screen reader announcements and keyboard navigation utilities.
 * 
 * @module lib/a11y
 */

/**
 * Announce a message to screen readers using aria-live regions
 * 
 * @param message - The message to announce
 * @param priority - Priority level: 'polite' (default) or 'assertive'
 * 
 * @example
 * ```tsx
 * // Announce form submission success
 * announceToScreenReader('Your RSVP has been submitted successfully')
 * 
 * // Announce urgent error
 * announceToScreenReader('Form submission failed', 'assertive')
 * ```
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  // Create or get existing announcement region
  let announcer = document.getElementById('a11y-announcer')
  
  if (!announcer) {
    announcer = document.createElement('div')
    announcer.id = 'a11y-announcer'
    announcer.setAttribute('aria-live', priority)
    announcer.setAttribute('aria-atomic', 'true')
    announcer.setAttribute('role', 'status')
    announcer.className = 'sr-only'
    document.body.appendChild(announcer)
  } else {
    // Update priority if different
    announcer.setAttribute('aria-live', priority)
  }

  // Clear previous message
  announcer.textContent = ''

  // Announce new message after a brief delay (ensures screen readers pick it up)
  setTimeout(() => {
    if (announcer) {
      announcer.textContent = message
    }
  }, 100)
}

/**
 * Check if the user prefers reduced motion
 * 
 * @returns true if user prefers reduced motion, false otherwise
 * 
 * @example
 * ```tsx
 * const shouldAnimate = !prefersReducedMotion()
 * if (shouldAnimate) {
 *   // Apply animations
 * }
 * ```
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Focus on an element and scroll it into view
 * 
 * @param elementOrId - Element or element ID to focus
 * @param options - Optional scroll behavior options
 * 
 * @example
 * ```tsx
 * // Focus on error message
 * focusElement('error-message')
 * 
 * // Focus with custom scroll behavior
 * focusElement(errorElement, { behavior: 'smooth', block: 'center' })
 * ```
 */
export function focusElement(
  elementOrId: HTMLElement | string,
  options: ScrollIntoViewOptions = { behavior: 'smooth', block: 'nearest' }
): void {
  const element = typeof elementOrId === 'string' 
    ? document.getElementById(elementOrId) 
    : elementOrId

  if (element) {
    element.focus()
    element.scrollIntoView(options)
  }
}

/**
 * Trap focus within a container (useful for modals, dialogs)
 * Returns a cleanup function to remove the trap
 * 
 * @param container - Container element to trap focus within
 * @returns Cleanup function to remove focus trap
 * 
 * @example
 * ```tsx
 * const cleanup = trapFocus(modalElement)
 * // Later, when closing modal:
 * cleanup()
 * ```
 */
export function trapFocus(container: HTMLElement): () => void {
  const focusableElements = container.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )

  const firstFocusable = focusableElements[0]
  const lastFocusable = focusableElements[focusableElements.length - 1]

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key !== 'Tab') return

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        e.preventDefault()
        lastFocusable?.focus()
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        e.preventDefault()
        firstFocusable?.focus()
      }
    }
  }

  container.addEventListener('keydown', handleKeyDown)

  // Focus first element
  firstFocusable?.focus()

  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown)
  }
}

/**
 * Get a human-readable label for keyboard shortcuts
 * 
 * @param key - Key combination (e.g., 'Cmd+K', 'Ctrl+Enter')
 * @returns Formatted label
 * 
 * @example
 * ```tsx
 * getKeyboardShortcutLabel('Cmd+K') // Returns 'Cmd + K' or 'Ctrl + K' on Windows
 * ```
 */
export function getKeyboardShortcutLabel(key: string): string {
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform)
  return key.replace('Cmd', isMac ? '⌘' : 'Ctrl').replace('+', ' + ')
}

/**
 * Check if an element is visible to screen readers
 * 
 * @param element - Element to check
 * @returns true if visible to screen readers, false otherwise
 */
export function isVisibleToScreenReaders(element: HTMLElement): boolean {
  // Check if element has aria-hidden
  if (element.getAttribute('aria-hidden') === 'true') return false

  // Check if element or any parent has sr-only class
  let current: HTMLElement | null = element
  while (current) {
    if (current.classList.contains('sr-only')) return false
    current = current.parentElement
  }

  // Check computed styles
  const styles = window.getComputedStyle(element)
  if (
    styles.display === 'none' ||
    styles.visibility === 'hidden' ||
    styles.opacity === '0'
  ) {
    return false
  }

  return true
}

/**
 * Get ARIA label for a date
 * 
 * @param dateString - ISO date string
 * @returns Human-readable date for screen readers
 * 
 * @example
 * ```tsx
 * getAriaDateLabel('2025-11-01') // Returns 'November 1st, 2025'
 * ```
 */
export function getAriaDateLabel(dateString: string): string {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  } catch {
    return dateString
  }
}
