import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from './components/RootLayout'
import ErrorBoundary from './components/ErrorBoundary'
import BackgroundCanvas from './components/BackgroundCanvas'
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import LocationMap from './pages/LocationMap'

import './App.css'

const LazyHN = lazy(() => import('./pages/HN'))
const LazyHue = lazy(() => import('./pages/Hue'))
const LazyComponentShowcase = lazy(() => import('./pages/ComponentShowcase'))
const LazySmoothScrollTest = lazy(() => import('./components/test/SmoothScrollTestComponent'))
const LazyAdminGuests = lazy(() => import('./pages/admin/AdminGuests'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'gallery',
        element: <Gallery />,
      },
      {
        path: 'location',
        element: <LocationMap />,
      },
      {
        path: 'hn',
        element: <Suspense fallback={<div>Loading...</div>}><LazyHN /></Suspense>,
      },
      {
        path: 'hue',
        element: <Suspense fallback={<div>Loading...</div>}><LazyHue /></Suspense>,
      },
      {
        path: 'components',
        element: <Suspense fallback={<div>Loading...</div>}><LazyComponentShowcase /></Suspense>,
      },
      {
        path: 'smooth-scroll-test',
        element: <Suspense fallback={<div>Loading...</div>}><LazySmoothScrollTest /></Suspense>,
      },
      {
        path: 'admin/guests',
        element: <Suspense fallback={<div>Loading...</div>}><LazyAdminGuests /></Suspense>,
      }
    ],
  },
])

function App() {
  return (
    <>
      {/* Global 3D Background Canvas - Fixed position, behind all content */}
      {/* <BackgroundCanvas /> */}
      
      {/* Page Content - Layers above 3D background */}
      <RouterProvider router={router} />
    </>
  )
}

export default App
