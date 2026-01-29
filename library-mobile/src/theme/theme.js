/**
 * BRAT. DESIGN. SYSTEM.
 * A high-contrast, industrial design system inspired by Charli XCX's 6th album.
 */

export const COLORS = {
  bg: '#0f0f0f',         // Deep obsidian background
  surface: '#111111',    // Elevated surface for cards
  text: '#ffffff',       // Pure white typography
  muted: 'rgba(255,255,255,0.6)', // Lower emphasis text
  brat: '#89CC04',       // The iconic "Brat" Lime Green
  bratSoft: '#B4E63A',   // Secondary neon highlight
  danger: '#D13232',     // Errors and destructive actions
  border: '#000000',     // Heavy industrial borders
};

export const RADIUS = {
  none: 0,               // Default for the sharp industrial look
  sm: 4,
  md: 8,
  lg: 12,
  xl: 32,
};

export const SPACING = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
};

/**
 * HARD. SHADOWS.
 * Using 100% opacity and 0 radius to create a "sticker" effect.
 */
export const SHADOW = {
  brat: {
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8, // Support for Android rendering
  },
  neonGlow: {
    shadowColor: '#89CC04',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  }
};

export const TYPOGRAPHY = {
  glitch: {
    textTransform: 'uppercase',
    fontWeight: '900',
    letterSpacing: -2,
  }
};