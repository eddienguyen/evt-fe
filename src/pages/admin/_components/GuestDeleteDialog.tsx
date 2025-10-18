/**
 * Guest Delete Dialog
 * 
 * Confirmation dialog for deleting guest.
 * Shows guest details and RSVP warning if applicable.
 * 
 * @module pages/admin/_components/GuestDeleteDialog
 */

import { useState } from 'react';
import type { GuestRecord } from '../../../types/admin';
import { getVenueName } from './guestTableUtils';

interface GuestDeleteDialogProps {
  guest: GuestRecord;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<{ success: boolean; error?: string }>;
  rsvpWarning?: {
    hasRSVPs: boolean;
    rsvpCount: number;
    message: string;
  } | null;
}

export const GuestDeleteDialog: React.FC<GuestDeleteDialogProps> = ({
  guest,
  isOpen,
  onClose,
  onConfirm,
  rsvpWarning,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setIsDeleting(true);
    setDeleteError(null);

    const result = await onConfirm(guest.id);

    if (result.success) {
      onClose();
    } else {
      setDeleteError(result.error || 'Không thể xóa khách mời');
    }

    setIsDeleting(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
    >
      <div
        className="bg-base dark:bg-base border border-text-light/20 rounded-lg
                   max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 id="delete-dialog-title" className="text-xl font-bold text-text dark:text-text">
              Xóa khách mời
            </h2>
            <p className="text-sm text-text-light mt-1">
              Bạn có chắc chắn muốn xóa khách mời này không? Hành động này không thể hoàn tác.
            </p>
          </div>
        </div>

        {/* Guest Details */}
        <div className="bg-base-light/20 dark:bg-base-light/5 rounded-lg p-4 mb-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-text-light">Tên:</span>
            <span className="text-sm text-text dark:text-text font-medium">{guest.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-text-light">Địa điểm:</span>
            <span className="text-sm text-text dark:text-text">{getVenueName(guest.venue)}</span>
          </div>
          {guest.secondaryNote && (
            <div className="flex justify-between">
              <span className="text-sm text-text-light">Ghi chú:</span>
              <span className="text-sm text-text dark:text-text">{guest.secondaryNote}</span>
            </div>
          )}
        </div>

        {/* RSVP Warning */}
        {rsvpWarning && rsvpWarning.hasRSVPs && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                  Cảnh báo RSVP liên quan
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                  {rsvpWarning.message}
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-2">
                  Việc xóa khách mời này có thể ảnh hưởng đến {rsvpWarning.rsvpCount} RSVP đã tạo.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {deleteError && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-300">{deleteError}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-6 py-2 text-sm font-medium text-text-light
                     border border-text-light/20 rounded-lg
                     hover:bg-base-light/30
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="px-6 py-2 text-sm font-medium text-white
                     bg-red-600 rounded-lg
                     hover:bg-red-700
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors"
          >
            {isDeleting ? 'Đang xóa...' : 'Xác nhận xóa'}
          </button>
        </div>
      </div>
    </div>
  );
};
