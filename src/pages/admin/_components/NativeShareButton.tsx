import React from 'react';
import { Share2, Download, Loader2 } from 'lucide-react';
import { useMobileDetection } from './hooks/useMobileDetection';
import { useNativeShare, type ShareData } from './hooks/useNativeShare';

/**
 * Props for NativeShareButton component
 */
export interface NativeShareButtonProps {
  /** Guest name for share message */
  guestName: string;
  /** URL of the front invitation image */
  frontImageUrl?: string;
  /** URL of the main invitation image */
  mainImageUrl?: string;
  /** Custom message to include in share */
  message?: string;
  /** Optional CSS classes */
  className?: string;
  /** Callback when share completes successfully */
  onShareSuccess?: () => void;
  /** Callback when share fails */
  onShareError?: (error: string) => void;
  /** Callback when download is triggered (desktop fallback) */
  onDownload?: () => void;
}

/**
 * Native Share Button Component
 * 
 * Renders a platform-aware button that:
 * - On mobile (iOS/Android): Shows share icon and triggers native share sheet with images
 * - On desktop: Shows download icon and triggers download functionality
 * 
 * Uses Web Share API for mobile sharing with multiple file attachments.
 * Gracefully falls back to download on platforms without Web Share API support.
 * 
 * @example
 * <NativeShareButton
 *   guestName="John Doe"
 *   frontImageUrl="https://example.com/front.jpg"
 *   mainImageUrl="https://example.com/main.jpg"
 *   message="Your wedding invitation is ready!"
 *   onShareSuccess={() => console.log('Shared!')}
 *   onShareError={(error) => console.error(error)}
 * />
 */
export const NativeShareButton: React.FC<NativeShareButtonProps> = ({
  guestName,
  frontImageUrl,
  mainImageUrl,
  message,
  className = '',
  onShareSuccess,
  onShareError,
  onDownload
}) => {
  const { isMobile } = useMobileDetection();
  const { canShare, share, isSharing } = useNativeShare();

  // Determine if we should show share button
  // In development, show share button on mobile even if Web Share API check fails
  // (due to HTTP vs HTTPS requirement on network IP)
  const isDevelopment = import.meta.env.DEV;
  const shouldShowShare = isMobile && (canShare || isDevelopment);
  
  console.log("Share Button Debug:", { 
    shouldShowShare, 
    isMobile, 
    canShare, 
    isDevelopment,
    hasNavigator: typeof navigator !== 'undefined',
    hasShare: typeof navigator?.share === 'function'
  });
  /**
   * Handle share button click
   */
  const handleShare = async () => {
    const shareData: ShareData = {
      guestName,
      frontImageUrl,
      mainImageUrl,
      message: message || `Invitation for ${guestName}`
    };

    const result = await share(shareData);

    if (result.success) {
      onShareSuccess?.();
    } else if (result.error && result.error !== 'Share cancelled by user') {
      onShareError?.(result.error);
    }
  };

  /**
   * Handle download button click (desktop fallback)
   */
  const handleDownload = () => {
    onDownload?.();
  };

  // Base button classes
  const baseClasses = 'inline-flex items-center gap-2 px-3 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Theme-specific classes matching wedding design system
  const themeClasses = shouldShowShare
    ? 'bg-gold-500 hover:bg-gold-600 text-white focus:ring-gold-500'
    : 'bg-taupe-100 hover:bg-taupe-200 text-taupe-800 focus:ring-taupe-500';

  const buttonClasses = `${baseClasses} ${themeClasses} ${className}`;

  // Render share button for mobile
  if (shouldShowShare) {
    return (
      <button
        type="button"
        onClick={handleShare}
        disabled={isSharing || (!frontImageUrl && !mainImageUrl)}
        className={buttonClasses}
        aria-label="Share invitation images"
      >
        {isSharing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Sharing...</span>
          </>
        ) : (
          <>
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </>
        )}
      </button>
    );
  }

  // Render download button for desktop
  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={!frontImageUrl && !mainImageUrl}
      className={buttonClasses}
      aria-label="Download invitation images"
    >
      <Download className="h-4 w-4" />
      <span>Download</span>
    </button>
  );
};

/**
 * Display error message from share operation
 * Helper component for error feedback
 */
export const ShareErrorMessage: React.FC<{ error: string | null }> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="text-sm text-red-600 mt-2" role="alert">
      {error}
    </div>
  );
};
