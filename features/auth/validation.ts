/**
 * Input validation helpers for Authentication & Student Onboarding
 */

export function validateEmail(email: string): { isValid: boolean; error?: string } {
  const clean = email.trim();
  if (!clean) {
    return { isValid: false, error: 'Email address is required.' };
  }

  // RFC 5322 standard simplified email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(clean)) {
    return { isValid: false, error: 'Please enter a valid email address.' };
  }

  return { isValid: true };
}

export function validatePassword(password: string): { isValid: boolean; error?: string } {
  if (!password) {
    return { isValid: false, error: 'Password is required.' };
  }
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters.' };
  }
  return { isValid: true };
}

export function validateName(name: string): { isValid: boolean; error?: string } {
  const clean = name.trim();
  if (!clean) {
    return { isValid: false, error: 'Full name is required.' };
  }
  if (clean.length < 2) {
    return { isValid: false, error: 'Please enter your full name.' };
  }
  return { isValid: true };
}

export function validatePasswordConfirmation(
  password: string,
  confirm: string
): { isValid: boolean; error?: string } {
  if (!confirm) {
    return { isValid: false, error: 'Please confirm your password.' };
  }
  if (password !== confirm) {
    return { isValid: false, error: 'Passwords do not match.' };
  }
  return { isValid: true };
}

