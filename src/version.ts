/**
 * Build-time version information
 * Injected via Vite's define during build process
 */

// These will be replaced by Vite's define at build time
declare const __VERSION__: string
declare const __GIT_COMMIT__: string
declare const __GIT_BRANCH__: string
declare const __BUILD_TIMESTAMP__: string
declare const __ENVIRONMENT__: string

export const versionInfo = {
  version: __VERSION__,
  gitCommit: __GIT_COMMIT__,
  gitBranch: __GIT_BRANCH__,
  buildTimestamp: __BUILD_TIMESTAMP__,
  environment: __ENVIRONMENT__,
} as const

export type VersionInfo = typeof versionInfo
