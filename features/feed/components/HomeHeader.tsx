import React from 'react';
import { View, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Search,
  Bell,
  MessageSquare,
  Shield,
  Globe,
} from 'lucide-react-native';
import { AppText } from '../../../components/ui/AppText';
import { AppAvatar } from '../../../components/ui/AppAvatar';
import { IconButton } from '../../../components/ui/IconButton';
import { theme } from '../../../theme';

export interface HomeHeaderProps {
  campusName?: string;
  userName?: string;
  onSearchPress: () => void;
  onNotificationsPress: () => void;
  onMarketplacePress?: () => void;
  onMessagesPress?: () => void;
  onAdminPress?: () => void;
  onLandingPress?: () => void;
  onProfilePress?: () => void;
  hasUnreadNotifications?: boolean;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  campusName = 'Noida International University',
  userName = 'Uttamraj Singh',
  onSearchPress,
  onNotificationsPress,
  onMessagesPress,
  onAdminPress,
  onLandingPress,
  onProfilePress,
  hasUnreadNotifications = true,
}) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 10) }]}>
      <View style={styles.content}>
        {/* Left: Diamond Emblem & NIU Connect Wordmark */}
        <View style={styles.brandCol}>
          <View style={styles.brandRow}>
            <View style={styles.diamondOuter}>
              <View style={styles.diamondInner} />
            </View>
            <View>
              <AppText variant="h2" serif color="primary" style={styles.brandTitle}>
                NIU Connect
              </AppText>
              <AppText variant="caption" color="secondary" numberOfLines={1} style={styles.contextText}>
                {campusName}
              </AppText>
            </View>
          </View>
        </View>

        {/* Center Search Pill on Desktop / Tablet */}
        {isWide && (
          <Pressable
            onPress={onSearchPress}
            style={styles.desktopSearchPill}
            accessibilityRole="button"
            accessibilityLabel="Search for students, events, communities, books"
          >
            <Search size={15} color={theme.colors.textMuted} />
            <AppText variant="caption" color="muted" style={styles.desktopSearchText}>
              Search for students, events, communities, books...
            </AppText>
          </Pressable>
        )}

        {/* Right: Quick Portal Switchers, Search, Notifications & Profile */}
        <View style={styles.actionsRow}>
          {onLandingPress && (
            <Pressable
              onPress={onLandingPress}
              style={styles.portalPill}
              accessibilityRole="button"
              accessibilityLabel="Open Public Website"
            >
              <Globe size={13} color={theme.colors.maroon} />
              <AppText variant="captionMedium" style={styles.portalPillText}>
                Public Site
              </AppText>
            </Pressable>
          )}

          {onAdminPress && (
            <Pressable
              onPress={onAdminPress}
              style={[styles.portalPill, styles.adminPill]}
              accessibilityRole="button"
              accessibilityLabel="Open Admin Portal"
            >
              <Shield size={13} color="#FFFFFF" />
              <AppText variant="captionMedium" style={styles.adminPillText}>
                Admin
              </AppText>
            </Pressable>
          )}

          {!isWide && (
            <IconButton
              icon={
                <Search
                  size={18}
                  color={theme.colors.textPrimary}
                  strokeWidth={theme.icons.strokeWidth.default}
                />
              }
              variant="surface"
              size="sm"
              onPress={onSearchPress}
              accessibilityLabel="Search NIU Connect"
            />
          )}

          <View style={styles.bellWrapper}>
            <IconButton
              icon={
                <Bell
                  size={18}
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

          {onMessagesPress && isWide && (
            <IconButton
              icon={
                <MessageSquare
                  size={18}
                  color={theme.colors.textPrimary}
                  strokeWidth={theme.icons.strokeWidth.default}
                />
              }
              variant="surface"
              size="sm"
              onPress={onMessagesPress}
              accessibilityLabel="Direct Messages"
            />
          )}

          {onProfilePress && (
            <Pressable onPress={onProfilePress} hitSlop={6}>
              <AppAvatar
                name={userName}
                size="sm"
                style={{ backgroundColor: theme.colors.maroon }}
              />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.screenPadding,
    gap: 12,
  },
  brandCol: {
    flexShrink: 0,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  diamondOuter: {
    width: 24,
    height: 24,
    borderRadius: 5,
    backgroundColor: theme.colors.maroon,
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  diamondInner: {
    width: 9,
    height: 9,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  brandTitle: {
    letterSpacing: -0.3,
    fontSize: 19,
    lineHeight: 22,
    color: theme.colors.maroon,
  },
  contextText: {
    fontSize: 10.5,
    letterSpacing: 0.2,
  },
  desktopSearchPill: {
    flex: 1,
    maxWidth: 420,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 14,
    height: 36,
  },
  desktopSearchText: {
    fontSize: 12.5,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  portalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.maroonLight,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  portalPillText: {
    color: theme.colors.maroon,
    fontSize: 11,
  },
  adminPill: {
    backgroundColor: theme.colors.maroon,
    borderColor: theme.colors.maroon,
  },
  adminPillText: {
    color: '#FFFFFF',
    fontSize: 11,
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
    borderRadius: 3.5,
    backgroundColor: theme.colors.maroon,
  },
});
