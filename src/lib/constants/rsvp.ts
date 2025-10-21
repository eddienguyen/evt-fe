/**
 * RSVP Vietnamese Localization Constants
 * 
 * Vietnamese text content for the RSVP form including labels,
 * placeholders, help text, and messages.
 * 
 * @module lib/constants/rsvp
 */

/**
 * Form field labels and content
 */
export const RSVP_LABELS = {
  // Form title and description
  title: 'Xác nhận tham dự',
  description: 'Vui lòng điền thông tin để xác nhận tham dự đám cưới của Ngọc & Quân',
  
  // Form fields
  name: 'Tên của tôi',
  guestCount: 'Tôi sẽ đi tổng cộng',
  willAttend: 'Xác nhận tham dự',
  venue: 'Địa điểm',
  wishes: 'Tôi muốn chúc cô dâu chú rể: ',
  
  // Attendance options
  attendingYes: 'Có, tôi sẽ tham dự',
  attendingNo: 'Xin lỗi, tôi không thể tham dự',
  
  // Venue options
  venueHue: 'Huế - 01/11/2025',
  venueHanoi: 'Hà Nội - 08/11/2025',
  
  // Required field indicator
  required: 'Bắt buộc',
  optional: 'Tùy chọn',
} as const

/**
 * Form field placeholders
 */
export const RSVP_PLACEHOLDERS = {
  name: 'Bạn tên là gì?',
  wishes: 'Gửi lời chúc đến cô dâu, chú rể...',
} as const

/**
 * Help text for form fields
 */
export const RSVP_HELP_TEXT = {
  name: 'Họ và tên đầy đủ của bạn',
  guestCount: 'người',
  willAttend: 'Vui lòng cho chúng tôi biết bạn có thể tham dự không',
  venue: 'Chọn địa điểm bạn muốn tham dự',
  wishes: 'Lời chúc, lời nhắn gửi đến cô dâu chú rể',
} as const

/**
 * Button labels
 */
export const RSVP_BUTTONS = {
  submit: 'Gửi xác nhận',
  submitting: 'Đang gửi...',
  close: 'Đóng',
  downloadCalendar: 'Tải lịch sự kiện',
  tryAgain: 'Thử lại',
} as const

/**
 * Success messages
 */
export const RSVP_SUCCESS = {
  title: 'Xác nhận thành công!',
  message: 'Cảm ơn bạn đã xác nhận tham dự. Chúng tôi rất mong được gặp bạn tại đám cưới!',
  calendarHint: 'Tải lịch sự kiện để không bỏ lỡ:',
  nextSteps: 'Chúng tôi sẽ liên lạc với bạn nếu có thông tin cập nhật.',
} as const

/**
 * Error messages
 */
export const RSVP_ERRORS = {
  // Network errors
  networkError: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.',
  serverError: 'Có lỗi xảy ra từ máy chủ. Vui lòng thử lại sau.',
  timeout: 'Yêu cầu bị hết thời gian chờ. Vui lòng thử lại.',
  
  // Validation errors (additional to schema errors)
  spamDetected: 'Phát hiện hoạt động spam. Vui lòng thử lại.',
  rateLimited: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng chờ một chút rồi thử lại.',
  
  // Generic errors
  unexpectedError: 'Có lỗi không mong muốn xảy ra. Vui lòng thử lại sau.',
  validationFailed: 'Vui lòng kiểm tra lại thông tin đã nhập.',
} as const

/**
 * Loading states
 */
export const RSVP_LOADING = {
  submitting: 'Đang xử lý yêu cầu của bạn...',
  validating: 'Đang kiểm tra thông tin...',
} as const

/**
 * Accessibility labels
 */
export const RSVP_A11Y = {
  // ARIA labels
  formLabel: 'Biểu mẫu xác nhận tham dự đám cưới',
  closeButton: 'Đóng bảng xác nhận tham dự',
  submitButton: 'Gửi xác nhận tham dự',
  downloadButton: 'Tải lịch sự kiện đám cưới',
  
  // Screen reader announcements
  formSubmitted: 'Xác nhận tham dự đã được gửi thành công',
  formError: 'Có lỗi trong biểu mẫu, vui lòng kiểm tra lại',
  fieldError: 'Trường này có lỗi',
  
  // Form field descriptions
  honeypotField: 'Trường này dành cho bot, xin đừng điền',
} as const

/**
 * Calendar event details
 */
export const RSVP_CALENDAR = {
  eventTitle: 'Đám cưới Ngọc & Quân',
  eventDescription: 'Chúng tôi rất vui mừng được mời bạn tham dự đám cưới của chúng tôi!',
  locationHue: 'Huế, Việt Nam',
  locationHanoi: 'Hà Nội, Việt Nam',
  timezone: 'Asia/Ho_Chi_Minh',
} as const