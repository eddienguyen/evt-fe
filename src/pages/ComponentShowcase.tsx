/**
 * Component Showcase Page
 * 
 * Demo page to showcase all UI components from the design system.
 * Used for visual testing and documentation.
 * 
 * @module pages/ComponentShowcase
 */

import React, { useState } from 'react'
import { Button, Input, Textarea } from '../components/ui'
import { useToast } from '../hooks/useToast'

const ComponentShowcase: React.FC = () => {
  const [inputValue, setInputValue] = useState('')
  const [textareaValue, setTextareaValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast, ToastComponent } = useToast()

  const handleLoadingDemo = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <>
      <main className="min-h-screen bg-base-light py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="font-heading text-4xl font-bold text-text mb-2">
          Component Showcase
        </h1>
        <p className="text-text-light text-lg mb-12">
          Design system components - Phase 3 implementation
        </p>

        {/* Button Variants */}
        <section className="mb-16">
          <h2 className="font-heading text-3xl font-semibold text-text mb-6">
            Button Components
          </h2>

          <div className="bg-white rounded-xl shadow-soft p-8 space-y-8">
            {/* Primary Buttons */}
            <div>
              <h3 className="text-xl font-semibold text-text mb-4">Primary Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" size="sm">Small Primary</Button>
                <Button variant="primary" size="md">Medium Primary</Button>
                <Button variant="primary" size="lg">Large Primary</Button>
              </div>
            </div>

            {/* All Variants */}
            <div>
              <h3 className="text-xl font-semibold text-text mb-4">All Variants</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="icon" aria-label="Settings">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </Button>
              </div>
            </div>

            {/* Button States */}
            <div>
              <h3 className="text-xl font-semibold text-text mb-4">Button States</h3>
              <div className="flex flex-wrap gap-4">
                <Button>Default</Button>
                <Button disabled>Disabled</Button>
                <Button isLoading disabled>Loading</Button>
                <Button onClick={handleLoadingDemo} isLoading={isLoading}>
                  {isLoading ? 'Processing...' : 'Click to Load'}
                </Button>
              </div>
            </div>

            {/* Buttons with Icons */}
            <div>
              <h3 className="text-xl font-semibold text-text mb-4">Buttons with Icons</h3>
              <div className="flex flex-wrap gap-4">
                <Button 
                  leftIcon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  }
                >
                  Add to Favorites
                </Button>
                <Button 
                  variant="secondary"
                  rightIcon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  }
                >
                  Continue
                </Button>
              </div>
            </div>

            {/* Full Width */}
            <div>
              <h3 className="text-xl font-semibold text-text mb-4">Full Width (Mobile)</h3>
              <div className="max-w-md">
                <Button fullWidth>Full Width Button</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Input Components */}
        <section className="mb-16">
          <h2 className="font-heading text-3xl font-semibold text-text mb-6">
            Input Components
          </h2>

          <div className="bg-white rounded-xl shadow-soft p-8 space-y-8">
            {/* Basic Input */}
            <div>
              <h3 className="text-xl font-semibold text-text mb-4">Basic Input</h3>
              <div className="max-w-md">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="John Doe"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Input with Error */}
            <div>
              <h3 className="text-xl font-semibold text-text mb-4">Error State</h3>
              <div className="max-w-md">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  error="Please enter a valid email address"
                  required
                />
              </div>
            </div>

            {/* Input with Success */}
            <div>
              <h3 className="text-xl font-semibold text-text mb-4">Success State</h3>
              <div className="max-w-md">
                <Input
                  label="Email Address"
                  type="email"
                  value="valid@example.com"
                  success="Email is valid"
                />
              </div>
            </div>

            {/* Input with Helper Text */}
            <div>
              <h3 className="text-xl font-semibold text-text mb-4">Helper Text</h3>
              <div className="max-w-md">
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="+84 123 456 789"
                  helperText="Format: Country code + phone number"
                />
              </div>
            </div>

            {/* Input with Icon */}
            <div>
              <h3 className="text-xl font-semibold text-text mb-4">With Icon</h3>
              <div className="max-w-md">
                <Input
                  label="Search Guests"
                  type="text"
                  placeholder="Search by name..."
                  leftIcon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  }
                />
              </div>
            </div>

            {/* Disabled Input */}
            <div>
              <h3 className="text-xl font-semibold text-text mb-4">Disabled State</h3>
              <div className="max-w-md">
                <Input
                  label="Disabled Field"
                  type="text"
                  value="Cannot edit this"
                  disabled
                />
              </div>
            </div>
          </div>
        </section>

        {/* Textarea Components */}
        <section className="mb-16">
          <h2 className="font-heading text-3xl font-semibold text-text mb-6">
            Textarea Components
          </h2>

          <div className="bg-white rounded-xl shadow-soft p-8 space-y-8">
            {/* Basic Textarea */}
            <div>
              <h3 className="text-xl font-semibold text-text mb-4">Basic Textarea</h3>
              <div className="max-w-md">
                <Textarea
                  label="Your Message"
                  placeholder="Write your wedding wishes here..."
                  rows={4}
                  value={textareaValue}
                  onChange={(e) => setTextareaValue(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Textarea with Character Count */}
            <div>
              <h3 className="text-xl font-semibold text-text mb-4">With Character Count</h3>
              <div className="max-w-md">
                <Textarea
                  label="Wedding Wishes"
                  placeholder="Share your wishes for the couple..."
                  maxLength={500}
                  showCharCount
                  rows={4}
                />
              </div>
            </div>

            {/* Textarea with Error */}
            <div>
              <h3 className="text-xl font-semibold text-text mb-4">Error State</h3>
              <div className="max-w-md">
                <Textarea
                  label="Message"
                  error="Message must be at least 10 characters"
                  rows={4}
                  required
                />
              </div>
            </div>

            {/* Textarea with Helper Text */}
            <div>
              <h3 className="text-xl font-semibold text-text mb-4">Helper Text</h3>
              <div className="max-w-md">
                <Textarea
                  label="Special Requests"
                  helperText="Please let us know about any dietary restrictions or accessibility needs"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Toast Components */}
        <section className="mb-16">
          <h2 className="font-heading text-3xl font-semibold text-text mb-6">
            Toast Notifications
          </h2>

          <div className="bg-white rounded-xl shadow-soft p-8 space-y-8">
            <p className="text-text-light mb-6">
              Toast notifications provide feedback with screen reader announcements.
              Accessible via keyboard (Escape to dismiss) and follows WCAG 2.1 AA standards.
            </p>

            <div>
              <h3 className="text-xl font-semibold text-text mb-4">All Variants</h3>
              <div className="flex flex-wrap gap-4">
                <Button onClick={() => toast.success('RSVP submitted successfully!')}>
                  Success Toast
                </Button>
                <Button onClick={() => toast.error('Failed to submit RSVP. Please try again.')}>
                  Error Toast
                </Button>
                <Button onClick={() => toast.warning('Please review your information before submitting.')}>
                  Warning Toast
                </Button>
                <Button onClick={() => toast.info('Your RSVP will be confirmed via email.')}>
                  Info Toast
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-text mb-4">Custom Duration</h3>
              <div className="flex flex-wrap gap-4">
                <Button onClick={() => toast.success('Short duration (2s)', 2000)}>
                  2 Second Toast
                </Button>
                <Button onClick={() => toast.info('Default duration (5s)')}>
                  5 Second Toast (Default)
                </Button>
                <Button onClick={() => toast.warning('Long duration (10s)', 10000)}>
                  10 Second Toast
                </Button>
                <Button onClick={() => toast.error('No auto-dismiss', 0)}>
                  Manual Dismiss Only
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-text mb-4">Multiple Toasts</h3>
              <Button onClick={() => {
                toast.info('Processing your RSVP...', 3000)
                setTimeout(() => toast.success('RSVP saved!', 3000), 1000)
                setTimeout(() => toast.success('Confirmation email sent!', 3000), 2000)
              }}>
                Show Multiple Toasts
              </Button>
              <p className="text-sm text-text-light mt-2">
                Toasts stack automatically with proper spacing
              </p>
            </div>
          </div>
        </section>

        {/* Complete Form Example */}
        <section className="mb-16">
          <h2 className="font-heading text-3xl font-semibold text-text mb-6">
            Complete Form Example
          </h2>

          <div className="bg-white rounded-xl shadow-soft p-8">
            <form className="max-w-2xl space-y-6" onSubmit={(e) => e.preventDefault()}>
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                required
              />
              
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                helperText="We'll send confirmation to this email"
                required
              />
              
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+84 123 456 789"
              />
              
              <Input
                label="Number of Guests"
                type="number"
                min="1"
                max="10"
                helperText="Including yourself"
                required
              />
              
              <Textarea
                label="Special Requests or Dietary Restrictions"
                placeholder="Let us know about any dietary restrictions, accessibility needs, or special requests..."
                rows={4}
                maxLength={500}
                showCharCount
              />
              
              <div className="flex flex-col md:flex-row gap-4">
                <Button type="submit" fullWidth>
                  Submit RSVP
                </Button>
                <Button type="button" variant="secondary" fullWidth>
                  Reset Form
                </Button>
              </div>
            </form>
          </div>
        </section>

        {/* Design Tokens Reference */}
        <section className="mb-16">
          <h2 className="font-heading text-3xl font-semibold text-text mb-6">
            Design Tokens Reference
          </h2>

          <div className="bg-white rounded-xl shadow-soft p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Colors */}
              <div>
                <h3 className="text-xl font-semibold text-text mb-4">Colors</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-accent-gold rounded-lg shadow-soft"></div>
                    <div>
                      <div className="font-medium">accent-gold</div>
                      <div className="text-text-light">#B08D57</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-accent-taupe rounded-lg shadow-soft"></div>
                    <div>
                      <div className="font-medium">accent-taupe</div>
                      <div className="text-text-light">#7A6C5D</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-base-light rounded-lg shadow-soft"></div>
                    <div>
                      <div className="font-medium">base-light</div>
                      <div className="text-text-light">#FFF8F3</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Typography */}
              <div>
                <h3 className="text-xl font-semibold text-text mb-4">Typography</h3>
                <div className="space-y-2">
                  <div className="font-heading text-2xl">Playfair Display</div>
                  <div className="text-text-light">Headings & Display</div>
                  <div className="font-body text-lg mt-4">Inter</div>
                  <div className="text-text-light">Body Text & UI</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
      {ToastComponent}
    </>
  )
}

export default ComponentShowcase
