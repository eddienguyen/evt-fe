import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Plus } from 'lucide-react';
import { useGuestManagement } from './_components/useGuestManagement';
import { GuestFilters } from './_components/GuestFilters';
import { GuestTable } from './_components/GuestTable';
import { GuestTableSkeleton } from './_components/GuestTableSkeleton';
import { GuestEditModal } from './_components/GuestEditModal';
import { GuestDeleteDialog } from './_components/GuestDeleteDialog';

/**
 * AdminGuests - Main guest management page with table view
 * 
 * Features:
 * - Guest list with pagination
 * - Search by name
 * - Filter by venue
 * - Sort by name, venue, created date
 * - Edit guest information
 * - Delete guest with RSVP warning
 * - Responsive desktop/mobile layout
 * 
 * Navigation:
 * - Guest creation is separate at /admin/guests/new
 */
const AdminGuests: React.FC = () => {
  const {
    // Data
    guests,
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
    
    // Sort
    sortField,
    sortDirection,
    
    // UI States
    expandedRows,
    selectedGuest,
    isEditModalOpen,
    isDeleteDialogOpen,
    deleteWarning,
    
    // Actions
    refreshData,
    updateGuest,
    deleteGuest,
    setSearchQuery,
    setVenueFilter,
    clearFilters,
    toggleRowExpansion,
    openEditModal,
    closeEditModal,
    openDeleteDialog,
    closeDeleteDialog,
    goToPage,
    setItemsPerPage,
    setSortField,
  } = useGuestManagement();

  // Handle edit save
  const handleEditSave = async (id: string, data: {
    name?: string;
    venue?: 'hue' | 'hanoi';
    secondaryNote?: string;
  }) => {
    const result = await updateGuest(id, data);
    if (result.success) {
      closeEditModal();
    }
    return result;
  };

  // Handle delete confirm
  const handleDeleteConfirm = async (id: string) => {
    const result = await deleteGuest(id);
    if (result.success) {
      closeDeleteDialog();
    }
    return result;
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    goToPage(newPage);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý khách mời</h1>
            <p className="text-sm text-gray-600 mt-1">
              {totalItems > 0 ? `${totalItems} khách mời` : 'Chưa có khách mời'}
            </p>
          </div>
        </div>
        
        <Link
          to="/admin/guests/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text- rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="h-5 w-5" />
          Tạo thiệp mời
        </Link>
      </div>

      {/* Filters */}
      <GuestFilters
        searchQuery={searchQuery}
        venueFilter={venueFilter}
        onSearchChange={setSearchQuery}
        onVenueChange={setVenueFilter}
        onClearFilters={clearFilters}
        isLoading={isLoading}
      />

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-red-600 mt-0.5">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-red-800">Error loading guests</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button
                onClick={refreshData}
                className="mt-2 text-sm font-medium text-red-800 hover:text-red-900 underline"
              >
                Xin thử lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && <GuestTableSkeleton />}

      {/* Table */}
      {!isLoading && !error && (
        <GuestTable
          guests={guests}
          expandedRows={expandedRows}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={setSortField}
          onEdit={openEditModal}
          onDelete={openDeleteDialog}
          onToggleExpand={toggleRowExpansion}
        />
      )}

      {/* Pagination */}
      {!isLoading && !error && Array.isArray(guests) && guests.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Items per page */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show</span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-600">per page</span>
            </div>

            {/* Page info */}
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
              {totalItems > 0 && (
                <span className="ml-2">
                  ({((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems})
                </span>
              )}
            </div>

            {/* Page navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(1)}
                disabled={!hasPrevious}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="First page"
              >
                First
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!hasPrevious}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Previous page"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasNext}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Next page"
              >
                Next
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={!hasNext}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Last page"
              >
                Last
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {selectedGuest && (
        <GuestEditModal
          guest={selectedGuest}
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onSave={handleEditSave}
        />
      )}

      {/* Delete Dialog */}
      {selectedGuest && (
        <GuestDeleteDialog
          guest={selectedGuest}
          isOpen={isDeleteDialogOpen}
          rsvpWarning={deleteWarning}
          onClose={closeDeleteDialog}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};

export default AdminGuests;
