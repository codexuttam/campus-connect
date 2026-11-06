import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { AppText } from '../../../components/ui/AppText';
import { IconButton } from '../../../components/ui/IconButton';
import { theme } from '../../../theme';

export interface ExploreHeaderProps {
  onSearchPress: () => void;
  onFilterPress: () => void;
  hasActiveFilters?: boolean;
}

export const ExploreHeader: React.FC<ExploreHeaderProps> = ({
  onSearchPress,
  onFilterPress,
  hasActiveFilters = false,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
      <View style={styles.topRow}>
        <View>
          <AppText variant="captionMedium" color="secondary" style={styles.kicker}>
            CAMPUS DIRECTORY
          </AppText>
          <AppText variant="h1" serif color="primary" style={styles.title}>
            Explore
          </AppText>
        </View>

        <View style={styles.filterWrapper}>
          <IconButton
            icon={
              <SlidersHorizontal
                size={theme.icons.sizes.header}
                color={hasActiveFilters ? theme.colors.maroon : theme.colors.textPrimary}
                strokeWidth={theme.icons.strokeWidth.default}
              />
            }
            variant={hasActiveFilters ? 'maroon' : 'surface'}
            size="sm"
            onPress={onFilterPress}
            accessibilityLabel="Filter discovery options"
          />
          {hasActiveFilters ? <View style={styles.filterDot} /> : null}
        </View>
      </View>

      {/* Compact Search Trigger Bar */}
      <Pressable
        onPress={onSearchPress}
        style={styles.searchBar}
        accessibilityRole="search"
        accessibilityLabel="Search people, projects, communities"
      >
        <Search
          size={18}
          color={theme.colors.textMuted}
          strokeWidth={theme.icons.strokeWidth.default}
        />
        <AppText variant="bodySmall" color="muted" style={styles.placeholderText}>
          People, projects, communities...
        </AppText>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.screenPadding,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderSubtle,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  kicker: {
    letterSpacing: theme.letterSpacing.wider,
    marginBottom: 2,
    fontSize: 11,
  },
  title: {
    letterSpacing: -0.5,
  },
  filterWrapper: {
    position: 'relative',
  },
  filterDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 7,
    height: 7,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.maroon,
    borderWidth: 1.5,
    borderColor: theme.colors.background,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    height: 44,
  },
  placeholderText: {
    flex: 1,
  },
});
