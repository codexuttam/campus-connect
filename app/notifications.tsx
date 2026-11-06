import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, Heart, MessageCircle, UserPlus, Sparkles } from 'lucide-react-native';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { AppHeader } from '../components/ui/AppHeader';
import { AppText } from '../components/ui/AppText';
import { AppCard } from '../components/ui/AppCard';
import { AppAvatar } from '../components/ui/AppAvatar';
import { theme } from '../theme';

const MOCK_NOTIFICATIONS = [
  {
    id: 'notif_1',
    user: 'Amara Patel',
    action: 'liked your discussion on Epistemic Limits in Reasoning.',
    time: '15m ago',
    type: 'like',
  },
  {
    id: 'notif_2',
    user: 'Leo Zhang',
    action: 'replied to your comment in HackOxford 2026 prep.',
    time: '1h ago',
    type: 'comment',
  },
  {
    id: 'notif_3',
    user: 'Elena Rostova',
    action: 'connected with your student academic circle.',
    time: '3h ago',
    type: 'connect',
  },
];

export default function NotificationsPlaceholderScreen() {
  const router = useRouter();

  return (
    <ScreenContainer scrollable safeTop padded={false} style={styles.container}>
      <AppHeader
        title="Activity"
        serifTitle
        showBack
        onBack={() => router.back()}
        borderBottom={false}
      />

      <View style={styles.content}>
        <AppText variant="captionMedium" color="secondary" style={styles.sectionKicker}>
          RECENT CAMPUS ACTIVITY
        </AppText>

        <View style={styles.notifList}>
          {MOCK_NOTIFICATIONS.map((item) => (
            <View key={item.id} style={styles.notifCard}>
              <AppAvatar
                name={item.user}
                size="sm"
                style={{ backgroundColor: theme.colors.maroon }}
              />
              <View style={styles.notifTextCol}>
                <AppText variant="bodySmall" color="primary">
                  <AppText variant="bodySmallMedium">{item.user}</AppText> {item.action}
                </AppText>
                <AppText variant="caption" color="muted" style={styles.timeText}>
                  {item.time}
                </AppText>
              </View>
            </View>
          ))}
        </View>

        <AppCard variant="surface" padding="lg" style={styles.infoCard}>
          <Sparkles size={24} color={theme.colors.olive} />
          <AppText variant="h3" serif color="primary" style={styles.cardTitle}>
            Notification Center Active
          </AppText>
          <AppText variant="bodySmall" color="secondary" align="center" style={styles.cardDesc}>
            Real-time push notifications, digest subscriptions, and circle mentions will be extended in upcoming modules.
          </AppText>
        </AppCard>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.xs,
  },
  sectionKicker: {
    fontSize: 10,
    letterSpacing: theme.letterSpacing.wider,
    marginBottom: theme.spacing.sm,
  },
  notifList: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.xl,
    paddingVertical: 4,
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderSubtle,
  },
  notifTextCol: {
    flex: 1,
  },
  timeText: {
    fontSize: 10,
    marginTop: 2,
  },
  infoCard: {
    alignItems: 'center',
  },
  cardTitle: {
    marginTop: theme.spacing.sm,
    marginBottom: 4,
  },
  cardDesc: {
    lineHeight: 18,
    maxWidth: 280,
  },
});
