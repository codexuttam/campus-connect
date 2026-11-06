import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, CheckCircle2, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react-native';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { AppHeader } from '../../components/ui/AppHeader';
import { AppText } from '../../components/ui/AppText';
import { AppInput } from '../../components/ui/AppInput';
import { AppButton } from '../../components/ui/AppButton';
import { AppCard } from '../../components/ui/AppCard';
import { validateEmail } from '../../features/auth/validation';
import { useAuth } from '../../hooks/useAuth';
import { theme } from '../../theme';

/**
 * Forgot Password Screen (G)
 *
 * Requirements:
 * - Email input
 * - Password reset request
 * - Success and error states
 */
export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { requestPasswordReset, isLoading, error: authError, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();
  const [generalError, setGeneralError] = useState<string | undefined>();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleResetRequest = async () => {
    clearError();
    setGeneralError(undefined);

    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid) {
      setEmailError(emailCheck.error);
      return;
    }
    setEmailError(undefined);

    const res = await requestPasswordReset(email.trim());
    if (res.success) {
      setSuccessMessage(res.message);
    } else {
      setGeneralError(res.error || res.message || 'Unable to submit password reset request.');
    }
  };

  return (
    <ScreenContainer scrollable safeTop safeBottom padded={false}>
      <AppHeader
        title="Password Recovery"
        serifTitle
        showBack
        onBack={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('/(auth)/login');
          }
        }}
        borderBottom={false}
      />

      <View style={styles.content}>
        {/* Editorial Heading */}
        <View style={styles.headingSection}>
          <AppText variant="captionMedium" color="secondary" style={styles.kicker}>
            ACCOUNT RECOVERY
          </AppText>
          <AppText variant="h1" serif color="primary" style={styles.title}>
            Reset Password
          </AppText>
          <AppText variant="bodySmall" color="secondary">
            Enter your student or account email address to receive password reset instructions.
          </AppText>
        </View>

        {/* Error notification banner */}
        {(generalError || authError) && (
          <View style={styles.errorBanner}>
            <AlertCircle size={16} color={theme.colors.error} />
            <AppText variant="caption" style={styles.errorBannerText}>
              {generalError || authError}
            </AppText>
          </View>
        )}

        {/* Success Card */}
        {successMessage ? (
          <AppCard variant="default" padding="lg" style={styles.successCard}>
            <View style={styles.successIconBox}>
              <CheckCircle2 size={32} color={theme.colors.success} />
            </View>
            <AppText variant="h2" serif color="primary" align="center" style={styles.successTitle}>
              Reset Link Dispatched
            </AppText>
            <AppText variant="bodySmall" color="secondary" align="center" style={styles.successDesc}>
              {successMessage}
            </AppText>

            <AppButton
              title="Return to Sign In"
              variant="primary"
              size="lg"
              fullWidth
              onPress={() => router.replace('/(auth)/login')}
              style={styles.returnButton}
            />
          </AppCard>
        ) : (
          <View style={styles.form}>
            <AppInput
              label="Email Address"
              placeholder="student@university.edu"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError(undefined);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={emailError}
              leadingIcon={
                <Mail
                  size={18}
                  color={theme.colors.textSecondary}
                  strokeWidth={theme.icons.strokeWidth.default}
                />
              }
            />

            <AppButton
              title="Send Recovery Instructions"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              trailingIcon={
                <ArrowRight
                  size={16}
                  color={theme.colors.textInverse}
                  strokeWidth={theme.icons.strokeWidth.bold}
                />
              }
              onPress={handleResetRequest}
              style={styles.submitButton}
            />

            <View style={styles.backRow}>
              <Pressable
                onPress={() => router.replace('/(auth)/login')}
                hitSlop={8}
                style={styles.backLink}
              >
                <ArrowLeft size={14} color={theme.colors.maroon} />
                <AppText variant="bodySmallMedium" style={styles.backText}>
                  Back to Sign In
                </AppText>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.huge,
  },
  headingSection: {
    marginBottom: theme.spacing.xl,
  },
  kicker: {
    letterSpacing: theme.letterSpacing.wider,
    marginBottom: 4,
    fontSize: 11,
  },
  title: {
    marginBottom: 6,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.errorLight,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.error,
    marginBottom: theme.spacing.lg,
  },
  errorBannerText: {
    color: theme.colors.error,
    flex: 1,
    lineHeight: 18,
  },
  form: {
    marginBottom: theme.spacing.xl,
  },
  submitButton: {
    marginTop: theme.spacing.md,
  },
  backRow: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backText: {
    color: theme.colors.maroon,
  },
  successCard: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  successIconBox: {
    marginBottom: theme.spacing.md,
  },
  successTitle: {
    marginBottom: theme.spacing.xs,
  },
  successDesc: {
    marginBottom: theme.spacing.xl,
    lineHeight: 20,
    maxWidth: 280,
  },
  returnButton: {
    marginTop: theme.spacing.xs,
  },
});

