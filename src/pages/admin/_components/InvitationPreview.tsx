/**
 * Invitation Preview Component
 * 
 * Displays live canvas preview of personalized invitation image
 * with text overlay based on venue, guest name, and secondary note.
 * Exposes export methods via forwardRef.
 * 
 * @module pages/admin/_components/InvitationPreview
 */

import { useImperativeHandle, forwardRef, useState, useEffect } from 'react';
import { useCanvasPreview } from './useCanvasPreview';
import { cn } from '../../../lib/utils';
import { NativeShareButton } from './NativeShareButton';

export interface InvitationPreviewProps {
  venue: 'hue' | 'hanoi';
  guestName: string;
  secondaryNote?: string;
  className?: string;
  positionOverrides?: {
    nameX?: number;
    nameY?: number;
    secondaryNoteX?: number;
    secondaryNoteY?: number;
    textColor?: string;
  };
}

export interface InvitationPreviewHandle {
  exportPreview: (canvasType: 'front' | 'main') => Promise<Blob>;
  exportHighResolution: (canvasType: 'front' | 'main') => Promise<Blob>;
}

/**
 * Invitation Preview Component
 * 
 * Renders a canvas-based preview of the invitation image with text overlay.
 * Updates in real-time as form values change.
 * Exposes export methods via ref.
 */
export const InvitationPreview = forwardRef<InvitationPreviewHandle, InvitationPreviewProps>(({
  venue,
  guestName,
  secondaryNote,
  className,
  positionOverrides
}, ref) => {
  const { frontCanvasRef, mainCanvasRef, isLoading, error, exportPreview, exportHighResolution } = useCanvasPreview({
    venue,
    guestName,
    secondaryNote,
    overrides: positionOverrides
  });

  const [canvasImageUrls, setCanvasImageUrls] = useState<{
    front: string | null;
    main: string | null;
  }>({ front: null, main: null });

  // Expose export methods to parent
  useImperativeHandle(ref, () => ({
    exportPreview,
    exportHighResolution
  }), [exportPreview, exportHighResolution]);

  /**
   * Generate data URLs from canvas for sharing
   */
  const generateShareUrls = async () => {
    try {
      if (!guestName && !secondaryNote) return;

      const urls: { front: string | null; main: string | null } = {
        front: null,
        main: null
      };

      // Generate front image URL if guest name exists
      if (guestName && frontCanvasRef.current) {
        urls.front = frontCanvasRef.current.toDataURL('image/png');
      }

      // Generate main image URL if secondary note exists
      if (secondaryNote && mainCanvasRef.current) {
        urls.main = mainCanvasRef.current.toDataURL('image/png');
      }

      setCanvasImageUrls(urls);
    } catch (err) {
      console.error('Failed to generate share URLs:', err);
    }
  };

  // Update share URLs when canvas content changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void generateShareUrls();
    }, 500); // Debounce canvas updates

    return () => clearTimeout(timeoutId);
  }, [guestName, secondaryNote]);

  /**
   * Handle direct download from canvas preview
   */
  const handleDownload = async (canvasType: 'front' | 'main') => {
    try {
      const blob = await exportPreview(canvasType);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${guestName || 'invitation'}-${canvasType === 'front' ? 'mat-ngoai' : 'mat-trong'}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download image:', err);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Section Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Xem trước thiệp mời
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Preview cập nhật tự động khi bạn nhập thông tin
        </p>
      </div>

      {/* Two Canvas Containers */}
      <div className="grid grid-cols-1 gap-6">
        {/* Front Canvas (Guest Name) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Mặt ngoài
            </h3>
            {guestName && !isLoading && (
              <NativeShareButton
                guestName={guestName}
                frontImageUrl={canvasImageUrls.front || undefined}
                message={`Thiệp mời mặt ngoài - ${guestName}`}
                className="text-xs"
                onShareSuccess={() => {
                  console.log('Share successful - Front');
                }}
                onShareError={(error) => {
                  console.error('Share failed - Front:', error);
                }}
                onDownload={() => handleDownload('front')}
              />
            )}
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="relative w-full max-w-md mx-auto group">
              {/* Loading State */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 rounded-lg z-10">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Đang tải...
                    </p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/20 rounded-lg z-10">
                  <p className="text-xs text-red-600 dark:text-red-400 text-center p-4">
                    {error}
                  </p>
                </div>
              )}

              {/* Front Canvas Element */}
              <canvas
                ref={frontCanvasRef}
                onClick={() => guestName && !isLoading && handleDownload('front')}
                className={cn(
                  'w-full h-auto rounded-lg shadow-md transition-all duration-300',
                  isLoading || error ? 'opacity-0' : 'opacity-100',
                  guestName && !isLoading && 'cursor-pointer hover:shadow-lg hover:scale-[1.02]'
                )}
                title={guestName && !isLoading ? 'Click to download' : ''}
              />

              {/* Placeholder when no name */}
              {!guestName && !isLoading && !error && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-gray-800/90 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center p-4">
                    Nhập tên để xem
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Canvas (Secondary Note) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Mặt trong
            </h3>
            {secondaryNote && !isLoading && (
              <NativeShareButton
                guestName={guestName || 'Guest'}
                mainImageUrl={canvasImageUrls.main || undefined}
                message={`Thiệp mời mặt trong - ${guestName || 'Guest'}`}
                className="text-xs"
                onShareSuccess={() => {
                  console.log('Share successful - Main');
                }}
                onShareError={(error) => {
                  console.error('Share failed - Main:', error);
                }}
                onDownload={() => handleDownload('main')}
              />
            )}
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="relative w-full max-w-md mx-auto group">
              {/* Loading State */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 rounded-lg z-10">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Đang tải...
                    </p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/20 rounded-lg z-10">
                  <p className="text-xs text-red-600 dark:text-red-400 text-center p-4">
                    {error}
                  </p>
                </div>
              )}

              {/* Main Canvas Element */}
              <canvas
                ref={mainCanvasRef}
                onClick={() => secondaryNote && !isLoading && handleDownload('main')}
                className={cn(
                  'w-full h-auto rounded-lg shadow-md transition-all duration-300',
                  isLoading || error ? 'opacity-0' : 'opacity-100',
                  secondaryNote && !isLoading && 'cursor-pointer hover:shadow-lg hover:scale-[1.02]'
                )}
                title={secondaryNote && !isLoading ? 'Download' : ''}
              />

              {/* Placeholder when no secondary note */}
              {!secondaryNote && !isLoading && !error && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-gray-800/90 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center p-4">
                    Nhập ghi chú để xem
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

InvitationPreview.displayName = 'InvitationPreview';

export default InvitationPreview;
