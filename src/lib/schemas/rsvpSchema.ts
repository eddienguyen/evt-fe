/**
 * RSVP Form Validation Schema
 * 
 * Zod schema for RSVP form validation with Vietnamese error messages.
 * Includes honeypot field for spam prevention.
 * 
 * @module lib/schemas/rsvpSchema
 */

import { z } from 'zod'

/**
 * RSVP Form Data Interface
 */
export interface RSVPFormData {
  name: string
  guestCount: number
  phone?: string
  wishes: string
  honeypot: string // Hidden field for spam prevention
}

/**
 * RSVP Validation Schema with Vietnamese error messages
 */
export const rsvpSchema = z.object({
  name: z
    .string()
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(50, 'Tên không được quá 50 ký tự')
    .regex(/^[a-zA-ZÀ-ỹ\s]+$/, 'Tên chỉ được chứa chữ cái và khoảng trắng'),
  
  guestCount: z
    .number({
      message: 'Số lượng khách phải là số'
    })
    .min(1, 'Số lượng khách phải ít nhất 1 người')
    .max(10, 'Số lượng khách không được quá 10 người')
    .int('Số lượng khách phải là số nguyên'),
    
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^(\+84|0)[3|5|7|8|9][0-9]{8}$/.test(val),
      'Số điện thoại không đúng định dạng (VD: 0901234567 hoặc +84901234567)'
    ),
    
  wishes: z
    .string()
    .min(10, 'Lời chúc phải có ít nhất 10 ký tự')
    .max(500, 'Lời chúc không được quá 500 ký tự'),
    
  honeypot: z
    .string()
    .max(0, 'Bot detected') // Must be empty
})

/**
 * Type inference from schema
 */
export type RSVPFormInput = z.infer<typeof rsvpSchema>

/**
 * Default form values
 */
export const rsvpDefaultValues: RSVPFormData = {
  name: '',
  guestCount: 1,
  phone: '',
  wishes: '',
  honeypot: ''
}

/**
 * Field validation helpers
 */
export const rsvpValidationHelpers = {
  /**
   * Validate Vietnamese phone number format
   */
  isValidVietnamesePhone: (phone: string): boolean => {
    if (!phone) return true // Optional field
    return /^(\+84|0)[3|5|7|8|9][0-9]{8}$/.test(phone)
  },

  /**
   * Validate Vietnamese name format
   */
  isValidVietnameseName: (name: string): boolean => {
    return /^[a-zA-ZÀ-ỹ\s]+$/.test(name) && name.length >= 2 && name.length <= 50
  },

  /**
   * Check if honeypot field indicates spam
   */
  isSpamDetected: (honeypot: string): boolean => {
    return honeypot.length > 0
  }
}