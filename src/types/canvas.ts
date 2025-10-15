/**
 * Canvas Type Definitions
 * 
 * Type definitions for canvas service and image processing operations.
 * 
 * @module types/canvas
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
  enabled?: boolean;
  minFontSize: number;
  maxFontSize: number;
  baseFontSize: number;
  maxWidth: number;
}

export interface CanvasExportState {
  isExporting: boolean;
  exportProgress: number;
  generatedBlob: Blob | null;
  error: string | null;
}
