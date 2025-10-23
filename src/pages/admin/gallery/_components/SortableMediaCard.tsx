/**
 * Sortable Media Card Component
 * 
 * Enhanced media card with drag-and-drop functionality.
 * Wraps the base MediaCard with sortable capabilities and displays
 * drag handles and order indicators when in sort mode.
 * 
 * @module pages/admin/gallery/_components/SortableMediaCard
 */

import React from 'react';
import { MediaCard } from './MediaCard';
import { useSortableMedia } from './useSortableMedia';
import { useSortMode } from './SortModeProvider';
import type { GalleryMediaItem } from '../../../../types/gallery';
import { GripVertical } from 'lucide-react';

/**
 * Sortable media card props interface
 */
interface SortableMediaCardProps {
  media: GalleryMediaItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onEdit: (media: GalleryMediaItem) => void;
  onPreview: (media: GalleryMediaItem) => void;
  isSelectionMode: boolean;
  index: number;
}

/**
 * SortableMediaCard Component
 * 
 * Media card with drag-and-drop capabilities for reordering.
 * Shows drag handle and order number when sort mode is enabled.
 */
export const SortableMediaCard: React.FC<SortableMediaCardProps> = ({
  media,
  isSelected,
  onSelect,
  onEdit,
  onPreview,
  isSelectionMode,
}) => {
  const { state } = useSortMode();
  const { isSortMode, isDragging: isGlobalDragging, draggedItemId } = state;

  // Use sortable hook
  const {
    dragHandleProps,
    isDragging,
    isOver,
    attributes,
    listeners,
  } = useSortableMedia({
    id: media.id,
    disabled: !isSortMode,
  });

  const isThisItemDragging = draggedItemId === media.id;
  const showDropIndicator = isOver && isGlobalDragging && !isThisItemDragging;

  return (
    <div
      className="relative"
      {...dragHandleProps}
      style={{
        ...dragHandleProps.style,
        opacity: isThisItemDragging ? 0.5 : 1,
      }}
    >
      {/* Drop Indicator (when another item is hovering over) */}
      {showDropIndicator && (
        <div className="absolute inset-0 border-2 border-dashed border-green-400 bg-green-50 dark:bg-green-900/20 rounded-lg z-10 pointer-events-none animate-pulse" />
      )}

      {/* Drag Handle */}
      {isSortMode && (
        <div
          className={`absolute top-2 right-2 z-20 p-1.5 rounded-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-sm border border-gray-200 dark:border-gray-700 transition-all ${
            isDragging
              ? 'cursor-grabbing opacity-100'
              : 'cursor-grab opacity-0 group-hover:opacity-100'
          }`}
          {...attributes}
          {...listeners}
          title="Drag to reorder"
        >
          <GripVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </div>
      )}

      {/* Order Number Badge */}
      {isSortMode && (
        <div
          className={`absolute top-2 left-2 z-20 flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs shadow-sm transition-all ${
            media.featured
              ? 'bg-yellow-500 text-white'
              : 'bg-blue-600 text-white'
          }`}
          title={`Display order: ${media.displayOrder}`}
        >
          {media.displayOrder}
        </div>
      )}

      {/* Featured Badge (when not in sort mode) */}
      {!isSortMode && media.featured && (
        <div
          className="absolute top-2 left-2 z-20 px-2 py-1 rounded-md bg-yellow-500 text-white text-xs font-semibold shadow-sm"
          title="Featured image"
        >
          ⭐ Featured
        </div>
      )}

      {/* Base Media Card */}
      <div className={isDragging ? 'opacity-50 scale-95 transform rotate-1' : ''}>
        <MediaCard
          media={media}
          isSelected={isSelected}
          onSelect={onSelect}
          onEdit={onEdit}
          onPreview={onPreview}
          isSelectionMode={isSelectionMode}
        />
      </div>

      {/* Dragging Overlay Effect */}
      {isThisItemDragging && (
        <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-lg pointer-events-none animate-pulse" />
      )}
    </div>
  );
};
