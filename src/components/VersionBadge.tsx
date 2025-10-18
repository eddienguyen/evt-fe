/**
 * Version Display Component
 * Shows deployment metadata for verification
 * Only visible in development or when explicitly requested
 */

import { versionInfo } from '@/version'

interface VersionBadgeProps {
  readonly position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
  readonly visible?: boolean
}

export function VersionBadge({ position = 'bottom-right', visible = false }: VersionBadgeProps) {
  // Only show in development or when explicitly visible
  if (!visible && import.meta.env.MODE !== 'development') {
    return null
  }

  const positionStyles = {
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
  }

  return (
    <div
      className={`fixed ${positionStyles[position]} z-50 bg-black/80 text-white text-xs font-mono px-3 py-2 rounded-lg shadow-lg backdrop-blur-sm`}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-green-400">●</span>
          <span className="font-semibold">v{versionInfo.version}</span>
        </div>
        <div className="text-gray-300">
          <div>Commit: {versionInfo.gitCommit}</div>
          <div>Branch: {versionInfo.gitBranch}</div>
          <div>Built: {new Date(versionInfo.buildTimestamp).toLocaleString()}</div>
        </div>
      </div>
    </div>
  )
}

/**
 * Version Info Hook
 * Access version info programmatically
 */
export function useVersionInfo() {
  return {
    ...versionInfo,
    buildDate: new Date(versionInfo.buildTimestamp),
    isDevelopment: import.meta.env.MODE === 'development',
    isProduction: import.meta.env.MODE === 'production',
  }
}

/**
 * Console Logger
 * Logs version info to browser console
 */
export function logVersionInfo() {
  console.group('🚀 Application Version Info')
  console.log('Version:', versionInfo.version)
  console.log('Git Commit:', versionInfo.gitCommit)
  console.log('Git Branch:', versionInfo.gitBranch)
  console.log('Build Timestamp:', versionInfo.buildTimestamp)
  console.log('Build Date:', new Date(versionInfo.buildTimestamp).toLocaleString())
  console.log('Environment:', versionInfo.environment)
  console.groupEnd()
}

/**
 * Initialize version badge with keyboard shortcut
 * Call this once in your app's entry point (main.tsx)
 * 
 * Usage: Press Ctrl+Shift+V to toggle version badge
 */
export function initVersionBadge() {
  // Log version on app startup
  logVersionInfo()

  // Add keyboard shortcut listener (Ctrl+Shift+V)
  let badgeVisible = false
  let badgeElement: HTMLDivElement | null = null

  const toggleBadge = () => {
    badgeVisible = !badgeVisible
    
    if (badgeVisible) {
      // Create and show badge
      badgeElement = document.createElement('div')
      badgeElement.id = 'version-badge'
      badgeElement.className = 'fixed bottom-4 right-4 z-[9999] bg-black/90 text-white text-xs font-mono px-4 py-3 rounded-lg shadow-2xl backdrop-blur-sm border border-white/20'
      badgeElement.innerHTML = `
        <div class="space-y-1">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-green-400">●</span>
            <span class="font-bold text-sm">v${versionInfo.version}</span>
          </div>
          <div class="text-gray-300 space-y-0.5">
            <div><span class="text-gray-500">Commit:</span> ${versionInfo.gitCommit}</div>
            <div><span class="text-gray-500">Branch:</span> ${versionInfo.gitBranch}</div>
            <div><span class="text-gray-500">Built:</span> ${new Date(versionInfo.buildTimestamp).toLocaleString()}</div>
            <div><span class="text-gray-500">Env:</span> ${versionInfo.environment}</div>
          </div>
          <div class="mt-2 pt-2 border-t border-white/10 text-gray-400 text-[10px]">
            Press Ctrl+Shift+V to hide
          </div>
        </div>
      `
      document.body.appendChild(badgeElement)
      console.log('✅ Version badge shown')
    } else if (badgeElement) {
      // Remove badge
      badgeElement.remove()
      badgeElement = null
      console.log('❌ Version badge hidden')
    }
  }

  // Listen for Ctrl+Shift+V
  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.shiftKey && event.key === 'V') {
      event.preventDefault()
      toggleBadge()
    }
  })

  // Add to window for console access
  ;(globalThis as any).__showVersion = () => {
    console.log('💡 Version Badge Shortcut: Ctrl+Shift+V')
    logVersionInfo()
  }

  console.log('📌 Version badge initialized. Press Ctrl+Shift+V to show/hide.')
}
