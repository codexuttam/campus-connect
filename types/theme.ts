import { TextStyle, ViewStyle } from 'react-native';
import { theme } from '../theme';

export type AppTheme = typeof theme;

export type TextVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'bodyLarge'
  | 'body'
  | 'bodyMedium'
  | 'bodySmall'
  | 'bodySmallMedium'
  | 'caption'
  | 'captionMedium'
  | 'editorial'
  | 'editorialItalic'
  | 'editorialHeader'
  | 'button'
  | 'buttonSmall'
  | 'badge';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'olive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type CardVariant = 'default' | 'surface' | 'outlined' | 'maroon' | 'olive';

export type BadgeVariant = 'maroon' | 'olive' | 'neutral' | 'outline';
export type BadgeSize = 'sm' | 'md';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

