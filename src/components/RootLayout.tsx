import React, { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { copyright } from '../config/site'
import FloatingCTAs from './FloatingCTAs'
import { versionInfo } from '@/version'

const RootLayout: React.FC = () => {
  const location = useLocation()
  const [showVersionDetails, setShowVersionDetails] = useState(false)
  // const handleAnchorClick = useAnchorNavigation({ offset: 80 })

  /**
   * Determine if a navigation link is currently active
   */
  const isActivePath = (path: string): boolean => {
    return location.pathname === path
  }

  /**
   * Check if current path is an admin page
   */
  const isAdminPage = (): boolean => {
    return location.pathname.startsWith('/admin')
  }

  /**
   * Get navigation link classes with active state
   */
  const getNavLinkClasses = (path: string): string => {
    const baseClasses = 'hover:text-accent-gold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2 rounded-sm px-2 py-1'
    const activeClasses = isActivePath(path) ? 'text-accent-gold font-semibold' : 'text-text'
    return `${baseClasses} ${activeClasses}`
  }

  return (
    <div className="min-h-screen flex flex-col relative z-1">
      {/* Skip to Content Link for Keyboard Navigation */}
      {/* <a
        href="#main-content"
        onClick={handleAnchorClick}
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-accent-gold focus:text-white focus:rounded-lg focus:shadow-strong focus:font-medium focus:transition-all focus:duration-150"
      >
        Skip to main content
      </a> */}

      <header className="fixed top-0 left-0 right-0 z-50 bg-base-light/80 backdrop-blur-sm shadow-soft">
        <nav className="container mx-auto px-4 py-4" aria-label="Main navigation">
          <ul className="flex items-center justify-center gap-8">
            <li>
              <Link
                to="/"
                className={getNavLinkClasses('/')}
                aria-current={isActivePath('/') ? 'page' : undefined}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/gallery"
                className={getNavLinkClasses('/gallery')}
                aria-current={isActivePath('/gallery') ? 'page' : undefined}
              >
                Gallery
              </Link>
            </li>
            <li>
              <Link
                to="/location"
                className={getNavLinkClasses('/location')}
                aria-current={isActivePath('/location') ? 'page' : undefined}
              >
                Location
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <main id="main-content" className="flex-grow pt-16">
        <Outlet />
      </main>

      <footer className="bg-base py-8" role="contentinfo">
        <div className="container mx-auto px-4 text-center text-text-light">
          {/* Copyright text - Click to toggle version info */}
          <p 
            onClick={() => setShowVersionDetails(!showVersionDetails)}
            className="cursor-pointer hover:text-text transition-colors duration-150 select-none"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setShowVersionDetails(!showVersionDetails)
              }
            }}
            aria-expanded={showVersionDetails}
            aria-label="Click to show version information"
          >
            {copyright.text} - {copyright.year} and continuing...
          </p>
          
          {/* Version Details - Shows on click, hidden by default */}
          {showVersionDetails && (
            <div className="mt-4 inline-block bg-base-dark/50 backdrop-blur-sm border border-text-light/20 rounded-lg p-4 text-left shadow-lg">
              <div className="font-mono text-xs space-y-1">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-text-light/20">
                  <span className="text-green-400">●</span>
                  <span className="font-bold text-sm text-accent-gold">v{versionInfo.version}</span>
                </div>
                <div className="text-text-light/80 space-y-0.5">
                  <div>
                    <span className="text-text-light/50">Commit:</span>{' '}
                    <span className="text-text">{versionInfo.gitCommit}</span>
                  </div>
                  <div>
                    <span className="text-text-light/50">Branch:</span>{' '}
                    <span className="text-text">{versionInfo.gitBranch}</span>
                  </div>
                  <div>
                    <span className="text-text-light/50">Built:</span>{' '}
                    <span className="text-text">
                      {new Date(versionInfo.buildTimestamp).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-light/50">Env:</span>{' '}
                    <span className="text-text">{versionInfo.environment}</span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-text-light/10 text-[10px] text-text-light/40">
                  Click copyright to hide
                </div>
              </div>
            </div>
          )}
        </div>
      </footer>

      {/* Floating CTAs - Persistent across all pages except admin */}
      {!isAdminPage() && <FloatingCTAs />}
    </div>
  )
}

export default RootLayout