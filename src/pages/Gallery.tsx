/**
 * Gallery Page
 * 
 * Main gallery page with progressive loading and lightbox functionality.
 * 
 * @module pages/Gallery
 */

import React from 'react'
import { Gallery as GalleryComponent } from '@/components/gallery'

/**
 * Gallery Page Component
 * 
 * Displays the wedding photo gallery with progressive loading,
 * lazy loading, and full-screen lightbox viewer.
 */
const Gallery: React.FC = () => {
  return (
    <main className="min-h-screen bg-warm-50 py-16">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <header className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl text-warm-900 mb-4">
            Khoảnh Khắc Đáng Nhớ
          </h1>
          <p className="text-warm-600 text-lg max-w-2xl mx-auto">
            Những kỷ niệm đẹp được lưu giữ trong từng khung hình
          </p>
        </header>

        {/* Gallery Component */}
        <GalleryComponent />
      </div>
    </main>
  )
}

export default Gallery