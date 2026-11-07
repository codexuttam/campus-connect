import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { AppText } from '../../../components/ui/AppText';
import { MarketplaceCondition } from '../types';
import { getConditionLabel } from '../utils/formatters';
import { theme } from '../../../theme';

export interface ProductConditionBadgeProps {
  condition: MarketplaceCondition;
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
}

export const ProductConditionBadge: React.FC<ProductConditionBadgeProps> = ({
  condition,
  size = 'sm',
  style,
}) => {
  const label = getConditionLabel(condition);

  return (
    <View
      style={[
        styles.badge,
        size === 'sm' ? styles.badgeSm : styles.badgeMd,
        style,
      ]}
    >
      <AppText
        variant="caption"
        style={[
          styles.text,
          size === 'sm' ? styles.textSm : styles.textMd,
        ]}
      >
        {label}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  badgeSm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeMd: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  text: {
    color: theme.colors.textSecondary,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  textSm: {
    fontSize: 10,
    lineHeight: 13,
  },
  textMd: {
    fontSize: 11,
    lineHeight: 14,
  },
});

