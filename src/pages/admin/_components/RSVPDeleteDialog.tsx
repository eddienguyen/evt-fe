/**
 * RSVP Delete Dialog
 * 
 * Confirmation dialog for deleting RSVP.
 * Shows RSVP details and requires explicit confirmation.
 * 
 * @module pages/admin/_components/RSVPDeleteDialog
 */

import { useState } from 'react';
import type { RSVPRecord } from '../../../types/rsvp';
import { getVenueName, getAttendanceStatus } from './rsvpTableUtils';

interface RSVPDeleteDialogProps {
  rsvp: RSVPRecord;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export const RSVPDeleteDialog: React.FC<RSVPDeleteDialogProps> = ({
  rsvp,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setIsDeleting(true);
    setDeleteError(null);

    const result = await onConfirm(rsvp.id);

    if (result.success) {
      onClose();
    } else {
      setDeleteError(result.error || 'Không thể xóa RSVP');
    }

    setIsDeleting(false);
  };

  if (!isOpen) return null;

  const attendanceStatus = getAttendanceStatus(rsvp.willAttend);

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
            <span className="text-2xl text-red-500">⚠</span>
          </div>
          <div>
            <h2 id="delete-dialog-title" className="text-xl font-bold text-text dark:text-text">
              Xóa RSVP
            </h2>
            <p className="text-sm text-text-light mt-1">
              Bạn có chắc chắn muốn xóa RSVP này không? Hành động này không thể hoàn tác.
            </p>
          </div>
        </div>

        {/* RSVP Details */}
        <div className="bg-base-light/20 dark:bg-base-light/5 rounded-lg p-4 mb-6 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-text-light">Tên:</span>
            <span className="text-sm text-text dark:text-text font-medium">{rsvp.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-text-light">Số khách:</span>
            <span className="text-sm text-text dark:text-text">{rsvp.guestCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-text-light">Trạng thái:</span>
            <span className={`text-sm font-medium ${attendanceStatus.className}`}>
              {attendanceStatus.text}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-text-light">Địa điểm:</span>
            <span className="text-sm text-text dark:text-text">{getVenueName(rsvp.venue)}</span>
          </div>
        </div>

        {/* Delete Error */}
        {deleteError && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg">
            <p className="text-sm text-red-500">{deleteError}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-text-light
                     border border-text-light/20 rounded-lg
                     hover:bg-base-light/20
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-white
                     bg-red-600 rounded-lg
                     hover:bg-red-700
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors"
          >
            {isDeleting ? 'Đang xóa...' : 'Xóa'}
          </button>
        </div>
      </div>
    </div>
  );
};
