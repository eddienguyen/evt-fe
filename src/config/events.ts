/**
 * Events Configuration
 * 
 * Central configuration for wedding event details including venues,
 * schedules, and location information for both Hue and Hanoi ceremonies.
 * 
 * @module config/events
 */

/**
 * Schedule item for an event timeline
 */
export interface ScheduleItem {
  /** Time in 12-hour format (e.g., "7:00 AM") */
  time: string
  /** Vietnamese title for the event segment */
  title: string
  /** Optional additional details */
  description?: string
  hightlight?: boolean
}

/**
 * Venue location details
 */
export interface VenueDetails {
  /** Venue name */
  name: string
  /** Full address */
  address: string
  /** Geographic coordinates */
  coordinates: {
    lat: number
    lng: number
  }
}

/**
 * Complete event information
 */
export interface EventDetails {
  /** Event identifier */
  id: 'hue' | 'hanoi'
  /** Display name for the event */
  displayName: string
  /** ISO date string (YYYY-MM-DD) */
  date: string
  /** Formatted date for display */
  dateDisplay: string
  /** Lunatic Formatted date for display */
  dateDisplay2: string
  /** Venue information */
  venue: VenueDetails
  /** Event schedule timeline */
  schedule: ScheduleItem[]
  /** Optional dress code */
  dressCode?: string
  /** Optional additional notes */
  notes?: string[]
}

/**
 * Events configuration container
 */
export interface EventsConfig {
  hue: EventDetails
  hanoi: EventDetails
}

/**
 * Wedding Events Configuration
 * 
 * Contains all event details for both Hue and Hanoi ceremonies.
 */
export const eventsConfig: EventsConfig = {
  // Hue Ceremony - November 1st, 2025
  hue: {
    id: 'hue',
    displayName: 'Lễ Vu Quy',
    date: '2025-11-01',
    dateDisplay: 'Thứ Bảy, 1 tháng 11, 2025',
    dateDisplay2: '(nhằm ngày 12 tháng 09, năm Ất Tỵ)',
    venue: {
      name: 'Trung Tâm Sự Kiện Asia Palace',
      address: '32 Phạm Ngũ Lão, Phú Hội, Thành phố Huế',
      coordinates: {
        lat: 16.46909318486246,
        lng: 107.59456501389353
      }
    },
    schedule: [
      {
        time: '7:00 AM',
        title: 'Ăn hỏi',
        description: '(tại Tư gia nhà gái)'
      },
      {
        time: '9:00 AM',
        title: 'Rước dâu',
        description: ''
      },
      {
        time: '11:00 AM',
        title: 'Tiệc cưới',
        description: '',
        hightlight: true,
      },
    ],
    notes: [
      'Rất hân hạnh được đón tiếp quý khách tại buổi lễ trọng đại này.',
    ]
  },

  // Hanoi Ceremony - November 8th, 2025
  hanoi: {
    id: 'hanoi',
    displayName: 'Lễ Thành Hôn',
    date: '2025-11-08',
    dateDisplay: 'Thứ Bảy, 8 tháng 11, 2025',
    dateDisplay2: '(nhằm ngày 19 tháng 09, năm Ất Tỵ)',
    venue: {
      name: 'Nhà khách Trúc Bạch',
      address: '1 P. Trấn Vũ, Quán Thánh, Hoàn Kiếm, Hà Nội',
      coordinates: {
        lat: 21.044212078128684,
        lng: 105.83818281184293
      }
    },
    schedule: [
      {
        time: '5:30 PM',
        title: 'Đón khách',
        description: ''
      },
      {
        time: '6:00 PM',
        title: 'Tiệc cưới',
        description: '',
        hightlight: true
      }
    ],
    notes: [
      'Bãi đỗ xe có sẵn tại địa điểm'
    ]
  }
}

/**
 * Get event details by ID
 * 
 * @param eventId - Event identifier ('hue' or 'hanoi')
 * @returns Event details or undefined if not found
 */
export function getEventById(eventId: 'hue' | 'hanoi'): EventDetails | undefined {
  return eventsConfig[eventId]
}

/**
 * Get all events as an array
 * 
 * @returns Array of all event details
 */
export function getAllEvents(): EventDetails[] {
  return [eventsConfig.hue, eventsConfig.hanoi]
}
