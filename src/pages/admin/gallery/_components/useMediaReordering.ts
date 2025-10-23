/**
 * useMediaReordering Hook
 * 
 * Custom hook for media reordering operations and API integration.
 * Handles batch operations, quick sort actions, and persistence.
 * 
 * @module pages/admin/gallery/_components/useMediaReordering
 */

import { useCallback } from 'react';
import { useSortMode } from './SortModeProvider';
import {
  moveItemsToTop,
  moveItemsToBottom,
  sortAlphabetically,
  resetToUploadOrder,
  moveItemsToCategory,
  applyQuickSortAction,
} from './sortingUtils';
import type { 
  MediaCategory,
  QuickSortAction,
  ReorderRequestPayload,
  ReorderResponse,
} from '../../../../types/gallery';

/**
 * Media reordering operations hook
 */
export const useMediaReordering = () => {
  const { 
    state, 
    updateOrder, 
    createSnapshot, 
    setSaving, 
    setError,
    markAsSaved,
  } = useSortMode();

  const { currentOrder, selectedItems } = state;

  // ===================================================================
  // QUICK SORT ACTIONS
  // ===================================================================

  /**
   * Move selected items to the top
   */
  const moveToTop = useCallback(
    (itemIds?: string[]) => {
      const ids = itemIds || Array.from(selectedItems);
      if (ids.length === 0) return;

      const newOrder = moveItemsToTop(currentOrder, ids);
      createSnapshot('quick-sort', `Moved ${ids.length} item(s) to top`);
      updateOrder(newOrder);
    },
    [currentOrder, selectedItems, createSnapshot, updateOrder]
  );

  /**
   * Move selected items to the bottom
   */
  const moveToBottom = useCallback(
    (itemIds?: string[]) => {
      const ids = itemIds || Array.from(selectedItems);
      if (ids.length === 0) return;

      const newOrder = moveItemsToBottom(currentOrder, ids);
      createSnapshot('quick-sort', `Moved ${ids.length} item(s) to bottom`);
      updateOrder(newOrder);
    },
    [currentOrder, selectedItems, createSnapshot, updateOrder]
  );

  /**
   * Sort items alphabetically
   */
  const sortAlpha = useCallback(
    (direction: 'asc' | 'desc' = 'asc') => {
      const newOrder = sortAlphabetically(currentOrder, direction);
      createSnapshot('quick-sort', `Sorted alphabetically (${direction})`);
      updateOrder(newOrder);
    },
    [currentOrder, createSnapshot, updateOrder]
  );

  /**
   * Reset to original upload order
   */
  const resetOrder = useCallback(() => {
    const newOrder = resetToUploadOrder(currentOrder);
    createSnapshot('reset', 'Reset to upload order');
    updateOrder(newOrder);
  }, [currentOrder, createSnapshot, updateOrder]);

  /**
   * Apply a quick sort action
   */
  const applyQuickSort = useCallback(
    (action: QuickSortAction, itemIds?: string[], category?: MediaCategory) => {
      const ids = itemIds || Array.from(selectedItems);
      const newOrder = applyQuickSortAction(currentOrder, action, ids, { category });
      createSnapshot('quick-sort', `Applied action: ${action}`);
      updateOrder(newOrder);
    },
    [currentOrder, selectedItems, createSnapshot, updateOrder]
  );

  // ===================================================================
  // CATEGORY OPERATIONS
  // ===================================================================

  /**
   * Move items to a different category
   */
  const transferToCategory = useCallback(
    (itemIds: string[], targetCategory: MediaCategory) => {
      const newOrder = moveItemsToCategory(currentOrder, itemIds, targetCategory);
      createSnapshot('category-move', `Moved ${itemIds.length} item(s) to ${targetCategory}`);
      updateOrder(newOrder);
    },
    [currentOrder, createSnapshot, updateOrder]
  );

  // ===================================================================
  // PERSISTENCE OPERATIONS
  // ===================================================================

  /**
   * Save current order to backend
   */
  const saveOrder = useCallback(
    async (): Promise<boolean> => {
      setSaving(true);
      setError(null);

      try {
        // Prepare reorder payload
        const payload: ReorderRequestPayload = {
          operations: currentOrder.map((item) => ({
            id: item.id,
            displayOrder: item.displayOrder,
            category: item.category,
          })),
        };

        // Make API request
        const response = await fetch('/api/gallery/reorder', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Failed to save order: ${response.statusText}`);
        }

        const data: ReorderResponse = await response.json();

        if (!data.success) {
          throw new Error(data.message || 'Failed to save order');
        }

        // Mark as saved in context
        markAsSaved();
        
        return true;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(errorMessage);
        console.error('Failed to save media order:', error);
        return false;
      } finally {
        setSaving(false);
      }
    },
    [currentOrder, setSaving, setError, markAsSaved]
  );

  /**
   * Discard changes and revert to original order
   */
  const discardChanges = useCallback(() => {
    // This will be handled by the context's setOriginalOrder
    // For now, just clear error
    setError(null);
  }, [setError]);

  // ===================================================================
  // RETURN VALUE
  // ===================================================================

  return {
    // Quick sort actions
    moveToTop,
    moveToBottom,
    sortAlpha,
    resetOrder,
    applyQuickSort,
    
    // Category operations
    transferToCategory,
    
    // Persistence
    saveOrder,
    discardChanges,
    
    // State
    isSaving: state.isSaving,
    error: state.error,
    hasPendingChanges: state.pendingChanges,
  };
};
