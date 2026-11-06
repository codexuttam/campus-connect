import { useAuthStore } from '../store/useAuthStore';

export function useAuth() {
  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  const sessionToken = useAuthStore((s) => s.sessionToken);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const error = useAuthStore((s) => s.error);
  const isClerkConfigured = useAuthStore((s) => s.isClerkConfigured);

  const initializeAuth = useAuthStore((s) => s.initializeAuth);
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);
  const verifyOtp = useAuthStore((s) => s.verifyOtp);
  const resendOtp = useAuthStore((s) => s.resendOtp);
  const submitOnboarding = useAuthStore((s) => s.submitOnboarding);
  const submitAltVerification = useAuthStore((s) => s.submitAltVerification);
  const requestPasswordReset = useAuthStore((s) => s.requestPasswordReset);
  const logout = useAuthStore((s) => s.logout);
  const clearError = useAuthStore((s) => s.clearError);

  const isAuthenticated = status === 'fully_onboarded';
  const isPendingVerification =
    status === 'email_verification_pending' || status === 'college_verification_pending';
  const isRegistrationIncomplete = status === 'registration_incomplete';

  return {
    status,
    user,
    sessionToken,
    isLoading,
    isInitialized,
    error,
    isClerkConfigured,
    isAuthenticated,
    isPendingVerification,
    isRegistrationIncomplete,

    // Operations
    initializeAuth,
    login,
    register,
    loginWithGoogle,
    verifyOtp,
    resendOtp,
    submitOnboarding,
    submitAltVerification,
    requestPasswordReset,
    logout,
    clearError,
  };
}

