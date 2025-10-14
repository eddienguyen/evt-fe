/**
 * Fallback Hero Component
 * 
 * Beautiful 2D gradient hero with CSS-only animations.
 * Used as fallback for low-end devices or when 3D is not supported.
 * 
 * @module components/FallbackHero
 */

import React from 'react'
import { couple, events } from '../config/site'

const FallbackHero: React.FC = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-hero-from via-hero-mid to-hero-to">
      {/* Animated star pattern overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(2px 2px at 20% 30%, white, transparent),
                           radial-gradient(2px 2px at 60% 70%, white, transparent),
                           radial-gradient(1px 1px at 50% 50%, white, transparent),
                           radial-gradient(1px 1px at 80% 10%, white, transparent),
                           radial-gradient(2px 2px at 90% 60%, white, transparent),
                           radial-gradient(1px 1px at 33% 80%, white, transparent),
                           radial-gradient(1px 1px at 15% 90%, white, transparent)`,
          backgroundSize: '200% 200%',
          backgroundPosition: '0% 0%',
          animation: 'twinkle 8s ease-in-out infinite'
        }}
      />

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

      {/* Content container */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="text-center text-accent-white max-w-4xl">
          <h1 
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 animate-fade-in"
            style={{
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
              animationDuration: '1s',
              animationFillMode: 'both'
            }}
          >
            {couple.displayName}
          </h1>
          
          <p 
            className="text-lg sm:text-xl md:text-2xl animate-fade-in-delay"
            style={{
              textShadow: '0 1px 5px rgba(0, 0, 0, 0.3)',
              animationDuration: '1s',
              animationDelay: '0.3s',
              animationFillMode: 'both'
            }}
          >
            {events.hue.dateDisplay}
          </p>

          {/* Decorative line */}
          <div 
            className="mt-8 mx-auto w-24 h-0.5 bg-accent-gold/50 animate-fade-in-delay"
            style={{
              animationDelay: '0.6s',
              animationFillMode: 'both'
            }}
          />
        </div>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-delay {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.2);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in-delay 1s ease-out;
        }

        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  )
}

export default FallbackHero
