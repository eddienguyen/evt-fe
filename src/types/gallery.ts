/**
 * Gallery Type Definitions
 *
 * Type definitions for gallery images, metadata, and state management.
 *
 * @module types/gallery
 */

/**
 * Image size variant interface
 */
export interface ImageSize {
  url: string;
  width: number;
  height: number;
  format: string;
}

/**
 * Image metadata interface
 */
export interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  size?: number;
  capturedDate?: string;
  dateTaken?: Date;
  location?: string;
  photographer?: string;
}

/**
 * Gallery image interface
 */
export interface GalleryImage {
  id: string;
  filename: string;
  alt: string;
  caption?: string;
  date: string;
  category: string;
  sizes: {
    thumbnail: ImageSize;
    medium: ImageSize;
    large: ImageSize;
    original: ImageSize;
  };
  metadata: ImageMetadata;
  blurhash?: string;
}

/**
 * Pagination interface
 */
export interface GalleryPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
  /** @deprecated Use hasMore instead */
  hasNext?: boolean;
}

/**
 * Gallery API response interface
 */
export interface GalleryAPIResponse {
  images: GalleryImage[];
  pagination: GalleryPagination;
}

/**
 * Gallery state interface
 */
export interface GalleryState {
  // Data States
  images: GalleryImage[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;

  // UI States
  selectedImageIndex: number | null;
  lightboxOpen: boolean;
  viewMode: "grid" | "masonry";

  // Filter/Search States
  searchQuery: string;
  selectedCategory: string | null;
  sortBy: "date" | "name" | "size";
}

/**
 * Lightbox state interface
 */
export interface LightboxState {
  isOpen: boolean;
  currentIndex: number;
  images: GalleryImage[];
}

// ===================================================================
// ADMIN GALLERY MANAGEMENT TYPES
// ===================================================================

/**
 * Media type enum for admin uploads
 */
export type MediaType = "image" | "video";

/**
 * Media category enum
 */
export type MediaCategory =
  | "wedding"
  | "engagement"
  | "pre-wedding"
  | "ceremony"
  | "reception"
  | "other";

/**
 * Upload status enum
 */
export type UploadStatus =
  | "pending"
  | "uploading"
  | "processing"
  | "completed"
  | "error";

/**
 * Sort options for media grid
 * Must match backend validation: createdAt, displayOrder, dateTaken, updatedAt
 */
export type MediaSortBy =
  | "createdAt"
  | "displayOrder"
  | "dateTaken"
  | "updatedAt";

/**
 * Gallery media item interface for admin management
 * Represents a single media item (image/video) in the gallery
 */
export interface GalleryMediaItem {
  id: string;
  filename: string;
  title?: string;
  caption?: string;
  alt: string;
  mediaType: MediaType;
  category: MediaCategory;
  r2ObjectKey: string;
  r2Urls: {
    thumbnail: string;
    medium: string;
    large: string;
    original: string;
  };
  featured: boolean;
  displayOrder: number;
  metadata: {
    width: number;
    height: number;
    fileSize: number;
    format: string;
    duration?: number; // For videos
  };
  location?: string;
  photographer?: string;
  dateTaken?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Media metadata that can be edited
 */
export interface MediaMetadata {
  title?: string;
  caption?: string;
  alt?: string;
  category: MediaCategory;
  featured: boolean;
  displayOrder?: number;
  location?: string;
  photographer?: string;
  dateTaken?: Date;
}

/**
 * Upload progress tracking for individual files
 */
export interface UploadProgressItem {
  fileId: string;
  filename: string;
  progress: number;
  status: UploadStatus;
  error?: string;
  mediaItem?: GalleryMediaItem;
}

/**
 * Gallery upload response from API
 */
export interface GalleryUploadResponse {
  success: boolean;
  mediaItem?: GalleryMediaItem;
  error?: string;
  errors?: string[];
}

/**
 * Gallery management state interface
 */
export interface GalleryManagementState {
  // Upload States
  uploading: boolean;
  uploadProgress: Record<string, number>; // fileId -> progress %
  uploadErrors: Record<string, string>;

  // Media Data
  mediaItems: GalleryMediaItem[];
  isLoading: boolean;
  error: string | null;

  // UI States
  showMetadataModal: boolean;
  showPreviewModal: boolean;
  editingMedia: GalleryMediaItem | null;
  previewMedia: GalleryMediaItem | null;
  viewMode: "grid" | "list";

  // Filter/Search States
  searchQuery: string;
  categoryFilter: MediaCategory | "all";
  sortBy: MediaSortBy;
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

/**
 * Gallery API query parameters
 */
export interface GalleryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: MediaCategory;
  featured?: boolean;
  sortBy?: MediaSortBy;
  sortOrder?: "asc" | "desc";
}

/**
 * Gallery API response for listing media
 */
export interface GalleryListResponse {
  success: boolean;
  items: GalleryMediaItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

/**
 * File validation result
 */
export interface FileValidationResult {
  valid: boolean;
  error?: string;
  warnings?: string[];
}

/**
 * Bulk operation result
 */
export interface BulkOperationResult {
  success: boolean;
  successCount: number;
  failCount: number;
  errors: Array<{
    id: string;
    filename: string;
    error: string;
  }>;
}

/**
 * Image loading state
 */
export type ImageLoadState = "idle" | "loading" | "loaded" | "error";

// ===================================================================
// MEDIA SORTING AND REORDERING TYPES
// ===================================================================

/**
 * Sort operation types
 */
export type SortOperationType =
  | "drag"
  | "quick-sort"
  | "category-move"
  | "bulk-move"
  | "alphabetical"
  | "reset";

/**
 * Quick sort action types
 */
export type QuickSortAction =
  | "move-to-top"
  | "move-to-bottom"
  | "alphabetical-asc"
  | "alphabetical-desc"
  | "reset-to-upload";

/**
 * Media order snapshot for history/undo functionality
 */
export interface MediaOrderSnapshot {
  timestamp: Date;
  order: GalleryMediaItem[];
  operation: SortOperationType;
  description?: string;
}

/**
 * Media sort state interface
 */
export interface MediaSortState {
  // Sort Mode States
  isSortMode: boolean;
  isDragging: boolean;
  draggedItemId: string | null;

  // Order States
  originalOrder: GalleryMediaItem[];
  currentOrder: GalleryMediaItem[];
  pendingChanges: boolean;

  // History States
  history: MediaOrderSnapshot[];
  historyIndex: number;
  canUndo: boolean;
  canRedo: boolean;

  // Category Transfer States
  dragOverCategory: MediaCategory | null;
  categoryTransferMode: boolean;

  // UI States
  autoSave: boolean;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  // Selection States (for batch operations)
  selectedItems: Set<string>;
  bulkSortMode: boolean;
}

/**
 * Reorder request payload for API
 */
export interface ReorderRequestPayload {
  operations: Array<{
    id: string;
    displayOrder: number;
    category?: MediaCategory;
  }>;
}

/**
 * Quick sort request payload
 */
export interface QuickSortRequestPayload {
  operation: QuickSortAction;
  itemIds: string[];
  direction?: "asc" | "desc";
  category?: MediaCategory;
}

/**
 * Reorder response from API
 */
export interface ReorderResponse {
  success: boolean;
  updatedItems: GalleryMediaItem[];
  message?: string;
  rollbackToken?: string;
}

/**
 * Sort history item for tracking changes
 */
export interface SortHistoryItem {
  operation: SortOperationType;
  timestamp: Date;
  affectedItems: number;
  rollbackToken?: string;
}
