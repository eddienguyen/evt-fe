/**
 * Gallery Page
 * 
 * Main gallery page with progressive loading and lightbox functionality.
 * 
 * @module pages/Gallery
 */

import React from 'react'
import { SEOHead } from '../components/SEO'
import { Gallery as GalleryComponent } from '@/components/gallery'

/**
 * Gallery Page Component
 * 
 * Displays the wedding photo gallery with progressive loading,
 * lazy loading, and full-screen lightbox viewer.
 */
const Gallery: React.FC = () => {
  // Scroll to top when the page loads
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return (
    <>
      <SEOHead />
      <main className="min-h-screen bg-warm-50 py-16">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <header className="text-center mb-12">
          <h1 className="font-rose text-4xl md:text-5xl text-warm-900 mb-4">
            Album ảnh của chúng mình
          </h1>
          <p className="text-warm-600 text-lg max-w-2xl mx-auto italic">
            Những kỷ niệm đẹp được lưu giữ trong từng khung hình
          </p>
        </header>

        {/* Gallery Component */}
        <GalleryComponent />
      </div>
    </main>
    </>
  )
}

export default Gallery