// Color Configuration for Dada Chi Shala Website
// All colors used throughout the application should be defined here

export const colors = {
  // Primary Brand Colors
  primary: {
    50: '#f0f4ff',
    100: '#e0e9ff',
    200: '#c7d6fe',
    300: '#a5b8fc',
    400: '#8493f8',
    500: '#6366f1',
    600: '#1e3a8a', // Navy Blue - Main Primary
    700: '#1e40af',
    800: '#1e3a8a',
    900: '#172554',
    950: '#0f172a'
  },

  // Secondary/Accent Colors
  secondary: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#eab308', // Gold/Yellow accent
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12'
  },

  // Neutral Colors
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617'
  },

  // Semantic Colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d'
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f'
  },

  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d'
  },

  // Common Colors
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',

  // NGO Specific Colors
  ngo: {
    trust: '#1e3a8a',      // Navy blue for trust and reliability
    care: '#22c55e',       // Green for care and growth
    hope: '#eab308',       // Gold for hope and optimism
    community: '#6366f1',  // Blue for community
    education: '#1e40af',  // Deep blue for education
    support: '#f59e0b'     // Warm orange for support
  }
};

// Color utility functions
export const getColor = (colorPath) => {
  const keys = colorPath.split('.');
  let result = colors;
  
  for (const key of keys) {
    result = result[key];
    if (!result) return null;
  }
  
  return result;
};

// Common color combinations for the NGO theme
export const colorSchemes = {
  primary: {
    background: colors.primary[600],
    text: colors.white,
    accent: colors.secondary[500]
  },
  
  secondary: {
    background: colors.secondary[500],
    text: colors.white,
    accent: colors.primary[600]
  },
  
  neutral: {
    background: colors.neutral[50],
    text: colors.neutral[900],
    accent: colors.primary[600]
  },
  
  hero: {
    background: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.primary[800]} 100%)`,
    text: colors.white,
    accent: colors.secondary[400]
  }
};

export default colors;
