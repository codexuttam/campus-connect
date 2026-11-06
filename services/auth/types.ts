import {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  StudentOnboardingData,
  AltVerificationData,
  OtpVerifyResponse,
  PasswordResetResponse,
  UserProfile,
  UserSession,
} from '../../types/auth';

export interface IAuthService {
  providerName: string;
  isConfigured: boolean;

  // Session
  getCurrentSession(): Promise<UserSession | null>;
  logout(): Promise<void>;

  // Authentication
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  register(data: RegisterData): Promise<AuthResponse>;
  loginWithGoogle(): Promise<AuthResponse>;
  requestPasswordReset(email: string): Promise<PasswordResetResponse>;

  // Verification & Onboarding
  verifyEmailOtp(otp: string, verificationType: 'account' | 'institutional'): Promise<OtpVerifyResponse>;
  resendEmailOtp(email: string, verificationType: 'account' | 'institutional'): Promise<{ success: boolean; message: string; cooldownSeconds: number }>;
  submitStudentOnboarding(data: StudentOnboardingData): Promise<AuthResponse>;
  submitAlternativeCollegeVerification(data: AltVerificationData): Promise<AuthResponse>;
}

export interface IAuthStorage {
  getSession(): Promise<UserSession | null>;
  saveSession(session: UserSession): Promise<void>;
  clearSession(): Promise<void>;
}

