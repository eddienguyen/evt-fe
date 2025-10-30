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
   * 
   * Strategy:
   * 1. Try direct fetch with CORS (works if R2 CORS is properly configured)
   * 2. If CORS fails, try backend proxy as fallback
   */
  const urlToFile = async (url: string, filename: string): Promise<File | null> => {
    // First attempt: Direct fetch with CORS
    try {
      const response = await fetch(url, {
        mode: 'cors',
        credentials: 'omit',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }

      const blob = await response.blob();
      const mimeType = blob.type || 'image/jpeg';
      const extension = mimeType.split('/')[1] || 'jpg';
      const file = new File([blob], `${filename}.${extension}`, { type: mimeType });
      
      console.log(`✅ Successfully fetched image directly: ${filename}`);
      return file;
      
    } catch (directError) {
      console.warn(`⚠️ Direct fetch failed for ${url}, trying backend proxy...`, directError);
      
      // Second attempt: Backend proxy
      try {
        const backendUrl = import.meta.env.VITE_API_BASE_URL || 'https://192.168.0.101:3000';
        const proxyUrl = `${backendUrl}/api/proxy-image?url=${encodeURIComponent(url)}`;
        
        const proxyResponse = await fetch(proxyUrl, {
          mode: 'cors',
          credentials: 'omit', // Don't send credentials for proxy requests (allows wildcard CORS)
        });
        
        if (!proxyResponse.ok) {
          throw new Error(`Proxy fetch failed: ${proxyResponse.statusText}`);
        }

        const blob = await proxyResponse.blob();
        const mimeType = blob.type || 'image/jpeg';
        const extension = mimeType.split('/')[1] || 'jpg';
        const file = new File([blob], `${filename}.${extension}`, { type: mimeType });
        
        console.log(`✅ Successfully fetched image via proxy: ${filename}`);
        return file;
        
      } catch (proxyError) {
        console.error(`❌ Both direct and proxy fetch failed for: ${url}`);
        console.error('Direct fetch error:', directError);
        console.error('Proxy fetch error:', proxyError);
        
        // Provide helpful CORS error message
        if (directError instanceof TypeError && directError.message === 'Load failed') {
          console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.error('🚨 CORS CONFIGURATION REQUIRED');
          console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.error('Your R2 bucket needs CORS configuration to allow:');
          console.error('  Origin:', globalThis.location?.origin);
          console.error('  Methods: GET, HEAD');
          console.error('  Headers: Content-Type, Range');
          console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.error('Steps to fix:');
          console.error('  1. Go to Cloudflare Dashboard > R2');
          console.error('  2. Select your bucket');
          console.error('  3. Go to Settings > CORS Policy');
          console.error('  4. Add this origin:', globalThis.location?.origin);
          console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        }
        
        return null;
      }
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
        const errorMsg = 'Failed to prepare images for sharing. Please check that CORS is configured on the image storage (R2 bucket).';
        setError(errorMsg);
        setIsSharing(false);
        console.error('Image preparation failed - likely CORS issue. Configure R2 bucket CORS to allow origin:', globalThis.location?.origin);
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
