/**
 * Sorting Utility Functions
 * 
 * Utility functions for media sorting, reordering calculations,
 * and order management operations.
 * 
 * @module pages/admin/gallery/_components/sortingUtils
 */

import type { 
  GalleryMediaItem, 
  MediaCategory,
  QuickSortAction 
} from '../../../../types/gallery';

// ===================================================================
// ORDER CALCULATION UTILITIES
// ===================================================================

/**
 * Recalculate display orders for an array of media items
 * Assigns sequential order numbers starting from 1
 */
export const recalculateDisplayOrder = (items: GalleryMediaItem[]): GalleryMediaItem[] => {
  return items.map((item, index) => ({
    ...item,
    displayOrder: index + 1,
  }));
};

/**
 * Move an item from one position to another in an array
 */
export const moveItem = <T,>(
  array: T[],
  fromIndex: number,
  toIndex: number
): T[] => {
  const result = [...array];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
};

/**
 * Move multiple items to a specific position
 */
export const moveItemsToPosition = (
  items: GalleryMediaItem[],
  itemIds: string[],
  targetPosition: number
): GalleryMediaItem[] => {
  // Separate selected and unselected items
  const selectedItems = items.filter(item => itemIds.includes(item.id));
  const unselectedItems = items.filter(item => !itemIds.includes(item.id));
  
  // Insert selected items at target position
  const result = [...unselectedItems];
  result.splice(targetPosition, 0, ...selectedItems);
  
  return recalculateDisplayOrder(result);
};

/**
 * Move items to the top of the list
 */
export const moveItemsToTop = (
  items: GalleryMediaItem[],
  itemIds: string[]
): GalleryMediaItem[] => {
  return moveItemsToPosition(items, itemIds, 0);
};

/**
 * Move items to the bottom of the list
 */
export const moveItemsToBottom = (
  items: GalleryMediaItem[],
  itemIds: string[]
): GalleryMediaItem[] => {
  const unselectedItems = items.filter(item => !itemIds.includes(item.id));
  return moveItemsToPosition(items, itemIds, unselectedItems.length);
};

// ===================================================================
// SORTING UTILITIES
// ===================================================================

/**
 * Sort items alphabetically by filename or title
 */
export const sortAlphabetically = (
  items: GalleryMediaItem[],
  direction: 'asc' | 'desc' = 'asc'
): GalleryMediaItem[] => {
  const sorted = [...items].sort((a, b) => {
    const nameA = (a.title || a.filename).toLowerCase();
    const nameB = (b.title || b.filename).toLowerCase();
    
    if (direction === 'asc') {
      return nameA.localeCompare(nameB);
    } else {
      return nameB.localeCompare(nameA);
    }
  });
  
  return recalculateDisplayOrder(sorted);
};

/**
 * Sort items by upload date (createdAt)
 */
export const sortByUploadDate = (
  items: GalleryMediaItem[],
  direction: 'asc' | 'desc' = 'desc'
): GalleryMediaItem[] => {
  const sorted = [...items].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    
    if (direction === 'asc') {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });
  
  return recalculateDisplayOrder(sorted);
};

/**
 * Sort items by date taken (if available, otherwise use createdAt)
 */
export const sortByDateTaken = (
  items: GalleryMediaItem[],
  direction: 'asc' | 'desc' = 'desc'
): GalleryMediaItem[] => {
  const sorted = [...items].sort((a, b) => {
    const dateA = a.dateTaken ? new Date(a.dateTaken).getTime() : new Date(a.createdAt).getTime();
    const dateB = b.dateTaken ? new Date(b.dateTaken).getTime() : new Date(b.createdAt).getTime();
    
    if (direction === 'asc') {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });
  
  return recalculateDisplayOrder(sorted);
};

/**
 * Reset items to their original upload order
 */
export const resetToUploadOrder = (items: GalleryMediaItem[]): GalleryMediaItem[] => {
  return sortByUploadDate(items, 'asc');
};

// ===================================================================
// CATEGORY UTILITIES
// ===================================================================

/**
 * Move items to a different category
 */
export const moveItemsToCategory = (
  items: GalleryMediaItem[],
  itemIds: string[],
  targetCategory: MediaCategory
): GalleryMediaItem[] => {
  return items.map(item => 
    itemIds.includes(item.id)
      ? { ...item, category: targetCategory }
      : item
  );
};

/**
 * Get items filtered by category
 */
export const filterByCategory = (
  items: GalleryMediaItem[],
  category: MediaCategory | 'all'
): GalleryMediaItem[] => {
  if (category === 'all') return items;
  return items.filter(item => item.category === category);
};

// ===================================================================
// QUICK SORT ACTION HANDLER
// ===================================================================

/**
 * Apply a quick sort action to items
 */
export const applyQuickSortAction = (
  items: GalleryMediaItem[],
  action: QuickSortAction,
  selectedItemIds: string[],
  options?: {
    direction?: 'asc' | 'desc';
    category?: MediaCategory;
  }
): GalleryMediaItem[] => {
  const { category } = options || {};
  
  // If category specified, only operate on items in that category
  const targetItems = category ? filterByCategory(items, category) : items;
  const otherItems = category ? items.filter(item => item.category !== category) : [];
  
  let result: GalleryMediaItem[];
  
  switch (action) {
    case 'move-to-top':
      result = moveItemsToTop(targetItems, selectedItemIds);
      break;
      
    case 'move-to-bottom':
      result = moveItemsToBottom(targetItems, selectedItemIds);
      break;
      
    case 'alphabetical-asc':
      result = sortAlphabetically(targetItems, 'asc');
      break;
      
    case 'alphabetical-desc':
      result = sortAlphabetically(targetItems, 'desc');
      break;
      
    case 'reset-to-upload':
      result = resetToUploadOrder(targetItems);
      break;
      
    default:
      result = targetItems;
  }
  
  // If we operated on a category subset, merge back with other items
  if (category) {
    return [...result, ...otherItems].sort((a, b) => 
      a.category.localeCompare(b.category)
    );
  }
  
  return result;
};

// ===================================================================
// DRAG AND DROP UTILITIES
// ===================================================================

/**
 * Calculate new order after a drag-and-drop operation
 */
export const calculateDragDropOrder = (
  items: GalleryMediaItem[],
  draggedId: string,
  targetId: string,
  position: 'before' | 'after'
): GalleryMediaItem[] => {
  const draggedIndex = items.findIndex(item => item.id === draggedId);
  const targetIndex = items.findIndex(item => item.id === targetId);
  
  if (draggedIndex === -1 || targetIndex === -1) {
    return items;
  }
  
  // Remove dragged item
  const result = [...items];
  const [draggedItem] = result.splice(draggedIndex, 1);
  
  // Calculate new target index after removal
  let newTargetIndex = targetIndex;
  if (draggedIndex < targetIndex) {
    newTargetIndex = targetIndex - 1;
  }
  
  // Insert at new position
  const insertIndex = position === 'before' ? newTargetIndex : newTargetIndex + 1;
  result.splice(insertIndex, 0, draggedItem);
  
  return recalculateDisplayOrder(result);
};

/**
 * Find the item at a specific position
 */
export const findItemAtPosition = (
  items: GalleryMediaItem[],
  displayOrder: number
): GalleryMediaItem | undefined => {
  return items.find(item => item.displayOrder === displayOrder);
};

/**
 * Get the next available display order
 */
export const getNextDisplayOrder = (items: GalleryMediaItem[]): number => {
  if (items.length === 0) return 1;
  const maxOrder = Math.max(...items.map(item => item.displayOrder));
  return maxOrder + 1;
};

// ===================================================================
// VALIDATION UTILITIES
// ===================================================================

/**
 * Check if items have changed order
 */
export const hasOrderChanged = (
  originalItems: GalleryMediaItem[],
  currentItems: GalleryMediaItem[]
): boolean => {
  if (originalItems.length !== currentItems.length) return true;
  
  return originalItems.some((item, index) => 
    item.id !== currentItems[index].id || 
    item.displayOrder !== currentItems[index].displayOrder
  );
};

/**
 * Validate display order sequence
 * Checks if orders are sequential starting from 1
 */
export const validateDisplayOrderSequence = (items: GalleryMediaItem[]): boolean => {
  const orders = items.map(item => item.displayOrder).sort((a, b) => a - b);
  return orders.every((order, index) => order === index + 1);
};

/**
 * Find gaps in display order sequence
 */
export const findDisplayOrderGaps = (items: GalleryMediaItem[]): number[] => {
  const orders = items.map(item => item.displayOrder).sort((a, b) => a - b);
  const gaps: number[] = [];
  
  const maxOrder = orders.at(-1) || 0;
  for (let i = 1; i < maxOrder; i++) {
    if (!orders.includes(i)) {
      gaps.push(i);
    }
  }
  
  return gaps;
};
