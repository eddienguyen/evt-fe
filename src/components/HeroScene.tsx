import React, { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Center } from '@react-three/drei'
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
  const starsRef = useRef<THREE.Points>(null)
  const groupRef = useRef<THREE.Group>(null)

  const starConfig = useMemo(() => {
    const config = (() => {
      switch (qualityLevel) {
        case 'high':
          return { count: 500, radius: 200, depth: 100 } 
        case 'mid':
          return { count: 300, radius: 150, depth: 70 } 
        case 'low':
          return { count: 100, radius: 100, depth: 50 } 
      }
    })()
    
    if (import.meta.env.DEV) {
      console.log('⭐ Rendering stars:', config.count, 'stars with quality:', qualityLevel)
    }
    
    return config
  }, [qualityLevel])

  // Generate star positions
  const positions = useMemo(() => {
    const pos = new Float32Array(starConfig.count * 3)
    for (let i = 0; i < starConfig.count; i++) {
      const radius = starConfig.radius + Math.random() * starConfig.depth - starConfig.depth / 2
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = radius * Math.cos(phi)
    }
    return pos
  }, [starConfig])

  // Generate colors for stars (darker taupe/gold colors)
  const colors = useMemo(() => {
    const cols = new Float32Array(starConfig.count * 3)
    const colorPalette = [
      new THREE.Color('#7A6C5D'), // Dark taupe
      new THREE.Color('#B08D57'), // Gold
      new THREE.Color('#8F7245'), // Dark gold
      new THREE.Color('#9A8C7D'), // Light taupe
    ]
    
    for (let i = 0; i < starConfig.count; i++) {
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)]
      cols[i * 3] = color.r
      cols[i * 3 + 1] = color.g
      cols[i * 3 + 2] = color.b
    }
    return cols
  }, [starConfig])

  // Add flowing animation to stars
  useFrame(({ clock }) => {
    if (!groupRef.current) return
    // Slow rotation for flowing effect
    groupRef.current.rotation.x = clock.getElapsedTime() * 0.02
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.03
    groupRef.current.rotation.z = clock.getElapsedTime() * 0.01
  })

  // Create Three.js Points object directly
  const pointsObject = useMemo(() => {
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    
    // Create a canvas texture for star shape
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')!
    
    // Draw a star shape
    ctx.clearRect(0, 0, 64, 64)
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)')
    gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.4)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 64, 64)
    
    // Add sparkle effect
    ctx.fillStyle = 'white'
    ctx.fillRect(31, 16, 2, 32)  // Vertical line
    ctx.fillRect(16, 31, 32, 2)  // Horizontal line
    ctx.fillRect(22, 22, 20, 20) // Center glow
    
    const texture = new THREE.CanvasTexture(canvas)
    
    const mat = new THREE.PointsMaterial({
      size: 3.5,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      map: texture,              // ✅ Apply star texture
      blending: THREE.AdditiveBlending, // ✅ Make stars glow
    })
    
    return new THREE.Points(geom, mat)
  }, [positions, colors])

  // Apply rotation animation via ref
  useEffect(() => {
    if (starsRef.current && pointsObject) {
      starsRef.current.add(pointsObject)
      return () => {
        starsRef.current?.remove(pointsObject)
      }
    }
  }, [pointsObject])

  return (
    <group ref={groupRef}>
      <primitive object={pointsObject} ref={starsRef} />
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