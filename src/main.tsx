// TEMPORARY: StrictMode disabled to prevent WebGL context loss during debugging
// StrictMode causes components to mount twice in dev mode, exhausting WebGL contexts
import { createRoot } from 'react-dom/client'
import { SmoothScrollProvider } from './components/providers/SmoothScrollProvider'
import { initVersionBadge } from './components/VersionBadge'
import './index.css'
import App from './App.tsx'

// Initialize version badge (Ctrl+Shift+V to show/hide)
initVersionBadge()

createRoot(document.getElementById('root')!).render(
  <SmoothScrollProvider autoInit={true} enableSectionTracking={true}>
    <App />
  </SmoothScrollProvider>
)
