/**
 * Admin Gallery Page
 * 
 * Main page component for gallery management in admin panel.
 * Provides interface for viewing, editing, and managing media items.
 * 
 * @module pages/admin/gallery/page
 */

import React, { useState } from 'react';
import { useGalleryManagement } from '../_components/useGalleryManagement';
import { useMediaSelection } from './_components/useMediaSelection';
import { SortModeProvider } from './_components/SortModeProvider';
import { MediaSortToolbar } from './_components/MediaSortToolbar';
import { MediaFilters } from './_components/MediaFilters';
import { SortableMediaGrid } from './_components/SortableMediaGrid';
import { GalleryMediaList } from './_components/GalleryMediaList';
import { MediaBulkActions } from './_components/MediaBulkActions';
import { MediaUploadZone } from './_components/MediaUploadZone';
import type { GalleryMediaItem } from '../../../types/gallery';

/**
 * AdminGallery Component
 * 
 * Main gallery management page with media grid/list view, 
 * search/filter functionality, and CRUD operations.
 * Now includes drag-and-drop sorting capabilities.
 * 
 * This component is meant to be rendered within AdminLayout via routing.
 */
export const AdminGallery: React.FC = () => {
  // Gallery management state and actions
  const galleryState = useGalleryManagement();
  
  // Media selection state (local to this page)
  const selectionState = useMediaSelection();
  
  // Local UI state
  const [showUploadZone, setShowUploadZone] = useState(false);

  // Handle view mode toggle
  const handleViewModeChange = (mode: 'grid' | 'list') => {
    galleryState.setViewMode(mode);
    // Clear selection when changing view mode
    selectionState.clearSelection();
  };

  // Handle order change from sortable grid
  const handleOrderChange = (newOrder: GalleryMediaItem[]) => {
    // Update the gallery state with new order
    // The actual save will be handled by MediaSortToolbar
    console.log('Order changed:', newOrder);
  };

  // Handle save success
  const handleSaveSuccess = () => {
    // Refresh media to get updated order from backend
    galleryState.refreshMedia();
  };

  // Media management handlers
  const handleEditMedia = (media: any) => {
    galleryState.openEditModal(media);
  };

  const handleBulkDelete = async (mediaIds: string[]) => {
    await galleryState.bulkDeleteMedia(mediaIds);
  };

  const handleBulkUpdateCategory = async (mediaIds: string[], category: any) => {
    await galleryState.bulkUpdateCategory(mediaIds, category);
  };

  // Render content based on loading/error states
  const renderContent = () => {
    if (galleryState.isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (galleryState.error) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-gray-900 dark:text-white font-medium mb-1">
            Error loading media
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {galleryState.error}
          </p>
          <button
            onClick={() => galleryState.refreshMedia()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (galleryState.mediaItems.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-gray-400 mb-4">📸</div>
          <p className="text-gray-900 dark:text-white font-medium mb-1">
            No media found
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Upload some photos and videos to get started
          </p>
          <button
            onClick={() => setShowUploadZone(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Upload Media
          </button>
        </div>
      );
    }

    // Render gallery content with actual components
    const commonProps = {
      mediaItems: galleryState.mediaItems,
      isSelectionMode: selectionState.isSelectionMode,
      selectedItems: selectionState.selectedItems,
      onSelect: selectionState.selectItem,
      onPreview: galleryState.openPreviewModal,
      onEdit: handleEditMedia,
      isLoading: galleryState.isLoading,
    };

    if (galleryState.viewMode === 'grid') {
      return (
        <SortableMediaGrid
          {...commonProps}
          onOrderChange={handleOrderChange}
        />
      );
    } else {
      // List view uses non-sortable grid for now
      return <GalleryMediaList {...commonProps} />;
    }
  };

  return (
    <SortModeProvider initialItems={galleryState.mediaItems}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Gallery Management
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage your wedding gallery photos and videos
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Upload Button */}
            <button
              onClick={() => setShowUploadZone(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Upload Media
            </button>
            
            {/* View Mode Toggle */}
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => handleViewModeChange('grid')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  galleryState.viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => handleViewModeChange('list')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  galleryState.viewMode === 'list'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Sort Toolbar */}
        <MediaSortToolbar onSaveSuccess={handleSaveSuccess} />

      {/* Upload Zone */}
      {showUploadZone && (
        <MediaUploadZone
          onClose={() => setShowUploadZone(false)}
          onUpload={async (files) => {
            await galleryState.uploadFiles(files);
            setShowUploadZone(false);
          }}
          uploadProgress={
            // Convert Record<string, number> to Record<string, UploadProgressItem>
            Object.entries(galleryState.uploadProgress).reduce(
              (acc, [fileId, progress]) => ({
                ...acc,
                [fileId]: {
                  fileId,
                  filename: fileId,
                  progress,
                  status: progress === 100 ? 'success' : 'uploading' as const,
                  error: galleryState.uploadErrors[fileId],
                },
              }),
              {}
            )
          }
          uploadErrors={galleryState.uploadErrors}
          isUploading={galleryState.uploading}
        />
      )}

      {/* Filters */}
      <MediaFilters
        searchQuery={galleryState.searchQuery}
        categoryFilter={galleryState.categoryFilter}
        sortBy={galleryState.sortBy}
        totalItems={galleryState.totalItems}
        onSearchChange={galleryState.setSearchQuery}
        onCategoryChange={galleryState.setCategoryFilter}
        onSortChange={galleryState.setSortBy}
      />

      {/* Bulk Actions */}
      <MediaBulkActions
        selectedMedia={new Set(selectionState.selectedItems)}
        allMedia={galleryState.mediaItems}
        onBulkDelete={handleBulkDelete}
        onBulkUpdateCategory={handleBulkUpdateCategory}
        onClearSelection={selectionState.clearSelection}
        disabled={galleryState.isLoading}
      />

      {/* Media Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {renderContent()}
      </div>

      {/* Pagination */}
      {galleryState.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing page {galleryState.currentPage} of {galleryState.totalPages}
            {' '}({galleryState.totalItems} total items)
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => galleryState.fetchMedia(galleryState.currentPage - 1)}
              disabled={galleryState.currentPage <= 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              Previous
            </button>
            <button
              onClick={() => galleryState.fetchMedia(galleryState.currentPage + 1)}
              disabled={galleryState.currentPage >= galleryState.totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modal Placeholders */}
      {galleryState.showMetadataModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Edit Metadata Modal (Coming Soon)
            </h3>
            <button
              onClick={galleryState.closeEditModal}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {galleryState.showPreviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Preview Modal (Coming Soon)
            </h3>
            <button
              onClick={galleryState.closePreviewModal}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
      </div>
    </SortModeProvider>
  );
};

export default AdminGallery;