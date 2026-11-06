import React, { useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Check, RotateCcw } from 'lucide-react-native';
import { AppText } from '../../../components/ui/AppText';
import { AppButton } from '../../../components/ui/AppButton';
import { IconButton } from '../../../components/ui/IconButton';
import { DiscoveryFilters } from '../types';
import { theme } from '../../../theme';

export interface FilterBottomSheetProps {
  visible: boolean;
  filters: DiscoveryFilters;
  onApply: (filters: DiscoveryFilters) => void;
  onReset: () => void;
  onClose: () => void;
}

const POPULAR_SKILLS = [
  'Python',
  'PyTorch',
  'Rust',
  'Econometrics',
  'React Native',
  'Figma',
  'Legal Writing',
  'Bioinformatics',
  'Type Theory',
  'Game Theory',
];

const POPULAR_BRANCHES = [
  'Computer Science',
  'Economics & Management',
  'Engineering Science',
  'Law & Jurisprudence',
  'Medicine & Health',
  'Mathematics',
  'Fine Art',
];

const GRAD_YEARS = ['All Years', '2025', '2026', '2027', '2028'];

export const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({
  visible,
  filters,
  onApply,
  onReset,
  onClose,
}) => {
  const insets = useSafeAreaInsets();

  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    filters.selectedSkills || []
  );
  const [selectedBranch, setSelectedBranch] = useState<string | undefined>(
    filters.branch
  );
  const [selectedYear, setSelectedYear] = useState<string | undefined>(
    filters.graduationYear
  );
  const [onlySeekingTeammates, setOnlySeekingTeammates] = useState<boolean>(
    Boolean(filters.onlySeekingTeammates)
  );
  const [onlyOfficialSocieties, setOnlyOfficialSocieties] = useState<boolean>(
    Boolean(filters.onlyOfficialSocieties)
  );

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleApply = () => {
    onApply({
      ...filters,
      selectedSkills,
      branch: selectedBranch,
      graduationYear: selectedYear === 'All Years' ? undefined : selectedYear,
      onlySeekingTeammates,
      onlyOfficialSocieties,
    });
    onClose();
  };

  const handleReset = () => {
    setSelectedSkills([]);
    setSelectedBranch(undefined);
    setSelectedYear(undefined);
    setOnlySeekingTeammates(false);
    setOnlyOfficialSocieties(false);
    onReset();
    onClose();
  };

  const activeCount =
    selectedSkills.length +
    (selectedBranch ? 1 : 0) +
    (selectedYear && selectedYear !== 'All Years' ? 1 : 0) +
    (onlySeekingTeammates ? 1 : 0) +
    (onlyOfficialSocieties ? 1 : 0);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.container,
          {
            paddingTop: Platform.OS === 'ios' ? Math.max(insets.top, 16) : 16,
            paddingBottom: insets.bottom + 12,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <AppText variant="captionMedium" color="secondary" style={styles.kicker}>
              PRECISE DIRECTORY
            </AppText>
            <View style={styles.titleRow}>
              <AppText variant="h2" serif color="primary">
                Discovery Filters
              </AppText>
              {activeCount > 0 ? (
                <View style={styles.countBadge}>
                  <AppText variant="captionMedium" style={styles.countText}>
                    {activeCount}
                  </AppText>
                </View>
              ) : null}
            </View>
          </View>

          <IconButton
            icon={<X size={20} color={theme.colors.textPrimary} />}
            variant="surface"
            size="sm"
            onPress={onClose}
            accessibilityLabel="Close filters"
          />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Section 1: Skill Tags */}
          <View style={styles.section}>
            <AppText variant="captionMedium" color="secondary" style={styles.sectionTitle}>
              SKILLS & EXPERTISE
            </AppText>
            <View style={styles.chipsWrap}>
              {POPULAR_SKILLS.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <Pressable
                    key={skill}
                    onPress={() => toggleSkill(skill)}
                    style={[
                      styles.chip,
                      isSelected && styles.chipSelected,
                    ]}
                  >
                    <AppText
                      variant="caption"
                      style={[
                        styles.chipText,
                        isSelected && styles.chipTextSelected,
                      ]}
                    >
                      {skill}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Section 2: Branch / Course */}
          <View style={styles.section}>
            <AppText variant="captionMedium" color="secondary" style={styles.sectionTitle}>
              ACADEMIC DISCIPLINE
            </AppText>
            <View style={styles.chipsWrap}>
              {POPULAR_BRANCHES.map((b) => {
                const isSelected = selectedBranch === b;
                return (
                  <Pressable
                    key={b}
                    onPress={() =>
                      setSelectedBranch(isSelected ? undefined : b)
                    }
                    style={[
                      styles.chip,
                      isSelected && styles.chipSelected,
                    ]}
                  >
                    <AppText
                      variant="caption"
                      style={[
                        styles.chipText,
                        isSelected && styles.chipTextSelected,
                      ]}
                    >
                      {b}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Section 3: Cohort / Graduation Year */}
          <View style={styles.section}>
            <AppText variant="captionMedium" color="secondary" style={styles.sectionTitle}>
              EXPECTED GRADUATION
            </AppText>
            <View style={styles.chipsWrap}>
              {GRAD_YEARS.map((y) => {
                const isSelected =
                  selectedYear === y || (!selectedYear && y === 'All Years');
                return (
                  <Pressable
                    key={y}
                    onPress={() => setSelectedYear(y)}
                    style={[
                      styles.chip,
                      isSelected && styles.chipSelected,
                    ]}
                  >
                    <AppText
                      variant="caption"
                      style={[
                        styles.chipText,
                        isSelected && styles.chipTextSelected,
                      ]}
                    >
                      {y}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Section 4: Specific Toggles */}
          <View style={styles.section}>
            <AppText variant="captionMedium" color="secondary" style={styles.sectionTitle}>
              SPECIAL CRITERIA
            </AppText>

            <Pressable
              onPress={() => setOnlySeekingTeammates(!onlySeekingTeammates)}
              style={styles.toggleRow}
            >
              <View style={styles.toggleTextCol}>
                <AppText variant="bodySmallMedium" color="primary">
                  Projects Seeking Teammates
                </AppText>
                <AppText variant="caption" color="secondary">
                  Only show initiatives recruiting student collaborators
                </AppText>
              </View>
              <View
                style={[
                  styles.checkbox,
                  onlySeekingTeammates && styles.checkboxActive,
                ]}
              >
                {onlySeekingTeammates ? (
                  <Check size={12} color={theme.colors.textInverse} strokeWidth={3} />
                ) : null}
              </View>
            </Pressable>

            <Pressable
              onPress={() => setOnlyOfficialSocieties(!onlyOfficialSocieties)}
              style={styles.toggleRow}
            >
              <View style={styles.toggleTextCol}>
                <AppText variant="bodySmallMedium" color="primary">
                  Official College Societies Only
                </AppText>
                <AppText variant="caption" color="secondary">
                  Filter out student study groups
                </AppText>
              </View>
              <View
                style={[
                  styles.checkbox,
                  onlyOfficialSocieties && styles.checkboxActive,
                ]}
              >
                {onlyOfficialSocieties ? (
                  <Check size={12} color={theme.colors.textInverse} strokeWidth={3} />
                ) : null}
              </View>
            </Pressable>
          </View>
        </ScrollView>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <AppButton
            title="Reset Filters"
            variant="secondary"
            size="md"
            leadingIcon={<RotateCcw size={14} color={theme.colors.textPrimary} />}
            onPress={handleReset}
            style={styles.resetButton}
          />

          <AppButton
            title={`Apply Filters${activeCount > 0 ? ` (${activeCount})` : ''}`}
            variant="primary"
            size="md"
            onPress={handleApply}
            style={styles.applyButton}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.screenPadding,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderSubtle,
  },
  kicker: {
    fontSize: 10,
    letterSpacing: theme.letterSpacing.wider,
    marginBottom: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countBadge: {
    backgroundColor: theme.colors.maroon,
    borderRadius: theme.radius.full,
    paddingHorizontal: 7,
    paddingVertical: 1,
  },
  countText: {
    color: theme.colors.textInverse,
    fontSize: 11,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xxxl,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 10,
    letterSpacing: theme.letterSpacing.wider,
    marginBottom: theme.spacing.sm,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipSelected: {
    backgroundColor: theme.colors.maroon,
    borderColor: theme.colors.maroon,
  },
  chipText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  chipTextSelected: {
    color: theme.colors.textInverse,
    fontFamily: theme.fontFamilies.sans.semiBold,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  toggleTextCol: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: theme.radius.xs,
    borderWidth: 1.5,
    borderColor: theme.colors.borderStrong,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: theme.colors.maroon,
    borderColor: theme.colors.maroon,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderSubtle,
  },
  resetButton: {
    flex: 1,
  },
  applyButton: {
    flex: 2,
  },
});
