/**
 * CampusConnect Authentication & User State Types
 *
 * Strict university-community identity state model:
 * 1. unauthenticated
 * 2. registration_incomplete
 * 3. email_verification_pending
 * 4. college_verification_pending
 * 5. fully_onboarded
 */

export type AuthStatus =
  | 'unauthenticated'
  | 'registration_incomplete'
  | 'email_verification_pending'
  | 'college_verification_pending'
  | 'fully_onboarded';

export type CollegeVerificationStatus =
  | 'unverified'
  | 'pending_email'
  | 'pending_admin_review'
  | 'verified';

export interface CollegeInfo {
  id: string;
  name: string;
  shortName: string;
  domain?: string; // e.g. "ox.ac.uk", "mit.edu"
  location: string;
  hasInstitutionalEmail: boolean;
  popular?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  avatarPreset?: string;
  collegeId?: string;
  collegeName?: string;
  collegeDomain?: string;
  institutionalEmail?: string;
  courseOrBranch?: string;
  graduationYear?: string;
  collegeVerificationStatus: CollegeVerificationStatus;
  altVerificationReason?: string;
  altVerificationDocName?: string;
  authStatus: AuthStatus;
  createdAt: string;
  lastLoginAt?: string;
}

export interface UserSession {
  token: string;
  refreshToken?: string;
  expiresAt: number;
  user: UserProfile;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password?: string;
  agreedToTerms: boolean;
}

export interface StudentOnboardingData {
  collegeId: string;
  collegeName: string;
  collegeDomain?: string;
  courseOrBranch: string;
  graduationYear: string;
  avatarPreset?: string;
  institutionalEmail?: string;
}

export interface AltVerificationData {
  collegeId: string;
  collegeName: string;
  studentIdNumber: string;
  documentType: 'student_id_card' | 'tuition_receipt' | 'acceptance_letter' | 'dean_affidavit';
  documentName: string;
  notes?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: UserProfile;
  sessionToken?: string;
  nextStatus?: AuthStatus;
  message?: string;
  error?: string;
}

export interface OtpVerifyResponse {
  success: boolean;
  user?: UserProfile;
  nextStatus?: AuthStatus;
  message?: string;
  error?: string;
}

export interface PasswordResetResponse {
  success: boolean;
  message: string;
  error?: string;
}

