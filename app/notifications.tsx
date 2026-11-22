import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import {
  Heart,
  MessageCircle,
  UserPlus,
  ShoppingBag,
  CheckCheck,
  BellOff,
} from 'lucide-react-native';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { AppHeader } from '../components/ui/AppHeader';
import { AppText } from '../components/ui/AppText';
import { AppCard } from '../components/ui/AppCard';
import { AppAvatar } from '../components/ui/AppAvatar';
import { theme } from '../theme';

const NOTIFICATIONS_STORAGE_KEY = 'campusconnect.notifications.v1';

type NotificationCategory = 'marketplace' | 'social';
type NotificationType = 'like' | 'comment' | 'connect' | 'marketplace';

interface CampusNotification {
  id: string;
  user: string;
  action: string;
  time: string;
  type: NotificationType;
  category: NotificationCategory;
  isRead: boolean;
  targetRoute?: string;
}

const INITIAL_NOTIFICATIONS: CampusNotification[] = [
  {
    id: 'notif_mkt_1',
    user: 'Alyssa Vance',
    action: 'replied to your inquiry on Campbell Biology (12th Edition).',
    time: '10m ago',
    type: 'marketplace',
    category: 'marketplace',
    isRead: false,
    targetRoute: '/(tabs)/chats',
  },
  {
    id: 'notif_1',
    user: 'Amara Patel',
    action: 'liked your discussion on Epistemic Limits in Reasoning.',
    time: '15m ago',
    type: 'like',
    category: 'social',
    isRead: false,
    targetRoute: '/(tabs)',
  },
  {
    id: 'notif_mkt_2',
    user: 'Marcus Chen',
    action: 'marked Keychron K2 Wireless Mechanical Keyboard as available for campus pickup.',
    time: '45m ago',
    type: 'marketplace',
    category: 'marketplace',
    isRead: false,
    targetRoute: '/marketplace/listing-3',
  },
  {
    id: 'notif_2',
    user: 'Leo Zhang',
    action: 'replied to your comment in HackOxford 2026 prep.',
    time: '1h ago',
    type: 'comment',
    category: 'social',
    isRead: true,
    targetRoute: '/(tabs)',
  },
  {
    id: 'notif_3',
    user: 'Elena Rostova',
    action: 'connected with your student academic circle.',
    time: '3h ago',
    type: 'connect',
    category: 'social',
    isRead: true,
    targetRoute: '/(tabs)/explore',
  },
];

function renderTypeBadge(type: NotificationType) {
  switch (type) {
    case 'marketplace':
      return <ShoppingBag size={12} color={theme.colors.maroon} />;
    case 'like':
      return <Heart size={12} color={theme.colors.maroon} fill={theme.colors.maroon} />;
    case 'comment':
      return <MessageCircle size={12} color={theme.colors.olive} />;
    case 'connect':
      return <UserPlus size={12} color={theme.colors.olive} />;
  }
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<CampusNotification[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | NotificationCategory>('all');

  useEffect(() => {
    AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setNotifications(parsed);
          }
        }
      })
      .catch(() => {});
  }, []);

  const persist = (next: CampusNotification[]) => {
    setNotifications(next);
    AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  };

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const filtered = useMemo(() => {
    if (filter === 'all') return notifications;
    return notifications.filter((n) => n.category === filter);
  }, [notifications, filter]);

  const handlePressItem = (item: CampusNotification) => {
    if (!item.isRead) {
      persist(
        notifications.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
      );
    }
    if (item.targetRoute) {
      router.push(item.targetRoute as any);
    }
  };

  const handleMarkAllRead = () => {
    persist(notifications.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <ScreenContainer scrollable safeTop padded={false} style={styles.container}>
      <AppHeader
        title="Activity"
        serifTitle
        showBack
        onBack={() => router.back()}
        borderBottom={false}
        rightAction={
          unreadCount > 0 ? (
            <Pressable
              onPress={handleMarkAllRead}
              style={styles.markAllBtn}
              accessibilityRole="button"
              accessibilityLabel="Mark all notifications as read"
            >
              <CheckCheck size={14} color={theme.colors.maroon} />
              <AppText variant="captionMedium" style={styles.markAllText}>
                Mark read
              </AppText>
            </Pressable>
          ) : undefined
        }
      />

      {/* Filter Pills */}
      <View style={styles.filterRow}>
        {(
          [
            { id: 'all', label: `All (${notifications.length})` },
            { id: 'marketplace', label: 'Marketplace' },
            { id: 'social', label: 'Social' },
          ] as const
        ).map((tab) => {
          const isSelected = filter === tab.id;
          return (
            <Pressable
              key={tab.id}
              onPress={() => setFilter(tab.id)}
              style={[styles.filterChip, isSelected && styles.filterChipSelected]}
            >
              <AppText
                variant="captionMedium"
                style={isSelected ? styles.filterChipTextSelected : styles.filterChipText}
              >
                {tab.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.content}>
        <AppText variant="captionMedium" color="secondary" style={styles.sectionKicker}>
          {unreadCount > 0 ? `${unreadCount} UNREAD UPDATES` : 'ALL CAUGHT UP'}
        </AppText>

        {filtered.length === 0 ? (
          <AppCard variant="surface" padding="lg" style={styles.emptyCard}>
            <BellOff size={26} color={theme.colors.textMuted} />
            <AppText variant="bodySmallMedium" color="primary" style={{ marginTop: 8 }}>
              No activity in this category
            </AppText>
          </AppCard>
        ) : (
          <View style={styles.notifList}>
            {filtered.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => handlePressItem(item)}
                style={({ pressed }) => [
                  styles.notifCard,
                  !item.isRead && styles.notifCardUnread,
                  pressed && styles.notifCardPressed,
                ]}
              >
                <View style={styles.avatarWrap}>
                  <AppAvatar
                    name={item.user}
                    size="sm"
                    style={{
                      backgroundColor:
                        item.category === 'marketplace'
                          ? theme.colors.olive
                          : theme.colors.maroon,
                    }}
                  />
                  <View style={styles.typeBadge}>{renderTypeBadge(item.type)}</View>
                </View>

                <View style={styles.notifTextCol}>
                  <AppText variant="bodySmall" color="primary">
                    <AppText variant="bodySmallMedium">{item.user}</AppText> {item.action}
                  </AppText>
                  <AppText variant="caption" color="muted" style={styles.timeText}>
                    {item.time}
                  </AppText>
                </View>

                {!item.isRead && <View style={styles.unreadDot} />}
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.maroonLight,
  },
  markAllText: {
    color: theme.colors.maroon,
    fontSize: 11,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.md,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterChipSelected: {
    backgroundColor: theme.colors.maroon,
    borderColor: theme.colors.maroon,
  },
  filterChipText: {
    color: theme.colors.textPrimary,
  },
  filterChipTextSelected: {
    color: '#FBF7EF',
  },
  content: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingBottom: theme.spacing.huge,
  },
  sectionKicker: {
    letterSpacing: theme.letterSpacing.wider,
    marginBottom: theme.spacing.sm,
    fontSize: 11,
  },
  notifList: {
    gap: 8,
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 12,
    gap: 12,
  },
  notifCardUnread: {
    borderColor: theme.colors.maroon,
    backgroundColor: theme.colors.surfaceLight,
  },
  notifCardPressed: {
    opacity: 0.9,
  },
  avatarWrap: {
    position: 'relative',
  },
  typeBadge: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifTextCol: {
    flex: 1,
  },
  timeText: {
    marginTop: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.maroon,
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
  },
});
