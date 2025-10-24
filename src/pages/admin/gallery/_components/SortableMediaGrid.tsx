/**
 * Sortable Media Grid Component
 * 
 * Grid layout with drag-and-drop sorting capabilities using @dnd-kit.
 * Wraps media cards in a sortable context and handles reordering operations.
 * 
 * @module pages/admin/gallery/_components/SortableMediaGrid
 */

import React, { useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type {
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableMediaCard } from './SortableMediaCard';
import { useSortMode } from './SortModeProvider';
import { calculateDragDropOrder } from './sortingUtils';
import type { GalleryMediaItem } from '../../../../types/gallery';

/**
 * Sortable media grid props interface
 */
interface SortableMediaGridProps {
  mediaItems: GalleryMediaItem[];
  selectedItems: string[];
  onSelect: (id: string) => void;
  onEdit: (media: GalleryMediaItem) => void;
  onPreview: (media: GalleryMediaItem) => void;
  isSelectionMode: boolean;
  onOrderChange?: (newOrder: GalleryMediaItem[]) => void;
}

/**
 * SortableMediaGrid Component
 * 
 * Responsive grid layout with drag-and-drop sorting.
 * Adapts column count based on viewport size.
 */
export const SortableMediaGrid: React.FC<SortableMediaGridProps> = ({
  mediaItems,
  selectedItems,
  onSelect,
  onEdit,
  onPreview,
  isSelectionMode,
  onOrderChange,
}) => {
  const { 
    state, 
    startDrag, 
    endDrag, 
    updateOrder,
    createSnapshot,
  } = useSortMode();

  const { isSortMode, currentOrder } = state;

  // Use currentOrder from context when in sort mode, otherwise use props
  const displayItems = isSortMode && currentOrder.length > 0 ? currentOrder : mediaItems;

  // Configure drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to start drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag start
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      startDrag(active.id as string);
    },
    [startDrag]
  );

  // Handle drag over (optional: for visual feedback)
  const handleDragOver = useCallback((_event: DragOverEvent) => {
    // Can add hover effects here if needed
  }, []);

  // Handle drag end
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      endDrag();

      if (!over || active.id === over.id) {
        return;
      }

      // Calculate new order using displayItems (current order in context)
      const newOrder = calculateDragDropOrder(
        displayItems,
        active.id as string,
        over.id as string,
        'after'
      );

      // Create history snapshot
      createSnapshot('drag', `Moved item ${active.id} to new position`);

      // Update order in context
      updateOrder(newOrder);

      // Notify parent component
      onOrderChange?.(newOrder);
    },
    [displayItems, endDrag, createSnapshot, updateOrder, onOrderChange]
  );

  // Extract item IDs for sortable context
  const itemIds = displayItems.map(item => item.id);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={itemIds}
        strategy={rectSortingStrategy}
      >
        <div
          className={`
            grid gap-4
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-5
            xl:grid-cols-6
            ${isSortMode ? 'cursor-default' : ''}
          `}
        >
          {displayItems.map((media, index) => (
            <SortableMediaCard
              key={media.id}
              media={media}
              isSelected={selectedItems.includes(media.id)}
              onSelect={onSelect}
              onEdit={onEdit}
              onPreview={onPreview}
              isSelectionMode={isSelectionMode}
              index={index}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
