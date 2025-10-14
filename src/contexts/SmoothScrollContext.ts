/**
 * Smooth Scroll Context
 * 
 * React Context for smooth scroll functionality.
 * 
 * @module contexts/SmoothScrollContext
 */

import { createContext } from 'react'
import type { SmoothScrollContextValue } from '@/types/scroll'

/**
 * Smooth Scroll Context
 */
export const SmoothScrollContext = createContext<SmoothScrollContextValue | null>(null)