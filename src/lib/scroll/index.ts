/**
 * Smooth Scroll Library Barrel Export
 * 
 * @module lib/scroll
 */

export { smoothScrollManager, SmoothScrollManager } from './smoothScroll'
export * from './scrollUtils'
export * from './scrollConfig'

// Re-export types
export type {
  SmoothScrollState,
  SmoothScrollActions,
  SmoothScrollContextValue,
  ScrollToOptions,
  ScrollDirection,
  DevicePerformanceTier,
  DeviceDetection,
  PerformanceMetrics,
  ScrollEventData
} from '@/types/scroll'