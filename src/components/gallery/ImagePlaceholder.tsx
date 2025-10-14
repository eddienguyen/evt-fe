/**
 * Image Placeholder Component
 * 
 * Loading and error state placeholder for gallery images.
 * 
 * @module components/gallery/ImagePlaceholder
 */

import React from 'react'
import { Loader2, ImageOff, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export interface ImagePlaceholderProps {
  /** Placeholder state */
  state: 'loading' | 'error'
  /** Aspect ratio (width/height) */
  aspectRatio?: number
  /** Retry callback for error state */
  onRetry?: () => void
  /** Additional CSS classes */
  className?: string
}

/**
 * Image Placeholder Component
 * 
 * Displays loading spinner or error state with retry button.
 * 
 * @example
 * ```tsx
 * <ImagePlaceholder
 *   state="loading"
 *   aspectRatio={4/3}
 * />
 * 
 * <ImagePlaceholder
 *   state="error"
 *   onRetry={() => loadImage()}
 * />
 * ```
 */
const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  state,
  aspectRatio = 4 / 3,
  onRetry,
  className,
}) => {
  return (
    <div
      className={cn(
        'relative flex items-center justify-center bg-base overflow-hidden rounded-lg',
        className
      )}
      style={{ aspectRatio: `${aspectRatio}` }}
    >
      {state === 'loading' && (
        <div className="flex flex-col items-center gap-2 text-text-muted">
          <Loader2 className="w-8 h-8 animate-spin text-accent-gold" aria-hidden="true" />
          <span className="text-sm">Đang tải...</span>
        </div>
      )}

      {state === 'error' && (
        <div className="flex flex-col items-center gap-3 text-text-muted px-4 text-center">
          <ImageOff className="w-10 h-10 text-text-secondary" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium mb-1">Không thể tải ảnh</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className={cn(
                  'inline-flex items-center gap-2 px-3 py-1.5 text-xs',
                  'bg-white rounded-md border border-border',
                  'hover:bg-base-light transition-colors duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2'
                )}
                aria-label="Thử lại tải ảnh"
              >
                <RefreshCw className="w-3 h-3" aria-hidden="true" />
                Thử lại
              </button>
            )}
          </div>
        </div>
      )}

      {/* Accessibility */}
      <span className="sr-only">
        {state === 'loading' ? 'Đang tải hình ảnh' : 'Không thể tải hình ảnh'}
      </span>
    </div>
  )
}

export default ImagePlaceholder
