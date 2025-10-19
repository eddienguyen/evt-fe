import React from 'react'
import { SEOHead } from '../components/SEO'
import HeroSection from '../components/HeroSection'
import { StoryTimeline } from '../components/timeline'
import { EventDetailsSection } from '../components/events'
import { CountdownTimer } from '../components/countdown'
import { GalleryTeaser } from '../components/gallery'
import { eventsConfig } from '../config/events'
import BackgroundCanvas from '@/components/BackgroundCanvas'

const Home: React.FC = () => {
  return (
    <>
      <SEOHead />
      {/* <HeroSection /> */}
      <BackgroundCanvas />
      {/* Event Details Section */}
      <EventDetailsSection enableAnimations={true} />

      {/* Countdown Timer Section */}
      <CountdownTimer
        targetDate={eventsConfig.hue.date}
        eventName="Đám cưới Ngọc & Quân"
        eventLocation="Huế"
        enableAnimations={true}
      />

      {/* Story Timeline Section */}
      <StoryTimeline enableAnimations={true} />

      {/* Gallery Teaser Section */}
      <GalleryTeaser
        imageCount={6}
        enableAnimations={true}
      />
    </>
  )
}

export default Home