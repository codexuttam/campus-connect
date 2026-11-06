import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react-native';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { AppHeader } from '../../components/ui/AppHeader';
import { AppText } from '../../components/ui/AppText';
import { AppInput } from '../../components/ui/AppInput';
import { AppButton } from '../../components/ui/AppButton';
import { Divider } from '../../components/ui/Divider';
import { validateEmail } from '../../features/auth/validation';
import { useAuth } from '../../hooks/useAuth';
import { theme } from '../../theme';

/**
 * Login Screen (C)
 *
 * Requirements:
 * - Fields: Email address, Password
 * - Actions: Login, Continue with Google, Forgot password, Navigate to registration
 * - Input validation, password visibility toggle, loading state, clear/minimal error messages
 */
export default function LoginScreen() {
  const router = useRouter();
  const { login, loginWithGoogle, isLoading, error: authError, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [generalError, setGeneralError] = useState<string | undefined>();

  const handleLogin = async () => {
    clearError();
    setGeneralError(undefined);

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error);
      return;
    }
    setEmailError(undefined);

    if (!password) {
      setPasswordError('Password is required.');
      return;
    }
    setPasswordError(undefined);

    const result = await login({ email, password });
    if (result.success) {
      router.replace('/(tabs)');
    } else {
      setGeneralError(result.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleGoogleLogin = async () => {
    clearError();
    setGeneralError(undefined);
    const result = await loginWithGoogle();
    if (result.success) {
      router.replace('/(tabs)');
    } else {
      setGeneralError(result.error || 'Google login could not be completed.');
    }
  };

  return (
    <ScreenContainer scrollable safeTop safeBottom padded={false}>
      <AppHeader
        title="Sign In"
        serifTitle
        showBack
        onBack={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('/(auth)/welcome');
          }
        }}
        borderBottom={false}
      />

      <View style={styles.content}>
        {/* Editorial Heading */}
        <View style={styles.headingSection}>
          <AppText variant="captionMedium" color="secondary" style={styles.kicker}>
            WELCOME BACK
          </AppText>
          <AppText variant="h1" serif color="primary" style={styles.title}>
            Enter the Quad
          </AppText>
          <AppText variant="bodySmall" color="secondary">
            Sign in with your student or registered account.
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

        {/* Input Fields */}
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

          <AppInput
            label="Password"
            placeholder="••••••••••••"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (passwordError) setPasswordError(undefined);
            }}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            error={passwordError}
            leadingIcon={
              <Lock
                size={18}
                color={theme.colors.textSecondary}
                strokeWidth={theme.icons.strokeWidth.default}
              />
            }
            trailingIcon={
              showPassword ? (
                <EyeOff
                  size={18}
                  color={theme.colors.textMuted}
                  strokeWidth={theme.icons.strokeWidth.default}
                />
              ) : (
                <Eye
                  size={18}
                  color={theme.colors.textMuted}
                  strokeWidth={theme.icons.strokeWidth.default}
                />
              )
            }
            onTrailingIconPress={() => setShowPassword(!showPassword)}
          />

          {/* Forgot Password Link */}
          <View style={styles.forgotRow}>
            <Pressable
              onPress={() => router.push('/(auth)/forgot-password')}
              hitSlop={8}
            >
              <AppText variant="captionMedium" style={styles.forgotText}>
                Forgot password?
              </AppText>
            </Pressable>
          </View>

          {/* Primary Submit */}
          <AppButton
            title="Log In"
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoading}
            onPress={handleLogin}
            style={styles.submitButton}
          />

          {/* Divider */}
          <Divider label="or" spacing="md" />

          {/* Google Sign In */}
          <AppButton
            title="Continue with Google"
            variant="secondary"
            size="lg"
            fullWidth
            disabled={isLoading}
            onPress={handleGoogleLogin}
            style={styles.googleButton}
          />
        </View>

        {/* Footer Link to Registration */}
        <View style={styles.footerRow}>
          <AppText variant="bodySmall" color="secondary">
            Don't have an account?{' '}
          </AppText>
          <Pressable onPress={() => router.push('/(auth)/register')} hitSlop={8}>
            <AppText variant="bodySmallMedium" style={styles.registerLink}>
              Register here
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
    paddingBottom: theme.spacing.xxxl,
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
  forgotRow: {
    alignItems: 'flex-end',
    marginTop: -4,
    marginBottom: theme.spacing.lg,
  },
  forgotText: {
    color: theme.colors.maroon,
  },
  submitButton: {
    marginTop: theme.spacing.xs,
  },
  googleButton: {
    marginTop: theme.spacing.xs,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  registerLink: {
    color: theme.colors.maroon,
    textDecorationLine: 'underline',
  },
});
