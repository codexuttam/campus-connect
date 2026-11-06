import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, Bell, Sparkles } from 'lucide-react-native';
import { AppText } from '../../../components/ui/AppText';
import { IconButton } from '../../../components/ui/IconButton';
import { theme } from '../../../theme';

export interface HomeHeaderProps {
  campusName?: string;
  onSearchPress: () => void;
  onNotificationsPress: () => void;
  hasUnreadNotifications?: boolean;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  campusName = 'Oxford · The Yard',
  onSearchPress,
  onNotificationsPress,
  hasUnreadNotifications = true,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
      <View style={styles.content}>
        {/* Left: Brand Wordmark & Campus Context */}
        <View style={styles.brandCol}>
          <View style={styles.brandRow}>
            <View style={styles.logoBadge}>
              <AppText variant="captionMedium" style={styles.logoText}>
                CC
              </AppText>
            </View>
            <AppText variant="h2" serif color="primary" style={styles.brandTitle}>
              CampusConnect
            </AppText>
          </View>
          <View style={styles.contextRow}>
            <View style={styles.contextDot} />
            <AppText variant="caption" color="secondary" numberOfLines={1} style={styles.contextText}>
              {campusName}
            </AppText>
          </View>
        </View>

        {/* Right: Search & Notifications */}
        <View style={styles.actionsRow}>
          <IconButton
            icon={
              <Search
                size={theme.icons.sizes.header}
                color={theme.colors.textPrimary}
                strokeWidth={theme.icons.strokeWidth.default}
              />
            }
            variant="surface"
            size="sm"
            onPress={onSearchPress}
            accessibilityLabel="Search campus directory and discussions"
          />

          <View style={styles.bellWrapper}>
            <IconButton
              icon={
                <Bell
                  size={theme.icons.sizes.header}
                  color={theme.colors.textPrimary}
                  strokeWidth={theme.icons.strokeWidth.default}
                />
              }
              variant="surface"
              size="sm"
              onPress={onNotificationsPress}
              accessibilityLabel="Notifications"
            />
            {hasUnreadNotifications ? <View style={styles.notificationDot} /> : null}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderSubtle,
    paddingBottom: theme.spacing.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.screenPadding,
  },
  brandCol: {
    flex: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBadge: {
    width: 26,
    height: 26,
    borderRadius: theme.radius.xs,
    backgroundColor: theme.colors.maroon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: theme.colors.textInverse,
    fontFamily: theme.fontFamilies.serif.bold,
    fontSize: 12,
  },
  brandTitle: {
    letterSpacing: -0.3,
  },
  contextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  contextDot: {
    width: 5,
    height: 5,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.olive,
  },
  contextText: {
    fontSize: 11,
    letterSpacing: 0.2,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bellWrapper: {
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 4,
    right: 5,
    width: 7,
    height: 7,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.maroon,
    borderWidth: 1,
    borderColor: theme.colors.background,
  },
});
