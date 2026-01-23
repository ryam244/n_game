// Theme configuration for Particle Alchemy Loop

export const colors = {
  primary: '#4396ea',
  primaryDark: '#3080d0',
  backgroundDark: '#111921',
  backgroundLight: '#f6f7f8',
  cardDark: '#1c2126',
  sand: '#D4A574',
  water: '#4A90E2',
  stone: '#6B6B6B',
  white: '#FFFFFF',
  black: '#000000',
  glassBackground: 'rgba(17, 25, 33, 0.75)',
  glassBackgroundLight: 'rgba(255, 255, 255, 0.03)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.8)',
  textMuted: 'rgba(255, 255, 255, 0.5)',
  textDisabled: 'rgba(255, 255, 255, 0.3)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '700' as const },
  h2: { fontSize: 24, fontWeight: '700' as const },
  h3: { fontSize: 20, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  bodySmall: { fontSize: 14, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '500' as const },
  tiny: { fontSize: 10, fontWeight: '600' as const },
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const gameConfig = {
  maxParticles: 5000,
  particleSize: 4,
  gravity: 0.5,
  friction: 0.98,
  gridSize: 4,
};

export const elementTypes = {
  sand: {
    id: 'sand',
    name: 'Sand',
    color: colors.sand,
    icon: 'grain',
  },
  water: {
    id: 'water',
    name: 'Water',
    color: colors.water,
    icon: 'water-drop',
  },
  stone: {
    id: 'stone',
    name: 'Stone',
    color: colors.stone,
    icon: 'landscape',
  },
} as const;

export type ElementType = keyof typeof elementTypes;
