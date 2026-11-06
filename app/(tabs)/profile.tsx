import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Settings, Shield, BookOpen, Layers, ExternalLink, LogOut } from 'lucide-react-native';
import {
  AppText,
  AppCard,
  AppAvatar,
  AppBadge,
  AppButton,
  IconButton,
  Divider,
} from '../../components/ui';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { theme } from '../../theme';
import { useAuth } from '../../hooks/useAuth';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const fullName = user?.fullName || 'Julian Vance';
  const course = user?.courseOrBranch || 'Computer Science & Philosophy';
  const collegeName = user?.collegeName || 'Balliol College';
  const gradYear = user?.graduationYear ? `Class of '${user.graduationYear.slice(-2)}` : "Class of '26";
  const isVerified = user?.collegeVerificationStatus === 'verified';

  const handleSignOut = async () => {
    await logout();
    router.replace('/(auth)/welcome');
  };

  return (
    <ScreenContainer scrollable safeTop padded={false}>
      <View style={styles.header}>
        <AppText variant="captionMedium" color="secondary" style={styles.kicker}>
          IDENTITY
        </AppText>
        <View style={styles.headerRow}>
          <AppText variant="h1" serif color="primary">
            Student Profile
          </AppText>
          <IconButton
            icon={
              <Settings
                size={theme.icons.sizes.header}
                color={theme.colors.textPrimary}
                strokeWidth={theme.icons.strokeWidth.default}
              />
            }
            variant="surface"
            size="sm"
            accessibilityLabel="Settings"
          />
        </View>
      </View>

      <View style={styles.content}>
        {/* Profile Identity Card */}
        <AppCard variant="default" padding="lg" style={styles.identityCard}>
          <View style={styles.avatarRow}>
            <AppAvatar name={fullName} size="lg" borderColor={theme.colors.maroon} />
            <View style={styles.identityText}>
              <AppText variant="h2" serif color="primary">
                {fullName}
              </AppText>
              <AppText variant="bodySmall" color="secondary">
                {course}
              </AppText>
              <View style={styles.badgeRow}>
                <AppBadge label={gradYear} variant="maroon" size="sm" />
                <AppBadge label={collegeName} variant="olive" size="sm" />
                {isVerified ? (
                  <AppBadge label="Verified" variant="olive" size="sm" dot />
                ) : null}
              </View>
            </View>
          </View>
        </AppCard>

        {/* System & Architecture Quick Access */}
        <AppCard variant="surface" padding="md" style={styles.systemCard}>
          <View style={styles.systemHeader}>
            <View style={styles.iconTag}>
              <Layers size={18} color={theme.colors.maroon} />
            </View>
            <View style={styles.systemTitleCol}>
              <AppText variant="bodySmallMedium" color="primary">
                Design System Inspector
              </AppText>
              <AppText variant="caption" color="secondary">
                Inspect and test all 10 centralized components
              </AppText>
            </View>
          </View>

          <Divider spacing="sm" />

          <AppButton
            title="Launch Component Showcase"
            variant="outline"
            size="sm"
            trailingIcon={
              <ExternalLink size={14} color={theme.colors.maroon} strokeWidth={2} />
            }
            onPress={() => router.push('/showcase')}
            style={styles.showcaseButton}
          />
        </AppCard>

        {/* Placeholder Information Blocks */}
        <View style={styles.statsRow}>
          <AppCard variant="default" padding="md" style={styles.statBox}>
            <AppText variant="caption" color="secondary">
              CLUBS
            </AppText>
            <AppText variant="h2" serif color="maroon">
              4
            </AppText>
          </AppCard>

          <AppCard variant="default" padding="md" style={styles.statBox}>
            <AppText variant="caption" color="secondary">
              CREDITS
            </AppText>
            <AppText variant="h2" serif color="olive">
              18
            </AppText>
          </AppCard>

          <AppCard variant="default" padding="md" style={styles.statBox}>
            <AppText variant="caption" color="secondary">
              ROLE
            </AppText>
            <AppText variant="h3" color="primary" style={styles.roleStat}>
              Student
            </AppText>
          </AppCard>
        </View>

        {/* Authentication & Session Management Action */}
        <View style={styles.sessionCard}>
          <AppButton
            title="Sign Out of CampusConnect"
            variant="secondary"
            size="md"
            fullWidth
            leadingIcon={
              <LogOut
                size={16}
                color={theme.colors.textPrimary}
                strokeWidth={theme.icons.strokeWidth.default}
              />
            }
            onPress={handleSignOut}
          />
        </View>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingBottom: theme.spacing.huge,
  },
  identityCard: {
    marginBottom: theme.spacing.lg,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  identityText: {
    marginLeft: theme.spacing.lg,
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.sm,
  },
  systemCard: {
    marginBottom: theme.spacing.lg,
  },
  systemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconTag: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  systemTitleCol: {
    flex: 1,
  },
  showcaseButton: {
    marginTop: theme.spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
  },
  roleStat: {
    marginTop: 4,
  },
  sessionCard: {
    marginTop: theme.spacing.sm,
  },
});
