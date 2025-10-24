/**
 * RSVP Table Row
 *
 * Individual row component for RSVP table with expand/collapse functionality.
 * Displays RSVP summary and detailed information when expanded.
 *
 * @module pages/admin/_components/RSVPTableRow
 */

import type { RSVPRecord } from "../../../types/rsvp";
import {
  formatDateShort,
  getVenueName,
  getAttendanceStatus,
  getGuestDisplayName,
  formatDate,
} from "./rsvpTableUtils";

interface RSVPTableRowProps {
  rsvp: RSVPRecord;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const RSVPTableRow: React.FC<RSVPTableRowProps> = ({
  rsvp,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
}) => {
  const attendanceStatus = getAttendanceStatus(rsvp.willAttend);

  return (
    <div
      className="bg-base dark:bg-base border border-text-light/10 rounded-lg overflow-hidden
                 hover:bg-base-light/30 dark:hover:bg-accent-taupe-light transition-colors"
    >
      {/* Main Row */}
      <div
        className="grid grid-cols-7 gap-4 p-4 cursor-pointer items-center"
        onClick={onToggleExpand}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggleExpand();
          }
        }}
        aria-expanded={isExpanded}
      >
        {/* Guest Name */}
        <div className="text-sm text-text dark:text-text">
          {getGuestDisplayName(rsvp)}
        </div>

        {/* Response Name */}
        <div className="text-sm text-text dark:text-text font-medium">
          {rsvp.name}
        </div>

        {/* Guest Count */}
        <div className="text-sm text-text dark:text-text text-center">
          {rsvp.guestCount}
        </div>

        {/* Will Attend */}
        <div className={`text-sm font-medium ${attendanceStatus.className}`}>
          {attendanceStatus.text}
        </div>

        {/* Venue */}
        <div className="text-sm text-text dark:text-text">
          {getVenueName(rsvp.venue)}
        </div>

        {/* Date */}
        <div className="text-sm text-text-light">
          {formatDateShort(rsvp.createdAt)}
        </div>

        {/* Actions */}
        <div
          className="flex items-center justify-end gap-2"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.stopPropagation();
            }
          }}
          role="toolbar"
          aria-label="RSVP actions"
        >
          <button
            onClick={onEdit}
            className="px-3 py-1 text-xs font-medium text-accent-gold
                     border border-accent-gold rounded-md
                     hover:bg-accent-gold/10
                     transition-colors"
            aria-label="Sửa RSVP"
          >
            Sửa
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-1 text-xs font-medium text-red-600 dark:text-red-400
                     border border-red-600 dark:border-red-400 rounded-md
                     hover:bg-red-600/10
                     transition-colors"
            aria-label="Xóa RSVP"
          >
            Xóa
          </button>
          <button
            onClick={onToggleExpand}
            className={`ml-2 text-text-light transition-transform duration-200
                       ${isExpanded ? "rotate-180" : "rotate-0"}`}
            aria-label={isExpanded ? "Thu gọn" : "Mở rộng"}
          >
            ▼
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-text-light/10 p-4 bg-base-light/20 dark:bg-base-light/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Wishes/Message */}
            <div>
              <h4 className="text-sm font-medium text-text-light mb-2">
                Lời chúc:
              </h4>
              <p className="text-sm text-text dark:text-text whitespace-pre-wrap">
                {rsvp.wishes || "Không có lời chúc"}
              </p>
            </div>

            {/* Timestamps */}
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-text-light">
                  Ngày tạo:{" "}
                </span>
                <span className="text-sm text-text dark:text-text">
                  {formatDate(rsvp.createdAt)}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-text-light">
                  Cập nhật:{" "}
                </span>
                <span className="text-sm text-text dark:text-text">
                  {formatDate(rsvp.updatedAt)}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-text-light">
                  ID:{" "}
                </span>
                <span className="text-sm text-text-light font-mono">
                  {rsvp.id}
                </span>
              </div>
              {rsvp.guestId && (
                <div>
                  <span className="text-sm font-medium text-text-light">
                    Guest ID:{" "}
                  </span>
                  <span className="text-sm text-text-light font-mono">
                    {rsvp.guestId}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
