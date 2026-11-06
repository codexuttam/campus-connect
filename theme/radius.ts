/**
 * CampusConnect Border Radius Tokens
 * Strict requirement: Consistent 12–16px corner radius across cards and inputs,
 * with pill variations for chips and round avatars.
 */

export const radius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,       // Standard buttons, small inputs
  lg: 14,       // Standard inputs, modals
  card: 16,     // Default card radius (16px)
  xl: 18,
  full: 9999,   // Badges, pills, avatar circles
} as const;

export type RadiusToken = keyof typeof radius;

