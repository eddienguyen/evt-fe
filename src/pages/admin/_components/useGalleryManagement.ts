/**
 * Gallery Management Hook
 * 
 * Custom hook for managing gallery admin state and operations.
 * Handles uploads, media CRUD operations, selection, and filtering.
 * 
 * @module pages/admin/_components/useGalleryManagement
 */

import { useState, useCallback, useEffect } from 'react';
import type {
  GalleryManagementState,
  GalleryMediaItem,
  MediaMetadata,
  MediaCategory,
  MediaSortBy,
} from '../../../types/gallery';
import { api } from '../../../services/galleryApi';
import { validateFile } from '../../../utils/fileValidation';
import { uploadWithProgress, generateFileId, createUploadFormData } from '../../../utils/uploadHelpers';

/**
 * Upload endpoint
 */
const UPLOAD_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/gallery`
  : 'http://localhost:3000/api/gallery';

/**
 * Gallery management actions interface
 */
interface GalleryManagementActions {
  // Upload actions
  uploadFiles: (files: File[]) => Promise<void>;
  cancelUpload: (fileId: string) => void;
  clearUploadErrors: () => void;
  
  // Media management
  fetchMedia: (page?: number) => Promise<void>;
  refreshMedia: () => Promise<void>;
  updateMediaMetadata: (id: string, metadata: Partial<MediaMetadata>) => Promise<void>;
  deleteMedia: (ids: string[]) => Promise<void>;
  
  // Selection actions
  selectMedia: (id: string) => void;
  deselectMedia: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  toggleSelect: (id: string) => void;
  
  // Modal actions
  openEditModal: (media: GalleryMediaItem) => void;
  closeEditModal: () => void;
  openPreviewModal: (media: GalleryMediaItem) => void;
  closePreviewModal: () => void;
  
  // View actions
  setViewMode: (mode: 'grid' | 'list') => void;
  
  // Filter/search actions
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: MediaCategory | 'all') => void;
  setSortBy: (sortBy: MediaSortBy) => void;
  
  // Bulk actions
  toggleBulkMode: () => void;
  bulkDeleteMedia: (ids: string[]) => Promise<void>;
  bulkUpdateCategory: (ids: string[], category: MediaCategory) => Promise<void>;
}

/**
 * Gallery management return type
 */
export type UseGalleryManagementReturn = GalleryManagementState & GalleryManagementActions;

/**
 * useGalleryManagement Hook
 * 
 * @returns Gallery management state and actions
 */
export const useGalleryManagement = (): UseGalleryManagementReturn => {
  // State
  const [state, setState] = useState<GalleryManagementState>({
    // Upload states
    uploading: false,
    uploadProgress: {},
    uploadErrors: {},
    
    // Media data
    mediaItems: [],
    selectedItems: [],
    isLoading: false,
    error: null,
    
    // UI states
    showMetadataModal: false,
    showPreviewModal: false,
    editingMedia: null,
    previewMedia: null,
    bulkActionMode: false,
    viewMode: 'grid',
    
    // Filter/search states
    searchQuery: '',
    categoryFilter: 'all',
    sortBy: 'createdAt',
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
  });

  /**
   * Fetch media items with current filters
   */
  const fetchMedia = useCallback(async (page = 1) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await api.getMedia({
        page,
        limit: 20,
        search: state.searchQuery || undefined,
        category: state.categoryFilter === 'all' ? undefined : state.categoryFilter,
        sortBy: state.sortBy,
        sortOrder: 'desc',
      });
      
      setState(prev => ({
        ...prev,
        mediaItems: page === 1 ? response.items : [...prev.mediaItems, ...response.items],
        currentPage: page,
        totalPages: response.pagination.totalPages,
        totalItems: response.pagination.total,
        isLoading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch media';
      setState(prev => ({
        ...prev,
        error: message,
        isLoading: false,
      }));
    }
  }, [state.searchQuery, state.categoryFilter, state.sortBy]);

  /**
   * Refresh media list (reset to page 1)
   */
  const refreshMedia = useCallback(async () => {
    await fetchMedia(1);
  }, [fetchMedia]);

  /**
   * Upload multiple files
   */
  const uploadFiles = useCallback(async (files: File[]) => {
    setState(prev => ({ ...prev, uploading: true }));
    
    for (const file of files) {
      // Validate file
      const validation = validateFile(file);
      if (!validation.valid) {
        const fileId = generateFileId(file);
        setState(prev => ({
          ...prev,
          uploadErrors: {
            ...prev.uploadErrors,
            [fileId]: validation.error || 'Invalid file',
          },
        }));
        continue;
      }
      
      // Generate file ID for tracking
      const fileId = generateFileId(file);
      
      try {
        // Create form data
        const formData = createUploadFormData(file, {
          category: state.categoryFilter === 'all' ? 'other' : state.categoryFilter,
        });
        
        // Upload with progress tracking
        await uploadWithProgress(formData, {
          url: UPLOAD_URL,
          onProgress: (progress) => {
            setState(prev => ({
              ...prev,
              uploadProgress: {
                ...prev.uploadProgress,
                [fileId]: progress,
              },
            }));
          },
        });
        
        // Remove progress tracking on completion
        setState(prev => {
          const { [fileId]: _, ...remainingProgress } = prev.uploadProgress;
          return { ...prev, uploadProgress: remainingProgress };
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Upload failed';
        setState(prev => ({
          ...prev,
          uploadErrors: {
            ...prev.uploadErrors,
            [fileId]: message,
          },
        }));
      }
    }
    
    setState(prev => ({ ...prev, uploading: false }));
    
    // Refresh media grid after all uploads
    await refreshMedia();
  }, [state.categoryFilter, refreshMedia]);

  /**
   * Cancel upload (placeholder - actual implementation would need abort controller)
   */
  const cancelUpload = useCallback((fileId: string) => {
    setState(prev => {
      const { [fileId]: _, ...remainingProgress } = prev.uploadProgress;
      return { ...prev, uploadProgress: remainingProgress };
    });
  }, []);

  /**
   * Clear upload errors
   */
  const clearUploadErrors = useCallback(() => {
    setState(prev => ({ ...prev, uploadErrors: {} }));
  }, []);

  /**
   * Update media metadata
   */
  const updateMediaMetadata = useCallback(async (id: string, metadata: Partial<MediaMetadata>) => {
    try {
      const updatedMedia = await api.updateMedia(id, metadata);
      
      setState(prev => ({
        ...prev,
        mediaItems: prev.mediaItems.map(item =>
          item.id === id ? updatedMedia : item
        ),
        editingMedia: null,
        showMetadataModal: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Update failed';
      setState(prev => ({ ...prev, error: message }));
      throw error;
    }
  }, []);

  /**
   * Delete media items
   */
  const deleteMedia = useCallback(async (ids: string[]) => {
    try {
      // Delete each item (or use bulk delete API if available)
      await Promise.all(ids.map(id => api.deleteMedia(id)));
      
      setState(prev => ({
        ...prev,
        mediaItems: prev.mediaItems.filter(item => !ids.includes(item.id)),
        selectedItems: prev.selectedItems.filter(id => !ids.includes(id)),
        totalItems: prev.totalItems - ids.length,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Delete failed';
      setState(prev => ({ ...prev, error: message }));
      throw error;
    }
  }, []);

  /**
   * Select media item
   */
  const selectMedia = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      selectedItems: [...prev.selectedItems, id],
    }));
  }, []);

  /**
   * Deselect media item
   */
  const deselectMedia = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      selectedItems: prev.selectedItems.filter(itemId => itemId !== id),
    }));
  }, []);

  /**
   * Toggle media selection
   */
  const toggleSelect = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      selectedItems: prev.selectedItems.includes(id)
        ? prev.selectedItems.filter(itemId => itemId !== id)
        : [...prev.selectedItems, id],
    }));
  }, []);

  /**
   * Select all visible media items
   */
  const selectAll = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedItems: prev.mediaItems.map(item => item.id),
    }));
  }, []);

  /**
   * Clear all selections
   */
  const clearSelection = useCallback(() => {
    setState(prev => ({ ...prev, selectedItems: [] }));
  }, []);

  /**
   * Open edit modal
   */
  const openEditModal = useCallback((media: GalleryMediaItem) => {
    setState(prev => ({
      ...prev,
      editingMedia: media,
      showMetadataModal: true,
    }));
  }, []);

  /**
   * Close edit modal
   */
  const closeEditModal = useCallback(() => {
    setState(prev => ({
      ...prev,
      editingMedia: null,
      showMetadataModal: false,
    }));
  }, []);

  /**
   * Set search query
   */
  const setSearchQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, searchQuery: query, currentPage: 1 }));
  }, []);

  /**
   * Set category filter
   */
  const setCategoryFilter = useCallback((category: MediaCategory | 'all') => {
    setState(prev => ({ ...prev, categoryFilter: category, currentPage: 1 }));
  }, []);

  /**
   * Set sort by
   */
  const setSortBy = useCallback((sortBy: MediaSortBy) => {
    setState(prev => ({ ...prev, sortBy, currentPage: 1 }));
  }, []);

  /**
   * Open preview modal
   */
  const openPreviewModal = useCallback((media: GalleryMediaItem) => {
    setState(prev => ({
      ...prev,
      previewMedia: media,
      showPreviewModal: true,
    }));
  }, []);

  /**
   * Close preview modal
   */
  const closePreviewModal = useCallback(() => {
    setState(prev => ({
      ...prev,
      previewMedia: null,
      showPreviewModal: false,
    }));
  }, []);

  /**
   * Set view mode
   */
  const setViewMode = useCallback((mode: 'grid' | 'list') => {
    setState(prev => ({ ...prev, viewMode: mode }));
  }, []);

  /**
   * Bulk delete media items
   */
  const bulkDeleteMedia = useCallback(async (ids: string[]) => {
    try {
      await deleteMedia(ids);
      setState(prev => ({
        ...prev,
        selectedItems: [],
        bulkActionMode: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Bulk delete failed';
      setState(prev => ({ ...prev, error: message }));
      throw error;
    }
  }, [deleteMedia]);

  /**
   * Bulk update category for multiple items
   */
  const bulkUpdateCategory = useCallback(async (ids: string[], category: MediaCategory) => {
    try {
      // Update each item (or use bulk update API if available)
      await Promise.all(ids.map(id => api.updateMedia(id, { category })));
      
      setState(prev => ({
        ...prev,
        mediaItems: prev.mediaItems.map(item =>
          ids.includes(item.id) ? { ...item, category } : item
        ),
        selectedItems: [],
        bulkActionMode: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Bulk update failed';
      setState(prev => ({ ...prev, error: message }));
      throw error;
    }
  }, []);

  /**
   * Toggle bulk action mode
   */
  const toggleBulkMode = useCallback(() => {
    setState(prev => ({
      ...prev,
      bulkActionMode: !prev.bulkActionMode,
      selectedItems: prev.bulkActionMode ? prev.selectedItems : [],
    }));
  }, []);

  // Fetch media on mount and when filters change
  useEffect(() => {
    fetchMedia(1);
  }, [state.searchQuery, state.categoryFilter, state.sortBy]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    ...state,
    uploadFiles,
    cancelUpload,
    clearUploadErrors,
    fetchMedia,
    refreshMedia,
    updateMediaMetadata,
    deleteMedia,
    selectMedia,
    deselectMedia,
    selectAll,
    clearSelection,
    toggleSelect,
    openEditModal,
    closeEditModal,
    openPreviewModal,
    closePreviewModal,
    setViewMode,
    setSearchQuery,
    setCategoryFilter,
    setSortBy,
    toggleBulkMode,
    bulkDeleteMedia,
    bulkUpdateCategory,
  };
};
