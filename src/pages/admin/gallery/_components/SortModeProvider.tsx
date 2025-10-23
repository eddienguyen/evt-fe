/**
 * Sort Mode Provider
 * 
 * Context provider for managing gallery media sorting state and operations.
 * Provides sort mode state, drag-and-drop state, history management, and
 * reordering actions to child components.
 * 
 * @module pages/admin/gallery/_components/SortModeProvider
 */

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { 
  MediaSortState, 
  GalleryMediaItem, 
  MediaOrderSnapshot, 
  MediaCategory,
  SortOperationType 
} from '../../../../types/gallery';

// ===================================================================
// TYPES
// ===================================================================

interface SortModeContextValue {
  // State
  state: MediaSortState;
  
  // Sort Mode Actions
  enableSortMode: () => void;
  disableSortMode: () => void;
  toggleSortMode: () => void;
  
  // Drag Actions
  startDrag: (itemId: string) => void;
  endDrag: () => void;
  setDragOverCategory: (category: MediaCategory | null) => void;
  
  // Order Management
  updateOrder: (newOrder: GalleryMediaItem[]) => void;
  setOriginalOrder: (items: GalleryMediaItem[]) => void;
  
  // History Actions
  createSnapshot: (operation: SortOperationType, description?: string) => void;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
  
  // Selection Actions
  toggleItemSelection: (itemId: string) => void;
  selectMultipleItems: (itemIds: string[]) => void;
  clearSelection: () => void;
  
  // Persistence Actions
  markAsSaved: () => void;
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  setError: (error: string | null) => void;
  toggleAutoSave: () => void;
}

// ===================================================================
// CONTEXT
// ===================================================================

const SortModeContext = createContext<SortModeContextValue | undefined>(undefined);

// ===================================================================
// PROVIDER
// ===================================================================

interface SortModeProviderProps {
  children: React.ReactNode;
  initialItems?: GalleryMediaItem[];
}

export const SortModeProvider: React.FC<SortModeProviderProps> = ({ 
  children, 
  initialItems = [] 
}) => {
  const [state, setState] = useState<MediaSortState>({
    isSortMode: false,
    isDragging: false,
    draggedItemId: null,
    originalOrder: initialItems,
    currentOrder: initialItems,
    pendingChanges: false,
    history: [],
    historyIndex: -1,
    canUndo: false,
    canRedo: false,
    dragOverCategory: null,
    categoryTransferMode: false,
    autoSave: false,
    isLoading: false,
    isSaving: false,
    error: null,
    selectedItems: new Set(),
    bulkSortMode: false,
  });

  // ===================================================================
  // SORT MODE ACTIONS
  // ===================================================================

  const enableSortMode = useCallback(() => {
    setState(prev => ({
      ...prev,
      isSortMode: true,
    }));
  }, []);

  const disableSortMode = useCallback(() => {
    setState(prev => ({
      ...prev,
      isSortMode: false,
      isDragging: false,
      draggedItemId: null,
      selectedItems: new Set(),
    }));
  }, []);

  const toggleSortMode = useCallback(() => {
    setState(prev => ({
      ...prev,
      isSortMode: !prev.isSortMode,
      isDragging: false,
      draggedItemId: null,
    }));
  }, []);

  // ===================================================================
  // DRAG ACTIONS
  // ===================================================================

  const startDrag = useCallback((itemId: string) => {
    setState(prev => ({
      ...prev,
      isDragging: true,
      draggedItemId: itemId,
    }));
  }, []);

  const endDrag = useCallback(() => {
    setState(prev => ({
      ...prev,
      isDragging: false,
      draggedItemId: null,
      dragOverCategory: null,
    }));
  }, []);

  const setDragOverCategory = useCallback((category: MediaCategory | null) => {
    setState(prev => ({
      ...prev,
      dragOverCategory: category,
    }));
  }, []);

  // ===================================================================
  // ORDER MANAGEMENT
  // ===================================================================

  const updateOrder = useCallback((newOrder: GalleryMediaItem[]) => {
    setState(prev => ({
      ...prev,
      currentOrder: newOrder,
      pendingChanges: true,
    }));
  }, []);

  const setOriginalOrder = useCallback((items: GalleryMediaItem[]) => {
    setState(prev => ({
      ...prev,
      originalOrder: items,
      currentOrder: items,
      pendingChanges: false,
    }));
  }, []);

  // ===================================================================
  // HISTORY ACTIONS
  // ===================================================================

  const createSnapshot = useCallback((operation: SortOperationType, description?: string) => {
    setState(prev => {
      const snapshot: MediaOrderSnapshot = {
        timestamp: new Date(),
        order: [...prev.currentOrder],
        operation,
        description,
      };

      // If we're not at the end of history, remove future history
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(snapshot);

      // Limit history to 50 snapshots
      const limitedHistory = newHistory.slice(-50);

      return {
        ...prev,
        history: limitedHistory,
        historyIndex: limitedHistory.length - 1,
        canUndo: limitedHistory.length > 0,
        canRedo: false,
      };
    });
  }, []);

  const undo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex <= 0) return prev;

      const newIndex = prev.historyIndex - 1;
      const snapshot = prev.history[newIndex];

      return {
        ...prev,
        currentOrder: [...snapshot.order],
        historyIndex: newIndex,
        canUndo: newIndex > 0,
        canRedo: true,
        pendingChanges: true,
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex >= prev.history.length - 1) return prev;

      const newIndex = prev.historyIndex + 1;
      const snapshot = prev.history[newIndex];

      return {
        ...prev,
        currentOrder: [...snapshot.order],
        historyIndex: newIndex,
        canUndo: true,
        canRedo: newIndex < prev.history.length - 1,
        pendingChanges: true,
      };
    });
  }, []);

  const clearHistory = useCallback(() => {
    setState(prev => ({
      ...prev,
      history: [],
      historyIndex: -1,
      canUndo: false,
      canRedo: false,
    }));
  }, []);

  // ===================================================================
  // SELECTION ACTIONS
  // ===================================================================

  const toggleItemSelection = useCallback((itemId: string) => {
    setState(prev => {
      const newSelection = new Set(prev.selectedItems);
      if (newSelection.has(itemId)) {
        newSelection.delete(itemId);
      } else {
        newSelection.add(itemId);
      }
      return {
        ...prev,
        selectedItems: newSelection,
        bulkSortMode: newSelection.size > 1,
      };
    });
  }, []);

  const selectMultipleItems = useCallback((itemIds: string[]) => {
    setState(prev => ({
      ...prev,
      selectedItems: new Set(itemIds),
      bulkSortMode: itemIds.length > 1,
    }));
  }, []);

  const clearSelection = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedItems: new Set(),
      bulkSortMode: false,
    }));
  }, []);

  // ===================================================================
  // PERSISTENCE ACTIONS
  // ===================================================================

  const markAsSaved = useCallback(() => {
    setState(prev => ({
      ...prev,
      pendingChanges: false,
      originalOrder: [...prev.currentOrder],
      isSaving: false,
    }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({
      ...prev,
      isLoading: loading,
    }));
  }, []);

  const setSaving = useCallback((saving: boolean) => {
    setState(prev => ({
      ...prev,
      isSaving: saving,
    }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({
      ...prev,
      error,
    }));
  }, []);

  const toggleAutoSave = useCallback(() => {
    setState(prev => ({
      ...prev,
      autoSave: !prev.autoSave,
    }));
  }, []);

  // ===================================================================
  // CONTEXT VALUE
  // ===================================================================

  const contextValue = useMemo<SortModeContextValue>(
    () => ({
      state,
      enableSortMode,
      disableSortMode,
      toggleSortMode,
      startDrag,
      endDrag,
      setDragOverCategory,
      updateOrder,
      setOriginalOrder,
      createSnapshot,
      undo,
      redo,
      clearHistory,
      toggleItemSelection,
      selectMultipleItems,
      clearSelection,
      markAsSaved,
      setLoading,
      setSaving,
      setError,
      toggleAutoSave,
    }),
    [
      state,
      enableSortMode,
      disableSortMode,
      toggleSortMode,
      startDrag,
      endDrag,
      setDragOverCategory,
      updateOrder,
      setOriginalOrder,
      createSnapshot,
      undo,
      redo,
      clearHistory,
      toggleItemSelection,
      selectMultipleItems,
      clearSelection,
      markAsSaved,
      setLoading,
      setSaving,
      setError,
      toggleAutoSave,
    ]
  );

  return (
    <SortModeContext.Provider value={contextValue}>
      {children}
    </SortModeContext.Provider>
  );
};

// ===================================================================
// HOOK
// ===================================================================

/**
 * Hook to access sort mode context
 * Must be used within SortModeProvider
 */
export const useSortMode = (): SortModeContextValue => {
  const context = useContext(SortModeContext);
  if (!context) {
    throw new Error('useSortMode must be used within SortModeProvider');
  }
  return context;
};
