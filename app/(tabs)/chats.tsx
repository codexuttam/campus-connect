import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MessageSquare, Edit3, ShoppingBag } from 'lucide-react-native';
import {
  AppText,
  AppCard,
  AppAvatar,
  AppBadge,
  IconButton,
} from '../../components/ui';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { theme } from '../../theme';

export default function ChatsScreen() {
  const { listingId, sellerName } = useLocalSearchParams<{
    listingId?: string;
    sellerName?: string;
  }>();

  return (
    <ScreenContainer scrollable safeTop padded={false}>
      <View style={styles.header}>
        <View>
          <AppText variant="captionMedium" color="secondary" style={styles.kicker}>
            COMMUNICATIONS
          </AppText>
          <AppText variant="h1" serif color="primary">
            Chats
          </AppText>
        </View>

        <IconButton
          icon={
            <Edit3
              size={theme.icons.sizes.header}
              color={theme.colors.textPrimary}
              strokeWidth={theme.icons.strokeWidth.default}
            />
          }
          variant="surface"
          size="sm"
          accessibilityLabel="New message"
        />
      </View>

      <View style={styles.content}>
        {/* Marketplace Context Banner if opened from a listing */}
        {listingId && (
          <AppCard variant="surface" padding="sm" style={styles.marketplaceInquiryCard}>
            <View style={styles.inquiryHeader}>
              <ShoppingBag size={16} color={theme.colors.maroon} />
              <AppText variant="captionMedium" color="primary">
                Marketplace Inquiry Context
              </AppText>
            </View>
            <AppText variant="caption" color="secondary" style={{ marginTop: 2 }}>
              Connecting with {sellerName || 'seller'} regarding listing #{listingId.slice(-6)}. Real-time messaging will open directly once peer chat channels are deployed.
            </AppText>
          </AppCard>
        )}

        {/* Sample conversation preview item showing visual design */}
        <AppCard variant="default" padding="sm" style={styles.conversationCard}>
          <View style={styles.chatRow}>
            <AppAvatar name="Architecture Society" size="md" />
            <View style={styles.chatInfo}>
              <View style={styles.chatTopRow}>
                <AppText variant="bodySmallMedium" color="primary">
                  Architecture Cohort '26
                </AppText>
                <AppText variant="caption" color="muted">
                  12m
                </AppText>
              </View>
              <AppText variant="caption" color="secondary" numberOfLines={1}>
                Critique sessions rescheduled to Studio 4B.
              </AppText>
            </View>
            <View style={styles.unreadDot} />
          </View>
        </AppCard>

        {/* Placeholder state */}
        <AppCard variant="surface" padding="lg" style={styles.placeholderCard}>
          <View style={styles.iconCircle}>
            <MessageSquare size={32} color={theme.colors.maroon} strokeWidth={1.6} />
          </View>
          <AppText variant="h3" serif color="primary" align="center" style={styles.cardTitle}>
            Student Messaging Shell
          </AppText>
          <AppText variant="bodySmall" color="secondary" align="center" style={styles.cardSubtitle}>
            Direct messaging, study groups, and society threads will be connected in future modules.
          </AppText>
          <AppBadge label="SECURE CHANNELS" variant="neutral" size="sm" />
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
  conversationCard: {
    marginBottom: theme.spacing.lg,
  },
  marketplaceInquiryCard: {
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  inquiryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.xs,
  },
  chatInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
    marginRight: theme.spacing.sm,
  },
  chatTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.maroon,
  },
  placeholderCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.huge,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.maroonLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    marginBottom: theme.spacing.xs,
  },
  cardSubtitle: {
    maxWidth: 280,
    lineHeight: 18,
    marginBottom: theme.spacing.md,
  },
});

