import { colors, ColorToken } from './colors';
import {
  fontFamilies,
  fontSizes,
  lineHeights,
  letterSpacing,
  typographyPresets,
} from './typography';
import { spacing, SpacingToken } from './spacing';
import { radius, RadiusToken } from './radius';
import { shadows } from './shadows';
import { iconSizes, iconStrokeWidth } from '../constants/icons';

export const theme = {
  colors,
  fontFamilies,
  fontSizes,
  lineHeights,
  letterSpacing,
  typography: typographyPresets,
  spacing,
  radius,
  shadows,
  icons: {
    sizes: iconSizes,
    strokeWidth: iconStrokeWidth,
  },
} as const;

export type Theme = typeof theme;

export {
  colors,
  fontFamilies,
  fontSizes,
  lineHeights,
  letterSpacing,
  typographyPresets,
  spacing,
  radius,
  shadows,
  iconSizes,
  iconStrokeWidth,
};

export type { ColorToken, SpacingToken, RadiusToken };

