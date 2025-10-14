import React from 'react'
import { StoryTimeline } from '../components/timeline'
import { EventDetailsSection } from '../components/events'
import { CountdownTimer } from '../components/countdown'
import { eventsConfig } from '../config/events'
import figure from '../public/Hue-invitation.jpg'

const Hue: React.FC = () => {
  return (
    <>
      {/* Wedding Invitation Banner */}
      <section aria-label="Wedding invitation" className="bg-base">
        <img 
          src={figure} 
          alt="Wedding invitation card for Ngọc & Quân's ceremony in Hue, Vietnam on November 1st, 2025"
          className="w-full h-auto"
        />
      </section>

      {/* Event Details Section */}
      <EventDetailsSection enableAnimations={true} eventID='hue'/>

      {/* Countdown Timer Section */}
      <CountdownTimer
        targetDate={eventsConfig.hue.date}
        eventName="Đám cưới Ngọc & Quân"
        eventLocation="Huế"
        enableAnimations={true}
      />

      {/* Story Timeline Section */}
      <StoryTimeline enableAnimations={true} />

      {/* Placeholder: Location & Directions */}
      <section 
        className="container mx-auto px-4 py-16 bg-base-light" 
        aria-labelledby="hue-location-heading"
      >
        <div className="text-center max-w-4xl mx-auto">
          <h2 id="hue-location-heading" className="font-heading text-3xl md:text-4xl font-bold text-text mb-6">
            🗺️ Địa điểm & Đường đi
          </h2>
          <p className="text-text-light text-lg mb-8">
            Thông tin chi tiết về địa điểm tổ chức và cách di chuyển
          </p>
          <div className="bg-white rounded-lg shadow-soft p-8">
            <p className="text-text-lighter italic">
              Bản đồ và hướng dẫn đến địa điểm sẽ hiển thị tại đây
            </p>
            <p className="text-sm text-text-lighter mt-2">
              Location Map section - Coming in Story #20
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default Hue
