/**
 * Performance Monitoring Hook
 * 
 * Monitors FPS (frames per second) and memory usage in real-time.
 * Automatically adjusts quality when performance degrades.
 * 
 * @module hooks/usePerformanceMonitor
 */

import { useState, useEffect, useRef, useCallback } from 'react'

export interface PerformanceStats {
  fps: number
  avgFps: number
  minFps: number
  maxFps: number
  memoryUsage?: number
  frameDrops: number
}

export interface PerformanceMonitorOptions {
  /**
   * FPS threshold below which quality should be reduced
   * @default 30
   */
  fpsThreshold?: number
  
  /**
   * Sample size for FPS averaging
   * @default 60
   */
  sampleSize?: number
  
  /**
   * Enable memory monitoring (if available)
   * @default true
   */
  trackMemory?: boolean
  
  /**
   * Callback when FPS drops below threshold
   */
  onPerformanceDrop?: () => void
  
  /**
   * Callback when performance recovers
   */
  onPerformanceRecover?: () => void
}

export interface PerformanceMonitorResult {
  stats: PerformanceStats
  isMonitoring: boolean
  shouldReduceQuality: boolean
  startMonitoring: () => void
  stopMonitoring: () => void
}

/**
 * Get current memory usage (if available)
 */
function getMemoryUsage(): number | undefined {
  // @ts-expect-error - memory is not in all TypeScript types
  const memory = performance.memory as {
    usedJSHeapSize?: number
    jsHeapSizeLimit?: number
  } | undefined

  if (memory && memory.usedJSHeapSize && memory.jsHeapSizeLimit) {
    return (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
  }

  return undefined
}

/**
 * Hook to monitor Three.js scene performance
 * 
 * Tracks FPS, memory usage, and frame drops to detect performance issues.
 * Can automatically trigger quality reduction when performance degrades.
 * 
 * @param options - Monitoring configuration options
 * @returns Performance monitoring controls and statistics
 * 
 * @example
 * ```tsx
 * const MyThreeComponent: React.FC = () => {
 *   const { stats, shouldReduceQuality } = usePerformanceMonitor({
 *     fpsThreshold: 30,
 *     onPerformanceDrop: () => console.warn('Performance degraded!')
 *   })
 *   
 *   return (
 *     <div>
 *       <p>FPS: {stats.fps.toFixed(1)}</p>
 *       {shouldReduceQuality && <p>Quality reduced</p>}
 *     </div>
 *   )
 * }
 * ```
 */
export function usePerformanceMonitor(
  options: PerformanceMonitorOptions = {}
): PerformanceMonitorResult {
  const {
    fpsThreshold = 30,
    sampleSize = 60,
    trackMemory = true,
    onPerformanceDrop,
    onPerformanceRecover
  } = options

  const [stats, setStats] = useState<PerformanceStats>({
    fps: 60,
    avgFps: 60,
    minFps: 60,
    maxFps: 60,
    memoryUsage: undefined,
    frameDrops: 0
  })

  const [isMonitoring, setIsMonitoring] = useState(false)
  const [shouldReduceQuality, setShouldReduceQuality] = useState(false)

  const frameTimesRef = useRef<number[]>([])
  const lastFrameTimeRef = useRef<number>(performance.now())
  const frameIdRef = useRef<number | null>(null)
  const consecutiveLowFramesRef = useRef(0)
  const wasLowPerformanceRef = useRef(false)

  const measureFrame = useCallback(() => {
    const now = performance.now()
    const delta = now - lastFrameTimeRef.current
    lastFrameTimeRef.current = now

    // Calculate FPS
    const fps = 1000 / delta
    
    // Add to rolling window
    frameTimesRef.current.push(fps)
    if (frameTimesRef.current.length > sampleSize) {
      frameTimesRef.current.shift()
    }

    // Calculate statistics
    const validFrames = frameTimesRef.current.filter((f) => !isNaN(f) && isFinite(f))
    
    if (validFrames.length > 0) {
      const avgFps = validFrames.reduce((a, b) => a + b, 0) / validFrames.length
      const minFps = Math.min(...validFrames)
      const maxFps = Math.max(...validFrames)
      const frameDrops = validFrames.filter((f) => f < fpsThreshold).length

      // Get memory usage if enabled
      const memoryUsage = trackMemory ? getMemoryUsage() : undefined

      setStats({
        fps,
        avgFps,
        minFps,
        maxFps,
        memoryUsage,
        frameDrops
      })

      // Check for performance degradation
      if (fps < fpsThreshold) {
        consecutiveLowFramesRef.current++
        
        // Trigger quality reduction after 30 consecutive low frames (~0.5s)
        if (consecutiveLowFramesRef.current > 30 && !wasLowPerformanceRef.current) {
          setShouldReduceQuality(true)
          wasLowPerformanceRef.current = true
          onPerformanceDrop?.()
          
          if (import.meta.env.DEV) {
            console.warn('⚠️ Performance degraded - reducing quality', {
              fps: fps.toFixed(1),
              avgFps: avgFps.toFixed(1),
              memoryUsage: memoryUsage?.toFixed(1)
            })
          }
        }
      } else {
        consecutiveLowFramesRef.current = 0
        
        // Recover if performance is good for 60 consecutive frames (~1s)
        if (frameDrops === 0 && 
            validFrames.length >= 60 && 
            minFps > fpsThreshold + 10 && 
            wasLowPerformanceRef.current) {
          setShouldReduceQuality(false)
          wasLowPerformanceRef.current = false
          onPerformanceRecover?.()
          
          if (import.meta.env.DEV) {
            console.log('✅ Performance recovered', {
              fps: fps.toFixed(1),
              avgFps: avgFps.toFixed(1)
            })
          }
        }
      }
    }

    // Continue monitoring
    if (isMonitoring) {
      frameIdRef.current = requestAnimationFrame(measureFrame)
    }
  }, [isMonitoring, fpsThreshold, sampleSize, trackMemory, onPerformanceDrop, onPerformanceRecover])

  const startMonitoring = useCallback(() => {
    if (!isMonitoring) {
      setIsMonitoring(true)
      lastFrameTimeRef.current = performance.now()
      frameIdRef.current = requestAnimationFrame(measureFrame)
      
      if (import.meta.env.DEV) {
        console.log('📊 Performance monitoring started')
      }
    }
  }, [isMonitoring, measureFrame])

  const stopMonitoring = useCallback(() => {
    if (isMonitoring && frameIdRef.current !== null) {
      cancelAnimationFrame(frameIdRef.current)
      frameIdRef.current = null
      setIsMonitoring(false)
      
      if (import.meta.env.DEV) {
        console.log('📊 Performance monitoring stopped')
      }
    }
  }, [isMonitoring])

  // Auto-start monitoring when component mounts
  useEffect(() => {
    startMonitoring()
    
    return () => {
      stopMonitoring()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    stats,
    isMonitoring,
    shouldReduceQuality,
    startMonitoring,
    stopMonitoring
  }
}

export default usePerformanceMonitor
