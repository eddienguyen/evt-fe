/**
 * Admin RSVPs Page
 * 
 * Main page for RSVP management.
 * Displays RSVPs in a table with search, filters, sorting, and pagination.
 * 
 * @module pages/admin/AdminRSVPs
 */

import { useRSVPManagement } from './_components/useRSVPManagement';
import { RSVPFilters } from './_components/RSVPFilters';
import { RSVPTable } from './_components/RSVPTable';
import { RSVPTableSkeleton } from './_components/RSVPTableSkeleton';
import { RSVPEditModal } from './_components/RSVPEditModal';
import { RSVPDeleteDialog } from './_components/RSVPDeleteDialog';
import { getPaginationInfo } from './_components/rsvpTableUtils';

const AdminRSVPs: React.FC = () => {
  const {
    // Data
    rsvps,
    isLoading,
    error,
    
    // Pagination
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    hasNext,
    hasPrevious,
    
    // Filters
    searchQuery,
    venueFilter,
    attendanceFilter,
    
    // UI States
    expandedRows,
    selectedRSVP,
    isEditModalOpen,
    isDeleteDialogOpen,
    
    // Sort
    sortField,
    sortDirection,
    
    // Actions
    refreshData,
    updateRSVP,
    deleteRSVP,
    setSearchQuery,
    setVenueFilter,
    setAttendanceFilter,
    clearFilters,
    toggleRowExpansion,
    openEditModal,
    closeEditModal,
    openDeleteDialog,
    closeDeleteDialog,
    goToPage,
    setItemsPerPage,
    setSortField,
  } = useRSVPManagement();

  const paginationInfo = getPaginationInfo(currentPage, itemsPerPage, totalItems);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text dark:text-text">
            Quản lý đơn tham dự
          </h1>
          <p className="text-sm text-text-light mt-1">
            {paginationInfo.showing}
          </p>
        </div>
        
        <button
          onClick={refreshData}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-accent-gold
                   border border-accent-gold rounded-lg
                   hover:bg-accent-gold/10
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors"
        >
          {isLoading ? 'Đang tải...' : 'Làm mới'}
        </button>
      </div>

      {/* Filters */}
      <RSVPFilters
        searchQuery={searchQuery}
        venueFilter={venueFilter}
        attendanceFilter={attendanceFilter}
        onSearchChange={setSearchQuery}
        onVenueChange={setVenueFilter}
        onAttendanceChange={setAttendanceFilter}
        onClearFilters={clearFilters}
        isLoading={isLoading}
      />

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg">
          <p className="text-sm text-red-500">{error}</p>
          <button
            onClick={refreshData}
            className="mt-2 text-sm text-red-500 underline hover:no-underline"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <RSVPTableSkeleton rows={itemsPerPage} />
      ) : (
        <RSVPTable
          rsvps={rsvps}
          expandedRows={expandedRows}
          sortField={sortField}
          sortDirection={sortDirection}
          onToggleExpand={toggleRowExpansion}
          onSort={setSortField}
          onEdit={openEditModal}
          onDelete={openDeleteDialog}
          isLoading={isLoading}
        />
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          {/* Page Size Selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="page-size" className="text-sm text-text-light">
              Hiển thị:
            </label>
            <select
              id="page-size"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number.parseInt(e.target.value, 10))}
              className="px-3 py-1 border border-text-light/20 rounded-lg
                       bg-base dark:bg-base text-text dark:text-text text-sm
                       focus:outline-none focus:ring-2 focus:ring-accent-gold"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            <span className="text-sm text-text-light">mục/trang</span>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(1)}
              disabled={!hasPrevious}
              className="px-3 py-1 text-sm font-medium text-text-light
                       border border-text-light/20 rounded-lg
                       hover:bg-base-light/20
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors"
            >
              ‹‹
            </button>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={!hasPrevious}
              className="px-3 py-1 text-sm font-medium text-text-light
                       border border-text-light/20 rounded-lg
                       hover:bg-base-light/20
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors"
            >
              ‹ Trước
            </button>
            
            <span className="px-4 py-1 text-sm text-text dark:text-text">
              Trang {currentPage} / {totalPages}
            </span>
            
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={!hasNext}
              className="px-3 py-1 text-sm font-medium text-text-light
                       border border-text-light/20 rounded-lg
                       hover:bg-base-light/20
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors"
            >
              Sau ›
            </button>
            <button
              onClick={() => goToPage(totalPages)}
              disabled={!hasNext}
              className="px-3 py-1 text-sm font-medium text-text-light
                       border border-text-light/20 rounded-lg
                       hover:bg-base-light/20
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors"
            >
              ››
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {selectedRSVP && (
        <RSVPEditModal
          rsvp={selectedRSVP}
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onSave={updateRSVP}
        />
      )}

      {/* Delete Dialog */}
      {selectedRSVP && (
        <RSVPDeleteDialog
          rsvp={selectedRSVP}
          isOpen={isDeleteDialogOpen}
          onClose={closeDeleteDialog}
          onConfirm={deleteRSVP}
        />
      )}
    </div>
  );
};

export default AdminRSVPs;
