/**
 * Canvas Preview Hook
 * 
 * Custom hook for managing TWO canvas-based invitation previews with text overlay.
 * Front canvas shows guest name, Main canvas shows secondary note.
 * Integrated with CanvasService for auto-sizing and export capabilities.
 * 
 * @module pages/admin/_components/useCanvasPreview
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { CANVAS_CONFIG, loadDancingScriptFont, type TextPosition } from './canvasConfig';
import { canvasService } from '../../../services/canvasService';
import type { AutoSizeConfig } from '../../../types/canvas';

export interface CanvasPreviewConfig {
  venue: 'hue' | 'hanoi';
  guestName: string;
  secondaryNote?: string;
  overrides?: {
    nameX?: number;
    nameY?: number;
    secondaryNoteX?: number;
    secondaryNoteY?: number;
    textColor?: string;
  };
}

export interface UseCanvasPreviewReturn {
  frontCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  mainCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  isLoading: boolean;
  error: string | null;
  exportPreview: (canvasType: 'front' | 'main') => Promise<Blob>;
  exportHighResolution: (canvasType: 'front' | 'main') => Promise<Blob>;
}

/**
 * Helper function to render text on canvas with auto-sizing and styling
 */
function renderTextOnCanvas(
  ctx: CanvasRenderingContext2D,
  text: string,
  position: TextPosition,
  canvasWidth: number,
  autoSizeConfig?: AutoSizeConfig,
  overrides?: { x?: number; y?: number; color?: string }
) {
  // Calculate optimal font size if auto-sizing is enabled
  let fontSize = position.fontSize;
  if (autoSizeConfig && autoSizeConfig.enabled) {
    fontSize = canvasService.calculateOptimalFontSize(ctx, text, {
      minFontSize: autoSizeConfig.minFontSize,
      maxFontSize: autoSizeConfig.maxFontSize,
      baseFontSize: position.fontSize,
      maxWidth: autoSizeConfig.maxWidth
    });
  }

  // Set font and styling
  ctx.font = `${fontSize}px ${position.fontFamily}`;
  ctx.fillStyle = overrides?.color || position.color;
  ctx.textAlign = position.align;
  ctx.textBaseline = 'middle';

  // Add subtle shadow for better readability
  ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  // Calculate position based on alignment and overrides
  let x = overrides?.x ?? position.x;
  const y = overrides?.y ?? position.y;
  
  if (position.align === 'center') {
    x = canvasWidth / 2;
  } else if (position.align === 'right') {
    x = canvasWidth - x;
  }

  // Handle multi-line text if line height is specified
  if (position.lineHeight && position.maxWidth) {
    const lines = canvasService.wrapText(ctx, text, position.maxWidth);
    lines.forEach((line, index) => {
      const lineY = y + (index * (position.lineHeight || 0));
      ctx.fillText(line, x, lineY);
    });
  } else {
    // Single line text
    ctx.fillText(text, x, y);
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
            venueConfig.frontImage.autoSize,
            {
              x: config.overrides?.nameX,
              y: config.overrides?.nameY,
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
            venueConfig.mainImage.autoSize,
            {
              x: config.overrides?.secondaryNoteX,
              y: config.overrides?.secondaryNoteY,
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

  /**
   * Export current preview canvas as blob
   */
  const exportPreview = useCallback(async (canvasType: 'front' | 'main'): Promise<Blob> => {
    const canvas = canvasType === 'front' ? frontCanvasRef.current : mainCanvasRef.current;
    
    if (!canvas) {
      throw new Error('Canvas not available');
    }

    return canvasService.exportAsBlob(canvas, 0.95, 'image/png');
  }, []);

  /**
   * Generate high-resolution export (2x scaling)
   */
  const exportHighResolution = useCallback(async (canvasType: 'front' | 'main'): Promise<Blob> => {
    const canvas = canvasType === 'front' ? frontCanvasRef.current : mainCanvasRef.current;
    
    if (!canvas) {
      throw new Error('Canvas not available');
    }

    const venueConfig = CANVAS_CONFIG[config.venue];
    const imageConfig = canvasType === 'front' ? venueConfig.frontImage : venueConfig.mainImage;
    const text = canvasType === 'front' ? config.guestName : (config.secondaryNote || '');
    
    const position = canvasType === 'front' 
      ? venueConfig.frontImage.namePosition 
      : venueConfig.mainImage.secondaryNotePosition;

    // Load high-res image
    const imagePath = imageConfig.path;
    const image = await canvasService.loadImage(imagePath);

    return canvasService.exportHighResolution(
      canvas,
      {
        width: image.width * 2,
        height: image.height * 2,
        quality: 0.95,
        format: 'image/png'
      },
      (ctx) => {
        // Draw background image
        ctx.drawImage(image, 0, 0);

        // Render text with scaling
        if (text) {
          renderTextOnCanvas(
            ctx,
            text,
            position,
            image.width,
            imageConfig.autoSize,
            {
              x: config.overrides?.[canvasType === 'front' ? 'nameX' : 'secondaryNoteX'],
              y: config.overrides?.[canvasType === 'front' ? 'nameY' : 'secondaryNoteY'],
              color: config.overrides?.textColor
            }
          );
        }
      }
    );
  }, [config.venue, config.guestName, config.secondaryNote, config.overrides]);

  return {
    frontCanvasRef,
    mainCanvasRef,
    isLoading,
    error,
    exportPreview,
    exportHighResolution
  };
}
