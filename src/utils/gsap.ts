/**
 * GSAP Configuration
 * 
 * Registers GSAP plugins and configures global settings.
 * Import this file before using GSAP features that require plugins.
 * 
 * @module utils/gsap
 */

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

console.log('[GSAP] Initialized with ScrollTrigger', { gsap, ScrollTrigger })

// Export configured gsap and plugins
export { gsap, ScrollTrigger }
