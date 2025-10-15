/**
 * Canvas Service
 * 
 * Singleton service for canvas image processing operations.
 * Provides font/image caching, text processing, and export functionality.
 * 
 * @module services/canvasService
 */

export interface TextPosition {
  x: number;
  y: number;
  align: 'left' | 'center' | 'right';
  maxWidth?: number;
  lineHeight?: number;
}

export interface TextStyling {
  fontFamily: string;
  fontSize: number;
  color: string;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
}

export interface ExportConfig {
  width: number;
  height: number;
  quality: number;
  format: 'image/jpeg' | 'image/png';
}

export interface AutoSizeConfig {
  minFontSize: number;
  maxFontSize: number;
  baseFontSize: number;
  maxWidth: number;
}

/**
 * Canvas Service Class
 * 
 * Singleton service for managing canvas operations including font loading,
 * image caching, text processing, and export functionality.
 */
class CanvasService {
  private static instance: CanvasService;
  private readonly fontCache: Map<string, FontFace> = new Map();
  private readonly imageCache: Map<string, HTMLImageElement> = new Map();
  private readonly fontLoadingStatus: Map<string, 'loading' | 'loaded' | 'error'> = new Map();

  private constructor() {
    // Private constructor for singleton pattern
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): CanvasService {
    if (!CanvasService.instance) {
      CanvasService.instance = new CanvasService();
    }
    return CanvasService.instance;
  }

  /**
   * Load and cache a font
   */
  public async loadFont(fontFamily: string, fontUrl: string): Promise<void> {
    // Check if already loaded
    if (this.fontCache.has(fontFamily)) {
      return;
    }

    // Check if currently loading
    if (this.fontLoadingStatus.get(fontFamily) === 'loading') {
      return new Promise((resolve, reject) => {
        const checkInterval = setInterval(() => {
          const status = this.fontLoadingStatus.get(fontFamily);
          if (status === 'loaded') {
            clearInterval(checkInterval);
            resolve();
          } else if (status === 'error') {
            clearInterval(checkInterval);
            reject(new Error(`Font ${fontFamily} failed to load`));
          }
        }, 100);
      });
    }

    try {
      this.fontLoadingStatus.set(fontFamily, 'loading');
      
      const fontFace = new FontFace(fontFamily, `url(${fontUrl})`);
      await fontFace.load();
      
      // Add to document fonts
      document.fonts.add(fontFace);
      
      // Cache the font
      this.fontCache.set(fontFamily, fontFace);
      this.fontLoadingStatus.set(fontFamily, 'loaded');
    } catch (error) {
      this.fontLoadingStatus.set(fontFamily, 'error');
      console.error(`Failed to load font ${fontFamily}:`, error);
      throw error;
    }
  }

  /**
   * Get font loading status
   */
  public getFontLoadingStatus(fontFamily: string): 'loading' | 'loaded' | 'error' | 'not-loaded' {
    return this.fontLoadingStatus.get(fontFamily) || 'not-loaded';
  }

  /**
   * Load and cache an image
   */
  public async loadImage(url: string): Promise<HTMLImageElement> {
    // Check cache first
    if (this.imageCache.has(url)) {
      return this.imageCache.get(url)!;
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Enable CORS for canvas export
      
      img.onload = () => {
        this.imageCache.set(url, img);
        resolve(img);
      };
      
      img.onerror = () => {
        reject(new Error(`Failed to load image: ${url}`));
      };
      
      img.src = url;
    });
  }

  /**
   * Get image from cache
   */
  public getImageFromCache(url: string): HTMLImageElement | null {
    return this.imageCache.get(url) || null;
  }

  /**
   * Calculate optimal font size based on text length and available width
   */
  public calculateOptimalFontSize(
    ctx: CanvasRenderingContext2D,
    text: string,
    config: AutoSizeConfig
  ): number {
    const { minFontSize, maxFontSize, baseFontSize, maxWidth } = config;
    
    // Start with base font size
    let fontSize = baseFontSize;
    ctx.font = `${fontSize}px ${ctx.font.split(' ').slice(1).join(' ')}`;
    
    // Measure text width
    let textWidth = ctx.measureText(text).width;
    
    // If text fits, try to increase font size up to maxFontSize
    if (textWidth < maxWidth && fontSize < maxFontSize) {
      while (fontSize < maxFontSize) {
        fontSize += 2;
        ctx.font = `${fontSize}px ${ctx.font.split(' ').slice(1).join(' ')}`;
        textWidth = ctx.measureText(text).width;
        
        if (textWidth >= maxWidth) {
          fontSize -= 2; // Step back to last valid size
          break;
        }
      }
    }
    // If text doesn't fit, reduce font size down to minFontSize
    else if (textWidth > maxWidth && fontSize > minFontSize) {
      while (fontSize > minFontSize) {
        fontSize -= 2;
        ctx.font = `${fontSize}px ${ctx.font.split(' ').slice(1).join(' ')}`;
        textWidth = ctx.measureText(text).width;
        
        if (textWidth <= maxWidth) {
          break;
        }
      }
    }
    
    return Math.max(minFontSize, Math.min(maxFontSize, fontSize));
  }

  /**
   * Wrap text into multiple lines based on max width
   */
  public wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
  ): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine + ' ' + word;
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && i > 0) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine);
    
    return lines;
  }

  /**
   * Measure text dimensions
   */
  public measureTextDimensions(
    ctx: CanvasRenderingContext2D,
    text: string
  ): TextMetrics {
    return ctx.measureText(text);
  }

  /**
   * Render text on canvas with advanced styling
   */
  public renderTextWithStyling(
    ctx: CanvasRenderingContext2D,
    text: string,
    position: TextPosition,
    styling: TextStyling
  ): void {
    // Save context state
    ctx.save();

    // Apply text styling
    ctx.font = `${styling.fontSize}px ${styling.fontFamily}`;
    ctx.fillStyle = styling.color;
    ctx.textAlign = position.align;
    ctx.textBaseline = 'middle';

    // Apply shadow if specified
    if (styling.shadowColor) {
      ctx.shadowColor = styling.shadowColor;
      ctx.shadowBlur = styling.shadowBlur || 0;
      ctx.shadowOffsetX = styling.shadowOffsetX || 0;
      ctx.shadowOffsetY = styling.shadowOffsetY || 0;
    }

    // Handle multi-line text if maxWidth is specified
    if (position.maxWidth && position.lineHeight) {
      const lines = this.wrapText(ctx, text, position.maxWidth);
      const lineHeight = position.lineHeight;
      const totalHeight = lines.length * lineHeight;
      let startY = position.y - (totalHeight / 2) + (lineHeight / 2);

      lines.forEach((line, index) => {
        ctx.fillText(line, position.x, startY + (index * lineHeight));
      });
    } else {
      // Single line text
      ctx.fillText(text, position.x, position.y);
    }

    // Restore context state
    ctx.restore();
  }

  /**
   * Export canvas as Blob
   */
  public async exportAsBlob(
    canvas: HTMLCanvasElement,
    quality: number = 0.95,
    format: 'image/jpeg' | 'image/png' = 'image/png'
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob from canvas'));
          }
        },
        format,
        quality
      );
    });
  }

  /**
   * Export canvas as Data URL
   */
  public exportAsDataURL(
    canvas: HTMLCanvasElement,
    quality: number = 0.95,
    format: 'image/jpeg' | 'image/png' = 'image/png'
  ): string {
    return canvas.toDataURL(format, quality);
  }

  /**
   * Generate high-resolution canvas export
   */
  public async exportHighResolution(
    baseCanvas: HTMLCanvasElement,
    config: ExportConfig,
    renderCallback: (ctx: CanvasRenderingContext2D, scale: number) => void
  ): Promise<Blob> {
    // Create high-resolution canvas
    const highResCanvas = document.createElement('canvas');
    highResCanvas.width = config.width;
    highResCanvas.height = config.height;
    
    const ctx = highResCanvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // Calculate scale factor
    const scaleX = config.width / baseCanvas.width;
    const scaleY = config.height / baseCanvas.height;
    const scale = Math.min(scaleX, scaleY);

    // Apply scaling
    ctx.scale(scale, scale);

    // Execute render callback with scaled context
    renderCallback(ctx, scale);

    // Export as blob
    return this.exportAsBlob(highResCanvas, config.quality, config.format);
  }

  /**
   * Clear all caches (for memory management)
   */
  public clearCaches(): void {
    this.imageCache.clear();
    // Note: Keep font cache as fonts are expensive to reload
  }

  /**
   * Download blob as file
   */
  public downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

// Export singleton instance
export const canvasService = CanvasService.getInstance();
