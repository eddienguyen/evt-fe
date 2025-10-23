/**
 * Media Card Component
 * 
 * Individual media item card for grid view.
 * Displays thumbnail, metadata, and action buttons.
 * 
 * @module pages/admin/gallery/_components/MediaCard
 */

import React, { useState } from 'react';
import type { GalleryMediaItem } from '../../../../types/gallery';

/**
 * Media card props interface
 */
interface MediaCardProps {
  media: GalleryMediaItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onEdit: (media: GalleryMediaItem) => void;
  onPreview: (media: GalleryMediaItem) => void;
  isSelectionMode: boolean;
}

/**
 * MediaCard Component
 * 
 * Displays a single media item in a card layout with thumbnail,
 * metadata, and action controls.
 */
export const MediaCard: React.FC<MediaCardProps> = ({
  media,
  isSelected,
  onSelect,
  onEdit,
  onPreview,
  isSelectionMode,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  // Format date
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Handle card click
  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSelectionMode) {
      onSelect(media.id);
    } else {
      onPreview(media);
    }
  };

  // Handle keyboard interaction
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (isSelectionMode) {
        onSelect(media.id);
      } else {
        onPreview(media);
      }
    }
  };

  // Handle selection checkbox change
  const handleSelectionChange = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(media.id);
  };

  return (
    <button
      type="button"
      className={`group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm border transition-all duration-200 cursor-pointer hover:shadow-lg text-left w-full ${
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
    >
      {/* Selection Checkbox */}
      {(isSelectionMode || isSelected) && (
        <div className="absolute top-2 left-2 z-10">
          <button
            onClick={handleSelectionChange}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
              isSelected
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white border-gray-300 hover:border-gray-400'
            }`}
          >
            {isSelected && (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(media);
            }}
            className="p-1.5 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            title="Edit metadata"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview(media);
            }}
            className="p-1.5 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            title="Preview"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Media Thumbnail */}
      <div className="aspect-video relative overflow-hidden rounded-t-lg bg-gray-100 dark:bg-gray-700">
        {imageError ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        ) : (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-pulse bg-gray-200 dark:bg-gray-600 w-full h-full"></div>
              </div>
            )}
            <img
              src={media.r2Urls.thumbnail}
              alt={media.alt || media.filename}
              className={`w-full h-full object-cover transition-opacity ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
            {media.mediaType === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black bg-opacity-50 rounded-full p-2">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            )}
          </>
        )}
        
        {/* Featured Badge */}
        {media.featured && (
          <div className="absolute bottom-2 left-2">
            <span className="bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              ⭐ Featured
            </span>
          </div>
        )}
      </div>

      {/* Media Information */}
      <div className="p-3 space-y-2">
        {/* Title */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {media.title || media.filename}
          </h3>
          {media.title && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {media.filename}
            </p>
          )}
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span className="capitalize">
            {media.category}
          </span>
          <span>
            {formatFileSize(media.metadata.fileSize)}
          </span>
        </div>

        {/* Date and Dimensions */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>
            {formatDate(media.createdAt)}
          </span>
          <span>
            {media.metadata.width} × {media.metadata.height}
          </span>
        </div>
      </div>
    </button>
  );
};