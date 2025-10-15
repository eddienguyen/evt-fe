import React from 'react'
import { SEOHead } from '../components/SEO'

const LocationMap: React.FC = () => {
  return (
    <>
      <SEOHead />
      <main className="min-h-screen">
      <div className="h-[60vh] w-full">
        {/* Map component will be added here */}
      </div>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Venue Location</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Venue details and directions will be added here */}
        </div>
      </div>
    </main>
    </>
  )
}

export default LocationMap