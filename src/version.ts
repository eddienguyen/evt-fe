/**
 * Build-time version information
 * Auto-generated during build process
 */

export const versionInfo = {
  version: '__VERSION__',
  gitCommit: '__GIT_COMMIT__',
  gitBranch: '__GIT_BRANCH__',
  buildTimestamp: '__BUILD_TIMESTAMP__',
  environment: '__ENVIRONMENT__',
} as const

export type VersionInfo = typeof versionInfo
