/**
 * RSVP Edit Modal
 * 
 * Modal dialog for editing RSVP details.
 * Includes form validation and error handling.
 * 
 * @module pages/admin/_components/RSVPEditModal
 */

import { useState, useEffect } from 'react';
import type { RSVPRecord, UpdateRSVPData } from '../../../types/rsvp';

interface RSVPEditModalProps {
  rsvp: RSVPRecord;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: UpdateRSVPData) => Promise<{ success: boolean; error?: string }>;
}

export const RSVPEditModal: React.FC<RSVPEditModalProps> = ({
  rsvp,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<UpdateRSVPData>({
    name: rsvp.name,
    guestCount: rsvp.guestCount,
    willAttend: rsvp.willAttend,
    wishes: rsvp.wishes || '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Reset form when rsvp changes
  useEffect(() => {
    setFormData({
      name: rsvp.name,
      guestCount: rsvp.guestCount,
      willAttend: rsvp.willAttend,
      wishes: rsvp.wishes || '',
    });
    setErrors({});
    setSubmitError(null);
  }, [rsvp]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Tên không được để trống';
    }

    if (formData.guestCount === undefined || formData.guestCount < 1) {
      newErrors.guestCount = 'Số khách phải ít nhất là 1';
    }

    if (formData.guestCount && formData.guestCount > 20) {
      newErrors.guestCount = 'Số khách không được quá 20';
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

    const result = await onSave(rsvp.id, formData);

    if (result.success) {
      onClose();
    } else {
      setSubmitError(result.error || 'Không thể cập nhật RSVP');
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
          <h2 className="text-2xl font-bold text-text dark:text-text">
            Sửa RSVP
          </h2>
          <button
            onClick={onClose}
            className="text-text-light hover:text-text transition-colors"
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-light mb-2">
              Tên người trả lời <span className="text-red-500">*</span>
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

          {/* Guest Count */}
          <div>
            <label htmlFor="guestCount" className="block text-sm font-medium text-text-light mb-2">
              Số lượng khách <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="guestCount"
              min="1"
              max="20"
              value={formData.guestCount}
              onChange={(e) => setFormData({ ...formData, guestCount: Number.parseInt(e.target.value, 10) })}
              disabled={isSubmitting}
              className={`w-full px-4 py-2 border rounded-lg
                       bg-base dark:bg-base text-text dark:text-text
                       focus:outline-none focus:ring-2 focus:ring-accent-gold
                       disabled:opacity-50 disabled:cursor-not-allowed
                       ${errors.guestCount ? 'border-red-500' : 'border-text-light/20'}`}
            />
            {errors.guestCount && (
              <p className="mt-1 text-sm text-red-500">{errors.guestCount}</p>
            )}
          </div>

          {/* Will Attend */}
          <div>
            <label htmlFor="willAttend" className="block text-sm font-medium text-text-light mb-2">
              Trạng thái tham dự <span className="text-red-500">*</span>
            </label>
            <select
              id="willAttend"
              value={formData.willAttend ? 'true' : 'false'}
              onChange={(e) => setFormData({ ...formData, willAttend: e.target.value === 'true' })}
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-text-light/20 rounded-lg
                       bg-base dark:bg-base text-text dark:text-text
                       focus:outline-none focus:ring-2 focus:ring-accent-gold
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="true">Tham dự</option>
              <option value="false">Không tham dự</option>
            </select>
          </div>

          {/* Wishes */}
          <div>
            <label htmlFor="wishes" className="block text-sm font-medium text-text-light mb-2">
              Lời chúc
            </label>
            <textarea
              id="wishes"
              rows={4}
              value={formData.wishes}
              onChange={(e) => setFormData({ ...formData, wishes: e.target.value })}
              disabled={isSubmitting}
              placeholder="Nhập lời chúc..."
              className="w-full px-4 py-2 border border-text-light/20 rounded-lg
                       bg-base dark:bg-base text-text dark:text-text
                       placeholder:text-text-light/50
                       focus:outline-none focus:ring-2 focus:ring-accent-gold
                       disabled:opacity-50 disabled:cursor-not-allowed
                       resize-vertical"
            />
          </div>

          {/* Submit Error */}
          {submitError && (
            <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg">
              <p className="text-sm text-red-500">{submitError}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-text-light
                       border border-text-light/20 rounded-lg
                       hover:bg-base-light/20
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white
                       bg-accent-gold rounded-lg
                       hover:bg-accent-gold/90
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors"
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
