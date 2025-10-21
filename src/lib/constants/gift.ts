/**
 * Gift/Bank Transfer Constants
 *
 * Vietnamese language constants and configuration for the gift panel,
 * following the established RSVP pattern.
 *
 * @module lib/constants/gift
 */

import type { BankDetails } from "../utils/qr";

/**
 * Gift panel labels and text content
 */
export const GIFT_LABELS = {
  // Panel structure
  title: "Gửi quà cưới",
  description:
    "Cảm ơn tấm lòng của bạn! Bạn có thể gửi quà cưới qua  tài khoản của chúng mình.",

  // Bank details section
  bankDetailsTitle: "Thông tin chuyển khoản",
  qrCodeTitle: "Quét mã QR",

  // Bank detail fields
  bankName: "Ngân hàng",
  accountNumber: "Số tài khoản",
  accountName: "Tên tài khoản",
  branch: "Chi nhánh",
  swiftCode: "Mã SWIFT",

  // Action labels
  copy: "Sao chép",
  copyAll: "Sao chép tất cả",
  close: "Đóng",

  // Status messages
  copied: "Đã sao chép",
  copyFailed: "Sao chép thất bại",

  // Instructions
  instructions: 'Vui lòng ghi ghi chú "Mừng cưới N & Q" khi chuyển khoản.',
  thankYou: "Cảm ơn tấm lòng của bạn! ❤️",
} as const;

/**
 * Gift panel placeholders and help text
 */
export const GIFT_PLACEHOLDERS = {
  // Future use for dynamic content
  amount: "Số tiền (tùy chọn)",
  message: "Lời nhắn (tùy chọn)",
} as const;

/**
 * Gift panel help text
 */
export const GIFT_HELP_TEXT = {
  bankTransfer: "Chuyển khoản ngân hàng là cách an toàn và thuận tiện nhất",
  qrCode:
    "Quét mã QR bằng ứng dụng ngân hàng của bạn để chuyển khoản nhanh chóng",
  manualEntry: "Hoặc nhập thông tin tài khoản thủ công vào ứng dụng ngân hàng",
  reference:
    'Nhớ ghi chú "Mừng cưới N & Q" để chúng tôi biết đây là quà từ bạn',
} as const;

/**
 * Gift panel button texts
 */
export const GIFT_BUTTONS = {
  copy: "Sao chép",
  copyAll: "Sao chép tất cả",
  close: "Đóng",
  downloadQR: "Tải mã QR",
  bankApp: "Mở app ngân hàng",
} as const;

/**
 * Gift panel success and status messages
 */
export const GIFT_MESSAGES = {
  copySuccess: {
    bankName: "Tên ngân hàng đã được sao chép",
    accountNumber: "Số tài khoản đã được sao chép",
    accountName: "Tên tài khoản đã được sao chép",
    branch: "Chi nhánh đã được sao chép",
    swiftCode: "Mã SWIFT đã được sao chép",
    allDetails: "Thông tin tài khoản đã được sao chép",
  },
  copyError: {
    general: "Không thể sao chép. Vui lòng thử lại.",
    notSupported: "Trình duyệt không hỗ trợ sao chép tự động.",
    networkError: "Lỗi mạng. Vui lòng thử lại.",
  },
  qrError: {
    loadFailed:
      "Không thể tải mã QR. Vui lòng sử dụng thông tin tài khoản bên dưới.",
    generateFailed: "Không thể tạo mã QR. Vui lòng nhập thông tin thủ công.",
  },
} as const;

/**
 * Bank account details configuration
 * Note: This should only contain public, non-sensitive information
 */
export const BANK_DETAILS: BankDetails = {
  bankName: "Ngân hàng TMCP Việt Nam Thịnh Vượng (VPBank)",
  accountNumber: "0962444357",
  accountName: "NGUYEN HOANG QUAN",
  branch: "Hà Nội",
  swiftCode: "BFTVVNVX",
  qrCodeImageUrl: "/qr-code.png",
};

export const BANK_DETAILS_LIST: BankDetails[] = [
  {
    bankName: "Ngân hàng TMCP Việt Nam Thịnh Vượng (VPBank)",
    accountNumber: "0962444357",
    accountName: "NGUYEN HOANG QUAN",
    branch: "Hà Nội",
    swiftCode: "BFTVVNVX",
    qrCodeImageUrl: "/qr-code.png",
  },
  {
    bankName: "Ngân hàng TMCP Công Thương Việt Nam (VietinBank)",
    accountNumber: "105873420390",
    branch: "CN DONG HA NOI - PGD YEN THINH",
    swiftCode: "ICBVVNVX",
    accountName: "DINH THI KIM NGOC",
    qrCodeImageUrl: "/qr-ngoc.jpeg"
  }
];

/**
 * QR code configuration
 */
export const QR_CONFIG = {
  // Static QR code path (for pre-generated QR)
  staticQRPath: "/assets/qr/bank-transfer-qr.png",

  // Dynamic QR generation options
  options: {
    width: 256,
    margin: 2,
    color: {
      dark: "#1F2937", // Design system dark color
      light: "#FFFFFF",
    },
    errorCorrectionLevel: "M" as const,
  },

  // QR code alt text for accessibility
  altText: "Mã QR chuyển khoản ngân hàng cho quà cưới N & Q",

  // Reference message for bank transfer
  transferReference: "Mừng cưới N & Q",
} as const;

/**
 * Copy operation configuration
 */
export const COPY_CONFIG = {
  // Auto-reset copy status after this duration (ms)
  resetDelay: 3000,

  // Copy button icon states
  icons: {
    idle: "copy",
    copying: "loader-2",
    success: "check",
    error: "alert-circle",
  },
} as const;

/**
 * Accessibility configuration
 */
export const GIFT_A11Y = {
  // ARIA labels
  panelLabel: "Bảng thông tin gửi quà cưới",
  bankDetailsRegion: "Thông tin chuyển khoản ngân hàng",
  qrCodeRegion: "Mã QR chuyển khoản",
  copyButtonLabel: (field: string) => `Sao chép ${field}`,

  // Screen reader announcements
  panelOpened: "Đã mở bảng thông tin gửi quà cưới",
  panelClosed: "Đã đóng bảng thông tin gửi quà cưới",

  // Live region for copy status
  liveRegionLabel: "Trạng thái sao chép",
} as const;

/**
 * Validation rules for bank details
 */
export const BANK_VALIDATION = {
  accountNumber: {
    minLength: 8,
    maxLength: 20,
    pattern: /^[0-9]+$/,
  },
  accountName: {
    minLength: 2,
    maxLength: 100,
    pattern: /^[A-ZÀ-Ỹ\s]+$/,
  },
  swiftCode: {
    length: 8,
    pattern: /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}$/,
  },
} as const;
