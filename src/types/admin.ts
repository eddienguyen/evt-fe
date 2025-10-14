/**
 * Admin Type Definitions
 * 
 * Type definitions for admin-specific features including
 * guest management and invitation generation.
 * 
 * @module types/admin
 */

export interface GuestFormData {
  name: string;
  venue: 'hue' | 'hanoi';
  secondaryNote?: string;
}

export interface GuestRecord {
  id: string;
  name: string;
  venue: 'hue' | 'hanoi';
  secondaryNote: string;
  invitationUrl: string;
  invitationImageFrontUrl?: string;
  invitationImageMainUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGuestResponse {
  success: boolean;
  data: GuestRecord;
  message: string;
}

export interface CreateGuestError {
  success: false;
  error: string;
  details?: Record<string, string>;
}
