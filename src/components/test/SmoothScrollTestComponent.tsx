import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';
import { useScrollTo } from '../../hooks/useScrollTo';

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

export const SmoothScrollTestComponent: React.FC = () => {
  const { isEnabled, deviceTier } = useSmoothScroll();
  const { scrollToElement } = useScrollTo();
  
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  const animatedBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (section1Ref.current && animatedBoxRef.current) {
      // Test GSAP ScrollTrigger with smooth scroll
      gsap.fromTo(
        animatedBoxRef.current,
        { 
          opacity: 0, 
          y: 100,
          scale: 0.8 
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section2Ref.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
            refreshPriority: -1, // Ensure it works with Lenis
          }
        }
      );

      // Parallax effect test
      gsap.to(section3Ref.current, {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: section3Ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          refreshPriority: -1,
        }
      });

      return () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    }
  }, []);

  const handleScrollToSection = (sectionId: string) => {
    scrollToElement(`#${sectionId}`, { customOffset: 80 });
  };

  return (
    <div className="smooth-scroll-test">
      {/* Test Status Header */}
      <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg z-50 text-sm">
        <div className="space-y-1">
          <div>Smooth Scroll: {isEnabled ? '✅ Enabled' : '❌ Disabled'}</div>
          <div>Status: ✅ Ready</div>
          <div>Device Tier: {deviceTier}</div>
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed top-4 left-4 space-y-2 z-40">
        <button
          onClick={() => handleScrollToSection('test-section-1')}
          className="block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Scroll to Section 1
        </button>
        <button
          onClick={() => handleScrollToSection('test-section-2')}
          className="block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Scroll to Section 2
        </button>
        <button
          onClick={() => handleScrollToSection('test-section-3')}
          className="block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          Scroll to Section 3
        </button>
      </div>

      {/* Test Section 1 - Basic Smooth Scroll */}
      <section 
        id="test-section-1"
        ref={section1Ref}
        className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center"
      >
        <div className="text-center text-white max-w-2xl mx-auto p-8">
          <h1 className="text-5xl font-bold mb-6">Smooth Scroll Test</h1>
          <p className="text-xl mb-8">
            This page tests the integration between our smooth scroll implementation
            and GSAP ScrollTrigger animations.
          </p>
          <div className="text-lg space-y-2">
            <div>Device Tier: <span className="font-semibold">{deviceTier}</span></div>
            <div>Status: <span className="font-semibold">Ready</span></div>
          </div>
        </div>
      </section>

      {/* Test Section 2 - GSAP Animation */}
      <section 
        id="test-section-2"
        ref={section2Ref}
        className="min-h-screen bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center relative"
      >
        <div className="text-center text-white max-w-2xl mx-auto p-8">
          <h2 className="text-4xl font-bold mb-6">GSAP ScrollTrigger Test</h2>
          <p className="text-lg mb-8">
            The box below should animate when this section comes into view.
          </p>
          
          {/* Animated Box */}
          <div 
            ref={animatedBoxRef}
            className="w-32 h-32 bg-white rounded-xl mx-auto shadow-2xl flex items-center justify-center"
          >
            <span className="text-green-600 font-bold text-lg">✨ GSAP</span>
          </div>
          
          <p className="text-sm mt-6 opacity-75">
            This animation uses GSAP ScrollTrigger with refreshPriority: -1 to ensure
            compatibility with Lenis smooth scroll.
          </p>
        </div>
      </section>

      {/* Test Section 3 - Parallax */}
      <section 
        id="test-section-3"
        className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center relative overflow-hidden"
      >
        <div 
          ref={section3Ref}
          className="absolute inset-0 bg-gradient-to-t from-purple-800/50 to-transparent"
        />
        
        <div className="text-center text-white max-w-2xl mx-auto p-8 relative z-10">
          <h2 className="text-4xl font-bold mb-6">Parallax Test</h2>
          <p className="text-lg mb-8">
            The background should have a subtle parallax effect when scrolling.
          </p>
          
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Smooth Scroll Features</h3>
              <ul className="text-left space-y-1">
                <li>• Lenis Integration</li>
                <li>• Device Optimization</li>
                <li>• GSAP Compatibility</li>
                <li>• Reduced Motion Support</li>
              </ul>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Performance</h3>
              <ul className="text-left space-y-1">
                <li>• GPU Acceleration</li>
                <li>• Memory Monitoring</li>
                <li>• Auto Degradation</li>
                <li>• Error Recovery</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Large spacing for scroll testing */}
      <section className="h-96 bg-gray-100 flex items-center justify-center">
        <div className="text-center text-gray-600">
          <h3 className="text-2xl font-bold mb-4">End of Test Page</h3>
          <p>Scroll back up to test the smooth scroll behavior!</p>
        </div>
      </section>
    </div>
  );
};

export default SmoothScrollTestComponent;