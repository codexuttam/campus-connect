import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react-native';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { AppHeader } from '../../components/ui/AppHeader';
import { AppText } from '../../components/ui/AppText';
import { AppInput } from '../../components/ui/AppInput';
import { AppButton } from '../../components/ui/AppButton';
import { PasswordStrengthMeter } from '../../components/auth/PasswordStrengthMeter';
import { TermsCheckbox } from '../../components/auth/TermsCheckbox';
import {
  validateName,
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
} from '../../features/auth/validation';
import { useAuth } from '../../hooks/useAuth';
import { theme } from '../../theme';

/**
 * Registration Screen (D)
 *
 * Requirements:
 * - Collect: Full name, Email address, Password, Confirm password
 * - Field-level validation
 * - Password visibility controls
 * - Password strength feedback
 * - Terms and conditions acceptance
 * - Continue to student onboarding
 * - Avoid putting every student detail into the initial registration form
 */
export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading, error: authError, clearError } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Field error states
  const [nameError, setNameError] = useState<string | undefined>();
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [confirmError, setConfirmError] = useState<string | undefined>();
  const [termsError, setTermsError] = useState(false);
  const [generalError, setGeneralError] = useState<string | undefined>();

  const handleRegister = async () => {
    clearError();
    setGeneralError(undefined);

    let hasErrors = false;

    // Validate Name
    const nameCheck = validateName(fullName);
    if (!nameCheck.isValid) {
      setNameError(nameCheck.error);
      hasErrors = true;
    } else {
      setNameError(undefined);
    }

    // Validate Email
    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid) {
      setEmailError(emailCheck.error);
      hasErrors = true;
    } else {
      setEmailError(undefined);
    }

    // Validate Password
    const passwordCheck = validatePassword(password);
    if (!passwordCheck.isValid) {
      setPasswordError(passwordCheck.error);
      hasErrors = true;
    } else {
      setPasswordError(undefined);
    }

    // Validate Confirm Password
    const confirmCheck = validatePasswordConfirmation(password, confirmPassword);
    if (!confirmCheck.isValid) {
      setConfirmError(confirmCheck.error);
      hasErrors = true;
    } else {
      setConfirmError(undefined);
    }

    // Validate Terms
    if (!agreedToTerms) {
      setTermsError(true);
      hasErrors = true;
    } else {
      setTermsError(false);
    }

    if (hasErrors) {
      return;
    }

    const res = await register({
      fullName: fullName.trim(),
      email: email.trim(),
      password,
      agreedToTerms,
    });

    if (res.success) {
      // Step D completed: Navigate immediately to Student Onboarding
      router.push('/(auth)/onboarding');
    } else {
      setGeneralError(res.error || 'Registration could not be completed.');
    }
  };

  return (
    <ScreenContainer scrollable safeTop safeBottom padded={false}>
      <AppHeader
        title="Register"
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
            SCHOLAR IDENTITY
          </AppText>
          <AppText variant="h1" serif color="primary" style={styles.title}>
            Create Account
          </AppText>
          <AppText variant="bodySmall" color="secondary">
            Join your collegiate network. Academic details follow in the next step.
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

        {/* Registration Form */}
        <View style={styles.form}>
          <AppInput
            label="Full Name"
            placeholder="Julian Vance"
            value={fullName}
            onChangeText={(text) => {
              setFullName(text);
              if (nameError) setNameError(undefined);
            }}
            autoCorrect={false}
            error={nameError}
            leadingIcon={
              <User
                size={18}
                color={theme.colors.textSecondary}
                strokeWidth={theme.icons.strokeWidth.default}
              />
            }
          />

          <AppInput
            label="Email Address"
            placeholder="julian@oxford.edu"
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
            placeholder="At least 8 characters"
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

          {/* Password Strength Indicator */}
          <PasswordStrengthMeter password={password} />

          <AppInput
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (confirmError) setConfirmError(undefined);
            }}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
            error={confirmError}
            leadingIcon={
              <Lock
                size={18}
                color={theme.colors.textSecondary}
                strokeWidth={theme.icons.strokeWidth.default}
              />
            }
            trailingIcon={
              showConfirmPassword ? (
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
            onTrailingIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          {/* Terms & Honor Code Acceptance */}
          <TermsCheckbox
            checked={agreedToTerms}
            onToggle={(val) => {
              setAgreedToTerms(val);
              if (termsError) setTermsError(false);
            }}
            hasError={termsError}
          >
            <AppText variant="caption" color={termsError ? 'error' : 'secondary'} style={styles.termsText}>
              I agree to the CampusConnect Student Honor Code and Terms of Service.
            </AppText>
          </TermsCheckbox>

          {/* Submit Button */}
          <AppButton
            title="Continue to Student Onboarding"
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
            onPress={handleRegister}
            style={styles.submitButton}
          />
        </View>

        {/* Footer Link to Login */}
        <View style={styles.footerRow}>
          <AppText variant="bodySmall" color="secondary">
            Already have an account?{' '}
          </AppText>
          <Pressable onPress={() => router.push('/(auth)/login')} hitSlop={8}>
            <AppText variant="bodySmallMedium" style={styles.loginLink}>
              Log in
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
  termsText: {
    lineHeight: 18,
  },
  submitButton: {
    marginTop: theme.spacing.md,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  loginLink: {
    color: theme.colors.maroon,
    textDecorationLine: 'underline',
  },
});

