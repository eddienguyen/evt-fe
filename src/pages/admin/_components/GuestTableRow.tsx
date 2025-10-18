/**
 * Guest Table Row
 * 
 * Individual row component for guest table with expand/collapse functionality.
 * Displays guest summary and detailed information when expanded.
 * 
 * @module pages/admin/_components/GuestTableRow
 */

import type { GuestRecord } from '../../../types/admin';
import {
  formatDateShort,
  getVenueName,
  getVenueBadgeColor,
  formatDate,
  getGuestInitials,
  hasInvitationImages,
} from './guestTableUtils';

interface GuestTableRowProps {
  guest: GuestRecord;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const GuestTableRow: React.FC<GuestTableRowProps> = ({
  guest,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
}) => {
  const venueBadgeColor = getVenueBadgeColor(guest.venue);
  const initials = getGuestInitials(guest.name);
  const hasImages = hasInvitationImages(guest);

  return (
    <>
      {/* Desktop Row */}
      <div className="hidden md:block bg-base dark:bg-base border border-text-light/10 rounded-lg overflow-hidden
                   hover:bg-base-light/30 dark:hover:bg-base-light/10 transition-colors">
        {/* Main Row */}
        <div
          className="grid grid-cols-6 gap-4 p-4 cursor-pointer items-center"
          onClick={onToggleExpand}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onToggleExpand();
            }
          }}
          aria-expanded={isExpanded}
        >
          {/* Guest Name with Avatar */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent-gold/20 text-accent-gold flex items-center justify-center text-xs font-semibold">
              {initials}
            </div>
            <span className="text-sm text-text dark:text-text font-medium">
              {guest.name}
            </span>
          </div>

          {/* Venue */}
          <div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${venueBadgeColor}`}>
              {getVenueName(guest.venue)}
            </span>
          </div>

          {/* Secondary Note */}
          <div className="text-sm text-text-light truncate">
            {guest.secondaryNote || '—'}
          </div>

          {/* Invitation Status */}
          <div className="text-sm">
            {hasImages ? (
              <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Có thiệp
              </span>
            ) : (
              <span className="text-text-light">Chưa có thiệp</span>
            )}
          </div>

          {/* Created Date */}
          <div className="text-sm text-text-light">
            {formatDateShort(guest.createdAt)}
          </div>

          {/* Actions */}
          <div
            className="flex items-center justify-end gap-2"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation();
              }
            }}
            role="toolbar"
            aria-label="Guest actions"
          >
            <button
              onClick={onEdit}
              className="px-3 py-1 text-xs font-medium text-accent-gold
                       border border-accent-gold rounded-md
                       hover:bg-accent-gold/10
                       transition-colors"
              aria-label="Sửa khách"
            >
              Sửa
            </button>
            <button
              onClick={onDelete}
              className="px-3 py-1 text-xs font-medium text-red-600 dark:text-red-400
                       border border-red-600 dark:border-red-400 rounded-md
                       hover:bg-red-600/10
                       transition-colors"
              aria-label="Xóa khách"
            >
              Xóa
            </button>
            <button
              className={`ml-2 text-text-light transition-transform duration-200
                         ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
              aria-label={isExpanded ? 'Thu gọn' : 'Mở rộng'}
            >
              ▼
            </button>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="border-t border-text-light/10 p-4 bg-base-light/20 dark:bg-base-light/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-text-light mb-1">Ghi chú phụ:</h4>
                  <p className="text-sm text-text dark:text-text">
                    {guest.secondaryNote || 'Không có ghi chú'}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-text-light mb-1">Link thiệp:</h4>
                  <a
                    href={guest.invitationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-accent-gold hover:underline break-all"
                  >
                    {guest.invitationUrl}
                  </a>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-text-light mb-2">Hình ảnh thiệp:</h4>
                  {hasImages ? (
                    <div className="flex gap-2">
                      {guest.invitationImageFrontUrl && (
                        <a
                          href={guest.invitationImageFrontUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Mặt trước
                        </a>
                      )}
                      {guest.invitationImageMainUrl && (
                        <a
                          href={guest.invitationImageMainUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Mặt chính
                        </a>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-text-light">Chưa có hình ảnh</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-text-light">Ngày tạo: </span>
                    <span className="text-sm text-text dark:text-text">
                      {formatDate(guest.createdAt)}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-text-light">Cập nhật: </span>
                    <span className="text-sm text-text dark:text-text">
                      {formatDate(guest.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Card */}
      <div className="md:hidden bg-base dark:bg-base border border-text-light/10 rounded-lg p-4">
        {/* Card Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent-gold/20 text-accent-gold flex items-center justify-center text-sm font-semibold">
              {initials}
            </div>
            <div>
              <h3 className="text-base font-medium text-text dark:text-text">
                {guest.name}
              </h3>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${venueBadgeColor} mt-1`}>
                {getVenueName(guest.venue)}
              </span>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="space-y-2 mb-4">
          {guest.secondaryNote && (
            <div className="text-sm text-text-light">
              <span className="font-medium">Ghi chú: </span>
              {guest.secondaryNote}
            </div>
          )}
          
          <div className="text-sm text-text-light">
            <span className="font-medium">Trạng thái: </span>
            {hasImages ? (
              <span className="text-green-600 dark:text-green-400">Có thiệp</span>
            ) : (
              <span>Chưa có thiệp</span>
            )}
          </div>

          <div className="text-sm text-text-light">
            <span className="font-medium">Ngày tạo: </span>
            {formatDateShort(guest.createdAt)}
          </div>
        </div>

        {/* Card Actions */}
        <div className="flex gap-2 pt-3 border-t border-text-light/10">
          <button
            onClick={() => {
              onToggleExpand();
            }}
            className="flex-1 px-3 py-2 text-sm font-medium text-text-light
                     border border-text-light/20 rounded-md
                     hover:bg-base-light/30
                     transition-colors"
          >
            {isExpanded ? 'Thu gọn' : 'Chi tiết'}
          </button>
          <button
            onClick={onEdit}
            className="flex-1 px-3 py-2 text-sm font-medium text-accent-gold
                     border border-accent-gold rounded-md
                     hover:bg-accent-gold/10
                     transition-colors"
          >
            Sửa
          </button>
          <button
            onClick={onDelete}
            className="flex-1 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400
                     border border-red-600 dark:border-red-400 rounded-md
                     hover:bg-red-600/10
                     transition-colors"
          >
            Xóa
          </button>
        </div>

        {/* Expanded Content (Mobile) */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-text-light/10 space-y-3">
            <div>
              <h4 className="text-sm font-medium text-text-light mb-1">Link thiệp:</h4>
              <a
                href={guest.invitationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent-gold hover:underline break-all"
              >
                {guest.invitationUrl}
              </a>
            </div>

            {hasImages && (
              <div>
                <h4 className="text-sm font-medium text-text-light mb-2">Hình ảnh:</h4>
                <div className="flex gap-2">
                  {guest.invitationImageFrontUrl && (
                    <a
                      href={guest.invitationImageFrontUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Mặt trước
                    </a>
                  )}
                  {guest.invitationImageMainUrl && (
                    <a
                      href={guest.invitationImageMainUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Mặt chính
                    </a>
                  )}
                </div>
              </div>
            )}

            <div>
              <span className="text-sm font-medium text-text-light">Cập nhật: </span>
              <span className="text-sm text-text dark:text-text">
                {formatDate(guest.updatedAt)}
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
