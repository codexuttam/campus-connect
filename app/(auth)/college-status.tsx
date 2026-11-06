import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ShieldCheck,
  Clock,
  FileText,
  Building2,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Upload,
} from 'lucide-react-native';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { AppHeader } from '../../components/ui/AppHeader';
import { AppText } from '../../components/ui/AppText';
import { AppInput } from '../../components/ui/AppInput';
import { AppButton } from '../../components/ui/AppButton';
import { AppCard } from '../../components/ui/AppCard';
import { AppBadge } from '../../components/ui/AppBadge';
import { useAuth } from '../../hooks/useAuth';
import { theme } from '../../theme';

const DOC_TYPES = [
  { id: 'student_id_card', label: 'Student ID Card' },
  { id: 'tuition_receipt', label: 'Tuition Fee Receipt' },
  { id: 'acceptance_letter', label: 'Dean / Offer Letter' },
] as const;

/**
 * College Verification Status & Alternative Verification Screen
 *
 * Requirements:
 * - College verification status tracker (unverified, pending_email, pending_admin_review, verified)
 * - Support colleges without public student domains
 * - Administrator-approved alternative verification process
 */
export default function CollegeStatusScreen() {
  const router = useRouter();
  const { user, submitAltVerification, isLoading, error: authError, clearError } = useAuth();

  const [studentIdNumber, setStudentIdNumber] = useState('');
  const [selectedDocType, setSelectedDocType] = useState<'student_id_card' | 'tuition_receipt' | 'acceptance_letter'>('student_id_card');
  const [docName, setDocName] = useState('student_credential_doc.pdf');
  const [notes, setNotes] = useState('');

  const [idError, setIdError] = useState<string | undefined>();
  const [generalError, setGeneralError] = useState<string | undefined>();
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(
    user?.collegeVerificationStatus === 'pending_admin_review'
  );

  const collegeName = user?.collegeName || 'Selected Institution';
  const collegeStatus = user?.collegeVerificationStatus || 'unverified';

  const handleSubmitAltVerification = async () => {
    clearError();
    setGeneralError(undefined);

    if (!studentIdNumber.trim()) {
      setIdError('Student ID or registration number is required.');
      return;
    }
    setIdError(undefined);

    const res = await submitAltVerification({
      collegeId: user?.collegeId || 'unlisted',
      collegeName,
      studentIdNumber: studentIdNumber.trim(),
      documentType: selectedDocType,
      documentName: docName,
      notes: notes.trim(),
    });

    if (res.success) {
      setIsSubmittedSuccess(true);
    } else {
      setGeneralError(res.error || 'Failed to submit document for review.');
    }
  };

  return (
    <ScreenContainer scrollable safeTop safeBottom padded={false}>
      <AppHeader
        title="College Verification"
        serifTitle
        showBack
        onBack={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('/(auth)/onboarding');
          }
        }}
        borderBottom={false}
      />

      <View style={styles.content}>
        {/* Editorial Heading */}
        <View style={styles.headingSection}>
          <AppText variant="captionMedium" color="secondary" style={styles.kicker}>
            CREDENTIAL VALIDATION
          </AppText>
          <AppText variant="h1" serif color="primary" style={styles.title}>
            Institutional Review
          </AppText>
          <AppText variant="bodySmall" color="secondary">
            Collegiate membership requires domain matching or administrator review.
          </AppText>
        </View>

        {/* College Summary Card */}
        <AppCard variant="default" padding="md" style={styles.collegeCard}>
          <View style={styles.collegeCardHeader}>
            <View style={styles.iconBox}>
              <Building2 size={20} color={theme.colors.maroon} />
            </View>
            <View style={styles.collegeDetails}>
              <AppText variant="bodyMedium" color="primary" numberOfLines={1}>
                {collegeName}
              </AppText>
              <AppText variant="caption" color="secondary">
                {user?.courseOrBranch || 'Undergraduate'} · Class of {user?.graduationYear || '2026'}
              </AppText>
            </View>
          </View>

          <View style={styles.badgeRow}>
            {collegeStatus === 'verified' && (
              <AppBadge label="Verified Academic Scholar" variant="olive" size="sm" dot />
            )}
            {collegeStatus === 'pending_admin_review' && (
              <AppBadge label="Under Administrator Review" variant="neutral" size="sm" dot />
            )}
            {collegeStatus === 'pending_email' && (
              <AppBadge label="Email OTP Verification Pending" variant="maroon" size="sm" dot />
            )}
            {collegeStatus === 'unverified' && (
              <AppBadge label="Unverified Institution" variant="neutral" size="sm" />
            )}
          </View>
        </AppCard>

        {/* Error notification banner */}
        {(generalError || authError) && (
          <View style={styles.errorBanner}>
            <AlertCircle size={16} color={theme.colors.error} />
            <AppText variant="caption" style={styles.errorBannerText}>
              {generalError || authError}
            </AppText>
          </View>
        )}

        {/* If user is already under admin review or just submitted */}
        {isSubmittedSuccess ? (
          <View style={styles.statusTimelineCard}>
            <View style={styles.timelineRow}>
              <View style={[styles.timelineDot, styles.timelineDotComplete]}>
                <CheckCircle2 size={14} color={theme.colors.textInverse} />
              </View>
              <View style={styles.timelineTextCol}>
                <AppText variant="bodySmallMedium" color="primary">
                  Student Documentation Submitted
                </AppText>
                <AppText variant="caption" color="secondary">
                  Credential attached: {user?.altVerificationDocName || docName}
                </AppText>
              </View>
            </View>

            <View style={styles.timelineConnector} />

            <View style={styles.timelineRow}>
              <View style={[styles.timelineDot, styles.timelineDotActive]}>
                <Clock size={14} color={theme.colors.textInverse} />
              </View>
              <View style={styles.timelineTextCol}>
                <AppText variant="bodySmallMedium" color="primary">
                  Campus Administrator Review
                </AppText>
                <AppText variant="caption" color="secondary">
                  Estimated review turnaround: 12–24 business hours.
                </AppText>
              </View>
            </View>

            <View style={styles.timelineConnector} />

            <View style={styles.timelineRow}>
              <View style={[styles.timelineDot, styles.timelineDotPending]}>
                <ShieldCheck size={14} color={theme.colors.textMuted} />
              </View>
              <View style={styles.timelineTextCol}>
                <AppText variant="bodySmall" color="muted">
                  Full Campus Network Access
                </AppText>
                <AppText variant="caption" color="muted">
                  Full student badge and departmental circles activated upon approval.
                </AppText>
              </View>
            </View>

            <AppButton
              title="Enter Preview Mode"
              variant="secondary"
              size="lg"
              fullWidth
              trailingIcon={
                <ArrowRight
                  size={16}
                  color={theme.colors.textPrimary}
                  strokeWidth={theme.icons.strokeWidth.bold}
                />
              }
              onPress={() => router.replace('/(tabs)')}
              style={styles.previewButton}
            />
          </View>
        ) : (
          /* Form for Alternative Verification */
          <View style={styles.formSection}>
            <View style={styles.noticeBox}>
              <AppText variant="captionMedium" color="primary" style={styles.noticeTitle}>
                Alternative Verification Path
              </AppText>
              <AppText variant="caption" color="secondary" style={styles.noticeDesc}>
                If your university does not provide direct student domain emails, submit an institutional document for manual administrative verification.
              </AppText>
            </View>

            <AppInput
              label="Student Identification Number"
              placeholder="e.g. STU-2024-8841"
              value={studentIdNumber}
              onChangeText={(t) => {
                setStudentIdNumber(t);
                if (idError) setIdError(undefined);
              }}
              autoCapitalize="characters"
              error={idError}
              leadingIcon={
                <ShieldCheck
                  size={18}
                  color={theme.colors.textSecondary}
                  strokeWidth={theme.icons.strokeWidth.default}
                />
              }
            />

            {/* Document Type Chips */}
            <AppText variant="captionMedium" color="secondary" style={styles.docTypeLabel}>
              DOCUMENT TYPE
            </AppText>
            <View style={styles.docTypeRow}>
              {DOC_TYPES.map((type) => {
                const isSelected = selectedDocType === type.id;
                return (
                  <Pressable
                    key={type.id}
                    onPress={() => setSelectedDocType(type.id)}
                    style={[
                      styles.docChip,
                      isSelected && styles.docChipSelected,
                    ]}
                  >
                    <AppText
                      variant="caption"
                      style={[
                        styles.docChipText,
                        isSelected && styles.docChipTextSelected,
                      ]}
                    >
                      {type.label}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>

            {/* Document Attachment Picker Box */}
            <View style={styles.uploadBox}>
              <View style={styles.uploadLeft}>
                <View style={styles.fileIconBox}>
                  <FileText size={18} color={theme.colors.maroon} />
                </View>
                <View style={styles.fileDetails}>
                  <AppText variant="bodySmallMedium" color="primary" numberOfLines={1}>
                    {docName}
                  </AppText>
                  <AppText variant="caption" color="secondary">
                    Official credential attached (PDF / JPG)
                  </AppText>
                </View>
              </View>
              <Upload size={16} color={theme.colors.maroon} />
            </View>

            <AppInput
              label="Optional Registrar Notes"
              placeholder="Add department or student portal reference..."
              value={notes}
              onChangeText={setNotes}
              containerStyle={styles.notesInput}
            />

            <AppButton
              title="Submit for Administrator Review"
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
              onPress={handleSubmitAltVerification}
              style={styles.submitButton}
            />
          </View>
        )}
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
  collegeCard: {
    marginBottom: theme.spacing.lg,
  },
  collegeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  collegeDetails: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
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
  statusTimelineCard: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timelineDot: {
    width: 28,
    height: 28,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  timelineDotComplete: {
    backgroundColor: theme.colors.olive,
  },
  timelineDotActive: {
    backgroundColor: theme.colors.maroon,
  },
  timelineDotPending: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  timelineConnector: {
    width: 2,
    height: 24,
    backgroundColor: theme.colors.border,
    marginLeft: 13,
    marginVertical: 4,
  },
  timelineTextCol: {
    flex: 1,
  },
  previewButton: {
    marginTop: theme.spacing.xl,
  },
  formSection: {
    marginBottom: theme.spacing.xl,
  },
  noticeBox: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  noticeTitle: {
    marginBottom: 4,
  },
  noticeDesc: {
    lineHeight: 18,
  },
  docTypeLabel: {
    letterSpacing: theme.letterSpacing.wide,
    marginBottom: theme.spacing.xs,
    fontSize: 11,
  },
  docTypeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: theme.spacing.lg,
  },
  docChip: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  docChipSelected: {
    backgroundColor: theme.colors.maroonLight,
    borderColor: theme.colors.maroon,
  },
  docChipText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  docChipTextSelected: {
    color: theme.colors.maroon,
    fontFamily: theme.fontFamilies.sans.semiBold,
  },
  uploadBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    marginBottom: theme.spacing.md,
  },
  uploadLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fileIconBox: {
    width: 32,
    height: 32,
    borderRadius: theme.radius.xs,
    backgroundColor: theme.colors.maroonLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  fileDetails: {
    flex: 1,
  },
  notesInput: {
    marginBottom: theme.spacing.lg,
  },
  submitButton: {
    marginTop: theme.spacing.xs,
  },
});

