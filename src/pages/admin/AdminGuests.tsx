/**
 * Admin Guests Page
 *
 * Main admin interface for creating guests with live invitation preview.
 * Combines form, canvas preview, and success feedback components.
 *
 * @module pages/admin/AdminGuests
 */

import React, { useState, useRef } from "react";
import axios from 'axios';
import { GuestForm } from "./_components/GuestForm";
import {
  InvitationPreview,
  type InvitationPreviewHandle,
} from "./_components/InvitationPreview";
import { SuccessMessage } from "./_components/SuccessMessage";
import { Modal } from "../../components/ui/Modal";
import {
  TextPositionControls,
  type TextPositionSettings,
} from "./_components/TextPositionControls";
import { CANVAS_CONFIG } from "./_components/canvasConfig";
import type {
  GuestFormData,
  GuestRecord,
  CreateGuestResponse,
} from "../../types/admin";

// Get API base URL from environment
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

/**
 * Admin Guests Page Component
 *
 * Provides interface for creating guests with real-time preview
 * and form validation.
 */
const AdminGuests: React.FC = () => {
  // Ref to access export methods from InvitationPreview
  const previewRef = useRef<InvitationPreviewHandle>(null);

  // Form state for live preview
  const [previewData, setPreviewData] = useState<Partial<GuestFormData>>({
    name: "",
    venue: "hue",
    secondaryNote: "",
  });

  // Text position settings
  const [positionSettings, setPositionSettings] =
    useState<TextPositionSettings>(() => {
      const venue = "hue"; // Default venue
      const config = CANVAS_CONFIG[venue];
      return {
        nameX: config.frontImage.namePosition.x,
        nameY: config.frontImage.namePosition.y,
        secondaryNoteX: config.mainImage.secondaryNotePosition.x,
        secondaryNoteY: config.mainImage.secondaryNotePosition.y,
        textColor: config.frontImage.namePosition.color,
      };
    });

  // Update position settings when venue changes
  React.useEffect(() => {
    const venue = previewData.venue || "hue";
    const config = CANVAS_CONFIG[venue];
    setPositionSettings({
      nameX: config.frontImage.namePosition.x,
      nameY: config.frontImage.namePosition.y,
      secondaryNoteX: config.mainImage.secondaryNotePosition.x,
      secondaryNoteY: config.mainImage.secondaryNotePosition.y,
      textColor: config.frontImage.namePosition.color,
    });
  }, [previewData.venue]);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdGuest, setCreatedGuest] = useState<GuestRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle form submission - create guest via API with image upload
   * Uses current canvas preview as image source (not export methods)
   */
  const handleSubmit = async (data: GuestFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Step 1: Get canvas blobs from current preview
      let frontBlob: Blob | null = null;
      let mainBlob: Blob | null = null;

      if (previewRef.current) {
        try {
          // Use exportPreview to capture current canvas state
          frontBlob = await previewRef.current.exportPreview("front");
          mainBlob = await previewRef.current.exportPreview("main");
          console.log("✅ Canvas blobs generated:", {
            front: frontBlob
              ? `${(frontBlob.size / 1024).toFixed(2)}KB`
              : "null",
            main: mainBlob ? `${(mainBlob.size / 1024).toFixed(2)}KB` : "null",
          });
        } catch (error) {
          console.warn("⚠️ Failed to generate canvas blobs:", error);
          // Continue without images (graceful degradation)
        }
      }

      // Step 2: Build FormData with guest data and optional images
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("venue", data.venue);
      if (data.secondaryNote) {
        formData.append("secondaryNote", data.secondaryNote);
      }

      // Attach canvas blobs if available
      if (frontBlob) {
        formData.append(
          "invitationImageFront",
          frontBlob,
          `${data.name}-front.png`
        );
      }
      if (mainBlob) {
        formData.append(
          "invitationImageMain",
          mainBlob,
          `${data.name}-main.png`
        );
      }

      // Step 3: Submit FormData to API using axios (replaced fetch for mobile compatibility)
      console.log('🔍 [AdminGuests] Submitting guest data...');
      let result: CreateGuestResponse | undefined;
      try {
        const axiosResponse = await axios.post(
          `${API_BASE_URL}/api/guests`,
          formData,
          {
            headers: {
              // Let browser set Content-Type for FormData
            },
            timeout: 15000 // 15s timeout for mobile reliability
          }
        );
        result = axiosResponse.data;
        console.log('✅ [AdminGuests] API response:', result);
      } catch (axiosErr: any) {
        if (axiosErr.response) {
          // Server responded with error
          console.error('❌ [AdminGuests] API error response:', axiosErr.response.data);
          throw new Error(axiosErr.response.data.error || 'Không thể tạo thiệp cho khách mời');
        } else if (axiosErr.request) {
          // No response received
          console.error('❌ [AdminGuests] No response from API:', axiosErr.request);
          throw new Error('Không nhận được phản hồi từ máy chủ. Vui lòng thử lại.');
        } else {
          // Other error
          console.error('❌ [AdminGuests] Request error:', axiosErr.message);
          throw new Error('Có lỗi xảy ra khi gửi yêu cầu.');
        }
      }

      if (result && result.success && result.data) {
        setCreatedGuest(result.data);
        setError(null);

        // Show warnings if image upload failed
        if (
          "warnings" in result &&
          Array.isArray(result.warnings) &&
          result.warnings.length > 0
        ) {
          console.warn("⚠️ Image upload warnings:", result.warnings);
        }
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("Failed to create guest:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Có lỗi xảy ra khi tạo khách mời. Vui lòng thử lại."
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
      name: "",
      venue: "hue",
      secondaryNote: "",
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

        {/* Success Modal */}
        <Modal
          isOpen={!!createdGuest}
          onClose={handleCreateAnother}
          size="lg"
        >
          {createdGuest && (
            <div className="p-6">
              <SuccessMessage
                guest={createdGuest}
                onCreateAnother={handleCreateAnother}
              />
            </div>
          )}
        </Modal>

        {/* Form & Preview State */}
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
            {/* Position Controls */}
            <TextPositionControls
              settings={positionSettings}
              onSettingsChange={setPositionSettings}
              venue={previewData.venue || "hue"}
            />
          </div>

          {/* Preview Section (Right - 3 columns) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Canvas Preview */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
              <InvitationPreview
                ref={previewRef}
                venue={previewData.venue || "hue"}
                guestName={previewData.name || ""}
                secondaryNote={previewData.secondaryNote}
                positionOverrides={positionSettings}
              />
            </div>
          </div>
        </div>
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
