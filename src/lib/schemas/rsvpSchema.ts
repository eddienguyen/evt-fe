/**
 * RSVP Form Validation Schema
 *
 * Zod schema for RSVP form validation with Vietnamese error messages.
 * Includes honeypot field for spam prevention.
 *
 * @module lib/schemas/rsvpSchema
 */

import { z } from "zod";

/**
 * RSVP Form Data Interface
 * Updated to match backend schema from Story #17
 */
export interface RSVPFormData {
  guestId?: string; // Optional UUID from personalized invitations
  name: string;
  guestCount: number;
  willAttend: boolean;
  wishes: string;
  venue: "hue" | "hanoi";
  honeypot: string; // Hidden field for spam prevention
}

/**
 * RSVP Validation Schema with Vietnamese error messages
 * Updated to match backend schema from Story #17
 */
export const rsvpSchema = z.object({
  guestId: z.string().uuid({ message: "ID khách mời không hợp lệ" }).optional(),

  name: z
    .string()
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(100, "Tên hơi dài nghen: 100 ký tự thui")
    .regex(/^[a-zA-Z0-9À-ỹ\s]+$/, "đừng dùng ký tự đặc biệt nhé"),

  guestCount: z
    .number({
      message: "Số lượng khách phải là số",
    })
    .min(1, "Số lượng khách phải ít nhất 1 người")
    .max(10, "Số lượng khách không được quá 10 người")
    .int("Số lượng khách phải là số nguyên"),

  willAttend: z.boolean({
    message: "Vui lòng xác nhận tham dự",
  }),

  wishes: z
    .string()
    .min(10, "Lời chúc phải có ít nhất 10 ký tự")
    .max(500, "Lời chúc không được quá 500 ký tự"),

  venue: z.enum(["hue", "hanoi"], {
    message: "Vui lòng chọn địa điểm",
  }),

  honeypot: z.string().max(0, "Bot detected"), // Must be empty
});

/**
 * Type inference from schema
 */
export type RSVPFormInput = z.infer<typeof rsvpSchema>;

/**
 * Default form values
 */
export const rsvpDefaultValues: RSVPFormData = {
  name: "",
  guestCount: 1,
  willAttend: true,
  wishes: "",
  venue: "hue",
  honeypot: "",
};

/**
 * Field validation helpers
 */
export const rsvpValidationHelpers = {
  /**
   * Validate Vietnamese name format
   */
  isValidVietnameseName: (name: string): boolean => {
    return (
      /^[a-zA-ZÀ-ỹ\s]+$/.test(name) && name.length >= 2 && name.length <= 100
    );
  },

  /**
   * Check if honeypot field indicates spam
   */
  isSpamDetected: (honeypot: string): boolean => {
    return honeypot.length > 0;
  },
};
