/**
 * CampusConnect Color Palette
 *
 * Strict university-community aesthetic:
 * Minimal, warm, elegant, editorial, and tactile.
 */

export const colors = {
  // Core Brand Tokens
  background: '#F3EBDD',         // Primary warm paper background
  maroon: '#702D3B',             // Primary brand maroon
  maroonDark: '#541F2B',         // Deep maroon for pressed states
  maroonLight: '#F3E5E7',        // Soft maroon tint for badges/accents
  olive: '#737B4B',              // Olive green secondary brand
  oliveDark: '#575E37',          // Deep olive for pressed states
  oliveLight: '#EEF1E6',         // Soft olive tint for badges/accents

  // Surfaces & Layers
  surface: '#E6DCCB',            // Secondary surface (chips, secondary buttons, toolbars)
  surfaceLight: '#EFE6D7',       // Intermediate surface
  card: '#FBF7EF',               // Clean, light elevated card background
  cardHover: '#F7F1E5',          // Card active/pressed state

  // Typography
  textPrimary: '#302B28',        // Main text (deep espresso tone)
  textSecondary: '#82796B',      // Secondary text (warm taupe)
  textMuted: '#A79E90',          // Muted placeholder / helper text
  textInverse: '#FBF7EF',        // Light text on dark/maroon backgrounds

  // Borders & Dividers
  border: '#DFD4C1',             // Subtle flat outline border
  borderSubtle: '#ECE4D4',       // Very subtle divider
  borderStrong: '#82796B',       // High-contrast border

  // Interactive / Feedback States
  active: '#702D3B',             // Active navigation / selected tab
  inactive: '#9B9080',           // Inactive navigation icon / label
  highlight: '#E8D4BE',          // Highlight tint

  // Semantic Status (Warm, desaturated tones matching the aesthetic)
  success: '#5B7A49',
  successLight: '#EFF5EC',
  error: '#943843',
  errorLight: '#FBECEE',
  warning: '#B87834',
  warningLight: '#FAF1E6',
  info: '#4F6C7D',
  infoLight: '#EDF3F7',
} as const;

export type ColorToken = keyof typeof colors;

