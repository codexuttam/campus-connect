/**
 * NIU Connect Color Palette — Luxury-Academic Design Language
 *
 * Noida International University ("Your Campus. Your Community.")
 * Deep Maroon (#641426), Burgundy (#861E35), Wine Red (#9F3048),
 * Silver (#C8C9CE), Light Silver (#E8E8EC), Pure White (#FFFFFF),
 * Background (#F7F7F9), Text (#202027).
 */

export const colors = {
  // Core Brand Tokens
  background: '#F7F7F9',         // Premium cool silver-white background
  maroon: '#641426',             // Deep Maroon primary brand
  maroonDark: '#4A0E1C',         // Darker maroon for pressed states
  maroonLight: '#F6EBF0',        // Soft wine/burgundy tint for badges & active pills
  burgundy: '#861E35',           // Secondary burgundy accent
  wine: '#9F3048',               // Wine red highlight
  silver: '#C8C9CE',             // Metallic silver accent
  silverLight: '#E8E8EC',        // Light silver surface
  olive: '#861E35',              // Mapped to Burgundy for luxury-academic consistency
  oliveDark: '#641426',          // Deep Maroon
  oliveLight: '#F5E9EC',         // Soft burgundy tint

  // Surfaces & Layers
  surface: '#E8E8EC',            // Light Silver secondary surface (chips, inputs, toolbars)
  surfaceLight: '#F2F2F5',       // Intermediate silver-white surface
  card: '#FFFFFF',               // Pure White elevated card background
  cardHover: '#FAFAFC',          // Subtle hover/pressed state

  // Typography
  textPrimary: '#202027',        // Deep charcoal-ink primary text
  textSecondary: '#5A5B66',      // Balanced slate secondary text
  textMuted: '#8C8E99',          // Muted silver-slate helper text
  textInverse: '#FFFFFF',        // Pure white text on maroon backgrounds

  // Borders & Dividers
  border: '#E2E3E8',             // Crisp silver hairline border
  borderSubtle: '#ECECEF',       // Subtle divider
  borderStrong: '#C8C9CE',       // Metallic silver strong border

  // Interactive / Feedback States
  active: '#641426',             // Active navigation / selected tab
  inactive: '#7E808C',           // Inactive navigation icon / label
  highlight: '#F3E5E9',          // Highlight tint

  // Semantic Status
  success: '#1E7E48',
  successLight: '#EAF6EE',
  error: '#B4232C',
  errorLight: '#FCECEE',
  warning: '#B86B14',
  warningLight: '#FEF4E8',
  info: '#2563EB',
  infoLight: '#EFF6FF',
} as const;

export type ColorToken = keyof typeof colors;

