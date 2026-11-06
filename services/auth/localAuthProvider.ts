import {
  AuthResponse,
  LoginCredentials,
  OtpVerifyResponse,
  PasswordResetResponse,
  RegisterData,
  StudentOnboardingData,
  AltVerificationData,
  UserProfile,
  UserSession,
} from '../../types/auth';
import { IAuthService } from './types';
import { authStorage } from './storage';
import { getCollegeById, validateInstitutionalEmail } from './collegeDirectory';

/**
 * Local Development & Prototyping Auth Provider
 *
 * Provides a local implementation of IAuthService.
 * Explicitly intended for UI development, verification flow testing,
 * and review when external credentials (Clerk / SMTP backend) are unconfigured.
 *
 * NOTE: Uses transparent development test code '123456' for verification,
 * without faking a production backend or claiming real email delivery.
 */
export class LocalAuthProvider implements IAuthService {
  readonly providerName = 'Local Development Provider';
  readonly isConfigured = true;

  // Expected test OTP for development verification testing
  static readonly DEV_TEST_OTP = '123456';

  async getCurrentSession(): Promise<UserSession | null> {
    return authStorage.getSession();
  }

  async logout(): Promise<void> {
    await authStorage.clearSession();
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const email = credentials.email.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    if (!credentials.password || credentials.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    // Check if there is an existing session or create a mock student profile
    const existingSession = await authStorage.getSession();
    if (existingSession && existingSession.user.email.toLowerCase() === email) {
      return {
        success: true,
        user: existingSession.user,
        sessionToken: existingSession.token,
        nextStatus: existingSession.user.authStatus,
      };
    }

    // Default mock user profile for local login testing
    const defaultUser: UserProfile = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      email,
      fullName: 'Julian Vance',
      collegeId: 'oxford',
      collegeName: 'University of Oxford',
      collegeDomain: 'ox.ac.uk',
      institutionalEmail: 'julian.vance@ox.ac.uk',
      courseOrBranch: 'Computer Science & Philosophy',
      graduationYear: '2026',
      collegeVerificationStatus: 'verified',
      authStatus: 'fully_onboarded',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    const session: UserSession = {
      token: 'cc_session_' + Date.now(),
      expiresAt: Date.now() + 86400 * 1000 * 7,
      user: defaultUser,
    };

    await authStorage.saveSession(session);

    return {
      success: true,
      user: defaultUser,
      sessionToken: session.token,
      nextStatus: 'fully_onboarded',
    };
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const email = data.email.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Valid email address is required.' };
    }
    if (!data.fullName.trim()) {
      return { success: false, error: 'Full name is required.' };
    }
    if (!data.agreedToTerms) {
      return { success: false, error: 'You must accept the terms and community guidelines.' };
    }

    // Initial registered user starts at registration_incomplete
    const newUser: UserProfile = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      email,
      fullName: data.fullName.trim(),
      collegeVerificationStatus: 'unverified',
      authStatus: 'registration_incomplete',
      createdAt: new Date().toISOString(),
    };

    const session: UserSession = {
      token: 'cc_reg_' + Date.now(),
      expiresAt: Date.now() + 86400 * 1000,
      user: newUser,
    };

    await authStorage.saveSession(session);

    return {
      success: true,
      user: newUser,
      sessionToken: session.token,
      nextStatus: 'registration_incomplete',
      message: 'Account created. Please complete student onboarding.',
    };
  }

  async loginWithGoogle(): Promise<AuthResponse> {
    // Simulated Google OAuth response in development
    const googleUser: UserProfile = {
      id: 'usr_g_' + Math.random().toString(36).substring(2, 9),
      email: 'student.google@ox.ac.uk',
      fullName: 'Amara Patel',
      collegeId: 'oxford',
      collegeName: 'University of Oxford',
      collegeDomain: 'ox.ac.uk',
      courseOrBranch: 'Economics & Management',
      graduationYear: '2026',
      collegeVerificationStatus: 'pending_email',
      authStatus: 'email_verification_pending',
      createdAt: new Date().toISOString(),
    };

    const session: UserSession = {
      token: 'cc_google_' + Date.now(),
      expiresAt: Date.now() + 86400 * 1000 * 7,
      user: googleUser,
    };

    await authStorage.saveSession(session);

    return {
      success: true,
      user: googleUser,
      sessionToken: session.token,
      nextStatus: 'email_verification_pending',
    };
  }

  async requestPasswordReset(email: string): Promise<PasswordResetResponse> {
    const clean = email.trim().toLowerCase();
    if (!clean || !clean.includes('@')) {
      return { success: false, message: 'Invalid email address provided.' };
    }

    return {
      success: true,
      message: `Password reset instructions have been generated for ${clean}. (In development: No external email service was contacted).`,
    };
  }

  async submitStudentOnboarding(data: StudentOnboardingData): Promise<AuthResponse> {
    const session = await authStorage.getSession();
    if (!session) {
      return { success: false, error: 'No active session found. Please register or login.' };
    }

    const college = getCollegeById(data.collegeId);
    if (!college) {
      return { success: false, error: 'Selected college was not found in directory.' };
    }

    // Determine verification requirements
    // If college has no institutional email domain -> route to alternative verification
    let nextStatus: UserProfile['authStatus'] = 'email_verification_pending';
    let collegeVerificationStatus: UserProfile['collegeVerificationStatus'] = 'pending_email';

    if (!college.hasInstitutionalEmail) {
      nextStatus = 'college_verification_pending';
      collegeVerificationStatus = 'pending_admin_review';
    }

    // Validate institutional email if provided
    if (data.institutionalEmail) {
      const emailCheck = validateInstitutionalEmail(data.institutionalEmail, college);
      if (!emailCheck.isValid) {
        return { success: false, error: emailCheck.message };
      }
    }

    const updatedUser: UserProfile = {
      ...session.user,
      collegeId: college.id,
      collegeName: college.name,
      collegeDomain: college.domain,
      institutionalEmail: data.institutionalEmail,
      courseOrBranch: data.courseOrBranch,
      graduationYear: data.graduationYear,
      avatarPreset: data.avatarPreset,
      collegeVerificationStatus,
      authStatus: nextStatus,
    };

    await authStorage.saveSession({
      ...session,
      user: updatedUser,
    });

    return {
      success: true,
      user: updatedUser,
      nextStatus,
      message: college.hasInstitutionalEmail
        ? 'Profile saved. Please verify your institutional email.'
        : 'Profile saved. Please submit alternative student documentation for admin review.',
    };
  }

  async verifyEmailOtp(
    otp: string,
    verificationType: 'account' | 'institutional'
  ): Promise<OtpVerifyResponse> {
    const cleanOtp = otp.trim();

    if (cleanOtp.length !== 6) {
      return { success: false, error: 'OTP must be exactly 6 digits.' };
    }

    // In local development test mode, accept DEV_TEST_OTP or 000000
    if (cleanOtp !== LocalAuthProvider.DEV_TEST_OTP && cleanOtp !== '000000') {
      return {
        success: false,
        error: `Invalid verification code. (Development test code is ${LocalAuthProvider.DEV_TEST_OTP})`,
      };
    }

    const session = await authStorage.getSession();
    if (!session) {
      return { success: false, error: 'Session expired. Please log in again.' };
    }

    // Once email is verified:
    // If the account already had college onboarding completed and this verified the institutional email:
    // User becomes fully_onboarded.
    // If this verified an initial personal account email, check if college info is still needed.
    let nextStatus: UserProfile['authStatus'] = 'fully_onboarded';
    let collegeStatus = session.user.collegeVerificationStatus;

    if (verificationType === 'institutional' || session.user.collegeName) {
      collegeStatus = 'verified';
      nextStatus = 'fully_onboarded';
    } else {
      nextStatus = 'registration_incomplete';
    }

    const updatedUser: UserProfile = {
      ...session.user,
      collegeVerificationStatus: collegeStatus,
      authStatus: nextStatus,
    };

    await authStorage.saveSession({
      ...session,
      user: updatedUser,
    });

    return {
      success: true,
      user: updatedUser,
      nextStatus,
      message: 'Verification successful. Welcome to CampusConnect.',
    };
  }

  async resendEmailOtp(
    email: string,
    verificationType: 'account' | 'institutional'
  ): Promise<{ success: boolean; message: string; cooldownSeconds: number }> {
    return {
      success: true,
      message: `A new 6-digit code was generated for ${email}. (Dev test code: ${LocalAuthProvider.DEV_TEST_OTP})`,
      cooldownSeconds: 45,
    };
  }

  async submitAlternativeCollegeVerification(data: AltVerificationData): Promise<AuthResponse> {
    const session = await authStorage.getSession();
    if (!session) {
      return { success: false, error: 'No active session found.' };
    }

    if (!data.studentIdNumber.trim()) {
      return { success: false, error: 'Student ID or registration number is required.' };
    }

    const updatedUser: UserProfile = {
      ...session.user,
      collegeVerificationStatus: 'pending_admin_review',
      authStatus: 'college_verification_pending',
      altVerificationReason: data.notes || `Submitted ${data.documentType}: ${data.documentName}`,
      altVerificationDocName: data.documentName,
    };

    await authStorage.saveSession({
      ...session,
      user: updatedUser,
    });

    return {
      success: true,
      user: updatedUser,
      nextStatus: 'college_verification_pending',
      message: 'Document submitted successfully. A campus administrator will review your enrollment credentials within 24 hours.',
    };
  }
}

