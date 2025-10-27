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
  align: "left" | "center" | "right";
  maxWidth?: number;
  lineHeight?: number;
}

export interface AutoSizeConfig {
  enabled?: boolean;
  minFontSize: number;
  maxFontSize: number;
  baseFontSize: number;
  maxWidth: number;
}

export interface VenueCanvasConfig {
  frontImage: {
    path: string;
    namePosition: TextPosition;
    autoSize?: AutoSizeConfig;
  };
  mainImage: {
    path: string;
    secondaryNotePosition: TextPosition;
    autoSize?: AutoSizeConfig;
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
export const CANVAS_CONFIG: Record<"hue" | "hanoi", VenueCanvasConfig> = {
  hue: {
    // Front image - for guest name
    frontImage: {
      path: "/invitations/Hue-inv-front-2.png",
      namePosition: {
        x: 850,
        y: 3650,
        fontSize: 100,
        fontFamily: "Dancing Script, cursive",
        color: "#2C1810",
        align: "left",
        maxWidth: 1000,
        lineHeight: 100,
      },
      autoSize: {
        enabled: true,
        minFontSize: 28,
        maxFontSize: 100,
        baseFontSize: 100,
        maxWidth: 1000,
      },
    },
    // Main image - for secondary note
    mainImage: {
      path: "/invitations/Hue-invitation.jpg",
      secondaryNotePosition: {
        x: 770,
        y: 260,
        fontSize: 38,
        fontFamily: "Dancing Script, cursive",
        color: "#5A4A42",
        align: "left",
        maxWidth: 600,
        lineHeight: 48,
      },
      autoSize: {
        enabled: true,
        minFontSize: 18,
        maxFontSize: 48,
        baseFontSize: 38,
        maxWidth: 600,
      },
    },
  },
  hanoi: {
    // Front image - for guest name
    frontImage: {
      path: "/invitations/HN-inv-front-2.png",
      namePosition: {
        x: 850,
        y: 3650,
        fontSize: 100,
        fontFamily: "Dancing Script, cursive",
        color: "#2C1810",
        align: "left",
        maxWidth: 1000,
        lineHeight: 100,
      },
      autoSize: {
        enabled: true,
        minFontSize: 28,
        maxFontSize: 100,
        baseFontSize: 100,
        maxWidth: 1000,
      },
    },
    // Main image - for secondary note
    mainImage: {
      path: "/invitations/HN-invitation.jpg",
      secondaryNotePosition: {
        x: 1060,
        y: 180,
        fontSize: 40,
        fontFamily: "Dancing Script, cursive",
        color: "#5A4A42",
        align: "left",
        maxWidth: 600,
        lineHeight: 50,
      },
      autoSize: {
        enabled: true,
        minFontSize: 20,
        maxFontSize: 50,
        baseFontSize: 40,
        maxWidth: 600,
      },
    },
  },
};

/**
 * Load Dancing Script font for canvas rendering
 */
export function loadDancingScriptFont(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document === "undefined") {
      resolve();
      return;
    }

    // Check if font is already loaded
    if (document.fonts?.check('12px "Dancing Script"')) {
      resolve();
      return;
    }

    // Create link element for Google Fonts
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap";
    link.rel = "stylesheet";

    link.onload = () => {
      // Wait for font to be actually loaded
      if (document.fonts) {
        document.fonts.ready.then(() => resolve());
      } else {
        // Fallback: wait a bit for font to load
        setTimeout(resolve, 100);
      }
    };

    link.onerror = () =>
      reject(new Error("Failed to load Dancing Script font"));

    document.head.appendChild(link);
  });
}
