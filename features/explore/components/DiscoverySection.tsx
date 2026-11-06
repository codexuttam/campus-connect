import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { AppText } from '../../../components/ui/AppText';
import { theme } from '../../../theme';

export interface DiscoverySectionProps {
  title: string;
  kicker?: string;
  subtitle?: string;
  onViewAll?: () => void;
  viewAllLabel?: string;
  children: React.ReactNode;
}

export const DiscoverySection: React.FC<DiscoverySectionProps> = ({
  title,
  kicker,
  subtitle,
  onViewAll,
  viewAllLabel = 'See all',
  children,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleCol}>
          {kicker ? (
            <AppText variant="captionMedium" color="secondary" style={styles.kicker}>
              {kicker}
            </AppText>
          ) : null}
          <AppText variant="h2" serif color="primary" style={styles.title}>
            {title}
          </AppText>
          {subtitle ? (
            <AppText variant="caption" color="secondary" style={styles.subtitle}>
              {subtitle}
            </AppText>
          ) : null}
        </View>

        {onViewAll ? (
          <Pressable onPress={onViewAll} hitSlop={8} style={styles.viewAllButton}>
            <AppText variant="captionMedium" style={styles.viewAllText}>
              {viewAllLabel}
            </AppText>
            <ChevronRight size={14} color={theme.colors.maroon} />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: theme.spacing.screenPadding,
    marginBottom: theme.spacing.sm,
  },
  titleCol: {
    flex: 1,
  },
  kicker: {
    fontSize: 10,
    letterSpacing: theme.letterSpacing.wider,
    marginBottom: 2,
  },
  title: {
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingBottom: 2,
  },
  viewAllText: {
    color: theme.colors.maroon,
  },
  content: {
    marginTop: 4,
  },
});
