import React from 'react';
import {
  Pressable,
  ActivityIndicator,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
  StyleProp,
  PressableProps,
} from 'react-native';
import { theme } from '../../theme';
import { AppText } from './AppText';
import { ButtonVariant, ButtonSize } from '../../types/theme';

export interface AppButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  leadingIcon,
  trailingIcon,
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  onPress,
  ...rest
}) => {
  const isInteractive = !disabled && !loading;

  const sizeStyle = sizeStyles[size];
  const variantConfig = getVariantStyle(variant, disabled);

  return (
    <Pressable
      onPress={isInteractive ? onPress : undefined}
      disabled={!isInteractive}
      style={({ pressed }) => [
        styles.base,
        sizeStyle.container,
        variantConfig.container,
        fullWidth && styles.fullWidth,
        pressed && isInteractive && variantConfig.pressed,
        disabled && styles.disabled,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: !isInteractive, busy: loading }}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variantConfig.loaderColor}
          style={styles.loader}
        />
      ) : (
        <View style={styles.contentRow}>
          {leadingIcon ? <View style={styles.leadingIcon}>{leadingIcon}</View> : null}
          <AppText
            variant={size === 'sm' ? 'buttonSmall' : 'button'}
            style={[
              styles.text,
              { color: variantConfig.textColor },
              textStyle,
            ]}
          >
            {title}
          </AppText>
          {trailingIcon ? <View style={styles.trailingIcon}>{trailingIcon}</View> : null}
        </View>
      )}
    </Pressable>
  );
};

const getVariantStyle = (variant: ButtonVariant, disabled: boolean) => {
  switch (variant) {
    case 'secondary':
      return {
        container: {
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
        pressed: {
          backgroundColor: theme.colors.surfaceLight,
        },
        textColor: theme.colors.textPrimary,
        loaderColor: theme.colors.textPrimary,
      };
    case 'outline':
      return {
        container: {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: theme.colors.maroon,
        },
        pressed: {
          backgroundColor: theme.colors.maroonLight,
        },
        textColor: theme.colors.maroon,
        loaderColor: theme.colors.maroon,
      };
    case 'ghost':
      return {
        container: {
          backgroundColor: 'transparent',
          borderWidth: 0,
        },
        pressed: {
          backgroundColor: theme.colors.surfaceLight,
        },
        textColor: theme.colors.textPrimary,
        loaderColor: theme.colors.textPrimary,
      };
    case 'olive':
      return {
        container: {
          backgroundColor: theme.colors.olive,
          borderWidth: 1,
          borderColor: theme.colors.oliveDark,
        },
        pressed: {
          backgroundColor: theme.colors.oliveDark,
        },
        textColor: theme.colors.textInverse,
        loaderColor: theme.colors.textInverse,
      };
    case 'primary':
    default:
      return {
        container: {
          backgroundColor: theme.colors.maroon,
          borderWidth: 1,
          borderColor: theme.colors.maroonDark,
        },
        pressed: {
          backgroundColor: theme.colors.maroonDark,
        },
        textColor: theme.colors.textInverse,
        loaderColor: theme.colors.textInverse,
      };
  }
};

const sizeStyles = {
  sm: StyleSheet.create({
    container: {
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: theme.radius.md,
      minHeight: 38,
    },
  }),
  md: StyleSheet.create({
    container: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: theme.radius.lg,
      minHeight: 46,
    },
  }),
  lg: StyleSheet.create({
    container: {
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: theme.radius.card,
      minHeight: 52,
    },
  }),
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leadingIcon: {
    marginRight: theme.spacing.sm,
  },
  trailingIcon: {
    marginLeft: theme.spacing.sm,
  },
  text: {
    textAlign: 'center',
  },
  loader: {
    marginVertical: 2,
  },
  disabled: {
    opacity: 0.5,
  },
});
