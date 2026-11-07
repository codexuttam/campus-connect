import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { AppText } from '../../../components/ui/AppText';
import { MarketplaceStatus } from '../types';
import { getStatusLabel } from '../utils/formatters';
import { theme } from '../../../theme';

export interface ProductStatusBadgeProps {
  status: MarketplaceStatus;
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
}

export const ProductStatusBadge: React.FC<ProductStatusBadgeProps> = ({
  status,
  size = 'sm',
  style,
}) => {
  if (status === 'active') {
    return null; // By default active items don't need a loud status badge
  }

  const isSold = status === 'sold';
  const isReserved = status === 'reserved';
  const isDraft = status === 'draft';

  return (
    <View
      style={[
        styles.badge,
        isSold && styles.soldBadge,
        isReserved && styles.reservedBadge,
        isDraft && styles.draftBadge,
        size === 'sm' ? styles.badgeSm : styles.badgeMd,
        style,
      ]}
    >
      <AppText
        variant="caption"
        style={[
          styles.text,
          isSold && styles.soldText,
          isReserved && styles.reservedText,
          isDraft && styles.draftText,
        ]}
      >
        {getStatusLabel(status).toUpperCase()}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: theme.radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeSm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeMd: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  soldBadge: {
    backgroundColor: '#302B28',
  },
  reservedBadge: {
    backgroundColor: theme.colors.warningLight,
    borderWidth: 1,
    borderColor: theme.colors.warning,
  },
  draftBadge: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  text: {
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  soldText: {
    color: '#FBF7EF',
  },
  reservedText: {
    color: theme.colors.warning,
  },
  draftText: {
    color: theme.colors.textSecondary,
  },
});

