/**
 * Background Canvas Component
 * 
 * Global 3D background that persists across the entire webpage.
 * Uses position: fixed to cover the viewport and layers beneath page content.
 * 
 * Phase 4A Implementation - Canvas separated from hero section.
 * 
 * @module components/BackgroundCanvas
 */
import React, { lazy, Suspense } from 'react'
import { usePerformanceDetection } from '../hooks/usePerformanceDetection'
import FallbackHero from './FallbackHero'

// Lazy load the 3D scene to reduce initial bundle size
const LazyHeroScene = lazy(() => import('./HeroScene'))

export interface BackgroundCanvasProps {
  /**
   * Quality level override (optional)
   * If not provided, will use performance detection
   */
  qualityLevel?: 'high' | 'mid' | 'low'
  
  /**
   * Whether to show the canvas
   * @default true
   */
  enabled?: boolean
}

/**
 * Loading component shown while 3D scene is loading
 */
const BackgroundCanvasLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-canvas-bg bg-gradient-to-b from-hero-from to-hero-to">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-accent-white">
          <div className="animate-pulse">
            <p className="text-lg">Loading 3D scene...</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Background Canvas with progressive enhancement
 * 
 * Automatically detects device capabilities and loads appropriate experience:
 * - High/Mid performance: Lazy-loaded 3D scene with adaptive quality
 * - Low performance: Beautiful 2D gradient fallback
 * - Reduced motion: Always shows 2D fallback
 * 
 * @example
 * ```tsx
 * // In App.tsx
 * <BackgroundCanvas />
 * <RootLayout />
 * ```
 */
const BackgroundCanvas: React.FC<BackgroundCanvasProps> = ({ 
  qualityLevel: overrideQuality,
  enabled = true 
}) => {
  const { shouldLoad3D: detectedShouldLoad3D, qualityLevel, isLoading } = usePerformanceDetection()

  // TEMPORARY: Force 3D loading for inspection (remove this later!)
  const shouldLoad3D = true

  // Use override quality if provided, otherwise use detected quality
  // Force 'mid' quality if detected as 'fallback' for inspection
  const finalQuality = overrideQuality || (qualityLevel === 'fallback' ? 'mid' : qualityLevel)

  // Debug logging
  if (import.meta.env.DEV) {
    console.log('🌌 BackgroundCanvas Debug:', {
      enabled,
      shouldLoad3D,
      detectedShouldLoad3D,
      detectedQuality: qualityLevel,
      finalQuality,
      isLoading,
      overrideQuality,
      note: '⚠️ TEMPORARY: 3D forced ON for inspection'
    })
  }

  // Don't render anything if disabled
  if (!enabled) {
    return null
  }

  // Show fallback during detection
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-canvas-bg">
        <FallbackHero />
      </div>
    )
  }

  // Show 3D scene for capable devices
  if (shouldLoad3D && finalQuality !== 'fallback') {
    return (
      <div className="fixed inset-0 z-canvas-bg" key="3d-canvas-container">
        <Suspense fallback={<BackgroundCanvasLoader />}>
          <LazyHeroScene key="hero-scene-stable" qualityLevel={finalQuality as 'high' | 'mid' | 'low'} />
        </Suspense>
      </div>
    )
  }

  // Show 2D fallback for low-end devices or reduced motion
  return (
    <div className="fixed inset-0 z-canvas-bg">
      <FallbackHero />
    </div>
  )
}

export default BackgroundCanvas
