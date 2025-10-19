import React, { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Text, Center } from '@react-three/drei'
import * as THREE from 'three'
import { couple, events } from '../config/site'
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor'
import { useThreeCleanup } from '../hooks/useThreeCleanup'

export interface HeroSceneProps {
  qualityLevel?: 'high' | 'mid' | 'low'
}

interface AdaptiveStarsProps {
  qualityLevel: 'high' | 'mid' | 'low'
}

/**
 * Adaptive Stars component with LOD based on device tier
 * Updated with flowing animation and darker colors to contrast with white-to-gold gradient
 */
const AdaptiveStars: React.FC<AdaptiveStarsProps> = React.memo(({ qualityLevel }) => {
  const starsRef = useRef<any>(null)

  const starConfig = useMemo(() => {
    const config = (() => {
      switch (qualityLevel) {
        case 'high':
          return { count: 500, radius: 200, depth: 100, factor: 12 } 
        case 'mid':
          return { count: 300, radius: 150, depth: 70, factor: 9 } 
        case 'low':
          return { count: 100, radius: 100, depth: 50, factor: 6 } 
      }
    })()
    
    if (import.meta.env.DEV) {
      console.log('⭐ Rendering stars:', config.count, 'stars with quality:', qualityLevel, 'factor:', config.factor)
    }
    
    return config
  }, [qualityLevel])

  // Add flowing animation to stars
  useFrame(({ clock }) => {
    if (!starsRef.current) return
    // Slow rotation for flowing effect
    starsRef.current.rotation.x = clock.getElapsedTime() * 0.02
    starsRef.current.rotation.y = clock.getElapsedTime() * 0.03
    starsRef.current.rotation.z = clock.getElapsedTime() * 0.01
  })

  return (
    <group ref={starsRef}>
      <Stars
        radius={starConfig.radius}
        depth={starConfig.depth}
        count={starConfig.count}
        factor={starConfig.factor}
        saturation={0.8}
        fade={true}
        speed={1}
      />
      {/* Add a subtle gold tint material overlay */}
      <mesh>
        <sphereGeometry args={[starConfig.radius * 1.2, 32, 32]} />
        <meshBasicMaterial
          color="#B08D57"
          transparent={true}
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
})

/**
 * Floating 3D Text component
 */
const FloatingText: React.FC = React.memo(() => {
  const textRef = useRef<THREE.Group>(null)
  const initialPosition = new THREE.Vector3(0, 0.5, 0) // Slightly elevated

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('✨ FloatingText component mounted')
      console.log('✨ Text content:', couple.displayName)
    }
  }, [])

  useFrame(({ clock }) => {
    if (!textRef.current) return
    // Gentle floating animation
    textRef.current.position.y = initialPosition.y + Math.sin(clock.getElapsedTime() * 0.8) * 0.15
    // Subtle rotation
    textRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.08
  })

  const config = useMemo(() => ({
    fontSize: 1.2, // Larger text
    color: '#ffffff',
    maxWidth: 10,
    lineHeight: 1.2,
    letterSpacing: 0.08,
    textAlign: 'center' as const,
    // Simplified material for better performance and stability
    material: new THREE.MeshBasicMaterial({
      color: '#ffffff',
      transparent: true,
      opacity: 0.95
    })
  }), [])

  return (
    <Center position={[0, 0, 0]}>
      <Text ref={textRef} {...config}>
        {couple.displayName}
      </Text>
    </Center>
  )
})

const HeroScene: React.FC<HeroSceneProps> = ({ qualityLevel = 'mid' }) => {
  const sceneRef = useRef<THREE.Scene | null>(null)
  const [currentQuality, setCurrentQuality] = useState(qualityLevel)
  const [contextLost, setContextLost] = useState(false)
  const [canvasKey, setCanvasKey] = useState(0)

  // Debug logging
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('🎨 HeroScene mounted with quality:', qualityLevel)
      console.log('🎨 Current quality state:', currentQuality)
      console.log('🎨 Canvas key:', canvasKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Monitor performance and auto-adjust quality
  const { stats, shouldReduceQuality } = usePerformanceMonitor({
    fpsThreshold: 30,
    onPerformanceDrop: () => {
      // Reduce quality one level
      if (currentQuality === 'high') {
        console.log('⬇️ Reducing quality: high → mid')
        setCurrentQuality('mid')
      } else if (currentQuality === 'mid') {
        console.log('⬇️ Reducing quality: mid → low')
        setCurrentQuality('low')
      }
    }
  })

  // Cleanup Three.js resources on unmount
  useThreeCleanup(sceneRef.current)

  // Update quality when prop changes
  useEffect(() => {
    if (import.meta.env.DEV && currentQuality !== qualityLevel) {
      console.log('🔄 Quality changed:', qualityLevel)
    }
    setCurrentQuality(qualityLevel)
  }, [qualityLevel, currentQuality])

  // Optimize canvas settings based on quality level
  const canvasConfig = useMemo(() => {
    const dpr = currentQuality === 'high' ? 2 : currentQuality === 'mid' ? 1 : 1
    const antialias = false // Disable for better performance and stability
    
    return { dpr: [1, dpr] as [number, number], antialias }
  }, [currentQuality])

  // Show loading message if context is lost
  if (contextLost) {
    return (
      <>
        {/* Gradient background - White to Gold/Paper */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-base-light to-accent-gold-light" aria-hidden="true" />
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-accent-gold text-lg">Recovering 3D scene...</p>
        </div>
      </>
    )
  }

  return (
    <>
      {/* Gradient background - White to Gold/Paper */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-base-light to-accent-gold-light" aria-hidden="true" />
      
      {/* 3D Canvas */}
      <Canvas
        key={`hero-canvas-${canvasKey}`}
        camera={{ position: [0, 0, 5], fov: 75 }}
        className="absolute inset-0"
        frameloop="always"
        dpr={canvasConfig.dpr}
        gl={{ 
          powerPreference: 'low-power', // Use low-power for better stability
          antialias: canvasConfig.antialias,
          alpha: true,
          preserveDrawingBuffer: false, // Disable to reduce memory pressure
          failIfMajorPerformanceCaveat: false // Allow software rendering if needed
        }}
        onCreated={({ scene, gl }) => {
          sceneRef.current = scene
          scene.background = null
          
          // Handle WebGL context loss/restore
          const canvas = gl.domElement
          canvas.addEventListener('webglcontextlost', (e) => {
            e.preventDefault()
            console.warn('⚠️ WebGL context lost, forcing canvas recreation...')
            setContextLost(true)
            // Force canvas remount after a delay
            setTimeout(() => {
              setCanvasKey(prev => prev + 1)
              setContextLost(false)
              console.log('🔄 Canvas recreated with new key')
            }, 100)
          })
          canvas.addEventListener('webglcontextrestored', () => {
            console.log('✅ WebGL context restored')
            setContextLost(false)
          })
        }}
      >
        {/* Simplified lighting for better performance */}
        <ambientLight intensity={1.0} />
        
        <AdaptiveStars qualityLevel={currentQuality} />
        {/* <FloatingText /> */}
      </Canvas>
      
      {/* Content overlay - positioned below 3D text */}
      {/* <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="text-center text-accent-white mt-32">
          <p className="text-xl md:text-2xl font-light tracking-wide opacity-90">
            {events.hue.dateDisplay} • {events.hue.locationShort}
          </p>
          <div className="mt-2 w-16 h-px bg-accent-gold mx-auto"></div>
          <p className="mt-4 text-sm md:text-base opacity-75">
            {events.hanoi.dateDisplay} • {events.hanoi.locationShort}
          </p>
        </div>
      </div> */}
      
      {/* Performance stats in development */}
      {import.meta.env.DEV && (
        <div className="absolute top-20 left-4 bg-black/50 text-white p-3 rounded-lg text-xs font-mono backdrop-blur-sm">
          <div>FPS: {stats.fps.toFixed(1)}</div>
          <div>Avg: {stats.avgFps.toFixed(1)}</div>
          <div>Min: {stats.minFps.toFixed(1)}</div>
          <div>Quality: {currentQuality}</div>
          {stats.memoryUsage && (
            <div>Memory: {stats.memoryUsage.toFixed(1)}%</div>
          )}
          {shouldReduceQuality && (
            <div className="text-yellow-400 mt-1">⚠ Reducing quality</div>
          )}
        </div>
      )}
    </>
  )
}

export default HeroScene