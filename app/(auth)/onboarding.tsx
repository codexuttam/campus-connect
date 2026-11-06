import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Building2,
  GraduationCap,
  BookOpen,
  ChevronRight,
  ArrowRight,
  AlertCircle,
  Mail,
  Check,
} from 'lucide-react-native';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { AppHeader } from '../../components/ui/AppHeader';
import { AppText } from '../../components/ui/AppText';
import { AppInput } from '../../components/ui/AppInput';
import { AppButton } from '../../components/ui/AppButton';
import { AppCard } from '../../components/ui/AppCard';
import { AppBadge } from '../../components/ui/AppBadge';
import { AppAvatar } from '../../components/ui/AppAvatar';
import { CollegeSearchModal } from '../../components/auth/CollegeSearchModal';
import { CollegeInfo } from '../../types/auth';
import { useAuth } from '../../hooks/useAuth';
import { theme } from '../../theme';

const POPULAR_COURSES = [
  'Computer Science',
  'Economics & Finance',
  'Engineering Sciences',
  'Medicine & Health',
  'Law & Jurisprudence',
  'Literature & Arts',
  'Natural Sciences',
  'Mathematics & Stats',
];

const GRADUATION_YEARS = ['2025', '2026', '2027', '2028', '2029', '2030'];

const AVATAR_PRESETS = [
  { id: 'crimson', label: 'Crimson', color: '#702D3B' },
  { id: 'olive', label: 'Olive', color: '#737B4B' },
  { id: 'espresso', label: 'Espresso', color: '#302B28' },
  { id: 'slate', label: 'Slate', color: '#4F6C7D' },
];

/**
 * Student Onboarding Screen (E)
 *
 * Requirements:
 * - Collect: College/university, Course or branch, Graduation year, Profile image (optional)
 * - Use searchable college selection rather than a large dropdown
 * - Use compact selectable options where appropriate
 */
export default function StudentOnboardingScreen() {
  const router = useRouter();
  const { user, submitOnboarding, isLoading, error: authError, clearError } = useAuth();

  const [selectedCollege, setSelectedCollege] = useState<CollegeInfo | null>(null);
  const [showCollegeModal, setShowCollegeModal] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState<string>('Computer Science');
  const [customCourse, setCustomCourse] = useState<string>('');
  const [isCustomCourseActive, setIsCustomCourseActive] = useState<boolean>(false);

  const [selectedGradYear, setSelectedGradYear] = useState<string>('2026');
  const [selectedAvatarPreset, setSelectedAvatarPreset] = useState<string>('crimson');

  const [institutionalEmail, setInstitutionalEmail] = useState<string>('');

  // Errors
  const [collegeError, setCollegeError] = useState<string | undefined>();
  const [emailError, setEmailError] = useState<string | undefined>();
  const [generalError, setGeneralError] = useState<string | undefined>();

  const activeCourse = isCustomCourseActive
    ? customCourse.trim()
    : selectedCourse;

  const handleSelectCollege = (college: CollegeInfo) => {
    setSelectedCollege(college);
    setCollegeError(undefined);

    // Pre-populate domain email placeholder if user already has username
    if (college.hasInstitutionalEmail && college.domain) {
      const username = user?.email.split('@')[0] || 'student';
      if (!institutionalEmail) {
        setInstitutionalEmail(`${username}@${college.domain}`);
      }
    }
  };

  const handleProceed = async () => {
    clearError();
    setGeneralError(undefined);

    if (!selectedCollege) {
      setCollegeError('Please select your university or college.');
      return;
    }

    if (!activeCourse) {
      setGeneralError('Please select or specify your course/branch of study.');
      return;
    }

    if (selectedCollege.hasInstitutionalEmail && !institutionalEmail.trim()) {
      setEmailError(`Institutional email is required for ${selectedCollege.name}.`);
      return;
    }

    const res = await submitOnboarding({
      collegeId: selectedCollege.id,
      collegeName: selectedCollege.name,
      collegeDomain: selectedCollege.domain,
      courseOrBranch: activeCourse,
      graduationYear: selectedGradYear,
      avatarPreset: selectedAvatarPreset,
      institutionalEmail: selectedCollege.hasInstitutionalEmail ? institutionalEmail.trim() : undefined,
    });

    if (res.success) {
      // If college has institutional email -> verify email
      // If alternative verification is required -> college status
      if (selectedCollege.hasInstitutionalEmail) {
        router.push('/(auth)/verify-email');
      } else {
        router.push('/(auth)/college-status');
      }
    } else {
      setGeneralError(res.error || 'Failed to complete onboarding.');
    }
  };

  return (
    <ScreenContainer scrollable safeTop safeBottom padded={false}>
      <AppHeader
        title="Student Onboarding"
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
            ACADEMIC CREDENTIALS
          </AppText>
          <AppText variant="h1" serif color="primary" style={styles.title}>
            Your College Profile
          </AppText>
          <AppText variant="bodySmall" color="secondary">
            Connect with peers from your course, cohort, and institution.
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

        {/* Section 1: Optional Avatar & Identity Accent */}
        <View style={styles.section}>
          <AppText variant="captionMedium" color="secondary" style={styles.sectionLabel}>
            STUDENT MONOGRAM & AVATAR
          </AppText>

          <View style={styles.avatarRow}>
            <AppAvatar
              name={user?.fullName || 'Student Scholar'}
              size="lg"
              style={[
                styles.previewAvatar,
                {
                  backgroundColor:
                    AVATAR_PRESETS.find((p) => p.id === selectedAvatarPreset)?.color ||
                    theme.colors.maroon,
                },
              ]}
            />
            <View style={styles.avatarOptionsCol}>
              <AppText variant="bodySmall" color="primary" style={styles.avatarSubtext}>
                Select accent tint for your student badge
              </AppText>
              <View style={styles.presetButtonsRow}>
                {AVATAR_PRESETS.map((preset) => {
                  const isSelected = selectedAvatarPreset === preset.id;
                  return (
                    <Pressable
                      key={preset.id}
                      onPress={() => setSelectedAvatarPreset(preset.id)}
                      style={[
                        styles.colorDot,
                        { backgroundColor: preset.color },
                        isSelected && styles.colorDotSelected,
                      ]}
                      accessibilityLabel={`Select ${preset.label} avatar color`}
                    >
                      {isSelected ? (
                        <Check
                          size={12}
                          color={theme.colors.textInverse}
                          strokeWidth={theme.icons.strokeWidth.bold}
                        />
                      ) : null}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>
        </View>

        {/* Section 2: College / University Selection (Searchable) */}
        <View style={styles.section}>
          <AppText variant="captionMedium" color="secondary" style={styles.sectionLabel}>
            COLLEGE OR UNIVERSITY
          </AppText>

          <Pressable
            onPress={() => setShowCollegeModal(true)}
            style={[
              styles.collegeSelectorCard,
              Boolean(collegeError) && styles.collegeSelectorCardError,
              Boolean(selectedCollege) && styles.collegeSelectorCardSelected,
            ]}
          >
            <View style={styles.selectorLeft}>
              <View style={styles.selectorIconBox}>
                <Building2
                  size={20}
                  color={
                    selectedCollege ? theme.colors.maroon : theme.colors.textSecondary
                  }
                  strokeWidth={theme.icons.strokeWidth.default}
                />
              </View>
              <View style={styles.selectorTextCol}>
                <AppText
                  variant={selectedCollege ? 'bodyMedium' : 'body'}
                  color={selectedCollege ? 'primary' : 'muted'}
                  numberOfLines={1}
                >
                  {selectedCollege ? selectedCollege.name : 'Select your institution...'}
                </AppText>
                {selectedCollege ? (
                  <AppText variant="caption" color="secondary" numberOfLines={1}>
                    {selectedCollege.location}
                  </AppText>
                ) : (
                  <AppText variant="caption" color="secondary">
                    Tap to search verified university directory
                  </AppText>
                )}
              </View>
            </View>

            <ChevronRight
              size={18}
              color={theme.colors.textMuted}
              strokeWidth={theme.icons.strokeWidth.default}
            />
          </Pressable>

          {collegeError ? (
            <AppText variant="caption" color="error" style={styles.fieldErrorText}>
              {collegeError}
            </AppText>
          ) : null}

          {/* If selected college has institutional email requirement, prompt for college email */}
          {selectedCollege?.hasInstitutionalEmail ? (
            <View style={styles.institutionalBox}>
              <View style={styles.institutionalInfoRow}>
                <AppBadge
                  label={`Verified Domain: @${selectedCollege.domain}`}
                  variant="olive"
                  size="sm"
                />
              </View>
              <AppInput
                label="Institutional Student Email"
                placeholder={`student@${selectedCollege.domain || 'university.edu'}`}
                value={institutionalEmail}
                onChangeText={(text) => {
                  setInstitutionalEmail(text);
                  if (emailError) setEmailError(undefined);
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                error={emailError}
                helperText={`A 6-digit verification code will be dispatched to this college address.`}
                leadingIcon={
                  <Mail
                    size={18}
                    color={theme.colors.textSecondary}
                    strokeWidth={theme.icons.strokeWidth.default}
                  />
                }
              />
            </View>
          ) : selectedCollege && !selectedCollege.hasInstitutionalEmail ? (
            <View style={styles.altNoticeCard}>
              <AppBadge label="Alternative Verification" variant="neutral" size="sm" dot />
              <AppText variant="caption" color="secondary" style={styles.altNoticeText}>
                {selectedCollege.name} does not issue standard student email domains. You will be routed to upload student credentials for administrator approval.
              </AppText>
            </View>
          ) : null}
        </View>

        {/* Section 3: Course / Branch of Study */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <AppText variant="captionMedium" color="secondary" style={styles.sectionLabel}>
              COURSE / MAJOR / BRANCH
            </AppText>
            <Pressable
              onPress={() => setIsCustomCourseActive(!isCustomCourseActive)}
              hitSlop={6}
            >
              <AppText variant="caption" color="primary" style={styles.customToggleText}>
                {isCustomCourseActive ? 'Choose preset' : 'Custom major'}
              </AppText>
            </Pressable>
          </View>

          {isCustomCourseActive ? (
            <AppInput
              placeholder="e.g. Molecular Biophysics, Architecture..."
              value={customCourse}
              onChangeText={setCustomCourse}
              autoCorrect={false}
              leadingIcon={
                <BookOpen
                  size={18}
                  color={theme.colors.textSecondary}
                  strokeWidth={theme.icons.strokeWidth.default}
                />
              }
            />
          ) : (
            <View style={styles.chipsGrid}>
              {POPULAR_COURSES.map((course) => {
                const isSelected = selectedCourse === course;
                return (
                  <Pressable
                    key={course}
                    onPress={() => setSelectedCourse(course)}
                    style={[
                      styles.courseChip,
                      isSelected && styles.courseChipSelected,
                    ]}
                  >
                    <AppText
                      variant="caption"
                      style={[
                        styles.courseChipText,
                        isSelected && styles.courseChipTextSelected,
                      ]}
                    >
                      {course}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>

        {/* Section 4: Graduation Year */}
        <View style={styles.section}>
          <AppText variant="captionMedium" color="secondary" style={styles.sectionLabel}>
            EXPECTED GRADUATION YEAR
          </AppText>

          <View style={styles.yearsRow}>
            {GRADUATION_YEARS.map((year) => {
              const isSelected = selectedGradYear === year;
              return (
                <Pressable
                  key={year}
                  onPress={() => setSelectedGradYear(year)}
                  style={[
                    styles.yearBox,
                    isSelected && styles.yearBoxSelected,
                  ]}
                >
                  <AppText
                    variant="bodySmallMedium"
                    style={[
                      styles.yearText,
                      isSelected && styles.yearTextSelected,
                    ]}
                  >
                    {year}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Primary CTA */}
        <AppButton
          title={
            selectedCollege?.hasInstitutionalEmail
              ? 'Proceed to Email Verification'
              : 'Proceed to Student Verification'
          }
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
          onPress={handleProceed}
          style={styles.submitButton}
        />
      </View>

      {/* College Search Modal */}
      <CollegeSearchModal
        visible={showCollegeModal}
        selectedCollegeId={selectedCollege?.id}
        onSelect={handleSelectCollege}
        onClose={() => setShowCollegeModal(false)}
      />
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
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  sectionLabel: {
    letterSpacing: theme.letterSpacing.wide,
    marginBottom: theme.spacing.xs,
    fontSize: 11,
  },
  customToggleText: {
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  previewAvatar: {
    marginRight: theme.spacing.lg,
  },
  avatarOptionsCol: {
    flex: 1,
  },
  avatarSubtext: {
    marginBottom: 8,
  },
  presetButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  colorDot: {
    width: 26,
    height: 26,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorDotSelected: {
    borderWidth: 2,
    borderColor: theme.colors.background,
    transform: [{ scale: 1.1 }],
  },
  collegeSelectorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  collegeSelectorCardError: {
    borderColor: theme.colors.error,
  },
  collegeSelectorCardSelected: {
    borderColor: theme.colors.maroon,
    backgroundColor: '#FFFDF9',
  },
  selectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  selectorIconBox: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  selectorTextCol: {
    flex: 1,
  },
  fieldErrorText: {
    marginTop: 4,
  },
  institutionalBox: {
    marginTop: theme.spacing.md,
  },
  institutionalInfoRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.xs,
  },
  altNoticeCard: {
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  altNoticeText: {
    marginTop: 6,
    lineHeight: 18,
  },
  chipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  courseChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  courseChipSelected: {
    backgroundColor: theme.colors.maroonLight,
    borderColor: theme.colors.maroon,
  },
  courseChipText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
  },
  courseChipTextSelected: {
    color: theme.colors.maroon,
    fontFamily: theme.fontFamilies.sans.semiBold,
  },
  yearsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  yearBox: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  yearBoxSelected: {
    backgroundColor: theme.colors.maroon,
    borderColor: theme.colors.maroon,
  },
  yearText: {
    color: theme.colors.textPrimary,
  },
  yearTextSelected: {
    color: theme.colors.textInverse,
  },
  submitButton: {
    marginTop: theme.spacing.lg,
  },
});

