/**
 * Export Controls Component
 * 
 * Provides UI controls for exporting invitation canvas previews
 * with options for standard preview and high-resolution downloads.
 * 
 * @module pages/admin/_components/ExportControls
 */

import { useState } from 'react';
import { Download, Image as ImageIcon } from 'lucide-react';
import Button from '../../../components/ui/Button';

export interface ExportControlsProps {
  onExportPreview: (canvasType: 'front' | 'main') => Promise<void>;
  onExportHighRes: (canvasType: 'front' | 'main') => Promise<void>;
  disabled?: boolean;
}

/**
 * Export Controls Component
 * 
 * Provides download and high-resolution export buttons for invitation canvases
 * with progress feedback during export operations.
 */
export const ExportControls: React.FC<ExportControlsProps> = ({
  onExportPreview,
  onExportHighRes,
  disabled = false
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleExport = async (
    exportFn: () => Promise<void>,
    actionLabel: string
  ) => {
    setIsExporting(true);
    setExportStatus({ type: null, message: '' });

    try {
      await exportFn();
      setExportStatus({
        type: 'success',
        message: `${actionLabel} thành công!`
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setExportStatus({ type: null, message: '' });
      }, 3000);
    } catch (error) {
      console.error(`Export error:`, error);
      setExportStatus({
        type: 'error',
        message: `Lỗi khi ${actionLabel.toLowerCase()}: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        📥 Xuất Ảnh Thiệp
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Front Image (Name) Exports */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">
            Mặt Ngoài (Tên Khách)
          </h4>
          
          <Button
            onClick={() => handleExport(
              () => onExportPreview('front'),
              'Tải ảnh xem trước mặt ngoài'
            )}
            disabled={disabled || isExporting}
            variant="secondary"
            className="w-full"
          >
            <Download className="w-4 h-4 mr-2" />
            Tải Preview (800x600)
          </Button>

          <Button
            onClick={() => handleExport(
              () => onExportHighRes('front'),
              'Tạo ảnh chất lượng cao mặt ngoài'
            )}
            disabled={disabled || isExporting}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Tạo High-Res (1600x1200)
          </Button>
        </div>

        {/* Main Image (Secondary Note) Exports */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">
            Mặt Trong (Lời Nhắn)
          </h4>
          
          <Button
            onClick={() => handleExport(
              () => onExportPreview('main'),
              'Tải ảnh xem trước mặt trong'
            )}
            disabled={disabled || isExporting}
            variant="secondary"
            className="w-full"
          >
            <Download className="w-4 h-4 mr-2" />
            Tải Preview (800x600)
          </Button>

          <Button
            onClick={() => handleExport(
              () => onExportHighRes('main'),
              'Tạo ảnh chất lượng cao mặt trong'
            )}
            disabled={disabled || isExporting}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Tạo High-Res (1600x1200)
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isExporting && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-center">
          <p className="text-sm text-blue-800">
            ⏳ Đang xử lý... Vui lòng đợi
          </p>
        </div>
      )}

      {/* Success/Error Messages */}
      {exportStatus.type && (
        <div
          className={`mt-4 p-3 border rounded ${
            exportStatus.type === 'success'
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <p
            className={`text-sm ${
              exportStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}
          >
            {exportStatus.type === 'success' ? '✅' : '❌'} {exportStatus.message}
          </p>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
        <p className="text-xs text-blue-800">
          <strong>💡 Lưu ý:</strong> Preview (800x600) dùng để xem nhanh. 
          High-Res (1600x1200) cho chất lượng in ấn tốt nhất.
        </p>
      </div>
    </div>
  );
};

export default ExportControls;
