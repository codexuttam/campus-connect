import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight, LogIn } from 'lucide-react-native';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { AppText } from '../../components/ui/AppText';
import { AppButton } from '../../components/ui/AppButton';
import { CollaborationMark } from '../../components/auth/CollaborationMark';
import { theme } from '../../theme';

/**
 * Welcome Screen (B)
 *
 * Requirements:
 * - CampusConnect logo & identity
 * - Tagline: "Your Campus. Your People."
 * - Subtle visual representing student collaboration
 * - Primary CTA: Get Started
 * - Secondary CTA: Login
 * - Keep the screen spacious and uncluttered
 */
export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ScreenContainer safeTop safeBottom padded style={styles.container}>
      <View style={styles.content}>
        {/* Top Header / Branding */}
        <View style={styles.brandHeader}>
          <View style={styles.logoBadge}>
            <AppText variant="captionMedium" style={styles.logoBadgeText}>
              CC
            </AppText>
          </View>
          <AppText variant="captionMedium" color="secondary" style={styles.kicker}>
            CAMPUSCONNECT
          </AppText>
        </View>

        {/* Hero Visual Area: Subtle Student Collaboration Nexus */}
        <View style={styles.visualContainer}>
          <CollaborationMark size={190} />
        </View>

        {/* Tagline & Headline */}
        <View style={styles.textContainer}>
          <AppText variant="display" serif color="primary" align="center" style={styles.title}>
            Your Campus.{'\n'}Your People.
          </AppText>
          <AppText variant="bodySmall" color="secondary" align="center" style={styles.subtitle}>
            An authenticated network connecting verified students, academic circles, and campus opportunities.
          </AppText>
        </View>

        {/* Action CTAs */}
        <View style={styles.actionContainer}>
          <AppButton
            title="Get Started"
            variant="primary"
            size="lg"
            fullWidth
            trailingIcon={
              <ArrowRight
                size={16}
                color={theme.colors.textInverse}
                strokeWidth={theme.icons.strokeWidth.bold}
              />
            }
            onPress={() => router.push('/(auth)/register')}
            style={styles.primaryButton}
          />

          <AppButton
            title="Log In"
            variant="secondary"
            size="lg"
            fullWidth
            leadingIcon={
              <LogIn
                size={16}
                color={theme.colors.textPrimary}
                strokeWidth={theme.icons.strokeWidth.default}
              />
            }
            onPress={() => router.push('/(auth)/login')}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.lg,
  },
  brandHeader: {
    alignItems: 'center',
    paddingTop: theme.spacing.xs,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.maroon,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  logoBadgeText: {
    color: theme.colors.textInverse,
    fontFamily: theme.fontFamilies.serif.bold,
    fontSize: 16,
    letterSpacing: 1,
  },
  kicker: {
    letterSpacing: theme.letterSpacing.wider,
    fontSize: 11,
  },
  visualContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
  },
  textContainer: {
    paddingHorizontal: theme.spacing.md,
    alignItems: 'center',
  },
  title: {
    marginBottom: theme.spacing.sm,
    lineHeight: 34,
  },
  subtitle: {
    maxWidth: 290,
    lineHeight: 19,
  },
  actionContainer: {
    width: '100%',
    paddingBottom: theme.spacing.xs,
  },
  primaryButton: {
    marginBottom: theme.spacing.md,
  },
});

