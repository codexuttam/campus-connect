import { create } from 'zustand';
import {
  AuthStatus,
  UserProfile,
  LoginCredentials,
  RegisterData,
  StudentOnboardingData,
  AltVerificationData,
  PasswordResetResponse,
} from '../types/auth';
import { authService, authServiceManager } from '../services/auth';

interface AuthState {
  status: AuthStatus;
  user: UserProfile | null;
  sessionToken: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  initializeAuth: () => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  verifyOtp: (
    otp: string,
    verificationType?: 'account' | 'institutional'
  ) => Promise<{ success: boolean; error?: string }>;
  resendOtp: (
    email?: string,
    verificationType?: 'account' | 'institutional'
  ) => Promise<{ success: boolean; message: string; cooldownSeconds?: number }>;
  submitOnboarding: (data: StudentOnboardingData) => Promise<{ success: boolean; error?: string }>;
  submitAltVerification: (data: AltVerificationData) => Promise<{ success: boolean; error?: string }>;
  requestPasswordReset: (email: string) => Promise<PasswordResetResponse>;
  logout: () => Promise<void>;
  clearError: () => void;
  setUser: (user: UserProfile | null) => void;
  setStatus: (status: AuthStatus) => void;
  isClerkConfigured: boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  status: 'unauthenticated',
  user: null,
  sessionToken: null,
  isLoading: false,
  isInitialized: false,
  error: null,
  isClerkConfigured: authServiceManager.isClerkConfigured,

  initializeAuth: async () => {
    try {
      set({ isLoading: true, error: null });
      const session = await authService.getCurrentSession();
      if (session && session.user) {
        set({
          status: session.user.authStatus,
          user: session.user,
          sessionToken: session.token,
          isInitialized: true,
          isLoading: false,
        });
      } else {
        set({
          status: 'unauthenticated',
          user: null,
          sessionToken: null,
          isInitialized: true,
          isLoading: false,
        });
      }
    } catch (err: any) {
      set({
        status: 'unauthenticated',
        user: null,
        sessionToken: null,
        isInitialized: true,
        isLoading: false,
        error: err?.message || 'Failed to restore session.',
      });
    }
  },

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authService.login(credentials);
      if (res.success && res.user) {
        const nextStatus = res.nextStatus || res.user.authStatus || 'fully_onboarded';
        set({
          status: nextStatus,
          user: res.user,
          sessionToken: res.sessionToken || null,
          isLoading: false,
          error: null,
        });
        return { success: true };
      } else {
        const errorMsg = res.error || 'Failed to authenticate.';
        set({ isLoading: false, error: errorMsg });
        return { success: false, error: errorMsg };
      }
    } catch (err: any) {
      const errorMsg = err?.message || 'Login encountered an unexpected error.';
      set({ isLoading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authService.register(data);
      if (res.success && res.user) {
        const nextStatus = res.nextStatus || 'registration_incomplete';
        set({
          status: nextStatus,
          user: res.user,
          sessionToken: res.sessionToken || null,
          isLoading: false,
          error: null,
        });
        return { success: true };
      } else {
        const errorMsg = res.error || 'Failed to register account.';
        set({ isLoading: false, error: errorMsg });
        return { success: false, error: errorMsg };
      }
    } catch (err: any) {
      const errorMsg = err?.message || 'Registration failed.';
      set({ isLoading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  loginWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await authService.loginWithGoogle();
      if (res.success && res.user) {
        const nextStatus = res.nextStatus || res.user.authStatus;
        set({
          status: nextStatus,
          user: res.user,
          sessionToken: res.sessionToken || null,
          isLoading: false,
          error: null,
        });
        return { success: true };
      } else {
        const errorMsg = res.error || 'Google authentication failed.';
        set({ isLoading: false, error: errorMsg });
        return { success: false, error: errorMsg };
      }
    } catch (err: any) {
      const errorMsg = err?.message || 'Google login failed.';
      set({ isLoading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  verifyOtp: async (otp: string, verificationType = 'institutional') => {
    set({ isLoading: true, error: null });
    try {
      const res = await authService.verifyEmailOtp(otp, verificationType);
      if (res.success && res.user) {
        const nextStatus = res.nextStatus || 'fully_onboarded';
        set({
          status: nextStatus,
          user: res.user,
          isLoading: false,
          error: null,
        });
        return { success: true };
      } else {
        const errorMsg = res.error || 'Invalid verification code.';
        set({ isLoading: false, error: errorMsg });
        return { success: false, error: errorMsg };
      }
    } catch (err: any) {
      const errorMsg = err?.message || 'Verification failed.';
      set({ isLoading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  resendOtp: async (email?: string, verificationType = 'institutional') => {
    const targetEmail = email || get().user?.institutionalEmail || get().user?.email || '';
    try {
      const res = await authService.resendEmailOtp(targetEmail, verificationType);
      return res;
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || 'Failed to resend code.',
        cooldownSeconds: 60,
      };
    }
  },

  submitOnboarding: async (data: StudentOnboardingData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authService.submitStudentOnboarding(data);
      if (res.success && res.user) {
        const nextStatus = res.nextStatus || 'email_verification_pending';
        set({
          status: nextStatus,
          user: res.user,
          isLoading: false,
          error: null,
        });
        return { success: true };
      } else {
        const errorMsg = res.error || 'Failed to save student profile.';
        set({ isLoading: false, error: errorMsg });
        return { success: false, error: errorMsg };
      }
    } catch (err: any) {
      const errorMsg = err?.message || 'Profile setup failed.';
      set({ isLoading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  submitAltVerification: async (data: AltVerificationData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authService.submitAlternativeCollegeVerification(data);
      if (res.success && res.user) {
        set({
          status: 'college_verification_pending',
          user: res.user,
          isLoading: false,
          error: null,
        });
        return { success: true };
      } else {
        const errorMsg = res.error || 'Failed to submit document.';
        set({ isLoading: false, error: errorMsg });
        return { success: false, error: errorMsg };
      }
    } catch (err: any) {
      const errorMsg = err?.message || 'Submission failed.';
      set({ isLoading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  requestPasswordReset: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authService.requestPasswordReset(email);
      set({ isLoading: false });
      return res;
    } catch (err: any) {
      set({ isLoading: false, error: err?.message || 'Password reset request failed.' });
      return {
        success: false,
        message: 'Could not send reset link.',
        error: err?.message,
      };
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
    } finally {
      set({
        status: 'unauthenticated',
        user: null,
        sessionToken: null,
        isLoading: false,
        error: null,
      });
    }
  },

  clearError: () => set({ error: null }),
  setUser: (user) => set({ user }),
  setStatus: (status) => set({ status }),
}));

