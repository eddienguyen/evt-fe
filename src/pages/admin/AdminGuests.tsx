/**
 * Admin Guests Page
 * 
 * Main admin interface for creating guests with live invitation preview.
 * Combines form, canvas preview, and success feedback components.
 * 
 * @module pages/admin/AdminGuests
 */

import React, { useState } from 'react';
import { GuestForm } from './_components/GuestForm';
import { InvitationPreview } from './_components/InvitationPreview';
import { SuccessMessage } from './_components/SuccessMessage';
import type { GuestFormData, GuestRecord, CreateGuestResponse } from '../../types/admin';

// Get API base URL from environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

/**
 * Admin Guests Page Component
 * 
 * Provides interface for creating guests with real-time preview
 * and form validation.
 */
const AdminGuests: React.FC = () => {
  // Form state for live preview
  const [previewData, setPreviewData] = useState<Partial<GuestFormData>>({
    name: '',
    venue: 'hue',
    secondaryNote: ''
  });

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdGuest, setCreatedGuest] = useState<GuestRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle form submission - create guest via API
   */
  const handleSubmit = async (data: GuestFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/guests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Không thể tạo thiệp cho khách mời');
      }

      const result: CreateGuestResponse = await response.json();
      
      if (result.success && result.data) {
        setCreatedGuest(result.data);
        setError(null);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Failed to create guest:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'Có lỗi xảy ra khi tạo khách mời. Vui lòng thử lại.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle form value changes for live preview
   */
  const handleFormChange = (data: Partial<GuestFormData>) => {
    setPreviewData(data);
  };

  /**
   * Reset form to create another guest
   */
  const handleCreateAnother = () => {
    setCreatedGuest(null);
    setError(null);
    setPreviewData({
      name: '',
      venue: 'hue',
      secondaryNote: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-playfair font-bold text-gray-900 dark:text-white">
                Tạo Thiệp mời
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Quản lý thiệp mời cá nhân hóa cho từng khách
              </p>
            </div>
            <a
              href="/"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              ← Về trang chính
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex gap-3">
              <svg
                className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                  Có lỗi xảy ra
                </h3>
                <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success State */}
        {createdGuest && (
          <SuccessMessage
            guest={createdGuest}
            onCreateAnother={handleCreateAnother}
          />
        )}

        {/* Form & Preview State */}
        {!createdGuest && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Form Section (Left - 2 columns) */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                <GuestForm
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  onFormChange={handleFormChange}
                />
              </div>
            </div>

            {/* Preview Section (Right - 3 columns) */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                <InvitationPreview
                  venue={previewData.venue || 'hue'}
                  guestName={previewData.name || ''}
                  secondaryNote={previewData.secondaryNote}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 dark:border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Wedding Invitation Management System
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AdminGuests;
