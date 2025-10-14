/**
 * Canvas Text Position Configuration
 * 
 * Defines text positioning coordinates for invitation images.
 * Adjust these values to match your actual image layouts.
 * 
 * @module pages/admin/_components/canvasConfig
 */

export interface TextPosition {
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  align: 'left' | 'center' | 'right';
  maxWidth?: number;
}

export interface VenueCanvasConfig {
  frontImage: {
    path: string;
    namePosition: TextPosition;
  };
  mainImage: {
    path: string;
    secondaryNotePosition: TextPosition;
  };
}

/**
 * Canvas configuration for each venue
 * 
 * **ADJUST THESE VALUES** to match your image layouts:
 * - x, y: Text position coordinates (in pixels)
 * - fontSize: Font size for the text
 * - color: Text color (hex or rgb)
 */
export const CANVAS_CONFIG: Record<'hue' | 'hanoi', VenueCanvasConfig> = {
  hue: {
    // Front image - for guest name
    frontImage: {
      path: '/invitations/Hue-invitation-front.jpg',
      namePosition: {
        x: 1150,        
        y: 890,        
        fontSize: 50,
        fontFamily: 'Dancing Script, cursive',
        color: '#2C1810',
        align: 'left',
        maxWidth: 600
      }
    },
    // Main image - for secondary note
    mainImage: {
      path: '/invitations/Hue-invitation.jpg',
      secondaryNotePosition: {
        x: 770,        
        y: 260,        
        fontSize: 38,
        fontFamily: 'Dancing Script, cursive',
        color: '#5A4A42',
        align: 'left',
        maxWidth: 600
      }
    }
  },
  hanoi: {
    // Front image - for guest name
    frontImage: {
      path: '/invitations/HN-invitation-front.jpg',
      namePosition: {
        x: 1150,        
        y: 900,        
        fontSize: 56,
        fontFamily: 'Dancing Script, cursive',
        color: '#2C1810',
        align: 'left',
        maxWidth: 600
      }
    },
    // Main image - for secondary note
    mainImage: {
      path: '/invitations/HN-invitation.jpg',
      secondaryNotePosition: {
        x: 1060,        
        y: 180,        
        fontSize: 40,
        fontFamily: 'Dancing Script, cursive',
        color: '#5A4A42',
        align: 'left',
        maxWidth: 600
      }
    }
  }
};

/**
 * Load Dancing Script font for canvas rendering
 */
export function loadDancingScriptFont(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      resolve();
      return;
    }

    // Check if font is already loaded
    if (document.fonts && document.fonts.check('12px "Dancing Script"')) {
      resolve();
      return;
    }

    // Create link element for Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    
    link.onload = () => {
      // Wait for font to be actually loaded
      if (document.fonts) {
        document.fonts.ready.then(() => resolve());
      } else {
        // Fallback: wait a bit for font to load
        setTimeout(resolve, 100);
      }
    };
    
    link.onerror = () => reject(new Error('Failed to load Dancing Script font'));
    
    document.head.appendChild(link);
  });
}
