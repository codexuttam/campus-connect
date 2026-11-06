import React, { useState, useMemo } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  FlatList,
  Pressable,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, X, Check, Building2, ShieldAlert, Sparkles } from 'lucide-react-native';
import { theme } from '../../theme';
import { AppText } from '../ui/AppText';
import { AppInput } from '../ui/AppInput';
import { AppBadge } from '../ui/AppBadge';
import { IconButton } from '../ui/IconButton';
import { CollegeInfo } from '../../types/auth';
import {
  COLLEGES_DIRECTORY,
  getPopularColleges,
  searchColleges,
} from '../../services/auth/collegeDirectory';

export interface CollegeSearchModalProps {
  visible: boolean;
  selectedCollegeId?: string;
  onSelect: (college: CollegeInfo) => void;
  onClose: () => void;
}

export const CollegeSearchModal: React.FC<CollegeSearchModalProps> = ({
  visible,
  selectedCollegeId,
  onSelect,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const filteredColleges = useMemo(() => {
    return searchColleges(query);
  }, [query]);

  const popularColleges = useMemo(() => {
    return getPopularColleges();
  }, []);

  const handleSelect = (college: CollegeInfo) => {
    onSelect(college);
    setQuery('');
    onClose();
  };

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
              DIRECTORY LOOKUP
            </AppText>
            <AppText variant="h2" serif color="primary">
              Select Your College
            </AppText>
          </View>
          <IconButton
            icon={
              <X
                size={theme.icons.sizes.header}
                color={theme.colors.textPrimary}
                strokeWidth={theme.icons.strokeWidth.default}
              />
            }
            variant="surface"
            size="sm"
            onPress={onClose}
            accessibilityLabel="Close college picker"
          />
        </View>

        {/* Search Input */}
        <View style={styles.searchWrapper}>
          <AppInput
            placeholder="Search by name, campus, or domain..."
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            autoCapitalize="none"
            leadingIcon={
              <Search
                size={18}
                color={theme.colors.textMuted}
                strokeWidth={theme.icons.strokeWidth.default}
              />
            }
            trailingIcon={
              query ? (
                <X
                  size={16}
                  color={theme.colors.textMuted}
                  strokeWidth={theme.icons.strokeWidth.default}
                />
              ) : undefined
            }
            onTrailingIconPress={() => setQuery('')}
            containerStyle={styles.searchInput}
          />
        </View>

        {/* Popular chips if query is empty */}
        {!query.trim() && (
          <View style={styles.popularSection}>
            <View style={styles.popularTitleRow}>
              <Sparkles size={13} color={theme.colors.olive} />
              <AppText variant="captionMedium" color="secondary" style={styles.popularTitle}>
                Popular Campuses
              </AppText>
            </View>
            <View style={styles.popularChips}>
              {popularColleges.slice(0, 5).map((col) => {
                const isSelected = selectedCollegeId === col.id;
                return (
                  <Pressable
                    key={col.id}
                    onPress={() => handleSelect(col)}
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
                      {col.shortName}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* College List */}
        <FlatList
          data={filteredColleges}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const isSelected = selectedCollegeId === item.id;
            return (
              <Pressable
                onPress={() => handleSelect(item)}
                style={({ pressed }) => [
                  styles.itemCard,
                  isSelected && styles.itemCardSelected,
                  pressed && styles.itemCardPressed,
                ]}
              >
                <View style={styles.itemIconContainer}>
                  <Building2
                    size={20}
                    color={
                      isSelected ? theme.colors.maroon : theme.colors.textSecondary
                    }
                    strokeWidth={theme.icons.strokeWidth.default}
                  />
                </View>

                <View style={styles.itemDetails}>
                  <AppText
                    variant="bodyMedium"
                    color="primary"
                    style={isSelected ? styles.selectedTitleText : undefined}
                    numberOfLines={1}
                  >
                    {item.name}
                  </AppText>
                  <AppText variant="caption" color="secondary" numberOfLines={1}>
                    {item.location}
                  </AppText>

                  <View style={styles.badgeRow}>
                    {item.hasInstitutionalEmail ? (
                      <AppBadge
                        label={`@${item.domain}`}
                        variant="olive"
                        size="sm"
                      />
                    ) : (
                      <AppBadge
                        label="Alt-ID Review Required"
                        variant="neutral"
                        size="sm"
                        dot
                      />
                    )}
                  </View>
                </View>

                {isSelected ? (
                  <View style={styles.checkMark}>
                    <Check
                      size={16}
                      color={theme.colors.maroon}
                      strokeWidth={theme.icons.strokeWidth.bold}
                    />
                  </View>
                ) : null}
              </Pressable>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <ShieldAlert
                size={32}
                color={theme.colors.textMuted}
                strokeWidth={theme.icons.strokeWidth.thin}
              />
              <AppText variant="bodyMedium" color="primary" style={styles.emptyTitle}>
                No registered institution found
              </AppText>
              <AppText variant="caption" color="secondary" align="center">
                Check your spelling, or select an alternative verification workflow once onboarded.
              </AppText>
            </View>
          }
        />
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
  },
  kicker: {
    letterSpacing: theme.letterSpacing.wider,
    marginBottom: 2,
  },
  searchWrapper: {
    paddingHorizontal: theme.spacing.screenPadding,
    marginBottom: theme.spacing.sm,
  },
  searchInput: {
    marginBottom: 0,
  },
  popularSection: {
    paddingHorizontal: theme.spacing.screenPadding,
    marginBottom: theme.spacing.md,
  },
  popularTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  popularTitle: {
    letterSpacing: theme.letterSpacing.wide,
  },
  popularChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipSelected: {
    backgroundColor: theme.colors.maroonLight,
    borderColor: theme.colors.maroon,
  },
  chipText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  chipTextSelected: {
    color: theme.colors.maroon,
    fontFamily: theme.fontFamilies.sans.semiBold,
  },
  listContent: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingBottom: theme.spacing.xxl,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  itemCardSelected: {
    borderColor: theme.colors.maroon,
    backgroundColor: '#FFFDF9',
  },
  itemCardPressed: {
    backgroundColor: theme.colors.cardHover,
  },
  itemIconContainer: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  itemDetails: {
    flex: 1,
  },
  selectedTitleText: {
    color: theme.colors.maroon,
    fontFamily: theme.fontFamilies.sans.semiBold,
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  checkMark: {
    marginLeft: theme.spacing.sm,
  },
  emptyState: {
    paddingVertical: theme.spacing.massive,
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  emptyTitle: {
    marginTop: theme.spacing.md,
    marginBottom: 4,
  },
});

