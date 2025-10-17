/**
 * Version Display Component
 * Shows deployment metadata for verification
 * Only visible in development or when explicitly requested
 */

import { versionInfo } from '@/version'

interface VersionBadgeProps {
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
  visible?: boolean
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
  console.log('Environment:', versionInfo.environment)
  console.groupEnd()
}
