import React from 'react';
import {
  Pressable,
  StyleSheet,
  ViewStyle,
  StyleProp,
  PressableProps,
} from 'react-native';
import { theme } from '../../theme';

export interface IconButtonProps extends Omit<PressableProps, 'style'> {
  icon: React.ReactNode;
  variant?: 'default' | 'ghost' | 'surface' | 'maroon' | 'olive';
  size?: 'sm' | 'md' | 'lg';
  shape?: 'round' | 'square';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  accessibilityLabel: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  variant = 'default',
  size = 'md',
  shape = 'round',
  disabled = false,
  style,
  onPress,
  accessibilityLabel,
  ...rest
}) => {
  const sizeConfig = sizes[size];
  const variantConfig = getVariantConfig(variant);

  const borderRadius =
    shape === 'round'
      ? sizeConfig.dimension / 2
      : theme.radius.md;

  return (
    <Pressable
      onPress={!disabled ? onPress : undefined}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.base,
        {
          width: sizeConfig.dimension,
          height: sizeConfig.dimension,
          borderRadius,
        },
        variantConfig.container,
        pressed && !disabled && variantConfig.pressed,
        disabled && styles.disabled,
        style,
      ]}
      hitSlop={8}
      {...rest}
    >
      {icon}
    </Pressable>
  );
};

const getVariantConfig = (variant: 'default' | 'ghost' | 'surface' | 'maroon' | 'olive') => {
  switch (variant) {
    case 'ghost':
      return {
        container: {
          backgroundColor: 'transparent',
          borderWidth: 0,
        },
        pressed: {
          backgroundColor: theme.colors.surface,
        },
      };
    case 'surface':
      return {
        container: {
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
        pressed: {
          backgroundColor: theme.colors.surfaceLight,
        },
      };
    case 'maroon':
      return {
        container: {
          backgroundColor: theme.colors.maroon,
          borderWidth: 0,
        },
        pressed: {
          backgroundColor: theme.colors.maroonDark,
        },
      };
    case 'olive':
      return {
        container: {
          backgroundColor: theme.colors.olive,
          borderWidth: 0,
        },
        pressed: {
          backgroundColor: theme.colors.oliveDark,
        },
      };
    case 'default':
    default:
      return {
        container: {
          backgroundColor: theme.colors.card,
          borderWidth: 1,
          borderColor: theme.colors.border,
          ...theme.shadows.subtle,
        },
        pressed: {
          backgroundColor: theme.colors.cardHover,
        },
      };
  }
};

const sizes = {
  sm: { dimension: 34 },
  md: { dimension: 42 },
  lg: { dimension: 48 },
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
});
