/**
 * Guest Form Component
 * 
 * Form for creating new guests with validation using react-hook-form and zod.
 * Includes venue selection, name input, and optional secondary note.
 * 
 * @module pages/admin/_components/GuestForm
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import type { GuestFormData } from '../../../types/admin';

// Validation schema
const guestFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(100, 'Tên không được quá 100 ký tự')
    .trim(),
  venue: z.enum(['hue', 'hanoi'], {
    message: 'Vui lòng chọn địa điểm'
  }),
  secondaryNote: z
    .string()
    .max(200, 'Ghi chú không được quá 200 ký tự')
    .trim()
    .optional()
    .or(z.literal(''))
});

export interface GuestFormProps {
  onSubmit: (data: GuestFormData) => Promise<void>;
  isSubmitting: boolean;
  onFormChange?: (data: Partial<GuestFormData>) => void;
}

/**
 * Guest Form Component
 * 
 * Handles guest creation form with validation and real-time updates.
 */
export const GuestForm: React.FC<GuestFormProps> = ({
  onSubmit,
  isSubmitting,
  onFormChange
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<GuestFormData>({
    resolver: zodResolver(guestFormSchema),
    defaultValues: {
      name: '',
      venue: 'hanoi',
      secondaryNote: ''
    }
  });

  // Watch form values for live preview
  React.useEffect(() => {
    const subscription = watch((value) => {
      if (onFormChange) {
        onFormChange(value as Partial<GuestFormData>);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, onFormChange]);

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Thông tin khách mời
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Nhập thông tin để tạo thiệp mời
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Venue Selection */}
        <div>
          <label
            htmlFor="venue"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Địa điểm <span className="text-red-500">*</span>
          </label>
          <select
            id="venue"
            {...register('venue')}
            disabled={isSubmitting}
            className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <option value="hanoi">Hà Nội</option>
            <option value="hue">Huế</option>
          </select>
          {errors.venue && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              {errors.venue.message}
            </p>
          )}
        </div>

        {/* Guest Name */}
        <div>
          <Input
            id="name"
            label="Tên khách mời"
            placeholder="Ví dụ: Anh Nguyễn Văn A"
            required
            error={errors.name?.message}
            disabled={isSubmitting}
            labelClassName="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            {...register('name')}
          />
        </div>

        {/* Secondary Note */}
        <div>
          <label
            htmlFor="secondaryNote"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Ghi chú <span className="text-gray-400"></span>
          </label>
          <Input
            id="secondaryNote"
            type="text"
            placeholder="Ví dụ: cùng gia đình"
            disabled={isSubmitting}
            required
            className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            {...register('secondaryNote')}
          />
          {errors.secondaryNote && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              {errors.secondaryNote.message}
            </p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Hiển thị ở trang trong (tối đa 200 ký tự)
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Đang tạo...' : 'Tạo thiệp mời'}
        </Button>
      </form>

      {/* Help Text */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex gap-3">
          <svg
            className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="text-sm text-blue-800 dark:text-blue-300">
            <p className="font-medium mb-1">Lưu ý:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-400">
              <li>Tên và địa điểm là bắt buộc</li>
              <li>Ảnh thiệp cập nhật tự động khi bạn nhập</li>
              <li>Link thiệp mời sẽ được tạo sau khi gửi</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestForm;
