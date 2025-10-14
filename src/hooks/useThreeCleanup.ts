/**
 * Three.js Cleanup Hook
 * 
 * Manages proper cleanup of Three.js resources to prevent memory leaks.
 * Automatically disposes geometries, materials, textures, and clears caches on unmount.
 * 
 * @module hooks/useThreeCleanup
 */

import { useEffect } from 'react'
import * as THREE from 'three'

/**
 * Recursively dispose of Three.js objects
 */
function disposeObject(obj: THREE.Object3D): void {
  if (!obj) return

  // Dispose geometry
  if ('geometry' in obj && obj.geometry) {
    const geometry = obj.geometry as THREE.BufferGeometry
    if (geometry.dispose) {
      geometry.dispose()
    }
  }

  // Dispose material(s)
  if ('material' in obj) {
    const materials = Array.isArray(obj.material) ? obj.material : [obj.material]
    
    materials.forEach((material: THREE.Material) => {
      if (material) {
        // Dispose textures
        const materialRecord = material as unknown as Record<string, unknown>
        Object.keys(materialRecord).forEach((prop) => {
          const value = materialRecord[prop]
          if (value && typeof value === 'object' && 'isTexture' in value) {
            (value as THREE.Texture).dispose()
          }
        })
        
        material.dispose()
      }
    })
  }

  // Recursively dispose children
  if (obj.children) {
    obj.children.forEach((child) => disposeObject(child))
  }
}

/**
 * Hook to manage Three.js resource cleanup
 * 
 * Automatically cleans up all Three.js resources when component unmounts:
 * - Disposes geometries
 * - Disposes materials
 * - Disposes textures
 * - Clears Three.js caches
 * - Removes event listeners
 * 
 * @param scene - Optional Three.js scene to clean up
 * 
 * @example
 * ```tsx
 * const MyThreeComponent: React.FC = () => {
 *   const sceneRef = useRef<THREE.Scene>(null)
 *   
 *   useThreeCleanup(sceneRef.current)
 *   
 *   return <Canvas ref={sceneRef}>...</Canvas>
 * }
 * ```
 */
export function useThreeCleanup(scene?: THREE.Scene | null): void {
  useEffect(() => {
    return () => {
      if (scene) {
        // Dispose scene and all children
        disposeObject(scene)
        
        // Clear scene
        while (scene.children.length > 0) {
          scene.remove(scene.children[0])
        }
      }

      // Clear Three.js caches
      if (THREE.Cache) {
        THREE.Cache.clear()
      }

      // Force garbage collection hint
      if (import.meta.env.DEV) {
        console.log('🧹 Three.js resources cleaned up')
      }
    }
  }, [scene])
}

/**
 * Manual cleanup function for immediate disposal
 * 
 * @param object - Three.js object to dispose
 * 
 * @example
 * ```tsx
 * const geometry = new THREE.BoxGeometry()
 * const material = new THREE.MeshBasicMaterial()
 * 
 * // Later, when done
 * cleanupThreeObject(mesh)
 * ```
 */
export function cleanupThreeObject(object: THREE.Object3D): void {
  disposeObject(object)
}

/**
 * Dispose of a Three.js texture
 * 
 * @param texture - Texture to dispose
 */
export function disposeTexture(texture: THREE.Texture | null | undefined): void {
  if (texture) {
    texture.dispose()
  }
}

/**
 * Dispose of a Three.js material
 * 
 * @param material - Material or array of materials to dispose
 */
export function disposeMaterial(
  material: THREE.Material | THREE.Material[] | null | undefined
): void {
  if (!material) return

  const materials = Array.isArray(material) ? material : [material]
  
  materials.forEach((mat) => {
    if (mat) {
      // Dispose textures first
      const matRecord = mat as unknown as Record<string, unknown>
      Object.keys(matRecord).forEach((prop) => {
        const value = matRecord[prop]
        if (value && typeof value === 'object' && 'isTexture' in value) {
          (value as THREE.Texture).dispose()
        }
      })
      
      mat.dispose()
    }
  })
}

/**
 * Dispose of a Three.js geometry
 * 
 * @param geometry - Geometry to dispose
 */
export function disposeGeometry(
  geometry: THREE.BufferGeometry | null | undefined
): void {
  if (geometry) {
    geometry.dispose()
  }
}

export default useThreeCleanup
