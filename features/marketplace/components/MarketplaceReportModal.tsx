import React, { useState } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
} from 'react-native';
import { X, ShieldAlert, Check } from 'lucide-react-native';
import { AppText } from '../../../components/ui/AppText';
import { AppButton } from '../../../components/ui/AppButton';
import { MarketplaceReportReason } from '../types';
import { theme } from '../../../theme';
import { showAlert } from '../../../services/dialog';

export interface MarketplaceReportModalProps {
  visible: boolean;
  listingTitle: string;
  onClose: () => void;
  onSubmitReport: (reason: MarketplaceReportReason, details?: string) => Promise<void>;
  isLoading?: boolean;
}

const REPORT_REASONS: { id: MarketplaceReportReason; label: string; description: string }[] = [
  {
    id: 'prohibited_item',
    label: 'Prohibited Item',
    description: 'Weapons, illegal substances, prescription medication, exams, or counterfeits.',
  },
  {
    id: 'counterfeit_or_fraud',
    label: 'Fraud or Scam',
    description: 'Deceptive descriptions, fake items, or suspicious payment requests.',
  },
  {
    id: 'suspicious_pricing',
    label: 'Suspicious Pricing',
    description: 'Unrealistically high or predatory pricing targeting freshmen/students.',
  },
  {
    id: 'inappropriate_content',
    label: 'Inappropriate Content',
    description: 'Offensive images, vulgar language, or adult material.',
  },
  {
    id: 'harassment_or_spam',
    label: 'Harassment or Duplicate Spam',
    description: 'Repeated duplicate listings or unsolicited commercial solicitation.',
  },
  {
    id: 'not_a_student',
    label: 'Not an Affiliated Student',
    description: 'Commercial retailer or outside third-party operating unauthorized on campus.',
  },
  {
    id: 'other',
    label: 'Other Campus Policy Violation',
    description: 'Any other safety or university policy concern.',
  },
];

export const MarketplaceReportModal: React.FC<MarketplaceReportModalProps> = ({
  visible,
  listingTitle,
  onClose,
  onSubmitReport,
  isLoading = false,
}) => {
  const [selectedReason, setSelectedReason] = useState<MarketplaceReportReason>('prohibited_item');
  const [details, setDetails] = useState('');

  const handleSubmit = async () => {
    try {
      await onSubmitReport(selectedReason, details.trim() || undefined);
      showAlert(
        'Report Submitted',
        'Thank you for keeping CampusConnect safe. Our student moderation council will review this listing shortly.',
        [{ text: 'OK', onPress: onClose }]
      );
    } catch (err: any) {
      showAlert('Submission Error', err?.message || 'Could not submit report.');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.dismissOverlay} onPress={onClose} />

        <View style={styles.sheetContainer}>
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <ShieldAlert size={20} color={theme.colors.error} />
              <AppText variant="h3" serif color="primary">
                Report Listing
              </AppText>
            </View>
            <Pressable
              onPress={onClose}
              hitSlop={8}
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Close report dialog"
            >
              <X size={18} color={theme.colors.textPrimary} />
            </Pressable>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <AppText variant="bodySmall" color="secondary" style={styles.itemRef}>
              Reporting: <AppText variant="bodySmallMedium" color="primary">{listingTitle}</AppText>
            </AppText>

            <AppText variant="captionMedium" color="secondary" style={styles.sectionLabel}>
              SELECT PRIMARY REASON
            </AppText>

            <View style={styles.reasonsList}>
              {REPORT_REASONS.map((r) => {
                const isSelected = selectedReason === r.id;
                return (
                  <Pressable
                    key={r.id}
                    onPress={() => setSelectedReason(r.id)}
                    style={[
                      styles.reasonOption,
                      isSelected && styles.reasonOptionSelected,
                    ]}
                  >
                    <View style={styles.radioRow}>
                      <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                        {isSelected && <View style={styles.radioInner} />}
                      </View>
                      <View style={styles.reasonTextWrap}>
                        <AppText variant="bodySmallMedium" color="primary">
                          {r.label}
                        </AppText>
                        <AppText variant="caption" color="secondary">
                          {r.description}
                        </AppText>
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            <AppText variant="captionMedium" color="secondary" style={styles.sectionLabel}>
              ADDITIONAL CONTEXT (OPTIONAL)
            </AppText>
            <TextInput
              style={styles.detailsInput}
              placeholder="Provide any details to help campus moderators investigate..."
              placeholderTextColor={theme.colors.textMuted}
              value={details}
              onChangeText={setDetails}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              maxLength={400}
            />
          </ScrollView>

          <View style={styles.footer}>
            <AppButton
              variant="outline"
              title="Cancel"
              onPress={onClose}
              style={styles.footerBtn}
              disabled={isLoading}
            />
            <AppButton
              variant="primary"
              title="Submit Report"
              onPress={handleSubmit}
              loading={isLoading}
              style={styles.footerBtn}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(48, 43, 40, 0.45)',
    justifyContent: 'flex-end',
  },
  dismissOverlay: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: theme.colors.border,
    maxHeight: '90%',
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.screenPadding,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.borderSubtle,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  closeBtn: {
    padding: 6,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
  },
  content: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.sm,
  },
  itemRef: {
    marginBottom: theme.spacing.md,
  },
  sectionLabel: {
    letterSpacing: 0.8,
    marginBottom: 8,
    fontSize: 11,
  },
  reasonsList: {
    gap: 8,
    marginBottom: theme.spacing.md,
  },
  reasonOption: {
    padding: 10,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  reasonOptionSelected: {
    borderColor: theme.colors.maroon,
    backgroundColor: theme.colors.card,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: theme.colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  radioCircleActive: {
    borderColor: theme.colors.maroon,
  },
  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: theme.colors.maroon,
  },
  reasonTextWrap: {
    flex: 1,
  },
  detailsInput: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 10,
    fontSize: 13,
    color: theme.colors.textPrimary,
    minHeight: 70,
    marginBottom: theme.spacing.md,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.borderSubtle,
    gap: 12,
  },
  footerBtn: {
    flex: 1,
  },
});

