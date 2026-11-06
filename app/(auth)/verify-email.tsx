import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ShieldCheck, Mail, RefreshCw, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react-native';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { AppHeader } from '../../components/ui/AppHeader';
import { AppText } from '../../components/ui/AppText';
import { AppButton } from '../../components/ui/AppButton';
import { AppBadge } from '../../components/ui/AppBadge';
import { OtpInput } from '../../components/auth/OtpInput';
import { useAuth } from '../../hooks/useAuth';
import { theme } from '../../theme';

/**
 * Email Verification Screen (F)
 *
 * Requirements:
 * - Six-digit OTP interface
 * - Resend OTP functionality
 * - Countdown display
 * - Verify button
 * - Error and success states
 * - College email verification must be a distinct step
 * - Do not mark an account as college-verified merely because the user entered a college name
 */
export default function VerifyEmailScreen() {
  const router = useRouter();
  const { user, verifyOtp, resendOtp, isLoading, error: authError, clearError } = useAuth();

  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [resendNotice, setResendNotice] = useState<string | null>(null);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [localError, setLocalError] = useState<string | undefined>();

  const targetEmail =
    user?.institutionalEmail || user?.email || 'student@university.edu';
  const collegeName = user?.collegeName || 'University Partner';
  const isInstitutional = Boolean(user?.institutionalEmail);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerify = async () => {
    clearError();
    setLocalError(undefined);

    if (otp.length !== 6) {
      setLocalError('Please enter all 6 digits of your verification code.');
      return;
    }

    const res = await verifyOtp(otp, isInstitutional ? 'institutional' : 'account');
    if (res.success) {
      setVerificationSuccess(true);
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 900);
    } else {
      setLocalError(res.error || 'Verification code was not accepted.');
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    clearError();
    setLocalError(undefined);
    setCanResend(false);
    setCountdown(45);

    const res = await resendOtp(targetEmail, isInstitutional ? 'institutional' : 'account');
    setResendNotice(res.message);
    if (res.cooldownSeconds) {
      setCountdown(res.cooldownSeconds);
    }
  };

  return (
    <ScreenContainer scrollable safeTop safeBottom padded={false}>
      <AppHeader
        title={isInstitutional ? 'Institutional Verification' : 'Verify Email'}
        serifTitle
        showBack
        onBack={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('/(auth)/onboarding');
          }
        }}
        borderBottom={false}
      />

      <View style={styles.content}>
        {/* Editorial Heading */}
        <View style={styles.headingSection}>
          <View style={styles.kickerRow}>
            <AppText variant="captionMedium" color="secondary" style={styles.kicker}>
              STEP 02 OF ONBOARDING
            </AppText>
            <AppBadge
              label={isInstitutional ? 'Institutional Domain' : 'Account Security'}
              variant="olive"
              size="sm"
            />
          </View>
          <AppText variant="h1" serif color="primary" style={styles.title}>
            Verify Your Email
          </AppText>
          <AppText variant="bodySmall" color="secondary">
            Enter the 6-digit verification code sent to your academic mailbox:
          </AppText>
        </View>

        {/* Target Email Box */}
        <View style={styles.emailCard}>
          <View style={styles.emailIconBox}>
            <Mail size={18} color={theme.colors.maroon} />
          </View>
          <View style={styles.emailDetailsCol}>
            <AppText variant="bodyMedium" color="primary" numberOfLines={1}>
              {targetEmail}
            </AppText>
            <AppText variant="caption" color="secondary">
              Affiliated with {collegeName}
            </AppText>
          </View>
        </View>

        {/* Development Mode Notice: Transparent test code indicator */}
        <View style={styles.devNotice}>
          <ShieldCheck size={14} color={theme.colors.olive} />
          <AppText variant="caption" color="secondary" style={styles.devNoticeText}>
            Development test code: <AppText variant="captionMedium" color="primary">123456</AppText>
          </AppText>
        </View>

        {/* Success Banner */}
        {verificationSuccess && (
          <View style={styles.successBanner}>
            <CheckCircle2 size={18} color={theme.colors.success} />
            <AppText variant="captionMedium" style={styles.successBannerText}>
              Verification confirmed! Welcome to CampusConnect.
            </AppText>
          </View>
        )}

        {/* Error notification banner */}
        {(localError || authError) && (
          <View style={styles.errorBanner}>
            <AlertCircle size={16} color={theme.colors.error} />
            <AppText variant="caption" style={styles.errorBannerText}>
              {localError || authError}
            </AppText>
          </View>
        )}

        {/* Resend status toast */}
        {resendNotice && !localError && !authError && (
          <View style={styles.infoBanner}>
            <RefreshCw size={14} color={theme.colors.info} />
            <AppText variant="caption" style={styles.infoBannerText}>
              {resendNotice}
            </AppText>
          </View>
        )}

        {/* 6-Digit OTP Box */}
        <OtpInput
          length={6}
          value={otp}
          onChange={(val) => {
            setOtp(val);
            if (localError) setLocalError(undefined);
          }}
          hasError={Boolean(localError || authError)}
          disabled={verificationSuccess || isLoading}
        />

        {/* Resend & Timer Row */}
        <View style={styles.resendRow}>
          {canResend ? (
            <Pressable onPress={handleResend} hitSlop={8} style={styles.resendButton}>
              <RefreshCw size={14} color={theme.colors.maroon} />
              <AppText variant="bodySmallMedium" style={styles.resendActiveText}>
                Resend verification code
              </AppText>
            </Pressable>
          ) : (
            <AppText variant="caption" color="secondary">
              Resend available in{' '}
              <AppText variant="captionMedium" color="primary">
                {countdown}s
              </AppText>
            </AppText>
          )}
        </View>

        {/* Verify CTA Button */}
        <AppButton
          title={verificationSuccess ? 'Verified' : 'Verify & Enter Campus'}
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading}
          disabled={otp.length !== 6 || verificationSuccess}
          trailingIcon={
            <ArrowRight
              size={16}
              color={theme.colors.textInverse}
              strokeWidth={theme.icons.strokeWidth.bold}
            />
          }
          onPress={handleVerify}
          style={styles.verifyButton}
        />

        {/* Alternative Verification Route for students without access */}
        <View style={styles.alternativeBox}>
          <AppText variant="caption" color="secondary" align="center" style={styles.altText}>
            Unable to access your campus email or don't have an institutional address?
          </AppText>
          <Pressable
            onPress={() => router.push('/(auth)/college-status')}
            hitSlop={8}
            style={styles.altLink}
          >
            <AppText variant="captionMedium" style={styles.altLinkText}>
              Request Administrator Review with Student ID
            </AppText>
          </Pressable>
        </View>
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
    marginBottom: theme.spacing.lg,
  },
  kickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  kicker: {
    letterSpacing: theme.letterSpacing.wider,
    fontSize: 11,
  },
  title: {
    marginBottom: 6,
  },
  emailCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  emailIconBox: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  emailDetailsCol: {
    flex: 1,
  },
  devNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.surface,
    paddingVertical: 6,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.sm,
    marginBottom: theme.spacing.md,
  },
  devNoticeText: {
    fontSize: 12,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.successLight,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.success,
    marginBottom: theme.spacing.md,
  },
  successBannerText: {
    color: theme.colors.success,
    flex: 1,
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
    marginBottom: theme.spacing.md,
  },
  errorBannerText: {
    color: theme.colors.error,
    flex: 1,
    lineHeight: 18,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.infoLight,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.info,
    marginBottom: theme.spacing.md,
  },
  infoBannerText: {
    color: theme.colors.info,
    flex: 1,
  },
  resendRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  resendActiveText: {
    color: theme.colors.maroon,
    textDecorationLine: 'underline',
  },
  verifyButton: {
    marginBottom: theme.spacing.xxl,
  },
  alternativeBox: {
    alignItems: 'center',
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderSubtle,
  },
  altText: {
    lineHeight: 18,
    marginBottom: 6,
  },
  altLink: {
    paddingVertical: 4,
  },
  altLinkText: {
    color: theme.colors.maroon,
    textDecorationLine: 'underline',
  },
});

