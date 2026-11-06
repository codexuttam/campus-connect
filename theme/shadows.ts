import { ViewStyle, Platform } from 'react-native';

/**
 * CampusConnect Shadow Tokens
 * Minimal, delicate paper-like elevation suited for the warm university aesthetic.
 */

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  } as ViewStyle,

  subtle: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#302B28',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
    },
    android: {
      elevation: 1,
    },
    default: {
      boxShadow: '0 2px 4px rgba(48, 43, 40, 0.04)',
    } as unknown as ViewStyle,
  }),

  card: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#302B28',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.05,
      shadowRadius: 6,
    },
    android: {
      elevation: 2,
    },
    default: {
      boxShadow: '0 3px 6px rgba(48, 43, 40, 0.05)',
    } as unknown as ViewStyle,
  }),

  modal: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#302B28',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
    },
    android: {
      elevation: 6,
    },
    default: {
      boxShadow: '0 8px 16px rgba(48, 43, 40, 0.08)',
    } as unknown as ViewStyle,
  }),
} as const;

