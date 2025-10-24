/**
 * Guest Edit Modal
 * 
 * Modal dialog for editing guest details.
 * Includes form validation and error handling.
 * 
 * @module pages/admin/_components/GuestEditModal
 */

import { useState, useEffect } from 'react';
import type { GuestRecord, UpdateGuestData } from '../../../types/admin';

interface GuestEditModalProps {
  guest: GuestRecord;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: UpdateGuestData) => Promise<{ success: boolean; error?: string }>;
}

export const GuestEditModal: React.FC<GuestEditModalProps> = ({
  guest,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<UpdateGuestData>({
    name: guest.name,
    venue: guest.venue,
    secondaryNote: guest.secondaryNote || '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Reset form when guest changes
  useEffect(() => {
    setFormData({
      name: guest.name,
      venue: guest.venue,
      secondaryNote: guest.secondaryNote || '',
    });
    setErrors({});
    setSubmitError(null);
  }, [guest]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Tên khách không được để trống';
    }

    if (formData.name && formData.name.length > 100) {
      newErrors.name = 'Tên khách không được quá 100 ký tự';
    }

    if (formData.secondaryNote && formData.secondaryNote.length > 200) {
      newErrors.secondaryNote = 'Ghi chú không được quá 200 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const result = await onSave(guest.id, formData);

    if (result.success) {
      onClose();
    } else {
      setSubmitError(result.error || 'Không thể cập nhật khách mời');
    }

    setIsSubmitting(false);
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
      aria-labelledby="edit-modal-title"
    >
      <div
        className="bg-base dark:bg-base border border-text-light/20 rounded-lg
                   max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 id="edit-modal-title" className="text-2xl font-bold text-text dark:text-text">
            Sửa thông tin khách mời
          </h2>
          <button
            onClick={onClose}
            className="text-text-light hover:text-text transition-colors"
            aria-label="Đóng"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Error Message */}
        {submitError && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-300">{submitError}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-light mb-2">
              Tên khách mời <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={isSubmitting}
              className={`w-full px-4 py-2 border rounded-lg
                       bg-base dark:bg-base text-text dark:text-text
                       focus:outline-none focus:ring-2 focus:ring-accent-gold
                       disabled:opacity-50 disabled:cursor-not-allowed
                       ${errors.name ? 'border-red-500' : 'border-text-light/20'}`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Venue */}
          <div>
            <label htmlFor="venue" className="block text-sm font-medium text-text-light mb-2">
              Địa điểm tổ chức <span className="text-red-500">*</span>
            </label>
            <select
              id="venue"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value as 'hue' | 'hanoi' })}
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-text-light/20 rounded-lg
                       bg-base dark:bg-base text-text dark:text-text
                       focus:outline-none focus:ring-2 focus:ring-accent-gold
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="hue">Huế</option>
              <option value="hanoi">Hà Nội</option>
            </select>
          </div>

          {/* Secondary Note */}
          <div>
            <label htmlFor="secondaryNote" className="block text-sm font-medium text-text-light mb-2">
              Ghi chú phụ
            </label>
            <textarea
              id="secondaryNote"
              value={formData.secondaryNote}
              onChange={(e) => setFormData({ ...formData, secondaryNote: e.target.value })}
              disabled={isSubmitting}
              rows={3}
              placeholder="Thông tin thêm (tùy chọn)..."
              className={`w-full px-4 py-2 border rounded-lg resize-none
                       bg-base dark:bg-base text-text dark:text-text
                       placeholder:text-text-light/50
                       focus:outline-none focus:ring-2 focus:ring-accent-gold
                       disabled:opacity-50 disabled:cursor-not-allowed
                       ${errors.secondaryNote ? 'border-red-500' : 'border-text-light/20'}`}
            />
            {errors.secondaryNote && (
              <p className="mt-1 text-sm text-red-500">{errors.secondaryNote}</p>
            )}
            <p className="mt-1 text-xs text-text-light">
              {formData.secondaryNote?.length || 0}/200 ký tự
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Lưu ý:</strong> Chỉnh sửa thông tin không ảnh hưởng đến thiệp mời đã tạo. 
              Link thiệp và hình ảnh thiệp sẽ không thay đổi.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2 text-sm font-medium text-text-light dark:text-base-light
                       border border-text-light/20 rounded-lg
                       hover:bg-base-light/30
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 text-sm font-medium text-white
                       bg-accent-gold rounded-lg
                       hover:bg-accent-gold/90
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors"
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
