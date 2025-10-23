/**
 * Media Sort Toolbar Component
 * 
 * Toolbar with sort mode toggle, quick actions, and save/undo controls.
 * Provides UI for all sorting and reordering operations.
 * 
 * @module pages/admin/gallery/_components/MediaSortToolbar
 */

import React from 'react';
import { useSortMode } from './SortModeProvider';
import { useMediaReordering } from './useMediaReordering';
import {
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Save,
  Undo,
  Redo,
  SortAsc,
  SortDesc,
  Loader2,
} from 'lucide-react';

/**
 * Media sort toolbar props interface
 */
interface MediaSortToolbarProps {
  onSaveSuccess?: () => void;
}

/**
 * MediaSortToolbar Component
 * 
 * Control toolbar for media sorting operations.
 * Shows sort mode toggle, quick actions, and persistence controls.
 */
export const MediaSortToolbar: React.FC<MediaSortToolbarProps> = ({
  onSaveSuccess,
}) => {
  const {
    state,
    toggleSortMode,
    undo,
    redo,
    toggleAutoSave,
  } = useSortMode();

  const {
    moveToTop,
    moveToBottom,
    sortAlpha,
    resetOrder,
    saveOrder,
    isSaving,
    hasPendingChanges,
  } = useMediaReordering();

  const {
    isSortMode,
    canUndo,
    canRedo,
    autoSave,
    selectedItems,
    error,
  } = state;

  const selectedCount = selectedItems.size;

  // Handle save
  const handleSave = async () => {
    const success = await saveOrder();
    if (success && onSaveSuccess) {
      onSaveSuccess();
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 mb-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Sort Mode Toggle */}
        <button
          type="button"
          onClick={toggleSortMode}
          className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
            isSortMode
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          {isSortMode ? '✓ Sort Mode' : 'Enable Sort Mode'}
        </button>

        {/* Divider */}
        {isSortMode && (
          <>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />

            {/* Quick Sort Actions */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => moveToTop()}
                disabled={selectedCount === 0}
                className="p-2 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Move to top"
              >
                <ArrowUp className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => moveToBottom()}
                disabled={selectedCount === 0}
                className="p-2 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Move to bottom"
              >
                <ArrowDown className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => sortAlpha('asc')}
                className="p-2 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                title="Sort A-Z"
              >
                <SortAsc className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => sortAlpha('desc')}
                className="p-2 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                title="Sort Z-A"
              >
                <SortDesc className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={resetOrder}
                className="p-2 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                title="Reset to upload order"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />

            {/* History Actions */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={undo}
                disabled={!canUndo}
                className="p-2 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Undo"
              >
                <Undo className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={redo}
                disabled={!canRedo}
                className="p-2 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Redo"
              >
                <Redo className="w-4 h-4" />
              </button>
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />

            {/* Save Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={!hasPendingChanges || isSaving}
                className="px-4 py-2 rounded-md font-medium text-sm bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Order
                  </>
                )}
              </button>

              {/* Auto-save Toggle */}
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSave}
                  onChange={toggleAutoSave}
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <span>Auto-save</span>
              </label>
            </div>

            {/* Status Indicator */}
            {hasPendingChanges && !autoSave && (
              <span className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                • Unsaved changes
              </span>
            )}
          </>
        )}

        {/* Selected Count */}
        {selectedCount > 0 && (
          <span className="ml-auto text-sm text-gray-600 dark:text-gray-400">
            {selectedCount} selected
          </span>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
};
