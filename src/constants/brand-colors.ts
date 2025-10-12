/**
 * Brand Colors for CareConnects Application
 * These colors are used consistently across the entire application
 */
//TODO: can we use color config from tailwind config
export const BRAND_COLORS = {
  // Primary brand blue color
  BLUE: '#1777ff',
  // Secondary brand green color
  GREEN: '#88d069',
} as const;

// CSS custom properties for use in styles
export const BRAND_COLOR_VARS = {
  BLUE: 'var(--color-brand-blue)',
  GREEN: 'var(--color-brand-green)',
} as const;

// Tailwind class names for brand colors
export const BRAND_COLOR_CLASSES = {
  BLUE: {
    bg: 'bg-brand-blue',
    text: 'text-brand-blue',
    border: 'border-brand-blue',
    ring: 'ring-brand-blue',
    hover: 'hover:bg-brand-blue',
    focus: 'focus:ring-brand-blue',
  },
  GREEN: {
    bg: 'bg-brand-green',
    text: 'text-brand-green',
    border: 'border-brand-green',
    ring: 'ring-brand-green',
    hover: 'hover:bg-brand-green',
    focus: 'focus:ring-brand-green',
  },
} as const;

// Color variations for different states
export const BRAND_COLOR_VARIATIONS = {
  BLUE: {
    DEFAULT: '#1777ff',
    LIGHT: '#4d9bff', // Lighter shade
    DARK: '#0d5bcc', // Darker shade
    HOVER: '#0d5bcc', // Hover state
    FOCUS: '#0d5bcc', // Focus state
  },
  GREEN: {
    DEFAULT: '#88d069',
    LIGHT: '#a8e085', // Lighter shade
    DARK: '#6bb84d', // Darker shade
    HOVER: '#6bb84d', // Hover state
    FOCUS: '#6bb84d', // Focus state
  },
} as const;
