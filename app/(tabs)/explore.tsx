import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Search, Compass, SlidersHorizontal } from 'lucide-react-native';
import {
  AppText,
  AppInput,
  AppCard,
  AppBadge,
  IconButton,
} from '../../components/ui';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { theme } from '../../theme';

export default function ExploreScreen() {
  return (
    <ScreenContainer scrollable safeTop padded={false}>
      {/* Editorial Header */}
      <View style={styles.header}>
        <View>
          <AppText variant="captionMedium" color="secondary" style={styles.kicker}>
            DISCOVERY
          </AppText>
          <AppText variant="h1" serif color="primary">
            Explore
          </AppText>
        </View>

        <IconButton
          icon={
            <SlidersHorizontal
              size={theme.icons.sizes.header}
              color={theme.colors.textPrimary}
              strokeWidth={theme.icons.strokeWidth.default}
            />
          }
          variant="surface"
          size="sm"
          accessibilityLabel="Filter results"
        />
      </View>

      <View style={styles.content}>
        {/* Search Input */}
        <AppInput
          placeholder="Search clubs, topics, or classmates..."
          leadingIcon={
            <Search
              size={18}
              color={theme.colors.textMuted}
              strokeWidth={theme.icons.strokeWidth.default}
            />
          }
          containerStyle={styles.searchBar}
        />

        {/* Quick Category Chips */}
        <View style={styles.chipRow}>
          <AppBadge label="All Fields" variant="maroon" size="md" />
          <AppBadge label="Societies" variant="neutral" size="md" />
          <AppBadge label="Colloquiums" variant="neutral" size="md" />
          <AppBadge label="Housing" variant="neutral" size="md" />
        </View>

        {/* Placeholder Graphic State */}
        <AppCard variant="default" padding="lg" style={styles.placeholderCard}>
          <View style={styles.iconCircle}>
            <Compass size={36} color={theme.colors.olive} strokeWidth={1.5} />
          </View>
          <AppText variant="h3" serif color="primary" align="center" style={styles.cardTitle}>
            Directory & Exploration
          </AppText>
          <AppText variant="bodySmall" color="secondary" align="center" style={styles.cardSubtitle}>
            Discovery channels, academic circles, and student initiatives will appear here.
          </AppText>
        </AppCard>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
  },
  kicker: {
    letterSpacing: theme.letterSpacing.wider,
    marginBottom: 2,
  },
  content: {
    paddingHorizontal: theme.spacing.screenPadding,
  },
  searchBar: {
    marginBottom: theme.spacing.md,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  placeholderCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.huge,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: theme.colors.oliveLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  cardTitle: {
    marginBottom: theme.spacing.xs,
  },
  cardSubtitle: {
    maxWidth: 280,
    lineHeight: 18,
  },
});

