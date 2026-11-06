import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { theme } from '../../theme';
import { AppText } from './AppText';

export interface DividerProps {
  label?: string;
  spacing?: 'sm' | 'md' | 'lg' | 'none';
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export const Divider: React.FC<DividerProps> = ({
  label,
  spacing = 'md',
  color = theme.colors.border,
  style,
}) => {
  const marginVertical = spacingMap[spacing];

  if (label) {
    return (
      <View style={[styles.labeledContainer, { marginVertical }, style]}>
        <View style={[styles.line, { backgroundColor: color }]} />
        <AppText
          variant="caption"
          color="muted"
          style={styles.label}
        >
          {label}
        </AppText>
        <View style={[styles.line, { backgroundColor: color }]} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.simpleLine,
        { backgroundColor: color, marginVertical },
        style,
      ]}
    />
  );
};

const spacingMap = {
  none: 0,
  sm: theme.spacing.sm,
  md: theme.spacing.lg,
  lg: theme.spacing.xxl,
};

const styles = StyleSheet.create({
  simpleLine: {
    height: 1,
    width: '100%',
  },
  labeledContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  line: {
    flex: 1,
    height: 1,
  },
  label: {
    paddingHorizontal: theme.spacing.md,
    textTransform: 'uppercase',
    letterSpacing: theme.letterSpacing.wider,
  },
});
