import React, { useState, useEffect } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
} from 'react-native';
import { X, Check } from 'lucide-react-native';
import { AppText } from '../../../components/ui/AppText';
import { AppButton } from '../../../components/ui/AppButton';
import {
  MarketplaceFilters,
  MarketplaceCondition,
  MarketplaceListingType,
  MarketplaceSortOption,
} from '../types';
import { CONDITION_ITEMS, LISTING_TYPE_ITEMS } from '../utils/formatters';
import { theme } from '../../../theme';

export interface MarketplaceFilterSheetProps {
  visible: boolean;
  filters: MarketplaceFilters;
  onApply: (filters: MarketplaceFilters) => void;
  onReset: () => void;
  onClose: () => void;
}

const SORT_OPTIONS: { id: MarketplaceSortOption; label: string }[] = [
  { id: 'newest', label: 'Recently Listed' },
  { id: 'price_low', label: 'Price: Low to High' },
  { id: 'price_high', label: 'Price: High to Low' },
];

export const MarketplaceFilterSheet: React.FC<MarketplaceFilterSheetProps> = ({
  visible,
  filters,
  onApply,
  onReset,
  onClose,
}) => {
  const [localFilters, setLocalFilters] = useState<MarketplaceFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters, visible]);

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    const empty: MarketplaceFilters = {
      sortBy: 'newest',
    };
    setLocalFilters(empty);
    onReset();
    onClose();
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
          {/* Header */}
          <View style={styles.header}>
            <AppText variant="h3" serif color="primary">
              Filter Listings
            </AppText>
            <Pressable
              onPress={onClose}
              hitSlop={8}
              style={styles.closeButton}
              accessibilityRole="button"
              accessibilityLabel="Close filters"
            >
              <X size={20} color={theme.colors.textPrimary} strokeWidth={2} />
            </Pressable>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Sort Options */}
            <View style={styles.section}>
              <AppText variant="captionMedium" color="secondary" style={styles.sectionTitle}>
                SORT BY
              </AppText>
              <View style={styles.chipRow}>
                {SORT_OPTIONS.map((opt) => {
                  const isSelected = (localFilters.sortBy || 'newest') === opt.id;
                  return (
                    <Pressable
                      key={opt.id}
                      onPress={() => setLocalFilters({ ...localFilters, sortBy: opt.id })}
                      style={[
                        styles.chip,
                        isSelected ? styles.chipSelected : styles.chipUnselected,
                      ]}
                    >
                      <AppText
                        variant="buttonSmall"
                        style={[
                          styles.chipText,
                          isSelected ? styles.chipTextSelected : styles.chipTextUnselected,
                        ]}
                      >
                        {opt.label}
                      </AppText>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Listing Type */}
            <View style={styles.section}>
              <AppText variant="captionMedium" color="secondary" style={styles.sectionTitle}>
                LISTING TYPE
              </AppText>
              <View style={styles.chipRow}>
                <Pressable
                  onPress={() => setLocalFilters({ ...localFilters, listingType: undefined })}
                  style={[
                    styles.chip,
                    !localFilters.listingType ? styles.chipSelected : styles.chipUnselected,
                  ]}
                >
                  <AppText
                    variant="buttonSmall"
                    style={[
                      styles.chipText,
                      !localFilters.listingType ? styles.chipTextSelected : styles.chipTextUnselected,
                    ]}
                  >
                    All Types
                  </AppText>
                </Pressable>
                {LISTING_TYPE_ITEMS.map((item) => {
                  const isSelected = localFilters.listingType === item.id;
                  return (
                    <Pressable
                      key={item.id}
                      onPress={() =>
                        setLocalFilters({
                          ...localFilters,
                          listingType: isSelected ? undefined : item.id,
                        })
                      }
                      style={[
                        styles.chip,
                        isSelected ? styles.chipSelected : styles.chipUnselected,
                      ]}
                    >
                      <AppText
                        variant="buttonSmall"
                        style={[
                          styles.chipText,
                          isSelected ? styles.chipTextSelected : styles.chipTextUnselected,
                        ]}
                      >
                        {item.label}
                      </AppText>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Condition */}
            <View style={styles.section}>
              <AppText variant="captionMedium" color="secondary" style={styles.sectionTitle}>
                CONDITION
              </AppText>
              <View style={styles.chipRow}>
                <Pressable
                  onPress={() => setLocalFilters({ ...localFilters, condition: undefined })}
                  style={[
                    styles.chip,
                    !localFilters.condition ? styles.chipSelected : styles.chipUnselected,
                  ]}
                >
                  <AppText
                    variant="buttonSmall"
                    style={[
                      styles.chipText,
                      !localFilters.condition ? styles.chipTextSelected : styles.chipTextUnselected,
                    ]}
                  >
                    Any
                  </AppText>
                </Pressable>
                {CONDITION_ITEMS.map((item) => {
                  const isSelected = localFilters.condition === item.id;
                  return (
                    <Pressable
                      key={item.id}
                      onPress={() =>
                        setLocalFilters({
                          ...localFilters,
                          condition: isSelected ? undefined : item.id,
                        })
                      }
                      style={[
                        styles.chip,
                        isSelected ? styles.chipSelected : styles.chipUnselected,
                      ]}
                    >
                      <AppText
                        variant="buttonSmall"
                        style={[
                          styles.chipText,
                          isSelected ? styles.chipTextSelected : styles.chipTextUnselected,
                        ]}
                      >
                        {item.label}
                      </AppText>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Price Range */}
            <View style={styles.section}>
              <AppText variant="captionMedium" color="secondary" style={styles.sectionTitle}>
                PRICE RANGE ($)
              </AppText>

              {/* Quick preset chips */}
              <View style={styles.presetChipsRow}>
                {[
                  { label: 'Under $25', min: undefined, max: 25 },
                  { label: '$25–$50', min: 25, max: 50 },
                  { label: '$50–$100', min: 50, max: 100 },
                  { label: '$100+', min: 100, max: undefined },
                ].map((preset) => {
                  const isActive =
                    localFilters.minPrice === preset.min &&
                    localFilters.maxPrice === preset.max;
                  return (
                    <Pressable
                      key={preset.label}
                      onPress={() =>
                        setLocalFilters({
                          ...localFilters,
                          minPrice: isActive ? undefined : preset.min,
                          maxPrice: isActive ? undefined : preset.max,
                        })
                      }
                      style={[
                        styles.presetChip,
                        isActive && styles.presetChipActive,
                      ]}
                    >
                      <AppText
                        variant="caption"
                        style={[
                          styles.presetChipText,
                          isActive && styles.presetChipTextActive,
                        ]}
                      >
                        {preset.label}
                      </AppText>
                    </Pressable>
                  );
                })}
              </View>

              <View style={styles.priceInputsRow}>
                <View style={styles.priceInputBox}>
                  <AppText variant="caption" color="secondary">
                    Min
                  </AppText>
                  <TextInput
                    style={styles.priceInput}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={theme.colors.textMuted}
                    value={localFilters.minPrice ? String(localFilters.minPrice) : ''}
                    onChangeText={(text) =>
                      setLocalFilters({
                        ...localFilters,
                        minPrice: text ? Number(text) : undefined,
                      })
                    }
                  />
                </View>
                <AppText variant="body" color="muted" style={{ alignSelf: 'center' }}>
                  —
                </AppText>
                <View style={styles.priceInputBox}>
                  <AppText variant="caption" color="secondary">
                    Max
                  </AppText>
                  <TextInput
                    style={styles.priceInput}
                    keyboardType="numeric"
                    placeholder="No limit"
                    placeholderTextColor={theme.colors.textMuted}
                    value={localFilters.maxPrice ? String(localFilters.maxPrice) : ''}
                    onChangeText={(text) =>
                      setLocalFilters({
                        ...localFilters,
                        maxPrice: text ? Number(text) : undefined,
                      })
                    }
                  />
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Footer actions */}
          <View style={styles.footer}>
            <AppButton
              variant="outline"
              title="Reset"
              onPress={handleReset}
              style={styles.actionBtn}
            />
            <AppButton
              variant="primary"
              title="Apply Filters"
              onPress={handleApply}
              style={styles.actionBtn}
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
    maxHeight: '85%',
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
  closeButton: {
    padding: 6,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
  },
  content: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: theme.radius.full,
    borderWidth: 1,
  },
  chipUnselected: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  },
  chipSelected: {
    backgroundColor: theme.colors.maroon,
    borderColor: theme.colors.maroon,
  },
  chipText: {
    fontSize: 12,
  },
  chipTextUnselected: {
    color: theme.colors.textPrimary,
  },
  chipTextSelected: {
    color: '#FBF7EF',
  },
  presetChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  presetChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  presetChipActive: {
    backgroundColor: theme.colors.olive,
    borderColor: theme.colors.olive,
  },
  presetChipText: {
    fontSize: 11,
    fontWeight: '500',
    color: theme.colors.textPrimary,
  },
  presetChipTextActive: {
    color: '#FBF7EF',
  },
  priceInputsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priceInputBox: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  priceInput: {
    fontSize: 15,
    fontFamily: theme.fontFamilies.sans.regular,
    color: theme.colors.textPrimary,
    paddingVertical: 2,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.borderSubtle,
    gap: 12,
  },
  actionBtn: {
    flex: 1,
  },
});
