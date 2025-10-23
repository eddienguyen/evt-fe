/**
 * Media Selection Hook
 * 
 * Custom hook for managing media item selection state.
 * Handles individual selection, bulk selection, and selection persistence.
 * 
 * @module pages/admin/gallery/_components/useMediaSelection
 */

import { useState, useCallback } from 'react';

/**
 * Media selection state interface
 */
interface MediaSelectionState {
  selectedItems: string[];
  isSelectionMode: boolean;
  selectAll: boolean;
}

/**
 * Media selection actions interface
 */
interface MediaSelectionActions {
  // Selection actions
  selectItem: (id: string) => void;
  deselectItem: (id: string) => void;
  toggleItem: (id: string) => void;
  selectAllItems: (itemIds: string[]) => void;
  deselectAllItems: () => void;
  clearSelection: () => void;
  
  // Mode actions
  enterSelectionMode: () => void;
  exitSelectionMode: () => void;
  toggleSelectionMode: () => void;
  
  // Utility functions
  isItemSelected: (id: string) => boolean;
  getSelectionCount: () => number;
  hasSelection: () => boolean;
}

/**
 * Media selection return type
 */
export type UseMediaSelectionReturn = MediaSelectionState & MediaSelectionActions;

/**
 * useMediaSelection Hook
 * 
 * @param initialSelected - Initial selected items (optional)
 * @returns Media selection state and actions
 */
export const useMediaSelection = (initialSelected: string[] = []): UseMediaSelectionReturn => {
  // State
  const [state, setState] = useState<MediaSelectionState>({
    selectedItems: initialSelected,
    isSelectionMode: initialSelected.length > 0,
    selectAll: false,
  });

  /**
   * Select a single item
   */
  const selectItem = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      selectedItems: prev.selectedItems.includes(id) 
        ? prev.selectedItems 
        : [...prev.selectedItems, id],
      isSelectionMode: true,
    }));
  }, []);

  /**
   * Deselect a single item
   */
  const deselectItem = useCallback((id: string) => {
    setState(prev => {
      const newSelected = prev.selectedItems.filter(itemId => itemId !== id);
      return {
        ...prev,
        selectedItems: newSelected,
        isSelectionMode: newSelected.length > 0,
        selectAll: false,
      };
    });
  }, []);

  /**
   * Toggle item selection
   */
  const toggleItem = useCallback((id: string) => {
    setState(prev => {
      const isCurrentlySelected = prev.selectedItems.includes(id);
      const newSelected = isCurrentlySelected
        ? prev.selectedItems.filter(itemId => itemId !== id)
        : [...prev.selectedItems, id];

      return {
        ...prev,
        selectedItems: newSelected,
        isSelectionMode: newSelected.length > 0,
        selectAll: false,
      };
    });
  }, []);

  /**
   * Select all provided items
   */
  const selectAllItems = useCallback((itemIds: string[]) => {
    setState(prev => ({
      ...prev,
      selectedItems: [...itemIds],
      isSelectionMode: itemIds.length > 0,
      selectAll: true,
    }));
  }, []);

  /**
   * Deselect all items
   */
  const deselectAllItems = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedItems: [],
      selectAll: false,
    }));
  }, []);

  /**
   * Clear selection and exit selection mode
   */
  const clearSelection = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedItems: [],
      isSelectionMode: false,
      selectAll: false,
    }));
  }, []);

  /**
   * Enter selection mode without selecting items
   */
  const enterSelectionMode = useCallback(() => {
    setState(prev => ({
      ...prev,
      isSelectionMode: true,
    }));
  }, []);

  /**
   * Exit selection mode and clear selection
   */
  const exitSelectionMode = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedItems: [],
      isSelectionMode: false,
      selectAll: false,
    }));
  }, []);

  /**
   * Toggle selection mode
   */
  const toggleSelectionMode = useCallback(() => {
    setState(prev => ({
      ...prev,
      isSelectionMode: !prev.isSelectionMode,
      selectedItems: prev.isSelectionMode ? [] : prev.selectedItems,
      selectAll: false,
    }));
  }, []);

  // Utility functions
  const isItemSelected = useCallback((id: string) => {
    return state.selectedItems.includes(id);
  }, [state.selectedItems]);

  const getSelectionCount = useCallback(() => {
    return state.selectedItems.length;
  }, [state.selectedItems]);

  const hasSelection = useCallback(() => {
    return state.selectedItems.length > 0;
  }, [state.selectedItems]);

  return {
    ...state,
    selectItem,
    deselectItem,
    toggleItem,
    selectAllItems,
    deselectAllItems,
    clearSelection,
    enterSelectionMode,
    exitSelectionMode,
    toggleSelectionMode,
    isItemSelected,
    getSelectionCount,
    hasSelection,
  };
};