/**
 * WishCard Component Tests
 * 
 * Unit tests for WishCard component including:
 * - Rendering with valid data
 * - Loading state (skeleton)
 * - Fallback handling for missing data
 * - Accessibility features
 * - Responsive behavior
 * 
 * @module components/wishes/WishCard.test
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WishCard } from './WishCard'
import type { WishItem } from '../../types/wishes'

// Mock data
const mockWish: WishItem = {
  id: '1',
  name: 'John Doe',
  wishes: 'Wishing you both endless love and happiness!',
  createdAt: new Date().toISOString(),
}

const mockWishVietnamese: WishItem = {
  id: '2',
  name: 'Nguyễn Văn A',
  wishes: 'Chúc hai bạn trăm năm hạnh phúc!',
  createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
  venue: 'hue'
}

describe('WishCard Component', () => {
  describe('Rendering', () => {
    it('renders wish card with all data', () => {
      render(<WishCard wish={mockWish} />)
      
      // Check wish text is displayed
      expect(screen.getByText(new RegExp(mockWish.wishes))).toBeInTheDocument()
      
      // Check author name is displayed
      expect(screen.getByText(mockWish.name)).toBeInTheDocument()
      
      // Check time element exists
      expect(screen.getByRole('time')).toBeInTheDocument()
    })

    it('renders Vietnamese content correctly', () => {
      render(<WishCard wish={mockWishVietnamese} />)
      
      expect(screen.getByText(new RegExp(mockWishVietnamese.wishes))).toBeInTheDocument()
      expect(screen.getByText(mockWishVietnamese.name)).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      const { container } = render(
        <WishCard wish={mockWish} className="custom-class" />
      )
      
      const article = container.querySelector('article')
      expect(article).toHaveClass('custom-class')
    })
  })

  describe('Loading State', () => {
    it('renders skeleton when isLoading is true', () => {
      render(<WishCard wish={mockWish} isLoading={true} />)
      
      // Should not show actual content
      expect(screen.queryByText(mockWish.wishes)).not.toBeInTheDocument()
      expect(screen.queryByText(mockWish.name)).not.toBeInTheDocument()
      
      // Should show loading indicator
      expect(screen.getByLabelText('Loading wish...')).toBeInTheDocument()
    })

    it('skeleton has aria-busy attribute', () => {
      render(<WishCard wish={mockWish} isLoading={true} />)
      
      const skeleton = screen.getByLabelText('Loading wish...')
      expect(skeleton).toHaveAttribute('aria-busy', 'true')
    })
  })

  describe('Fallback Handling', () => {
    it('handles missing wishes text gracefully', () => {
      const incompleteWish = {
        id: '3',
        name: 'Test User',
        wishes: '',
        createdAt: new Date().toISOString()
      }
      
      render(<WishCard wish={incompleteWish} />)
      
      // Should show fallback text
      expect(screen.getByText(/Wishing you both love and happiness!/)).toBeInTheDocument()
      expect(screen.getByText('Test User')).toBeInTheDocument()
    })

    it('handles missing name gracefully', () => {
      const incompleteWish = {
        id: '4',
        name: '',
        wishes: 'Great wishes!',
        createdAt: new Date().toISOString()
      }
      
      render(<WishCard wish={incompleteWish} />)
      
      // Should show fallback name
      expect(screen.getByText('A Guest')).toBeInTheDocument()
      expect(screen.getByText(/Great wishes!/)).toBeInTheDocument()
    })

    it('handles missing createdAt gracefully', () => {
      const incompleteWish = {
        id: '5',
        name: 'Test User',
        wishes: 'Best wishes!',
        createdAt: ''
      }
      
      render(<WishCard wish={incompleteWish} />)
      
      // Should still render without crashing
      expect(screen.getByText('Test User')).toBeInTheDocument()
      expect(screen.getByText(/Best wishes!/)).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('uses semantic article element', () => {
      const { container } = render(<WishCard wish={mockWish} />)
      
      const article = container.querySelector('article')
      expect(article).toBeInTheDocument()
    })

    it('has proper aria-label for article', () => {
      render(<WishCard wish={mockWish} />)
      
      const article = screen.getByLabelText(`Wish from ${mockWish.name}`)
      expect(article).toBeInTheDocument()
    })

    it('uses blockquote for wish text', () => {
      const { container } = render(<WishCard wish={mockWish} />)
      
      const blockquote = container.querySelector('blockquote')
      expect(blockquote).toBeInTheDocument()
      expect(blockquote).toHaveTextContent(mockWish.wishes)
    })

    it('time element has dateTime attribute', () => {
      render(<WishCard wish={mockWish} />)
      
      const timeElement = screen.getByRole('time')
      expect(timeElement).toHaveAttribute('dateTime', mockWish.createdAt)
    })

    it('decorative quote mark is aria-hidden', () => {
      const { container } = render(<WishCard wish={mockWish} />)
      
      const decorativeQuote = container.querySelector('[aria-hidden="true"]')
      expect(decorativeQuote).toBeInTheDocument()
    })
  })

  describe('Date Formatting', () => {
    it('shows "Today" for today\'s wishes', () => {
      const todayWish = {
        ...mockWish,
        createdAt: new Date().toISOString()
      }
      
      render(<WishCard wish={todayWish} />)
      
      expect(screen.getByText('Today')).toBeInTheDocument()
    })

    it('shows "Yesterday" for yesterday\'s wishes', () => {
      const yesterdayWish = {
        ...mockWish,
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
      
      render(<WishCard wish={yesterdayWish} />)
      
      expect(screen.getByText('Yesterday')).toBeInTheDocument()
    })

    it('shows "X days ago" for recent wishes', () => {
      const recentWish = {
        ...mockWish,
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString() // 3 days ago
      }
      
      render(<WishCard wish={recentWish} />)
      
      expect(screen.getByText('3 days ago')).toBeInTheDocument()
    })

    it('shows formatted date for older wishes', () => {
      const oldWish = {
        ...mockWish,
        createdAt: new Date(Date.now() - 40 * 86400000).toISOString() // 40 days ago
      }
      
      render(<WishCard wish={oldWish} />)
      
      // Should show month and day format
      const timeElement = screen.getByRole('time')
      expect(timeElement.textContent).toMatch(/[A-Z][a-z]{2} \d{1,2}/)
    })

    it('handles invalid date gracefully', () => {
      const invalidDateWish = {
        ...mockWish,
        createdAt: 'invalid-date'
      }
      
      render(<WishCard wish={invalidDateWish} />)
      
      // Should show fallback text
      expect(screen.getByText('Recently')).toBeInTheDocument()
    })
  })

  describe('Typography', () => {
    it('uses handwritten font for wish text', () => {
      const { container } = render(<WishCard wish={mockWish} />)
      
      const blockquote = container.querySelector('blockquote')
      expect(blockquote).toHaveClass('font-handwritten')
    })

    it('uses proper text sizing', () => {
      const { container } = render(<WishCard wish={mockWish} />)
      
      const blockquote = container.querySelector('blockquote')
      expect(blockquote).toHaveClass('text-lg')
      expect(blockquote).toHaveClass('leading-relaxed')
    })
  })

  describe('Styling', () => {
    it('has rounded corners', () => {
      const { container } = render(<WishCard wish={mockWish} />)
      
      const article = container.querySelector('article')
      expect(article).toHaveClass('rounded-xl')
    })

    it('has responsive padding', () => {
      const { container } = render(<WishCard wish={mockWish} />)
      
      const article = container.querySelector('article')
      expect(article).toHaveClass('p-4', 'md:p-6')
    })

    it('has proper borders and shadows', () => {
      const { container } = render(<WishCard wish={mockWish} />)
      
      const article = container.querySelector('article')
      expect(article).toHaveClass('border', 'shadow-sm')
    })
  })
})
