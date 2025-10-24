/**
 * Media Edit Modal Component
 * 
 * Modal for editing media item metadata. Displays thumbnail preview,
 * full metadata form, and save/cancel actions.
 * 
 * @module pages/admin/gallery/_components/MediaEditModal
 */

import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import type { GalleryMediaItem, MediaMetadata, MediaCategory } from '../../../../types/gallery';

/**
 * MediaEditModal Props
 */
interface MediaEditModalProps {
  /** Media item to edit */
  mediaItem: GalleryMediaItem;
  /** Close modal callback */
  onClose: () => void;
  /** Save changes callback */
  onSave: (id: string, metadata: Partial<MediaMetadata>) => Promise<void>;
  /** Whether save operation is in progress */
  isSaving?: boolean;
}

/**
 * Edit form state interface
 */
interface EditFormState {
  title: string;
  caption: string;
  alt: string;
  category: MediaCategory;
  location: string;
  photographer: string;
  dateTaken: string;
  featured: boolean;
  displayOrder: number;
}

/**
 * Category options for dropdown
 */
const CATEGORY_OPTIONS: { value: MediaCategory; label: string }[] = [
  { value: 'wedding', label: 'Wedding' },
  { value: 'engagement', label: 'Engagement' },
  { value: 'pre-wedding', label: 'Pre-Wedding' },
  { value: 'ceremony', label: 'Ceremony' },
  { value: 'reception', label: 'Reception' },
  { value: 'other', label: 'Other' },
];

/**
 * MediaEditModal Component
 * 
 * Provides modal interface for editing media metadata with validation,
 * unsaved changes warning, and success/error feedback.
 */
export const MediaEditModal: React.FC<MediaEditModalProps> = ({
  mediaItem,
  onClose,
  onSave,
  isSaving = false,
}) => {
  // Form state
  const [formState, setFormState] = useState<EditFormState>({
    title: mediaItem.title || '',
    caption: mediaItem.caption || '',
    alt: mediaItem.alt || '',
    category: mediaItem.category || 'ceremony',
    location: mediaItem.location || '',
    photographer: mediaItem.photographer || '',
    dateTaken: mediaItem.dateTaken ? new Date(mediaItem.dateTaken).toISOString().split('T')[0] : '',
    featured: mediaItem.featured,
    displayOrder: mediaItem.displayOrder || 0,
  });

  // Track if form has been modified
  const [isDirty, setIsDirty] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Update isDirty when form changes
  useEffect(() => {
    const hasChanges =
      formState.title !== (mediaItem.title || '') ||
      formState.caption !== (mediaItem.caption || '') ||
      formState.alt !== (mediaItem.alt || '') ||
      formState.category !== mediaItem.category ||
      formState.location !== (mediaItem.location || '') ||
      formState.photographer !== (mediaItem.photographer || '') ||
      formState.dateTaken !== (mediaItem.dateTaken ? new Date(mediaItem.dateTaken).toISOString().split('T')[0] : '') ||
      formState.featured !== mediaItem.featured ||
      formState.displayOrder !== mediaItem.displayOrder;

    setIsDirty(hasChanges);
  }, [formState, mediaItem]);

  /**
   * Handle form field change
   */
  const handleChange = (
    field: keyof EditFormState,
    value: string | boolean | number
  ) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
    setSaveError(null);
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);

    try {
      // Convert form state to metadata
      const metadata: Partial<MediaMetadata> = {
        title: formState.title.trim() || undefined,
        caption: formState.caption.trim() || undefined,
        alt: formState.alt.trim() || undefined,
        category: formState.category,
        location: formState.location.trim() || undefined,
        photographer: formState.photographer.trim() || undefined,
        dateTaken: formState.dateTaken ? new Date(formState.dateTaken) : undefined,
        featured: formState.featured,
        displayOrder: formState.displayOrder,
      };

      await onSave(mediaItem.id, metadata);
      onClose();
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : 'Failed to save changes'
      );
    }
  };

  /**
   * Handle close with unsaved changes check
   */
  const handleClose = () => {
    if (isDirty) {
      const confirmed = globalThis.confirm(
        'You have unsaved changes. Are you sure you want to close?'
      );
      if (!confirmed) return;
    }
    onClose();
  };

  /**
   * Handle backdrop click
   */
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
      onKeyDown={(e) => {
        if (e.key === 'Escape') handleClose();
      }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 id="modal-title" className="text-xl font-semibold text-gray-900 dark:text-white">
            Edit Media
          </h2>
          <button
            onClick={handleClose}
            disabled={isSaving}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Preview */}
            <div className="space-y-4">
              <div className="aspect-video w-full bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
                {mediaItem.mediaType === 'image' ? (
                  <img
                    src={mediaItem.r2Urls.medium || mediaItem.r2Urls.thumbnail}
                    alt={mediaItem.alt || 'Media preview'}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <video
                    src={mediaItem.r2Urls.original}
                    className="w-full h-full object-contain"
                    controls
                  >
                    <track kind="captions" />
                  </video>
                )}
              </div>

              {/* File Info */}
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p>
                  <span className="font-medium">Type:</span> {mediaItem.mediaType}
                </p>
                <p>
                  <span className="font-medium">Size:</span>{' '}
                  {(mediaItem.metadata.fileSize / 1024 / 1024).toFixed(2)} MB
                </p>
                <p>
                  <span className="font-medium">Uploaded:</span>{' '}
                  {new Date(mediaItem.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formState.featured}
                  onChange={(e) => handleChange('featured', e.target.checked)}
                  disabled={isSaving}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label
                  htmlFor="featured"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Featured (highlight in gallery)
                </label>
              </div>

              {/* Display Order */}
              <div>
                <label
                  htmlFor="displayOrder"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Display Order
                </label>
                <input
                  type="number"
                  id="displayOrder"
                  min="1"
                  value={formState.displayOrder}
                  onChange={(e) => handleChange('displayOrder', Number.parseInt(e.target.value, 10))}
                  disabled={isSaving}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter display order..."
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Lower numbers appear first in the gallery
                </p>
              </div>
            </div>

            {/* Right Column: Form Fields */}
            <div className="space-y-4">
              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={formState.category}
                  onChange={(e) =>
                    handleChange('category', e.target.value as MediaCategory)
                  }
                  disabled={isSaving}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  value={formState.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  disabled={isSaving}
                  placeholder="e.g., Garden, Reception Hall"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           placeholder-gray-400 dark:placeholder-gray-500
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Photographer */}
              <div>
                <label
                  htmlFor="photographer"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Photographer
                </label>
                <input
                  type="text"
                  id="photographer"
                  value={formState.photographer}
                  onChange={(e) => handleChange('photographer', e.target.value)}
                  disabled={isSaving}
                  placeholder="Photographer name"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           placeholder-gray-400 dark:placeholder-gray-500
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Date Taken */}
              <div>
                <label
                  htmlFor="dateTaken"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Date Taken
                </label>
                <input
                  type="date"
                  id="dateTaken"
                  value={formState.dateTaken}
                  onChange={(e) => handleChange('dateTaken', e.target.value)}
                  disabled={isSaving}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Caption */}
              <div>
                <label
                  htmlFor="caption"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Caption
                </label>
                <textarea
                  id="caption"
                  value={formState.caption}
                  onChange={(e) => handleChange('caption', e.target.value)}
                  disabled={isSaving}
                  rows={3}
                  placeholder="Optional caption for this media"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           placeholder-gray-400 dark:placeholder-gray-500
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                />
              </div>

              {/* Alt Text */}
              <div>
                <label
                  htmlFor="alt"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Alt Text
                </label>
                <input
                  type="text"
                  id="alt"
                  value={formState.alt}
                  onChange={(e) => handleChange('alt', e.target.value)}
                  disabled={isSaving}
                  placeholder="Describe the image for accessibility"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           placeholder-gray-400 dark:placeholder-gray-500
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {saveError && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800 dark:text-red-300">
                  Failed to save changes
                </p>
                <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                  {saveError}
                </p>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                     hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSaving || !isDirty}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 
                     hover:bg-blue-700 rounded-md transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
