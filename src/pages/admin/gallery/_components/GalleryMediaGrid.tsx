import React from 'react';
import type { GalleryMediaItem } from '../../../../types/gallery';
import { MediaCard } from './MediaCard';

interface GalleryMediaGridProps {
  media: GalleryMediaItem[];
  isSelectionMode: boolean;
  selectedMedia: Set<string>;
  onSelect: (mediaId: string) => void;
  onPreview: (media: GalleryMediaItem) => void;
  onEdit: (media: GalleryMediaItem) => void;
  isLoading?: boolean;
}

export const GalleryMediaGrid: React.FC<GalleryMediaGridProps> = ({
  media,
  isSelectionMode,
  selectedMedia,
  onSelect,
  onPreview,
  onEdit,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 p-6">
        {Array.from({ length: 12 }, (_, index) => {
          const skeletonId = `skeleton-${index + 1}`;
          return (
            <div
              key={skeletonId}
              className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
            />
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
            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 p-6">
      {media.map((mediaItem) => (
        <MediaCard
          key={mediaItem.id}
          media={mediaItem}
          isSelected={selectedMedia.has(mediaItem.id)}
          isSelectionMode={isSelectionMode}
          onSelect={onSelect}
          onPreview={onPreview}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};