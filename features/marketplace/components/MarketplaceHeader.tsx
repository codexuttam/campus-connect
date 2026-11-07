import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bookmark, Plus, Tag } from 'lucide-react-native';
import { AppText } from '../../../components/ui/AppText';
import { IconButton } from '../../../components/ui/IconButton';
import { theme } from '../../../theme';

export interface MarketplaceHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  showActions?: boolean;
  savedCount?: number;
}

export const MarketplaceHeader: React.FC<MarketplaceHeaderProps> = ({
  title = 'Marketplace',
  showBack = false,
  onBack,
  showActions = true,
  savedCount,
}) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {showBack && (
          <Pressable
            onPress={onBack ? onBack : () => router.back()}
            style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={22} color={theme.colors.textPrimary} strokeWidth={2} />
          </Pressable>
        )}
        <View>
          <AppText variant="captionMedium" color="secondary" style={styles.kicker}>
            CAMPUS DISCOVERY
          </AppText>
          <AppText variant="h1" serif color="primary" style={styles.title}>
            {title}
          </AppText>
        </View>
      </View>

      {showActions && (
        <View style={styles.actions}>
          {/* Saved Listings Shortcut */}
          <Pressable
            onPress={() => router.push('/marketplace/saved')}
            style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
            accessibilityRole="button"
            accessibilityLabel="Saved listings"
            hitSlop={6}
          >
            <Bookmark size={20} color={theme.colors.textPrimary} strokeWidth={1.8} />
            {typeof savedCount === 'number' && savedCount > 0 && (
              <View style={styles.badge}>
                <AppText variant="caption" style={styles.badgeText}>
                  {savedCount}
                </AppText>
              </View>
            )}
          </Pressable>

          {/* My Listings Shortcut */}
          <Pressable
            onPress={() => router.push('/marketplace/my-listings')}
            style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
            accessibilityRole="button"
            accessibilityLabel="My listings"
            hitSlop={6}
          >
            <Tag size={19} color={theme.colors.textPrimary} strokeWidth={1.8} />
          </Pressable>

          {/* Sell / Create Listing CTA */}
          <Pressable
            onPress={() => router.push('/marketplace/create')}
            style={({ pressed }) => [styles.sellButton, pressed && styles.sellButtonPressed]}
            accessibilityRole="button"
            accessibilityLabel="Sell an item"
          >
            <Plus size={16} color="#FBF7EF" strokeWidth={2.4} style={{ marginRight: 4 }} />
            <AppText variant="buttonSmall" style={styles.sellText}>
              Sell
            </AppText>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xs,
    backgroundColor: theme.colors.background,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  backButtonPressed: {
    opacity: 0.7,
  },
  kicker: {
    letterSpacing: theme.letterSpacing.wider,
    marginBottom: 2,
    fontSize: 10,
  },
  title: {
    lineHeight: 30,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    width: 38,
    height: 38,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  actionButtonPressed: {
    opacity: 0.75,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: theme.colors.maroon,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FBF7EF',
    fontSize: 9,
    fontWeight: '700',
  },
  sellButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.maroon,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.md,
  },
  sellButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  sellText: {
    color: '#FBF7EF',
    fontWeight: '600',
    fontSize: 13,
  },
});

