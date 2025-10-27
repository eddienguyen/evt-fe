import { useState, useCallback } from 'react';

/**
 * Interface for share data containing invitation images
 */
export interface ShareData {
  /** Guest name for share message */
  guestName: string;
  /** URL of the front invitation image */
  frontImageUrl?: string;
  /** URL of the main invitation image */
  mainImageUrl?: string;
  /** Custom message to include in share */
  message?: string;
}

/**
 * Interface for share operation result
 */
export interface ShareResult {
  /** Whether the share operation was successful */
  success: boolean;
  /** Error message if share failed */
  error?: string;
}

/**
 * Interface for the useNativeShare hook return value
 */
export interface UseNativeShareReturn {
  /** Whether a share operation is in progress */
  isSharing: boolean;
  /** Whether the Web Share API is supported */
  canShare: boolean;
  /** Function to trigger native share */
  share: (data: ShareData) => Promise<ShareResult>;
  /** Last error message if share failed */
  error: string | null;
}

/**
 * Custom hook for native mobile sharing using Web Share API
 * Supports sharing multiple invitation images with guest information
 * 
 * @returns {UseNativeShareReturn} Hook interface with share functionality
 * 
 * @example
 * const { canShare, share, isSharing, error } = useNativeShare();
 * 
 * const handleShare = async () => {
 *   const result = await share({
 *     guestName: 'John Doe',
 *     frontImageUrl: 'https://example.com/front.jpg',
 *     mainImageUrl: 'https://example.com/main.jpg',
 *     message: 'Your wedding invitation'
 *   });
 *   
 *   if (result.success) {
 *     console.log('Shared successfully');
 *   }
 * };
 */
export const useNativeShare = (): UseNativeShareReturn => {
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if Web Share API is available
  const canShare = globalThis.navigator?.canShare !== undefined && 
                   globalThis.navigator?.share !== undefined;

  // Debug logging for Web Share API availability
  if (import.meta.env.DEV) {
    console.log('🔍 Web Share API Detection:', {
      hasNavigator: globalThis.navigator !== undefined,
      hasShare: typeof globalThis.navigator?.share === 'function',
      hasCanShare: typeof globalThis.navigator?.canShare === 'function',
      canShare,
      isSecureContext: globalThis.isSecureContext,
      protocol: globalThis.location?.protocol,
      hostname: globalThis.location?.hostname
    });
  }

  /**
   * Convert image URL to File object for sharing
   * Required because Web Share API accepts File objects, not URLs
   */
  const urlToFile = async (url: string, filename: string): Promise<File | null> => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }

      const blob = await response.blob();
      
      // Determine MIME type from blob or default to jpeg
      const mimeType = blob.type || 'image/jpeg';
      
      // Create File object with proper extension
      const extension = mimeType.split('/')[1] || 'jpg';
      const file = new File([blob], `${filename}.${extension}`, { type: mimeType });
      
      return file;
    } catch (err) {
      console.error(`Error converting URL to file: ${url}`, err);
      return null;
    }
  };

  /**
   * Prepare files array from image URLs
   */
  const prepareFiles = async (data: ShareData): Promise<File[]> => {
    const files: File[] = [];

    if (data.frontImageUrl) {
      const frontFile = await urlToFile(
        data.frontImageUrl,
        `${data.guestName}-invitation-front`
      );
      if (frontFile) files.push(frontFile);
    }

    if (data.mainImageUrl) {
      const mainFile = await urlToFile(
        data.mainImageUrl,
        `${data.guestName}-invitation-main`
      );
      if (mainFile) files.push(mainFile);
    }

    return files;
  };

  /**
   * Validate share operation prerequisites
   */
  const validateShareData = (data: ShareData): ShareResult | null => {
    // In development mode, skip canShare check for mobile testing over HTTP
    // The actual navigator.share() call will fail gracefully if not supported
    const isDevelopment = import.meta.env.DEV;
    
    if (!canShare && !isDevelopment) {
      const errorMsg = 'Web Share API is not supported on this device';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    if (!data.frontImageUrl && !data.mainImageUrl) {
      const errorMsg = 'At least one invitation image must be provided';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    return null;
  };

  /**
   * Execute native share operation with invitation images
   */
  const share = useCallback(async (data: ShareData): Promise<ShareResult> => {
    setError(null);

    const validationError = validateShareData(data);
    if (validationError) return validationError;

    setIsSharing(true);

    try {
      const files = await prepareFiles(data);

      if (files.length === 0) {
        const errorMsg = 'Failed to prepare images for sharing';
        setError(errorMsg);
        setIsSharing(false);
        return { success: false, error: errorMsg };
      }

      const shareData: ShareData & { files?: File[] } = {
        guestName: data.guestName,
        message: data.message,
        files
      };

      // Check if navigator.share exists (runtime check)
      if (!globalThis.navigator?.share) {
        const errorMsg = 'Web Share API is not available. This feature requires HTTPS or localhost.';
        setError(errorMsg);
        setIsSharing(false);
        console.error('Share API not available:', {
          hasNavigator: !!globalThis.navigator,
          hasShare: !!globalThis.navigator?.share,
          isSecureContext: globalThis.isSecureContext,
          protocol: globalThis.location?.protocol
        });
        return { success: false, error: errorMsg };
      }

      // Check if can share with canShare() if available
      if (globalThis.navigator.canShare && !globalThis.navigator.canShare(shareData)) {
        const errorMsg = 'This device cannot share these files';
        setError(errorMsg);
        setIsSharing(false);
        return { success: false, error: errorMsg };
      }

      await globalThis.navigator.share(shareData);
      setIsSharing(false);
      return { success: true };

    } catch (err) {
      setIsSharing(false);

      if (err instanceof Error && err.name === 'AbortError') {
        return { success: false, error: 'Share cancelled by user' };
      }

      const errorMsg = err instanceof Error ? err.message : 'Unknown error during share operation';
      setError(errorMsg);
      console.error('Share error:', err);
      return { success: false, error: errorMsg };
    }
  }, [canShare]);

  return {
    isSharing,
    canShare,
    share,
    error
  };
};
