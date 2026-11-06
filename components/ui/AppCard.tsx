import React from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  ViewStyle,
  StyleProp,
  PressableProps,
} from 'react-native';
import { theme } from '../../theme';
import { CardVariant } from '../../types/theme';

export interface AppCardProps extends Omit<PressableProps, 'style'> {
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export const AppCard: React.FC<AppCardProps> = ({
  variant = 'default',
  padding = 'md',
  children,
  style,
  onPress,
  ...rest
}) => {
  const isPressable = typeof onPress === 'function';
  const paddingStyle = paddingStyles[padding];
  const variantStyle = getVariantStyle(variant);

  if (isPressable) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.base,
          variantStyle.container,
          paddingStyle,
          pressed && variantStyle.pressed,
          style,
        ]}
        accessibilityRole="button"
        {...rest}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={[styles.base, variantStyle.container, paddingStyle, style]}>
      {children}
    </View>
  );
};

const getVariantStyle = (variant: CardVariant) => {
  switch (variant) {
    case 'surface':
      return {
        container: {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderWidth: 1,
        },
        pressed: {
          backgroundColor: theme.colors.surfaceLight,
        },
      };
    case 'outlined':
      return {
        container: {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.borderStrong,
          borderWidth: 1.5,
        },
        pressed: {
          backgroundColor: theme.colors.cardHover,
        },
      };
    case 'maroon':
      return {
        container: {
          backgroundColor: theme.colors.maroonLight,
          borderColor: theme.colors.maroon,
          borderWidth: 1,
        },
        pressed: {
          opacity: 0.9,
        },
      };
    case 'olive':
      return {
        container: {
          backgroundColor: theme.colors.oliveLight,
          borderColor: theme.colors.olive,
          borderWidth: 1,
        },
        pressed: {
          opacity: 0.9,
        },
      };
    case 'default':
    default:
      return {
        container: {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
          borderWidth: 1,
          ...theme.shadows.subtle,
        },
        pressed: {
          backgroundColor: theme.colors.cardHover,
        },
      };
  }
};

const paddingStyles = StyleSheet.create({
  none: {
    padding: 0,
  },
  sm: {
    padding: theme.spacing.sm,
  },
  md: {
    padding: theme.spacing.cardPadding,
  },
  lg: {
    padding: theme.spacing.xxl,
  },
});

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.radius.card,
    overflow: 'hidden',
  },
});
