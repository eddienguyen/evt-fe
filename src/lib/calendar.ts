/**
 * Calendar Utility
 * 
 * Generates ICS calendar files for wedding events with proper
 * timezone handling and Vietnamese descriptions.
 * 
 * @module lib/calendar
 */

import { events } from '@/config/site'
import { RSVP_CALENDAR } from '@/lib/constants/rsvp'

/**
 * Calendar event interface
 */
export interface CalendarEvent {
  title: string
  description: string
  location: string
  startDate: Date
  endDate: Date
  timezone: string
}

/**
 * Format date for ICS format (YYYYMMDDTHHMMSSZ)
 */
function formatICSDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

/**
 * Generate unique ID for calendar event
 */
function generateEventId(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `rsvp-${timestamp}-${random}@ngocquanwd.com`
}

/**
 * Escape text for ICS format
 */
function escapeICSText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '')
}

/**
 * Create calendar event for Hue wedding
 */
export function createHueWeddingEvent(): CalendarEvent {
  const startDate = new Date('2025-11-01T10:00:00+07:00') // 10:00 AM Vietnam time
  const endDate = new Date('2025-11-01T14:00:00+07:00')   // 2:00 PM Vietnam time
  
  return {
    title: RSVP_CALENDAR.eventTitle,
    description: `${RSVP_CALENDAR.eventDescription}\n\nĐịa điểm: ${events.hue.location}\nThời gian: ${events.hue.dateDisplay}`,
    location: events.hue.location,
    startDate,
    endDate,
    timezone: RSVP_CALENDAR.timezone
  }
}

/**
 * Create calendar event for Hanoi wedding
 */
export function createHanoiWeddingEvent(): CalendarEvent {
  const startDate = new Date('2025-11-08T10:00:00+07:00') // 10:00 AM Vietnam time
  const endDate = new Date('2025-11-08T14:00:00+07:00')   // 2:00 PM Vietnam time
  
  return {
    title: RSVP_CALENDAR.eventTitle,
    description: `${RSVP_CALENDAR.eventDescription}\n\nĐịa điểm: ${events.hanoi.location}\nThời gian: ${events.hanoi.dateDisplay}`,
    location: events.hanoi.location,
    startDate,
    endDate,
    timezone: RSVP_CALENDAR.timezone
  }
}

/**
 * Generate ICS file content for a calendar event
 */
export function generateICSFile(event: CalendarEvent): string {
  const now = new Date()
  const eventId = generateEventId()
  
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Ngoc & Quan Wedding//Wedding RSVP//VN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VTIMEZONE',
    'TZID:Asia/Ho_Chi_Minh',
    'BEGIN:STANDARD',
    'DTSTART:20000101T000000',
    'TZOFFSETFROM:+0700',
    'TZOFFSETTO:+0700',
    'TZNAME:ICT',
    'END:STANDARD',
    'END:VTIMEZONE',
    'BEGIN:VEVENT',
    `UID:${eventId}`,
    `DTSTAMP:${formatICSDate(now)}`,
    `DTSTART;TZID=Asia/Ho_Chi_Minh:${formatICSDate(event.startDate).replace('Z', '')}`,
    `DTEND;TZID=Asia/Ho_Chi_Minh:${formatICSDate(event.endDate).replace('Z', '')}`,
    `SUMMARY:${escapeICSText(event.title)}`,
    `DESCRIPTION:${escapeICSText(event.description)}`,
    `LOCATION:${escapeICSText(event.location)}`,
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'CATEGORIES:WEDDING',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n')
  
  return icsContent
}

/**
 * Download ICS file for both wedding events
 */
export function downloadWeddingCalendar(): void {
  // Create combined calendar with both events
  const hueEvent = createHueWeddingEvent()
  const hanoiEvent = createHanoiWeddingEvent()
  
  const now = new Date()
  const hueEventId = generateEventId()
  const hanoiEventId = generateEventId()
  
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Ngoc & Quan Wedding//Wedding RSVP//VN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VTIMEZONE',
    'TZID:Asia/Ho_Chi_Minh',
    'BEGIN:STANDARD',
    'DTSTART:20000101T000000',
    'TZOFFSETFROM:+0700',
    'TZOFFSETTO:+0700',
    'TZNAME:ICT',
    'END:STANDARD',
    'END:VTIMEZONE',
    
    // Hue Event
    'BEGIN:VEVENT',
    `UID:${hueEventId}`,
    `DTSTAMP:${formatICSDate(now)}`,
    `DTSTART;TZID=Asia/Ho_Chi_Minh:${formatICSDate(hueEvent.startDate).replace('Z', '')}`,
    `DTEND;TZID=Asia/Ho_Chi_Minh:${formatICSDate(hueEvent.endDate).replace('Z', '')}`,
    `SUMMARY:${escapeICSText(hueEvent.title + ' - Huế')}`,
    `DESCRIPTION:${escapeICSText(hueEvent.description)}`,
    `LOCATION:${escapeICSText(hueEvent.location)}`,
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'CATEGORIES:WEDDING',
    'END:VEVENT',
    
    // Hanoi Event
    'BEGIN:VEVENT',
    `UID:${hanoiEventId}`,
    `DTSTAMP:${formatICSDate(now)}`,
    `DTSTART;TZID=Asia/Ho_Chi_Minh:${formatICSDate(hanoiEvent.startDate).replace('Z', '')}`,
    `DTEND;TZID=Asia/Ho_Chi_Minh:${formatICSDate(hanoiEvent.endDate).replace('Z', '')}`,
    `SUMMARY:${escapeICSText(hanoiEvent.title + ' - Hà Nội')}`,
    `DESCRIPTION:${escapeICSText(hanoiEvent.description)}`,
    `LOCATION:${escapeICSText(hanoiEvent.location)}`,
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'CATEGORIES:WEDDING',
    'END:VEVENT',
    
    'END:VCALENDAR'
  ].join('\r\n')
  
  // Create blob and download
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = 'ngoc-quan-wedding.ics'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Clean up
  URL.revokeObjectURL(url)
}

/**
 * Check if calendar download is supported
 */
export function isCalendarDownloadSupported(): boolean {
  return typeof window !== 'undefined' && 
         typeof document !== 'undefined' && 
         typeof URL !== 'undefined' && 
         typeof Blob !== 'undefined'
}