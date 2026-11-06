import React from 'react';
import { Text, TextProps, StyleSheet, TextStyle, StyleProp } from 'react-native';
import { theme } from '../../theme';
import { TextVariant } from '../../types/theme';

export interface AppTextProps extends TextProps {
  variant?: TextVariant;
  color?: 'primary' | 'secondary' | 'muted' | 'maroon' | 'olive' | 'inverse' | string;
  serif?: boolean;
  align?: 'auto' | 'left' | 'center' | 'right' | 'justify';
  style?: StyleProp<TextStyle>;
  children?: React.ReactNode;
}

export const AppText: React.FC<AppTextProps> = ({
  variant = 'body',
  color = 'primary',
  serif = false,
  align,
  style,
  children,
  ...rest
}) => {
  const baseStyle = theme.typography[variant] || theme.typography.body;

  const resolvedColor = (() => {
    switch (color) {
      case 'primary':
        return theme.colors.textPrimary;
      case 'secondary':
        return theme.colors.textSecondary;
      case 'muted':
        return theme.colors.textMuted;
      case 'maroon':
        return theme.colors.maroon;
      case 'olive':
        return theme.colors.olive;
      case 'inverse':
        return theme.colors.textInverse;
      default:
        return color;
    }
  })();

  const fontStyle: TextStyle = serif
    ? { fontFamily: theme.fontFamilies.serif.regular }
    : {};

  return (
    <Text
      style={[
        styles.base,
        baseStyle,
        { color: resolvedColor },
        align ? { textAlign: align } : undefined,
        fontStyle,
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});
