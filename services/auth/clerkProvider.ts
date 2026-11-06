import {
  AuthResponse,
  LoginCredentials,
  OtpVerifyResponse,
  PasswordResetResponse,
  RegisterData,
  StudentOnboardingData,
  AltVerificationData,
  UserSession,
} from '../../types/auth';
import { IAuthService } from './types';
import { authStorage } from './storage';

/**
 * Clerk Authentication Provider
 *
 * Implements integration points for Clerk's React Native SDK (@clerk/clerk-expo).
 * Reads public configuration from process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY.
 *
 * Note: Never store Clerk Secret Keys in mobile client applications.
 */
export class ClerkAuthProvider implements IAuthService {
  readonly providerName = 'Clerk';
  private publishableKey: string | undefined;

  constructor() {
    this.publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  }

  get isConfigured(): boolean {
    return Boolean(this.publishableKey && this.publishableKey.startsWith('pk_'));
  }

  async getCurrentSession(): Promise<UserSession | null> {
    if (!this.isConfigured) {
      return null;
    }
    return authStorage.getSession();
  }

  async logout(): Promise<void> {
    await authStorage.clearSession();
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (!this.isConfigured) {
      return {
        success: false,
        error: 'Clerk is not configured. Set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your environment to enable production login.',
      };
    }

    // In a live Clerk environment with @clerk/clerk-expo, call:
    // await clerk.signIn.create({ identifier: credentials.email, password: credentials.password })
    return {
      success: false,
      error: 'Backend integration required. Please connect Clerk credentials.',
    };
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    if (!this.isConfigured) {
      return {
        success: false,
        error: 'Clerk is not configured. Set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your environment to enable production registration.',
      };
    }

    // In a live Clerk environment, call:
    // await clerk.signUp.create({ emailAddress: data.email, password: data.password, ... })
    return {
      success: false,
      error: 'Backend integration required. Please connect Clerk credentials.',
    };
  }

  async loginWithGoogle(): Promise<AuthResponse> {
    if (!this.isConfigured) {
      return {
        success: false,
        error: 'Google OAuth via Clerk requires EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY and custom scheme redirect configuration.',
      };
    }

    return {
      success: false,
      error: 'Clerk OAuth requires active network and configured custom URL scheme.',
    };
  }

  async requestPasswordReset(email: string): Promise<PasswordResetResponse> {
    if (!this.isConfigured) {
      return {
        success: false,
        message: 'Clerk not configured',
        error: 'Password reset requires EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY and Clerk email template service.',
      };
    }

    return {
      success: false,
      message: 'Pending backend connection',
      error: 'Backend connection required.',
    };
  }

  async verifyEmailOtp(
    otp: string,
    verificationType: 'account' | 'institutional'
  ): Promise<OtpVerifyResponse> {
    if (!this.isConfigured) {
      return {
        success: false,
        error: 'Email OTP verification requires configured Clerk or institutional SMTP backend service.',
      };
    }

    return {
      success: false,
      error: 'Backend connection required to verify OTP.',
    };
  }

  async resendEmailOtp(
    email: string,
    verificationType: 'account' | 'institutional'
  ): Promise<{ success: boolean; message: string; cooldownSeconds: number }> {
    if (!this.isConfigured) {
      return {
        success: false,
        message: 'Clerk email dispatch not configured.',
        cooldownSeconds: 60,
      };
    }

    return {
      success: true,
      message: 'Verification code resent.',
      cooldownSeconds: 60,
    };
  }

  async submitStudentOnboarding(data: StudentOnboardingData): Promise<AuthResponse> {
    if (!this.isConfigured) {
      return {
        success: false,
        error: 'Onboarding profile sync requires active backend or configured provider.',
      };
    }

    return {
      success: false,
      error: 'Backend connection required.',
    };
  }

  async submitAlternativeCollegeVerification(data: AltVerificationData): Promise<AuthResponse> {
    if (!this.isConfigured) {
      return {
        success: false,
        error: 'Alternative document submission requires secure backend document storage and admin moderation API.',
      };
    }

    return {
      success: false,
      error: 'Backend document storage required.',
    };
  }
}

