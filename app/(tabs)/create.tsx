import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PlusCircle, Sparkles, Image as ImageIcon, Calendar, FileText } from 'lucide-react-native';
import {
  AppText,
  AppCard,
  AppBadge,
} from '../../components/ui';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { theme } from '../../theme';

export default function CreateScreen() {
  return (
    <ScreenContainer scrollable safeTop padded={false}>
      <View style={styles.header}>
        <AppText variant="captionMedium" color="secondary" style={styles.kicker}>
          CONTRIBUTE
        </AppText>
        <AppText variant="h1" serif color="primary">
          Create
        </AppText>
      </View>

      <View style={styles.content}>
        {/* Quick Options */}
        <AppText variant="captionMedium" color="secondary" style={styles.sectionTitle}>
          PUBLISH TO CAMPUS
        </AppText>

        <View style={styles.grid}>
          <AppCard variant="default" padding="md" style={styles.optionCard}>
            <View style={[styles.iconBox, { backgroundColor: theme.colors.maroonLight }]}>
              <Calendar size={22} color={theme.colors.maroon} strokeWidth={1.8} />
            </View>
            <AppText variant="bodySmallMedium" color="primary">
              Campus Event
            </AppText>
            <AppText variant="caption" color="secondary" style={styles.optionDesc}>
              Lectures, socials & sports
            </AppText>
          </AppCard>

          <AppCard variant="default" padding="md" style={styles.optionCard}>
            <View style={[styles.iconBox, { backgroundColor: theme.colors.oliveLight }]}>
              <FileText size={22} color={theme.colors.olive} strokeWidth={1.8} />
            </View>
            <AppText variant="bodySmallMedium" color="primary">
              Bulletin Post
            </AppText>
            <AppText variant="caption" color="secondary" style={styles.optionDesc}>
              Announcements & notices
            </AppText>
          </AppCard>
        </View>

        {/* Minimal Placeholder State */}
        <AppCard variant="surface" padding="lg" style={styles.placeholderCard}>
          <Sparkles size={28} color={theme.colors.maroon} strokeWidth={1.8} />
          <AppText variant="h3" serif color="primary" align="center" style={styles.cardTitle}>
            Creator Studio Shell
          </AppText>
          <AppText variant="bodySmall" color="secondary" align="center" style={styles.cardSubtitle}>
            Full creation flows will be configured in subsequent modules.
          </AppText>
          <AppBadge label="PHASE 01 COMPLETED" variant="maroon" size="sm" style={styles.badge} />
        </AppCard>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
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
  sectionTitle: {
    letterSpacing: theme.letterSpacing.wider,
    marginBottom: theme.spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  optionCard: {
    flex: 1,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  optionDesc: {
    marginTop: 2,
  },
  placeholderCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.huge,
  },
  cardTitle: {
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  cardSubtitle: {
    maxWidth: 280,
    lineHeight: 18,
    marginBottom: theme.spacing.md,
  },
  badge: {
    marginTop: theme.spacing.xs,
  },
});

