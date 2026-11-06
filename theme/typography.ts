import { TextStyle, Platform } from 'react-native';

export const fontFamilies = {
  sans: {
    regular: 'DMSans_400Regular',
    medium: 'DMSans_500Medium',
    semiBold: 'DMSans_600SemiBold',
    bold: 'DMSans_700Bold',
  },
  serif: {
    regular: 'Lora_400Regular',
    italic: 'Lora_400Regular_Italic',
    semiBold: 'Lora_600SemiBold',
    bold: 'Lora_700Bold',
  },
  fallback: {
    sans: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'sans-serif',
    }),
    serif: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
  },
} as const;

export const fontSizes = {
  display: 28,
  h1: 24,
  h2: 20,
  h3: 17,
  bodyLarge: 16,
  body: 15,
  bodySmall: 13,
  caption: 12,
  tiny: 10,
} as const;

export const lineHeights = {
  display: 34,
  h1: 30,
  h2: 26,
  h3: 22,
  bodyLarge: 22,
  body: 20,
  bodySmall: 18,
  caption: 16,
  tiny: 14,
} as const;

export const letterSpacing = {
  tighter: -0.5,
  tight: -0.2,
  normal: 0,
  wide: 0.3,
  wider: 0.6,
  caps: 1.0,
} as const;

export const typographyPresets: Record<string, TextStyle> = {
  display: {
    fontFamily: fontFamilies.sans.bold,
    fontSize: fontSizes.display,
    lineHeight: lineHeights.display,
    letterSpacing: letterSpacing.tight,
  },
  h1: {
    fontFamily: fontFamilies.sans.bold,
    fontSize: fontSizes.h1,
    lineHeight: lineHeights.h1,
    letterSpacing: letterSpacing.tight,
  },
  h2: {
    fontFamily: fontFamilies.sans.semiBold,
    fontSize: fontSizes.h2,
    lineHeight: lineHeights.h2,
    letterSpacing: letterSpacing.tight,
  },
  h3: {
    fontFamily: fontFamilies.sans.semiBold,
    fontSize: fontSizes.h3,
    lineHeight: lineHeights.h3,
    letterSpacing: letterSpacing.normal,
  },
  bodyLarge: {
    fontFamily: fontFamilies.sans.regular,
    fontSize: fontSizes.bodyLarge,
    lineHeight: lineHeights.bodyLarge,
    letterSpacing: letterSpacing.normal,
  },
  body: {
    fontFamily: fontFamilies.sans.regular,
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
    letterSpacing: letterSpacing.normal,
  },
  bodyMedium: {
    fontFamily: fontFamilies.sans.medium,
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
    letterSpacing: letterSpacing.normal,
  },
  bodySmall: {
    fontFamily: fontFamilies.sans.regular,
    fontSize: fontSizes.bodySmall,
    lineHeight: lineHeights.bodySmall,
    letterSpacing: letterSpacing.normal,
  },
  bodySmallMedium: {
    fontFamily: fontFamilies.sans.medium,
    fontSize: fontSizes.bodySmall,
    lineHeight: lineHeights.bodySmall,
    letterSpacing: letterSpacing.normal,
  },
  caption: {
    fontFamily: fontFamilies.sans.regular,
    fontSize: fontSizes.caption,
    lineHeight: lineHeights.caption,
    letterSpacing: letterSpacing.normal,
  },
  captionMedium: {
    fontFamily: fontFamilies.sans.medium,
    fontSize: fontSizes.caption,
    lineHeight: lineHeights.caption,
    letterSpacing: letterSpacing.wide,
  },
  editorial: {
    fontFamily: fontFamilies.serif.regular,
    fontSize: fontSizes.h2,
    lineHeight: lineHeights.h2,
    letterSpacing: letterSpacing.normal,
  },
  editorialItalic: {
    fontFamily: fontFamilies.serif.italic,
    fontSize: fontSizes.bodyLarge,
    lineHeight: lineHeights.bodyLarge,
    letterSpacing: letterSpacing.normal,
  },
  editorialHeader: {
    fontFamily: fontFamilies.serif.bold,
    fontSize: fontSizes.h1,
    lineHeight: lineHeights.h1,
    letterSpacing: letterSpacing.tight,
  },
  tabLabel: {
    fontFamily: fontFamilies.sans.medium,
    fontSize: fontSizes.caption,
    lineHeight: lineHeights.caption,
    letterSpacing: letterSpacing.wide,
  },
  button: {
    fontFamily: fontFamilies.sans.semiBold,
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
    letterSpacing: letterSpacing.wide,
  },
  buttonSmall: {
    fontFamily: fontFamilies.sans.semiBold,
    fontSize: fontSizes.bodySmall,
    lineHeight: lineHeights.bodySmall,
    letterSpacing: letterSpacing.wide,
  },
  badge: {
    fontFamily: fontFamilies.sans.medium,
    fontSize: fontSizes.caption,
    lineHeight: lineHeights.caption,
    letterSpacing: letterSpacing.wide,
  },
};

