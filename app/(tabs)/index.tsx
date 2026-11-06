import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, ArrowRight, Bell, Calendar, Users, Bookmark } from 'lucide-react-native';
import {
  AppText,
  AppCard,
  AppBadge,
  AppAvatar,
  AppButton,
  IconButton,
} from '../../components/ui';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { theme } from '../../theme';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScreenContainer scrollable safeTop padded={false}>
      {/* Compact University Editorial Header */}
      <View style={styles.header}>
        <View>
          <AppText variant="captionMedium" color="secondary" style={styles.kicker}>
            CAMPUS CONNECT
          </AppText>
          <AppText variant="h1" serif color="primary">
            The Yard
          </AppText>
        </View>

        <View style={styles.headerActions}>
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
            accessibilityLabel="Notifications"
          />
          <AppAvatar name="Amara Patel" size="sm" style={styles.avatarSpacing} />
        </View>
      </View>

      <View style={styles.body}>
        {/* Foundation Notice Card */}
        <AppCard variant="maroon" padding="md" style={styles.foundationCard}>
          <View style={styles.cardHeaderRow}>
            <AppBadge label="FOUNDATION V1.0" variant="maroon" size="sm" dot />
            <Sparkles size={16} color={theme.colors.maroon} />
          </View>
          <AppText variant="h3" color="primary" style={styles.foundationTitle}>
            Design System & Architecture Active
          </AppText>
          <AppText variant="bodySmall" color="secondary" style={styles.foundationDesc}>
            Warm university paper aesthetic, centralized theme tokens, strict TypeScript, and 5-tab navigation shell.
          </AppText>
          <View style={styles.showcaseButtonRow}>
            <AppButton
              title="Open Component Showcase"
              variant="primary"
              size="sm"
              trailingIcon={
                <ArrowRight
                  size={14}
                  color={theme.colors.textInverse}
                  strokeWidth={2}
                />
              }
              onPress={() => router.push('/showcase')}
            />
          </View>
        </AppCard>

        {/* Visual-First Sample Showcase Cards (70% visual / 30% text aesthetic demonstration) */}
        <View style={styles.sectionHeader}>
          <AppText variant="captionMedium" color="secondary" style={styles.sectionTitle}>
            CURATED DISCOVERY
          </AppText>
          <AppBadge label="PREVIEW" variant="neutral" size="sm" />
        </View>

        {/* Sample Card 1: Community Spotlight */}
        <AppCard variant="default" padding="none" style={styles.sampleCard}>
          {/* Visual Container */}
          <View style={[styles.visualArea, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.floatingBadgeRow}>
              <AppBadge label="ACADEMIC" variant="olive" size="sm" />
              <IconButton
                icon={
                  <Bookmark
                    size={16}
                    color={theme.colors.textSecondary}
                    strokeWidth={theme.icons.strokeWidth.default}
                  />
                }
                variant="ghost"
                size="sm"
                accessibilityLabel="Save item"
              />
            </View>
            <View style={styles.visualGraphicCenter}>
              <Users size={44} color={theme.colors.olive} strokeWidth={1.5} />
            </View>
          </View>

          {/* Minimal Text Container (30%) */}
          <View style={styles.cardContent}>
            <AppText variant="h3" serif color="primary" numberOfLines={1}>
              Oxford Debate Society
            </AppText>
            <View style={styles.cardMetaRow}>
              <AppText variant="caption" color="secondary">
                Thursday · Merton Hall
              </AppText>
              <AppBadge label="128 Members" variant="neutral" size="sm" />
            </View>
          </View>
        </AppCard>

        {/* Sample Card 2: Campus Event */}
        <AppCard variant="default" padding="none" style={styles.sampleCard}>
          <View style={[styles.visualArea, { backgroundColor: theme.colors.cardHover }]}>
            <View style={styles.floatingBadgeRow}>
              <AppBadge label="GATHERING" variant="maroon" size="sm" />
              <IconButton
                icon={
                  <Bookmark
                    size={16}
                    color={theme.colors.textSecondary}
                    strokeWidth={theme.icons.strokeWidth.default}
                  />
                }
                variant="ghost"
                size="sm"
                accessibilityLabel="Save item"
              />
            </View>
            <View style={styles.visualGraphicCenter}>
              <Calendar size={44} color={theme.colors.maroon} strokeWidth={1.5} />
            </View>
          </View>

          <View style={styles.cardContent}>
            <AppText variant="h3" serif color="primary" numberOfLines={1}>
              Founders Coffee & Critique
            </AppText>
            <View style={styles.cardMetaRow}>
              <AppText variant="caption" color="secondary">
                Friday 10:00 AM · The Quad
              </AppText>
              <AppBadge label="Open to All" variant="olive" size="sm" />
            </View>
          </View>
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
    backgroundColor: theme.colors.background,
  },
  kicker: {
    letterSpacing: theme.letterSpacing.wider,
    marginBottom: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarSpacing: {
    marginLeft: theme.spacing.sm,
  },
  body: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingBottom: theme.spacing.massive,
  },
  foundationCard: {
    marginBottom: theme.spacing.xl,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  foundationTitle: {
    marginBottom: theme.spacing.xs,
  },
  foundationDesc: {
    marginBottom: theme.spacing.md,
    lineHeight: 18,
  },
  showcaseButtonRow: {
    alignSelf: 'flex-start',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    letterSpacing: theme.letterSpacing.wider,
  },
  sampleCard: {
    marginBottom: theme.spacing.lg,
  },
  visualArea: {
    height: 140,
    width: '100%',
    padding: theme.spacing.md,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderSubtle,
  },
  floatingBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  visualGraphicCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: theme.spacing.sm,
  },
  cardContent: {
    padding: theme.spacing.cardPadding,
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xs + 2,
  },
});

