/**
 * Success Message Component
 * 
 * Displays success feedback after guest creation with invitation details.
 * 
 * @module pages/admin/_components/SuccessMessage
 */

import React from 'react';
import type { GuestRecord } from '../../../types/admin';
import { Button } from '../../../components/ui/Button';

export interface SuccessMessageProps {
  guest: GuestRecord;
  onCreateAnother: () => void;
}

/**
 * Success Message Component
 * 
 * Shows created guest details and invitation URL with actions.
 */
export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  guest,
  onCreateAnother
}) => {
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(guest.invitationUrl);
      alert('Đã copy link thiệp mời!');
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Không thể copy link');
    }
  };

  const handleOpenInvitation = () => {
    window.open(guest.invitationUrl, '_blank');
  };

  return (
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
      {/* Success Icon & Title */}
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0">
          <svg
            className="w-6 h-6 text-green-600 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">
            Tạo Link khách mời thành công!
          </h3>
          <p className="text-sm text-green-700 dark:text-green-400 mt-1">
            Thiệp mời đã được tạo và sẵn sàng gửi đến khách
          </p>
        </div>
      </div>

      {/* Guest Details */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 space-y-3">
        <div>
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Tên khách mời
          </div>
          <p className="text-base font-medium text-gray-900 dark:text-white mt-1">
            {guest.name}
          </p>
        </div>

        <div>
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Địa điểm
          </div>
          <p className="text-base text-gray-900 dark:text-white mt-1">
            {guest.venue === 'hue' ? 'Huế' : 'Hà Nội'}
          </p>
        </div>

        {guest.secondaryNote && (
          <div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Ghi chú
            </div>
            <p className="text-base text-gray-900 dark:text-white mt-1">
              {guest.secondaryNote}
            </p>
          </div>
        )}

        <div>
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Link thiệp mời
          </div>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="text"
              readOnly
              value={guest.invitationUrl}
              className="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white font-mono"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyUrl}
              aria-label="Copy invitation URL"
            >
              Copy
            </Button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="primary"
          fullWidth
          onClick={onCreateAnother}
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          Tạo khách mời khác
        </Button>
        <Button
          variant="outline"
          fullWidth
          onClick={handleOpenInvitation}
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          }
        >
          Xem thiệp mời
        </Button>
      </div>
    </div>
  );
};

export default SuccessMessage;
