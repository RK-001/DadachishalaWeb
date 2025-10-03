/**
 * Color utility functions for the Dadachishala NGO website
 * Provides helper functions to work with the centralized color system
 */

import { colors } from '../config/colors.js';

/**
 * Get a color value from the color system
 * @param {string} colorPath - Dot notation path to color (e.g., 'primary.600', 'secondary.500')
 * @returns {string} Hex color value
 */
export const getColor = (colorPath) => {
  const pathArray = colorPath.split('.');
  let result = colors;
  
  for (const key of pathArray) {
    result = result[key];
    if (!result) {
      console.warn(`Color path "${colorPath}" not found. Returning fallback color.`);
      return colors.primary[600]; // Fallback to primary navy
    }
  }
  
  return result;
};

/**
 * Get CSS custom property string for a color
 * @param {string} colorPath - Dot notation path to color
 * @returns {string} CSS var() string
 */
export const getCSSVar = (colorPath) => {
  const cssVarName = `--color-${colorPath.replace('.', '-')}`;
  return `var(${cssVarName})`;
};

/**
 * Generate Tailwind CSS class name for a color
 * @param {string} type - Type of property ('bg', 'text', 'border')
 * @param {string} colorPath - Dot notation path to color
 * @returns {string} Tailwind class name
 */
export const getTailwindClass = (type, colorPath) => {
  const colorName = colorPath.replace('.', '-');
  return `${type}-${colorName}`;
};

/**
 * Convert hex color to RGB values
 * @param {string} hex - Hex color value
 * @returns {object} RGB object with r, g, b properties
 */
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * Convert hex color to RGBA string
 * @param {string} hex - Hex color value
 * @param {number} alpha - Alpha value (0-1)
 * @returns {string} RGBA color string
 */
export const hexToRgba = (hex, alpha = 1) => {
  const rgb = hexToRgb(hex);
  return rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})` : hex;
};

/**
 * Get theme colors for consistent usage across components
 */
export const themeColors = {
  // Primary brand colors
  primary: getColor('primary.600'), // Navy blue
  primaryLight: getColor('primary.100'),
  primaryDark: getColor('primary.800'),
  
  // Secondary brand colors
  secondary: getColor('secondary.500'), // Gold
  secondaryLight: getColor('secondary.100'),
  secondaryDark: getColor('secondary.700'),
  
  // Neutral colors
  white: getColor('brand.white'),
  black: getColor('neutral.900'),
  gray: {
    50: getColor('neutral.50'),
    100: getColor('neutral.100'),
    200: getColor('neutral.200'),
    300: getColor('neutral.300'),
    400: getColor('neutral.400'),
    500: getColor('neutral.500'),
    600: getColor('neutral.600'),
    700: getColor('neutral.700'),
    800: getColor('neutral.800'),
    900: getColor('neutral.900'),
  },
  
  // Semantic colors
  success: getColor('semantic.success.main'),
  warning: getColor('semantic.warning.main'),
  error: getColor('semantic.error.main'),
  
  // Special NGO colors
  navy: getColor('brand.navy'),
  cream: getColor('brand.cream'),
};

/**
 * Common color combinations for NGO branding
 */
export const colorCombinations = {
  heroGradient: {
    from: getColor('primary.50'),
    via: getColor('brand.white'),
    to: getColor('secondary.50'),
  },
  
  donationCard: {
    background: getColor('brand.white'),
    border: getColor('secondary.500'),
    text: getColor('neutral.900'),
  },
  
  callToAction: {
    background: getColor('primary.600'),
    backgroundHover: getColor('primary.700'),
    text: getColor('brand.white'),
  },
  
  accent: {
    background: getColor('secondary.500'),
    backgroundHover: getColor('secondary.600'),
    text: getColor('brand.white'),
  },
};

/**
 * Get appropriate text color based on background color
 * @param {string} backgroundColor - Background color hex value
 * @returns {string} Appropriate text color (white or dark)
 */
export const getContrastTextColor = (backgroundColor) => {
  const rgb = hexToRgb(backgroundColor);
  if (!rgb) return getColor('neutral.900');
  
  // Calculate relative luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  
  // Return white text for dark backgrounds, dark text for light backgrounds
  return luminance > 0.5 ? getColor('neutral.900') : getColor('brand.white');
};

export default {
  getColor,
  getCSSVar,
  getTailwindClass,
  hexToRgb,
  hexToRgba,
  themeColors,
  colorCombinations,
  getContrastTextColor,
};
