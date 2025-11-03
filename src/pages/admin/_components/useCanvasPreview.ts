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
  overrides?: { x?: number; y?: number; color?: string; fontFamily?: string }
) {
  // Calculate optimal font size if auto-sizing is enabled
  let fontSize = position.fontSize;
  if (autoSizeConfig?.enabled) {
    fontSize = canvasService.calculateOptimalFontSize(ctx, text, {
      minFontSize: autoSizeConfig.minFontSize,
      maxFontSize: autoSizeConfig.maxFontSize,
      baseFontSize: position.fontSize,
      maxWidth: autoSizeConfig.maxWidth
    });
  }

  // Set font and styling - use override font family if provided
  const fontFamily = overrides?.fontFamily || position.fontFamily;
  ctx.font = `${fontSize}px ${fontFamily}`;
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
    for (const [index, line] of lines.entries()) {
      const lineY = y + (index * (position.lineHeight || 0));
      ctx.fillText(line, x, lineY);
    }
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
  const fontFamilyRef = useRef<string>('italic "Times New Roman"');

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

    // Load font (Dancing Script or fallback)
    if (!fontLoadedRef.current) {
      loadDancingScriptFont()
        .then((fontFamily) => {
          fontFamilyRef.current = fontFamily;
          fontLoadedRef.current = true;
          checkBothLoaded();
        })
        .catch((err) => {
          console.warn('Failed to load font:', err);
          fontFamilyRef.current = 'italic "Times New Roman"';
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
              color: config.overrides?.textColor,
              fontFamily: fontFamilyRef.current
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
              color: config.overrides?.textColor,
              fontFamily: fontFamilyRef.current
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
    if (frontImg.src !== globalThis.location.origin + venueConfig.frontImage.path) {
      frontImg.src = venueConfig.frontImage.path;
    } else if (frontImg.complete) {
      handleFrontImageLoad();
    }

    if (mainImg.src !== globalThis.location.origin + venueConfig.mainImage.path) {
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
   * Export current preview canvas as blob (EXACT canvas quality - no recompression)
   * This produces the same quality as right-clicking and "Save Image"
   */
  const exportPreview = useCallback(async (canvasType: 'front' | 'main'): Promise<Blob> => {
    const canvas = canvasType === 'front' ? frontCanvasRef.current : mainCanvasRef.current;
    
    if (!canvas) {
      throw new Error('Canvas not available');
    }

    // Use PNG format with maximum quality (1) to preserve exact canvas pixels
    // This is the same as "Save Image" - no compression or quality loss
    return canvasService.exportAsBlob(canvas, 1, 'image/png');
  }, []);

  /**
   * Generate high-resolution export (3x scaling with native resolution)
   * This re-renders the canvas at 3x resolution for print quality
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

    // Load high-res image at original quality
    const imagePath = imageConfig.path;
    const image = await canvasService.loadImage(imagePath);

    // Create high-res canvas at 3x resolution
    const scaleFactor = 3;
    const highResCanvas = document.createElement('canvas');
    highResCanvas.width = image.naturalWidth * scaleFactor;
    highResCanvas.height = image.naturalHeight * scaleFactor;

    const ctx = highResCanvas.getContext('2d', {
      alpha: true,
      desynchronized: false,
      willReadFrequently: false
    });

    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // Enable high-quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Scale context for high-res rendering
    ctx.scale(scaleFactor, scaleFactor);

    // Draw background image at original resolution
    ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);

    // Render text with scaled positions
    if (text) {
      const scaledPosition = {
        ...position,
        fontSize: position.fontSize * scaleFactor,
        x: position.x,
        y: position.y
      };

      renderTextOnCanvas(
        ctx,
        text,
        scaledPosition,
        image.naturalWidth,
        imageConfig.autoSize ? {
          ...imageConfig.autoSize,
          minFontSize: imageConfig.autoSize.minFontSize * scaleFactor,
          maxFontSize: imageConfig.autoSize.maxFontSize * scaleFactor,
          baseFontSize: position.fontSize * scaleFactor,
          maxWidth: imageConfig.autoSize.maxWidth
        } : undefined,
        {
          x: config.overrides?.[canvasType === 'front' ? 'nameX' : 'secondaryNoteX'],
          y: config.overrides?.[canvasType === 'front' ? 'nameY' : 'secondaryNoteY'],
          color: config.overrides?.textColor,
          fontFamily: fontFamilyRef.current
        }
      );
    }

    // Export at maximum PNG quality (lossless)
    return canvasService.exportAsBlob(highResCanvas, 1, 'image/png');
  }, [config.venue, config.guestName, config.secondaryNote, config.overrides, fontFamilyRef]);

  return {
    frontCanvasRef,
    mainCanvasRef,
    isLoading,
    error,
    exportPreview,
    exportHighResolution
  };
}
