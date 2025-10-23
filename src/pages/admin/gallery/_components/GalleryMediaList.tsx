import React from 'react';
import type { GalleryMediaItem } from '../../../../types/gallery';

interface GalleryMediaListProps {
  mediaItems: GalleryMediaItem[];
  isSelectionMode: boolean;
  selectedItems: string[];
  onSelect: (mediaId: string) => void;
  onPreview: (media: GalleryMediaItem) => void;
  onEdit: (media: GalleryMediaItem) => void;
  isLoading?: boolean;
}

export const GalleryMediaList: React.FC<GalleryMediaListProps> = ({
  mediaItems,
  isSelectionMode,
  selectedItems,
  onSelect,
  onPreview,
  onEdit,
  isLoading = false,
}) => {
  // Convert selectedItems array to Set for backward compatibility
  const selectedMedia = new Set(selectedItems);
  const media = mediaItems;
  // Format file size
  const formatFileSize = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  // Format date
  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-3 p-6">
        {Array.from({ length: 8 }, (_, index) => {
          const skeletonId = `list-skeleton-${index + 1}`;
          return (
            <div key={skeletonId} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-1/3" />
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-1/4" />
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-16" />
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-12" />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <svg
          className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No media found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          No media items match your current filters. Try adjusting your search criteria or upload some media to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-6">
      {media.map((mediaItem) => {
        const isSelected = selectedMedia.has(mediaItem.id);
        
        const handleItemClick = () => {
          if (isSelectionMode) {
            onSelect(mediaItem.id);
          } else {
            onPreview(mediaItem);
          }
        };

        const handleSelectionChange = (e: React.MouseEvent) => {
          e.stopPropagation();
          onSelect(mediaItem.id);
        };

        return (
          <button
            key={mediaItem.id}
            type="button"
            onClick={handleItemClick}
            className={`w-full flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 text-left hover:shadow-sm ${
              isSelected
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            {/* Selection Checkbox */}
            {(isSelectionMode || isSelected) && (
              <div className="flex-shrink-0">
                <button
                  type="button"
                  onClick={handleSelectionChange}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {isSelected && (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
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

            {/* Media Thumbnail */}
            <div className="flex-shrink-0 relative">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                  src={mediaItem.r2Urls.thumbnail}
                  alt={mediaItem.alt || mediaItem.filename}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {mediaItem.mediaType === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black bg-opacity-50 rounded-full p-1">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
              {mediaItem.featured && (
                <div className="absolute -top-1 -right-1">
                  <span className="bg-yellow-500 text-white text-xs font-medium px-1 py-0.5 rounded">
                    ⭐
                  </span>
                </div>
              )}
            </div>

            {/* Media Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate">
                    {mediaItem.alt || mediaItem.filename}
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                    <span className="capitalize">{mediaItem.mediaType}</span>
                    <span>•</span>
                    <span>{mediaItem.category || 'Uncategorized'}</span>
                    <span>•</span>
                    <span>{formatFileSize(mediaItem.metadata.fileSize || 0)}</span>
                  </div>
                </div>
                <div className="flex-shrink-0 text-right text-sm text-gray-500 dark:text-gray-400">
                  <div>{formatDate(mediaItem.createdAt)}</div>
                  <div className="mt-1">
                    {Boolean(mediaItem.metadata.width && mediaItem.metadata.height) && (
                      <span>{mediaItem.metadata.width} × {mediaItem.metadata.height}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex-shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(mediaItem);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Edit media"
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
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview(mediaItem);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Preview media"
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
          </button>
        );
      })}
    </div>
  );
};