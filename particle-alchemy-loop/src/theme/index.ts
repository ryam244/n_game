// src/theme/index.ts
// Particle Alchemy Loop - Global Theme Configuration
// Extracted from HTML mockups

export const colors = {
  // Primary colors
  primary: '#4396ea',
  primaryDark: '#3080d0',
  primaryLight: '#5aa8f5',

  // Background colors
  backgroundDark: '#111921',
  backgroundLight: '#f6f7f8',
  cardDark: '#1c2126',

  // Accent colors
  accentGold: '#FFD700',
  cyanGlow: '#00f2ff',

  // Element colors (for particles)
  sand: '#D4A574',
  water: '#4A90E2',
  stone: '#6B6B6B',
  fire: '#FF6B35',
  plant: '#7BC043',
  oil: '#8B4513',
  steam: '#E0E0E0',
  lava: '#FF4500',
  ice: '#A2D9F7',
  smoke: '#808080',

  // UI colors
  white: '#FFFFFF',
  black: '#000000',

  // Transparent overlays
  glassBackground: 'rgba(17, 25, 33, 0.75)',
  glassBackgroundLight: 'rgba(255, 255, 255, 0.03)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
  glassBorderLight: 'rgba(255, 255, 255, 0.05)',

  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.8)',
  textMuted: 'rgba(255, 255, 255, 0.5)',
  textDisabled: 'rgba(255, 255, 255, 0.3)',

  // Status colors
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
};

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const typography = {
  // Font family
  fontFamily: 'System', // Will use SF Pro on iOS

  // Font sizes
  h1: {
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    letterSpacing: 0,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: 0,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    letterSpacing: 0,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
    letterSpacing: 0.2,
  },
  tiny: {
    fontSize: 10,
    fontWeight: '600' as const,
    letterSpacing: 0.3,
  },

  // Special tracking styles
  trackingWide: {
    letterSpacing: 3,
  },
  trackingWidest: {
    letterSpacing: 4,
  },
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};

export const shadows = {
  glow: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  goldGlow: {
    shadowColor: colors.accentGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  card: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const icons = {
  strokeWidth: 1.5,
  size: {
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
  },
};

// Game-specific constants
export const gameConfig = {
  // Particle settings
  maxParticles: 20000,
  particleSize: 4,

  // Physics
  gravity: 0.5,
  friction: 0.98,

  // Canvas settings
  gridSize: 4,

  // Animation
  targetFPS: 60,
};

// Element type definitions
export const elementTypes = {
  sand: {
    id: 'sand',
    name: 'Sand',
    color: colors.sand,
    icon: 'grain',
    density: 1.5,
    friction: 0.8,
    isFluid: false,
    isSolid: true,
  },
  water: {
    id: 'water',
    name: 'Water',
    color: colors.water,
    icon: 'water_drop',
    density: 1.0,
    friction: 0.2,
    isFluid: true,
    isSolid: false,
  },
  stone: {
    id: 'stone',
    name: 'Stone',
    color: colors.stone,
    icon: 'mountain_flag',
    density: 3.0,
    friction: 1.0,
    isFluid: false,
    isSolid: true,
    isStatic: true,
  },
} as const;

export type ElementType = keyof typeof elementTypes;

// Export complete theme object
export const theme = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  icons,
  gameConfig,
  elementTypes,
};

export default theme;
