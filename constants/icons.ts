/**
 * Centralized Icon Sizing and Configuration
 * Simple outline icons, stroke width 1.75 - 2
 */

export const iconSizes = {
  xs: 14,
  sm: 18,
  md: 22,
  lg: 26,
  xl: 32,
  tab: 22,
  header: 22,
} as const;

export const iconStrokeWidth = {
  thin: 1.5,
  default: 1.8,
  bold: 2.2,
} as const;

export type IconSizeToken = keyof typeof iconSizes;

