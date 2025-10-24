/**
 * Sortable Media Card Component
 * 
 * Enhanced media card with drag-and-drop functionality.
 * Wraps the base MediaCard with sortable capabilities and displays
 * drag handles and order indicators when in sort mode.
 * 
 * @module pages/admin/gallery/_components/SortableMediaCard
 */

import React, { useState, useRef, useEffect } from 'react';
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
  const { state, updateOrder } = useSortMode();
  const { isSortMode, isDragging: isGlobalDragging, draggedItemId, currentOrder } = state;

  // State for editable order
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [orderValue, setOrderValue] = useState(media.displayOrder.toString());
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditingOrder && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingOrder]);

  // Handle order change
  const handleOrderChange = (newOrder: number) => {
    if (newOrder < 1 || Number.isNaN(newOrder)) {
      setOrderValue(media.displayOrder.toString());
      return;
    }

    // Create new order array with updated displayOrder
    const newOrderArray = currentOrder.map(item => 
      item.id === media.id 
        ? { ...item, displayOrder: newOrder }
        : item
    ).sort((a, b) => a.displayOrder - b.displayOrder);

    // Update context
    updateOrder(newOrderArray);
    setIsEditingOrder(false);
  };

  const handleOrderClick = () => {
    setIsEditingOrder(true);
    setOrderValue(media.displayOrder.toString());
  };

  const handleOrderBlur = () => {
    const newOrder = Number.parseInt(orderValue, 10);
    handleOrderChange(newOrder);
  };

  const handleOrderKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newOrder = Number.parseInt(orderValue, 10);
      handleOrderChange(newOrder);
    } else if (e.key === 'Escape') {
      setOrderValue(media.displayOrder.toString());
      setIsEditingOrder(false);
    }
  };

  return (
    <div
      className="relative group"
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

      {/* Order Number Badge - Editable */}
      {isSortMode && (
        <button
          type="button"
          className={`absolute top-2 left-2 z-20 flex items-center justify-center w-auto min-w-[32px] h-8 px-2 rounded-full font-bold text-xs shadow-sm transition-all cursor-pointer hover:ring-2 hover:ring-white ${
            media.featured
              ? 'bg-yellow-500 text-white'
              : 'bg-blue-600 text-white'
          } ${isEditingOrder ? 'ring-2 ring-white' : ''}`}
          onClick={handleOrderClick}
          title="Click to edit display order"
        >
          {isEditingOrder ? (
            <input
              ref={inputRef}
              type="number"
              min="1"
              value={orderValue}
              onChange={(e) => setOrderValue(e.target.value)}
              onBlur={handleOrderBlur}
              onKeyDown={handleOrderKeyDown}
              className="w-12 bg-transparent text-center text-white font-bold text-xs outline-none appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span>{media.displayOrder}</span>
          )}
        </button>
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
