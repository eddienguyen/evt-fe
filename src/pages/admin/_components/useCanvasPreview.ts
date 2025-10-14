/**
 * Canvas Preview Hook
 * 
 * Custom hook for managing TWO canvas-based invitation previews with text overlay.
 * Front canvas shows guest name, Main canvas shows secondary note.
 * 
 * @module pages/admin/_components/useCanvasPreview
 */

import { useEffect, useRef, useState } from 'react';
import { CANVAS_CONFIG, loadDancingScriptFont, type TextPosition } from './canvasConfig';

export interface CanvasPreviewConfig {
  venue: 'hue' | 'hanoi';
  guestName: string;
  secondaryNote?: string;
  overrides?: {
    nameX?: number;
    secondaryNoteX?: number;
    textColor?: string;
  };
}

export interface UseCanvasPreviewReturn {
  frontCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  mainCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Helper function to render text on canvas with proper styling
 */
function renderTextOnCanvas(
  ctx: CanvasRenderingContext2D,
  text: string,
  position: TextPosition,
  canvasWidth: number,
  overrides?: { x?: number; color?: string }
) {
  // Set font and styling
  ctx.font = `${position.fontSize}px ${position.fontFamily}`;
  ctx.fillStyle = overrides?.color || position.color;
  ctx.textAlign = position.align;
  ctx.textBaseline = 'middle';

  // Add subtle shadow for better readability
  ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  // Calculate X position based on alignment and overrides
  let x = overrides?.x ?? position.x;
  if (position.align === 'center') {
    x = canvasWidth / 2;
  } else if (position.align === 'right') {
    x = canvasWidth - x;
  }

  // Draw text
  if (position.maxWidth) {
    // Measure text and scale if needed
    const metrics = ctx.measureText(text);
    if (metrics.width > position.maxWidth) {
      const scale = position.maxWidth / metrics.width;
      ctx.save();
      ctx.translate(x, position.y);
      ctx.scale(scale, 1);
      ctx.fillText(text, 0, 0);
      ctx.restore();
    } else {
      ctx.fillText(text, x, position.y);
    }
  } else {
    ctx.fillText(text, x, position.y);
  }

  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
}

/**
 * Custom hook for TWO canvas-based invitation previews
 * 
 * @param config - Canvas configuration with venue and text data
 * @returns Two canvas refs, loading state, and error state
 */
export function useCanvasPreview(config: CanvasPreviewConfig): UseCanvasPreviewReturn {
  const frontCanvasRef = useRef<HTMLCanvasElement>(null);
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const frontImageRef = useRef<HTMLImageElement | null>(null);
  const mainImageRef = useRef<HTMLImageElement | null>(null);
  const fontLoadedRef = useRef(false);

  useEffect(() => {
    const frontCanvas = frontCanvasRef.current;
    const mainCanvas = mainCanvasRef.current;
    
    if (!frontCanvas || !mainCanvas) return;

    const frontCtx = frontCanvas.getContext('2d');
    const mainCtx = mainCanvas.getContext('2d');
    
    if (!frontCtx || !mainCtx) {
      setError('Canvas not supported');
      return;
    }

    // Clear any previous errors
    setError(null);
    setIsLoading(true);

    // Get venue-specific configuration
    const venueConfig = CANVAS_CONFIG[config.venue];
    let frontImageLoaded = false;
    let mainImageLoaded = false;

    // Check if both images are loaded
    const checkBothLoaded = () => {
      if (frontImageLoaded && mainImageLoaded && fontLoadedRef.current) {
        setIsLoading(false);
      }
    };

    // Load Dancing Script font
    if (!fontLoadedRef.current) {
      loadDancingScriptFont()
        .then(() => {
          fontLoadedRef.current = true;
          checkBothLoaded();
        })
        .catch((err) => {
          console.warn('Failed to load Dancing Script font:', err);
          fontLoadedRef.current = true; // Proceed with fallback
          checkBothLoaded();
        });
    }

    // Load front image (for guest name)
    frontImageRef.current ??= new Image();
    const frontImg = frontImageRef.current;

    const handleFrontImageLoad = () => {
      try {
        // Set canvas dimensions to match image
        frontCanvas.width = frontImg.width;
        frontCanvas.height = frontImg.height;

        // Draw base image
        frontCtx.drawImage(frontImg, 0, 0);

        // Draw guest name if provided
        if (config.guestName) {
          renderTextOnCanvas(
            frontCtx,
            config.guestName,
            venueConfig.frontImage.namePosition,
            frontCanvas.width,
            {
              x: config.overrides?.nameX,
              color: config.overrides?.textColor
            }
          );
        }

        frontImageLoaded = true;
        checkBothLoaded();
      } catch (err) {
        console.error('Front canvas rendering error:', err);
        setError('Không thể hiển thị preview mặt ngoài');
        setIsLoading(false);
      }
    };

    const handleFrontImageError = () => {
      console.error('Failed to load front image:', venueConfig.frontImage.path);
      setError('Không thể tải ảnh mặt ngoài');
      setIsLoading(false);
    };

    frontImg.addEventListener('load', handleFrontImageLoad);
    frontImg.addEventListener('error', handleFrontImageError);

    // Load main image (for secondary note)
    mainImageRef.current ??= new Image();
    const mainImg = mainImageRef.current;

    const handleMainImageLoad = () => {
      try {
        // Set canvas dimensions to match image
        mainCanvas.width = mainImg.width;
        mainCanvas.height = mainImg.height;

        // Draw base image
        mainCtx.drawImage(mainImg, 0, 0);

        // Draw secondary note if provided
        if (config.secondaryNote) {
          renderTextOnCanvas(
            mainCtx,
            config.secondaryNote,
            venueConfig.mainImage.secondaryNotePosition,
            mainCanvas.width,
            {
              x: config.overrides?.secondaryNoteX,
              color: config.overrides?.textColor
            }
          );
        }

        mainImageLoaded = true;
        checkBothLoaded();
      } catch (err) {
        console.error('Main canvas rendering error:', err);
        setError('Không thể hiển thị preview mặt trong');
        setIsLoading(false);
      }
    };

    const handleMainImageError = () => {
      console.error('Failed to load main image:', venueConfig.mainImage.path);
      setError('Không thể tải ảnh mặt trong');
      setIsLoading(false);
    };

    mainImg.addEventListener('load', handleMainImageLoad);
    mainImg.addEventListener('error', handleMainImageError);

    // Trigger image loading
    if (frontImg.src !== window.location.origin + venueConfig.frontImage.path) {
      frontImg.src = venueConfig.frontImage.path;
    } else if (frontImg.complete) {
      handleFrontImageLoad();
    }

    if (mainImg.src !== window.location.origin + venueConfig.mainImage.path) {
      mainImg.src = venueConfig.mainImage.path;
    } else if (mainImg.complete) {
      handleMainImageLoad();
    }

    return () => {
      frontImg.removeEventListener('load', handleFrontImageLoad);
      frontImg.removeEventListener('error', handleFrontImageError);
      mainImg.removeEventListener('load', handleMainImageLoad);
      mainImg.removeEventListener('error', handleMainImageError);
    };
  }, [config.venue, config.guestName, config.secondaryNote]);

  return {
    frontCanvasRef,
    mainCanvasRef,
    isLoading,
    error
  };
}
