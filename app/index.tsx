import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../theme';
import { AppText } from '../components/ui/AppText';
import { useAuth } from '../hooks/useAuth';

/**
 * Splash Screen (A)
 *
 * Requirements:
 * - CampusConnect branding
 * - Minimal logo or typographic identity
 * - Warm beige background (#F3EBDD)
 * - Short, subtle transition
 * - Check authentication state and route users appropriately
 */
export default function SplashScreen() {
  const router = useRouter();
  const { status, isInitialized, initializeAuth } = useAuth();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.97)).current;

  // 1. Kick off auth restoration
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // 2. Gentle restrained transition
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  // 3. Route user based on actual account state once initialized
  useEffect(() => {
    if (!isInitialized) return;

    const timer = setTimeout(() => {
      switch (status) {
        case 'fully_onboarded':
          router.replace('/(tabs)');
          break;
        case 'registration_incomplete':
          router.replace('/(auth)/onboarding');
          break;
        case 'email_verification_pending':
          router.replace('/(auth)/verify-email');
          break;
        case 'college_verification_pending':
          router.replace('/(auth)/college-status');
          break;
        case 'unauthenticated':
        default:
          router.replace('/(auth)/welcome');
          break;
      }
    }, 750);

    return () => clearTimeout(timer);
  }, [isInitialized, status, router]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Minimal Collegiate Seal / Monogram */}
        <View style={styles.emblemContainer}>
          <View style={styles.emblemOuter}>
            <View style={styles.emblemInner}>
              <AppText variant="h1" serif style={styles.emblemText}>
                CC
              </AppText>
            </View>
          </View>
        </View>

        {/* Brand Typographic Identity */}
        <AppText variant="captionMedium" color="secondary" style={styles.kicker}>
          UNIVERSITY NETWORK
        </AppText>
        <AppText variant="display" serif color="primary" style={styles.brandTitle}>
          CampusConnect
        </AppText>

        <View style={styles.footerAccent}>
          <View style={styles.dot} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  emblemContainer: {
    marginBottom: theme.spacing.xl,
  },
  emblemOuter: {
    width: 68,
    height: 68,
    borderRadius: theme.radius.card,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emblemInner: {
    width: 52,
    height: 52,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.maroon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emblemText: {
    color: theme.colors.textInverse,
    fontSize: 22,
    letterSpacing: 1.5,
  },
  kicker: {
    letterSpacing: theme.letterSpacing.caps,
    marginBottom: 4,
    fontSize: 11,
  },
  brandTitle: {
    color: theme.colors.textPrimary,
    letterSpacing: -0.5,
  },
  footerAccent: {
    marginTop: theme.spacing.xxxl,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.olive,
  },
});

