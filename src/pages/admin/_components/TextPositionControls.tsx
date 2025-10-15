/**
 * Text Position Controls Component
 * 
 * Provides UI controls for adjusting text positioning and color
 * on invitation canvas previews in a collapsible advanced settings panel.
 * 
 * @module pages/admin/_components/TextPositionControls
 */

import React, { useState } from 'react';

export interface TextPositionSettings {
  nameX: number;
  nameY: number;
  secondaryNoteX: number;
  secondaryNoteY: number;
  textColor: string;
}

export interface TextPositionControlsProps {
  settings: TextPositionSettings;
  onSettingsChange: (settings: TextPositionSettings) => void;
  venue: 'hue' | 'hanoi';
}

/**
 * Text Position Controls Component
 * 
 * Collapsible panel with sliders for horizontal text positioning and color picker
 * for both name and secondary note text. Updates preview in real-time.
 */
export const TextPositionControls: React.FC<TextPositionControlsProps> = ({
  settings,
  onSettingsChange,
  venue
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleNameXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({
      ...settings,
      nameX: parseInt(e.target.value, 10)
    });
  };

  const handleNameYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({
      ...settings,
      nameY: parseInt(e.target.value, 10)
    });
  };

  const handleSecondaryNoteXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({
      ...settings,
      secondaryNoteX: parseInt(e.target.value, 10)
    });
  };

  const handleSecondaryNoteYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({
      ...settings,
      secondaryNoteY: parseInt(e.target.value, 10)
    });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({
      ...settings,
      textColor: e.target.value
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
      >
        <div className="flex items-center gap-3">
          <svg
            className="w-5 h-5 text-blue-600 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Cài đặt nâng cao
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Điều chỉnh vị trí và màu sắc văn bản
            </p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 space-y-6">
          {/* Help Text */}
          {/* <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-xs text-blue-800 dark:text-blue-300">
              <strong>Mẹo:</strong> Thay đổi sẽ cập nhật ngay lập tức trên preview bên phải
            </p>
          </div> */}

          {/* Name Position Controls */}
          <div className="space-y-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              📝 Vị trí tên khách mời (Mặt ngoài)
            </h4>
            
            {/* Name X Position Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="nameX"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Vị trí ngang (X)
                </label>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {settings.nameX}px
                </span>
              </div>
              <input
                id="nameX"
                type="range"
                min="0"
                max="2000"
                step="10"
                value={settings.nameX}
                onChange={handleNameXChange}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Name Y Position Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="nameY"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Vị trí dọc (Y)
                </label>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {settings.nameY}px
                </span>
              </div>
              <input
                id="nameY"
                type="range"
                min="0"
                max="1200"
                step="10"
                value={settings.nameY}
                onChange={handleNameYChange}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>

          {/* Secondary Note Position Controls */}
          <div className="space-y-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              💬 Vị trí ghi chú (Mặt trong)
            </h4>
            
            {/* Secondary Note X Position Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="secondaryNoteX"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Vị trí ngang (X)
                </label>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {settings.secondaryNoteX}px
                </span>
              </div>
              <input
                id="secondaryNoteX"
                type="range"
                min="0"
                max="2000"
                step="10"
                value={settings.secondaryNoteX}
                onChange={handleSecondaryNoteXChange}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Secondary Note Y Position Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="secondaryNoteY"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Vị trí dọc (Y)
                </label>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {settings.secondaryNoteY}px
                </span>
              </div>
              <input
                id="secondaryNoteY"
                type="range"
                min="0"
                max="1200"
                step="10"
                value={settings.secondaryNoteY}
                onChange={handleSecondaryNoteYChange}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>

          {/* Color Picker */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label
                htmlFor="textColor"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Màu văn bản
              </label>
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded border-2 border-gray-300 dark:border-gray-600 shadow-sm"
                  style={{ backgroundColor: settings.textColor }}
                />
                <span className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {settings.textColor}
                </span>
              </div>
            </div>
            <input
              id="textColor"
              type="color"
              value={settings.textColor}
              onChange={handleColorChange}
              className="w-full h-10 bg-transparent cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Màu này áp dụng cho cả tên và ghi chú
            </p>
          </div>

          {/* Venue Info */}
          <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              📍 Đang điều chỉnh cho địa điểm: <span className="font-semibold text-gray-800 dark:text-gray-200">{venue === 'hue' ? 'Huế' : 'Hà Nội'}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextPositionControls;
