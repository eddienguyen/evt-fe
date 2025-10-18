/**
 * Timeline Configuration
 * 
 * Static timeline data for the couple's relationship journey.
 * Structured for easy CMS/API migration in the future.
 * 
 * @module config/timeline
 */

/**
 * Timeline milestone interface
 */
export interface TimelineMilestone {
  id: string
  date: string                        // ISO date string for sorting
  title: string                       // Milestone title (Vietnamese)
  description: string                 // Short description (1-2 sentences)
  category?: 'meeting' | 'dating' | 'milestone' | 'engagement' | 'proposal' | 'wedding-prep'
  image?: {
    url: string                       // Image path or URL
    alt: string                       // Accessibility description
    width?: number                    // Optional dimensions for optimization
    height?: number
  }
  featured?: boolean                  // Highlight important milestones
  order: number                       // Explicit ordering for flexibility
}

/**
 * Timeline configuration interface
 */
export interface TimelineConfig {
  milestones: TimelineMilestone[]
  settings: {
    animationDuration: number         // Base animation duration (ms)
    staggerDelay: number              // Delay between item animations (ms)
    enableImages: boolean             // Toggle image display
    animationLibrary: 'gsap' | 'css'  // Animation strategy
  }
  metadata?: {
    lastUpdated: string               // ISO timestamp
    source: 'local' | 'api'           // Data source indicator
    version: string                   // Config version for cache busting
  }
}

/**
 * Timeline configuration with 6 sample milestones
 */
export const timelineConfig: TimelineConfig = {
  milestones: [
    {
      id: 'first-meet',
      date: '2020-03-15',
      title: 'Lần đầu gặp gỡ',
      description: '---',
      category: 'meeting',
      featured: true,
      order: 1,
      image: {
        url: '/timeline/first-meet.jpg',
        alt: 'Ngọc và Quân lần đầu gặp nhau',
        width: 800,
        height: 600
      }
    },
    {
      id: 'first-date',
      date: '2020-04-20',
      title: 'Buổi hẹn đầu tiên',
      description: '---',
      category: 'dating',
      featured: false,
      order: 2,
      image: {
        url: '/timeline/first-date.jpg',
        alt: 'Buổi hẹn đầu tiên',
        width: 800,
        height: 600
      }
    },
    {
      id: 'first-trip',
      date: '2021-08-10',
      title: 'Chuyến du lịch đầu tiên',
      description: '---',
      category: 'milestone',
      featured: true,
      order: 3,
      image: {
        url: '/timeline/first-trip.jpg',
        alt: 'Chuyến du lịch Đà Lạt của cặp đôi',
        width: 800,
        height: 600
      }
    },
    {
      id: 'anniversary',
      date: '2022-03-15',
      title: 'Kỷ niệm 2 năm',
      description: '---',
      category: 'milestone',
      featured: false,
      order: 4,
      image: {
        url: '/timeline/anniversary.jpg',
        alt: 'Kỷ niệm 2 năm yêu nhau',
        width: 800,
        height: 600
      }
    },
    {
      id: 'proposal',
      date: '2024-12-24',
      title: 'Lời cầu hôn',
      description: '---',
      category: 'proposal',
      featured: true,
      order: 5,
      image: {
        url: '/timeline/proposal.jpg',
        alt: 'Lời cầu hôn dưới ánh đèn Giáng sinh',
        width: 800,
        height: 600
      }
    },
    {
      id: 'wedding-prep',
      date: '2025-08-01',
      title: 'Chuẩn bị đám cưới',
      description: '---',
      category: 'wedding-prep',
      featured: false,
      order: 6,
      image: {
        url: '/timeline/wedding-prep.jpg',
        alt: 'Chuẩn bị cho đám cưới',
        width: 800,
        height: 600
      }
    }
  ],
  settings: {
    animationDuration: 800,
    staggerDelay: 200,
    enableImages: true,
    animationLibrary: 'gsap'
  },
  metadata: {
    lastUpdated: new Date().toISOString(),
    source: 'local',
    version: '1.0.0'
  }
}

/**
 * Get milestones sorted by order
 */
export function getSortedMilestones(): TimelineMilestone[] {
  return [...timelineConfig.milestones].sort((a, b) => a.order - b.order)
}

/**
 * Get featured milestones only
 */
export function getFeaturedMilestones(): TimelineMilestone[] {
  return getSortedMilestones().filter(m => m.featured)
}

/**
 * Get milestones by category
 */
export function getMilestonesByCategory(category: string): TimelineMilestone[] {
  return getSortedMilestones().filter(m => m.category === category)
}

/**
 * Future: Fetch timeline data from API
 */
export async function fetchTimelineData(): Promise<TimelineMilestone[]> {
  // TODO: Implement API call when backend is ready
  // For now, return local data
  return getSortedMilestones()
}

/**
 * API response interface for future implementation
 */
export interface TimelineAPIResponse {
  data: TimelineMilestone[]
  meta?: {
    total: number
    lastUpdated: string
  }
}
