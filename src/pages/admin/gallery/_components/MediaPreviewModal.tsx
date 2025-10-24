/**
 * Media Preview Modal Component
 * 
 * Full-screen lightbox modal for viewing media in detail.
 * Supports navigation between items, metadata display, and quick actions.
 * 
 * @module pages/admin/gallery/_components/MediaPreviewModal
 */

import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Edit2, Trash2, Download } from 'lucide-react';
import type { GalleryMediaItem } from '../../../../types/gallery';

/**
 * MediaPreviewModal Props
 */
interface MediaPreviewModalProps {
  /** Currently previewed media item */
  mediaItem: GalleryMediaItem;
  /** All media items for navigation */
  allItems: GalleryMediaItem[];
  /** Close modal callback */
  onClose: () => void;
  /** Navigate to previous item callback */
  onPrevious?: () => void;
  /** Navigate to next item callback */
  onNext?: () => void;
  /** Edit metadata callback */
  onEdit?: (item: GalleryMediaItem) => void;
  /** Delete item callback */
  onDelete?: (id: string) => void;
}

/**
 * MediaPreviewModal Component
 * 
 * Full-screen lightbox for viewing media with navigation,
 * metadata sidebar, and action buttons.
 */
export const MediaPreviewModal: React.FC<MediaPreviewModalProps> = ({
  mediaItem,
  allItems,
  onClose,
  onPrevious,
  onNext,
  onEdit,
  onDelete,
}) => {
  // Find current index for navigation
  const currentIndex = allItems.findIndex((item) => item.id === mediaItem.id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allItems.length - 1;

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (hasPrevious && onPrevious) {
            e.preventDefault();
            onPrevious();
          }
          break;
        case 'ArrowRight':
          if (hasNext && onNext) {
            e.preventDefault();
            onNext();
          }
          break;
      }
    },
    [onClose, onPrevious, onNext, hasPrevious, hasNext]
  );

  // Add keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  /**
   * Handle backdrop click
   */
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  /**
   * Handle download
   */
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = mediaItem.r2Urls.original;
    link.download = mediaItem.filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-modal-title"
      className="fixed inset-0 z-50 bg-black flex"
      onClick={handleBackdropClick}
    >
      {/* Header Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between">
          {/* Title */}
          <h2
            id="preview-modal-title"
            className="text-lg font-medium text-white truncate flex-1"
          >
            {mediaItem.title || mediaItem.filename}
          </h2>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 ml-4">
            {onEdit && (
              <button
                onClick={() => {
                  onEdit(mediaItem);
                  onClose();
                }}
                className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Edit metadata"
                title="Edit"
              >
                <Edit2 className="h-5 w-5" />
              </button>
            )}

            <button
              onClick={handleDownload}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Download media"
              title="Download"
            >
              <Download className="h-5 w-5" />
            </button>

            {onDelete && (
              <button
                onClick={() => {
                  if (globalThis.confirm('Are you sure you want to delete this media?')) {
                    onDelete(mediaItem.id);
                    onClose();
                  }
                }}
                className="p-2 text-red-400 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Delete media"
                title="Delete"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close preview"
              title="Close (Esc)"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      {hasPrevious && onPrevious && (
        <button
          onClick={onPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
          aria-label="Previous media"
          title="Previous (←)"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
      )}

      {hasNext && onNext && (
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
          aria-label="Next media"
          title="Next (→)"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center p-20">
        {mediaItem.mediaType === 'image' ? (
          <img
            src={mediaItem.r2Urls.large || mediaItem.r2Urls.original}
            alt={mediaItem.alt || mediaItem.title || 'Preview'}
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <video
            src={mediaItem.r2Urls.original}
            controls
            autoPlay
            className="max-w-full max-h-full"
          >
            <track kind="captions" />
          </video>
        )}
      </div>

      {/* Metadata Sidebar */}
      <div className="w-80 bg-gray-900 text-white p-6 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Details</h3>

        <div className="space-y-4 text-sm">
          {/* Filename */}
          <div>
            <p className="text-gray-400 mb-1">Filename</p>
            <p className="font-medium break-all">{mediaItem.filename}</p>
          </div>

          {/* Title */}
          {mediaItem.title && (
            <div>
              <p className="text-gray-400 mb-1">Title</p>
              <p className="font-medium">{mediaItem.title}</p>
            </div>
          )}

          {/* Caption */}
          {mediaItem.caption && (
            <div>
              <p className="text-gray-400 mb-1">Caption</p>
              <p className="font-medium">{mediaItem.caption}</p>
            </div>
          )}

          {/* Category */}
          <div>
            <p className="text-gray-400 mb-1">Category</p>
            <p className="font-medium capitalize">{mediaItem.category}</p>
          </div>

          {/* Location */}
          {mediaItem.location && (
            <div>
              <p className="text-gray-400 mb-1">Location</p>
              <p className="font-medium">{mediaItem.location}</p>
            </div>
          )}

          {/* Photographer */}
          {mediaItem.photographer && (
            <div>
              <p className="text-gray-400 mb-1">Photographer</p>
              <p className="font-medium">{mediaItem.photographer}</p>
            </div>
          )}

          {/* Date Taken */}
          {mediaItem.dateTaken && (
            <div>
              <p className="text-gray-400 mb-1">Date Taken</p>
              <p className="font-medium">
                {new Date(mediaItem.dateTaken).toLocaleDateString()}
              </p>
            </div>
          )}

          <div className="border-t border-gray-700 pt-4">
            <p className="text-gray-400 mb-2">Technical Details</p>

            {/* Dimensions */}
            <div className="mb-2">
              <p className="text-gray-500 text-xs">Dimensions</p>
              <p className="font-medium">
                {mediaItem.metadata.width} × {mediaItem.metadata.height}
              </p>
            </div>

            {/* File Size */}
            <div className="mb-2">
              <p className="text-gray-500 text-xs">Size</p>
              <p className="font-medium">
                {(mediaItem.metadata.fileSize / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            {/* Format */}
            <div className="mb-2">
              <p className="text-gray-500 text-xs">Format</p>
              <p className="font-medium uppercase">{mediaItem.metadata.format}</p>
            </div>

            {/* Duration (for videos) */}
            {mediaItem.metadata.duration && (
              <div className="mb-2">
                <p className="text-gray-500 text-xs">Duration</p>
                <p className="font-medium">
                  {Math.floor(mediaItem.metadata.duration / 60)}:
                  {String(Math.floor(mediaItem.metadata.duration % 60)).padStart(2, '0')}
                </p>
              </div>
            )}

            {/* Upload Date */}
            <div className="mb-2">
              <p className="text-gray-500 text-xs">Uploaded</p>
              <p className="font-medium">
                {new Date(mediaItem.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Featured Badge */}
            {mediaItem.featured && (
              <div className="mt-4">
                <span className="inline-block px-2 py-1 bg-yellow-600 text-white text-xs font-medium rounded">
                  Featured
                </span>
              </div>
            )}
          </div>

          {/* Counter */}
          <div className="pt-4 border-t border-gray-700">
            <p className="text-gray-400 text-xs">
              {currentIndex + 1} of {allItems.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
