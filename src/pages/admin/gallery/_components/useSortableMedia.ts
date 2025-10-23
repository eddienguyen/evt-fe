/**
 * useSortableMedia Hook
 * 
 * Custom hook for drag-and-drop functionality using @dnd-kit.
 * Provides drag handle props, drag state, and styling for sortable media cards.
 * 
 * @module pages/admin/gallery/_components/useSortableMedia
 */

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { CSSProperties } from 'react';

// ===================================================================
// TYPES
// ===================================================================

interface UseSortableMediaProps {
  id: string;
  disabled?: boolean;
}

interface UseSortableMediaReturn {
  // Drag handle props
  dragHandleProps: {
    ref: (element: HTMLElement | null) => void;
    style: CSSProperties;
  };
  // Drag state
  isDragging: boolean;
  isOver: boolean;
  // Styling
  transform: string | undefined;
  transition: string | undefined;
  // Accessibility
  attributes: ReturnType<typeof useSortable>['attributes'];
  listeners: ReturnType<typeof useSortable>['listeners'];
}

// ===================================================================
// HOOK
// ===================================================================

export const useSortableMedia = ({ 
  id, 
  disabled = false 
}: UseSortableMediaProps): UseSortableMediaReturn => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({
    id,
    disabled,
  });

  // Calculate transform style
  const transformStyle = transform
    ? CSS.Transform.toString(transform)
    : undefined;

  // Create drag handle props
  const dragHandleProps = {
    ref: setNodeRef,
    style: {
      transform: transformStyle,
      transition: transition || undefined,
      opacity: isDragging ? 0.5 : 1,
      zIndex: isDragging ? 999 : 1,
      cursor: disabled ? 'default' : 'grab',
    } as CSSProperties,
  };

  return {
    dragHandleProps,
    isDragging,
    isOver,
    transform: transformStyle,
    transition: transition || undefined,
    attributes,
    listeners: disabled ? undefined : listeners,
  };
};
