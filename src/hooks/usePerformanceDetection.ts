/**
 * Performance Detection Hook
 * 
 * Detects device capabilities to determine if 3D scene should be loaded.
 * Analyzes GPU tier, memory, connection speed, CPU cores, and motion preferences.
 * 
 * @module hooks/usePerformanceDetection
 */

import { useState, useEffect } from 'react'

export type DeviceTier = 'low' | 'mid' | 'high'

export interface PerformanceMetrics {
  deviceTier: DeviceTier
  gpuTier: 'low' | 'mid' | 'high'
  memoryGB: number
  connectionSpeed: 'slow' | 'fast'
  cpuCores: number
  supportsWebGL: boolean
  prefersReducedMotion: boolean
}

export interface PerformanceDetectionResult {
  metrics: PerformanceMetrics | null
  isLoading: boolean
  shouldLoad3D: boolean
  qualityLevel: 'high' | 'mid' | 'low' | 'fallback'
}

/**
 * Detect WebGL support and GPU tier
 */
function detectGPU(): { supported: boolean; tier: 'low' | 'mid' | 'high' } {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    
    if (!gl) {
      return { supported: false, tier: 'low' }
    }

    // Get renderer info
    const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info')
    let renderer = 'unknown'
    
    if (debugInfo) {
      renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase()
    }

    // Check max texture size as a proxy for GPU capability
    const maxTextureSize = (gl as WebGLRenderingContext).getParameter((gl as WebGLRenderingContext).MAX_TEXTURE_SIZE)

    // Classify GPU tier
    let tier: 'low' | 'mid' | 'high' = 'mid'
    
    if (maxTextureSize >= 16384) {
      tier = 'high'
    } else if (maxTextureSize < 8192) {
      tier = 'low'
    }

    // Check for specific GPU patterns
    if (renderer.includes('intel') || renderer.includes('integrated')) {
      tier = tier === 'high' ? 'mid' : 'low'
    } else if (renderer.includes('nvidia') || renderer.includes('amd') || renderer.includes('radeon')) {
      tier = tier === 'low' ? 'mid' : 'high'
    }

    return { supported: true, tier }
  } catch (error) {
    console.warn('GPU detection failed:', error)
    return { supported: false, tier: 'low' }
  }
}

/**
 * Detect device memory (if available)
 */
function detectMemory(): number {
  // @ts-expect-error - deviceMemory is not in TypeScript types yet
  const memory = navigator.deviceMemory as number | undefined
  
  if (memory) {
    return memory
  }

  // Fallback estimation based on other signals
  const hardwareConcurrency = navigator.hardwareConcurrency || 4
  
  if (hardwareConcurrency >= 8) return 8
  if (hardwareConcurrency >= 4) return 4
  return 2
}

/**
 * Detect connection speed
 */
function detectConnectionSpeed(): 'slow' | 'fast' {
  // @ts-expect-error - connection is not in all TypeScript types
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
  
  if (connection) {
    const effectiveType = connection.effectiveType
    
    if (effectiveType === '4g' || effectiveType === '5g') {
      return 'fast'
    }
    
    if (effectiveType === '3g' || effectiveType === '2g' || effectiveType === 'slow-2g') {
      return 'slow'
    }
  }

  // Default to fast if unknown
  return 'fast'
}

/**
 * Detect reduced motion preference
 */
function detectReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  return mediaQuery.matches
}

/**
 * Classify device tier based on all metrics
 */
function classifyDeviceTier(metrics: Omit<PerformanceMetrics, 'deviceTier'>): DeviceTier {
  // Force low tier if WebGL not supported or reduced motion preferred
  if (!metrics.supportsWebGL || metrics.prefersReducedMotion) {
    return 'low'
  }

  // Score-based classification
  let score = 0

  // GPU contribution (40%)
  if (metrics.gpuTier === 'high') score += 40
  else if (metrics.gpuTier === 'mid') score += 25
  else score += 10

  // Memory contribution (30%)
  if (metrics.memoryGB >= 8) score += 30
  else if (metrics.memoryGB >= 4) score += 20
  else score += 5

  // CPU contribution (20%)
  if (metrics.cpuCores >= 8) score += 20
  else if (metrics.cpuCores >= 4) score += 15
  else score += 5

  // Connection contribution (10%)
  if (metrics.connectionSpeed === 'fast') score += 10
  else score += 5

  // Classify based on total score
  if (score >= 75) return 'high'
  if (score >= 50) return 'mid'
  return 'low'
}

/**
 * Determine quality level based on device tier
 */
function determineQualityLevel(tier: DeviceTier, prefersReducedMotion: boolean): 'high' | 'mid' | 'low' | 'fallback' {
  if (prefersReducedMotion) return 'fallback'
  
  switch (tier) {
    case 'high': return 'high'
    case 'mid': return 'mid'
    case 'low': return 'fallback'
  }
}

/**
 * Hook to detect device performance capabilities
 * 
 * @returns Performance detection result with metrics and recommendations
 * 
 * @example
 * ```tsx
 * const { shouldLoad3D, qualityLevel, metrics } = usePerformanceDetection()
 * 
 * if (shouldLoad3D) {
 *   return <HeroScene quality={qualityLevel} />
 * } else {
 *   return <FallbackHero />
 * }
 * ```
 */
export function usePerformanceDetection(): PerformanceDetectionResult {
  const [result, setResult] = useState<PerformanceDetectionResult>({
    metrics: null,
    isLoading: true,
    shouldLoad3D: false,
    qualityLevel: 'fallback'
  })

  useEffect(() => {
    // Detect all metrics
    const gpu = detectGPU()
    const memoryGB = detectMemory()
    const connectionSpeed = detectConnectionSpeed()
    const cpuCores = navigator.hardwareConcurrency || 4
    const prefersReducedMotion = detectReducedMotion()

    const baseMetrics = {
      gpuTier: gpu.tier,
      memoryGB,
      connectionSpeed,
      cpuCores,
      supportsWebGL: gpu.supported,
      prefersReducedMotion
    }

    const deviceTier = classifyDeviceTier(baseMetrics)
    const qualityLevel = determineQualityLevel(deviceTier, prefersReducedMotion)
    
    const metrics: PerformanceMetrics = {
      ...baseMetrics,
      deviceTier
    }

    // Decide if 3D should be loaded
    const shouldLoad3D = gpu.supported && 
                         !prefersReducedMotion && 
                         deviceTier !== 'low' &&
                         qualityLevel !== 'fallback'

    setResult({
      metrics,
      isLoading: false,
      shouldLoad3D,
      qualityLevel
    })

    // Log detection results in development
    if (import.meta.env.DEV) {
      console.log('🔍 Performance Detection Results:', {
        deviceTier,
        shouldLoad3D,
        qualityLevel,
        metrics
      })
    }
  }, [])

  return result
}

export default usePerformanceDetection
