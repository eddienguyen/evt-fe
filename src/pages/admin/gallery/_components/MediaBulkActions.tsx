import React, { useState } from 'react';
import type { GalleryMediaItem, MediaCategory } from '../../../../types/gallery';

interface MediaBulkActionsProps {
  selectedMedia: Set<string>;
  allMedia: GalleryMediaItem[];
  onBulkDelete: (mediaIds: string[]) => Promise<void>;
  onBulkUpdateCategory: (mediaIds: string[], category: MediaCategory) => Promise<void>;
  onClearSelection: () => void;
  disabled?: boolean;
}

export const MediaBulkActions: React.FC<MediaBulkActionsProps> = ({
  selectedMedia,
  allMedia,
  onBulkDelete,
  onBulkUpdateCategory,
  onClearSelection,
  disabled = false,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCategorySelect, setShowCategorySelect] = useState(false);

  const selectedCount = selectedMedia.size;
  const selectedIds = Array.from(selectedMedia);
  const selectedItems = allMedia.filter(item => selectedMedia.has(item.id));

  // Category options
  const categoryOptions: { value: MediaCategory; label: string }[] = [
    { value: 'ceremony', label: 'Ceremony' },
    { value: 'reception', label: 'Reception' },
    { value: 'portraits', label: 'Portraits' },
    { value: 'candid', label: 'Candid' },
    { value: 'details', label: 'Details' },
    { value: 'venue', label: 'Venue' },
    { value: 'general', label: 'General' },
  ];

  const handleBulkDelete = async () => {
    if (selectedCount === 0) return;

    setIsProcessing(true);
    try {
      await onBulkDelete(selectedIds);
      setShowDeleteConfirm(false);
      onClearSelection();
    } catch (error) {
      console.error('Failed to delete media:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkUpdateCategory = async (category: MediaCategory) => {
    if (selectedCount === 0) return;

    setIsProcessing(true);
    try {
      await onBulkUpdateCategory(selectedIds, category);
      setShowCategorySelect(false);
    } catch (error) {
      console.error('Failed to update category:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <>
      {/* Bulk Actions Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Selection Info */}
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">{selectedCount}</span>{' '}
                {selectedCount === 1 ? 'item' : 'items'} selected
              </div>
              <button
                type="button"
                onClick={onClearSelection}
                disabled={disabled || isProcessing}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear selection
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {/* Update Category */}
              <button
                type="button"
                onClick={() => setShowCategorySelect(true)}
                disabled={disabled || isProcessing}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                Update Category
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={disabled || isProcessing}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                {isProcessing ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

            <div className="relative inline-block transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                      Delete {selectedCount} {selectedCount === 1 ? 'item' : 'items'}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Are you sure you want to delete {selectedCount === 1 ? 'this item' : 'these items'}? This action cannot be undone.
                      </p>
                      {selectedCount <= 3 && (
                        <div className="mt-3 space-y-1">
                          {selectedItems.map((item) => (
                            <div key={item.id} className="text-xs text-gray-600 dark:text-gray-300 truncate">
                              • {item.alt || item.filename}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={handleBulkDelete}
                  disabled={isProcessing}
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {isProcessing ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isProcessing}
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Selection Modal */}
      {showCategorySelect && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

            <div className="relative inline-block transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                  Update Category for {selectedCount} {selectedCount === 1 ? 'item' : 'items'}
                </h3>
                <div className="space-y-2">
                  {categoryOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleBulkUpdateCategory(option.value)}
                      disabled={isProcessing}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="font-medium text-gray-900 dark:text-white">
                        {option.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={() => setShowCategorySelect(false)}
                  disabled={isProcessing}
                  className="inline-flex w-full justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Padding for Fixed Bar */}
      <div className="h-20" />
    </>
  );
};