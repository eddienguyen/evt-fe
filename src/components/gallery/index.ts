/**
 * Gallery Components
 * 
 * Barrel export for all gallery-related components.
 * 
 * @module components/gallery
 */

// Main components
export { default as Gallery } from './Gallery'
export { default as GalleryGrid } from './GalleryGrid'
export { default as GalleryItem } from './GalleryItem'

// Gallery Teaser components
export { default as GalleryTeaser } from './GalleryTeaser'
export { default as TeaserGrid } from './TeaserGrid'
export { default as TeaserImage } from './TeaserImage'

// Image loading
export { default as ImageLoader } from './ImageLoader'
export { default as ImagePlaceholder } from './ImagePlaceholder'

// Lightbox
export { default as Lightbox } from './Lightbox'
export { default as LightboxControls } from './LightboxControls'

// Re-export types for convenience
export type {
  GalleryImage,
  ImageSize,
  ImageMetadata,
  GalleryState,
  LightboxState,
  ImageLoadState,
} from '@/types/gallery'

// Re-export props types
export type { LightboxProps } from './Lightbox'
export type { GalleryTeaserProps } from './GalleryTeaser'
export type { TeaserGridProps } from './TeaserGrid'
export type { TeaserImageProps } from './TeaserImage'
