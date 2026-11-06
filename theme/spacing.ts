/**
 * CampusConnect Spacing Scale
 * Clean 4pt / 8pt grid system for consistent whitespace.
 */

export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  massive: 48,
  screenPadding: 20,
  cardPadding: 16,
  tabBarHeight: 64,
  headerHeight: 56,
} as const;

export type SpacingToken = keyof typeof spacing;

