/**
 * Invitation Preview Component
 * 
 * Displays live canvas preview of personalized invitation image
 * with text overlay based on venue, guest name, and secondary note.
 * 
 * @module pages/admin/_components/InvitationPreview
 */

import React from 'react';
import { useCanvasPreview } from './useCanvasPreview';
import { cn } from '../../../lib/utils';

export interface InvitationPreviewProps {
  venue: 'hue' | 'hanoi';
  guestName: string;
  secondaryNote?: string;
  className?: string;
  positionOverrides?: {
    nameX?: number;
    secondaryNoteX?: number;
    textColor?: string;
  };
}

/**
 * Invitation Preview Component
 * 
 * Renders a canvas-based preview of the invitation image with text overlay.
 * Updates in real-time as form values change.
 */
export const InvitationPreview: React.FC<InvitationPreviewProps> = ({
  venue,
  guestName,
  secondaryNote,
  className,
  positionOverrides
}) => {
  const { frontCanvasRef, mainCanvasRef, isLoading, error } = useCanvasPreview({
    venue,
    guestName,
    secondaryNote,
    overrides: positionOverrides
  });

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
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Mặt ngoài
          </h3>
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="relative w-full max-w-md mx-auto">
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
                className={cn(
                  'w-full h-auto rounded-lg shadow-md transition-opacity duration-300',
                  isLoading || error ? 'opacity-0' : 'opacity-100'
                )}
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
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Mặt trong
          </h3>
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="relative w-full max-w-md mx-auto">
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
                className={cn(
                  'w-full h-auto rounded-lg shadow-md transition-opacity duration-300',
                  isLoading || error ? 'opacity-0' : 'opacity-100'
                )}
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
};

export default InvitationPreview;
