import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export interface MarketplaceProductSkeletonGridProps {
  cardWidth: number;
  count?: number;
}

export const MarketplaceProductSkeletonGrid: React.FC<
  MarketplaceProductSkeletonGridProps
> = ({ cardWidth, count = 6 }) => {
  const items = Array.from({ length: count }, (_, idx) => idx);

  return (
    <View style={styles.grid}>
      {items.map((idx) => (
        <View key={idx} style={[styles.card, { width: cardWidth }]}>
          <View style={styles.imageBlock} />
          <View style={styles.details}>
            <View style={styles.priceLine} />
            <View style={styles.titleLinePrimary} />
            <View style={styles.titleLineSecondary} />
            <View style={styles.badgePill} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.sm,
    gap: 12,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    marginBottom: 14,
  },
  imageBlock: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: theme.colors.surface,
  },
  details: {
    padding: 10,
    gap: 6,
  },
  priceLine: {
    width: '38%',
    height: 14,
    borderRadius: 4,
    backgroundColor: theme.colors.surface,
  },
  titleLinePrimary: {
    width: '88%',
    height: 11,
    borderRadius: 4,
    backgroundColor: theme.colors.surface,
  },
  titleLineSecondary: {
    width: '62%',
    height: 11,
    borderRadius: 4,
    backgroundColor: theme.colors.surface,
  },
  badgePill: {
    width: 52,
    height: 16,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface,
    marginTop: 2,
  },
});
