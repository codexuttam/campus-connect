import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Check, ChevronRight, AlertCircle, ShieldAlert } from 'lucide-react-native';
import { AppText } from '../../../components/ui/AppText';
import { AppButton } from '../../../components/ui/AppButton';
import { AppCard } from '../../../components/ui/AppCard';
import { ListingImagePicker } from './ListingImagePicker';
import { ProductConditionBadge } from './ProductConditionBadge';
import {
  CreateListingInput,
  MarketplaceCategory,
  MarketplaceCondition,
  MarketplaceListingType,
} from '../types';
import {
  CATEGORY_ITEMS,
  CONDITION_ITEMS,
  LISTING_TYPE_ITEMS,
  formatPrice,
  getCategoryLabel,
  getConditionLabel,
} from '../utils/formatters';
import { validateListingInput } from '../utils/validation';
import { theme } from '../../../theme';

export interface ListingFormProps {
  initialValues?: Partial<CreateListingInput>;
  onSubmit: (values: CreateListingInput) => Promise<void>;
  isLoading?: boolean;
  submitButtonText?: string;
  isEditing?: boolean;
}

export const ListingForm: React.FC<ListingFormProps> = ({
  initialValues,
  onSubmit,
  isLoading = false,
  submitButtonText = 'Publish Listing',
  isEditing = false,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [images, setImages] = useState<string[]>(initialValues?.images || []);
  const [title, setTitle] = useState(initialValues?.title || '');
  const [category, setCategory] = useState<MarketplaceCategory>(
    initialValues?.category || 'books'
  );
  const [listingType, setListingType] = useState<MarketplaceListingType>(
    initialValues?.listingType || 'sell'
  );
  const [condition, setCondition] = useState<MarketplaceCondition>(
    initialValues?.condition || 'like_new'
  );
  const [price, setPrice] = useState(
    initialValues?.price !== undefined ? String(initialValues.price) : ''
  );
  const [exchangeFor, setExchangeFor] = useState(initialValues?.exchangeFor || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentPayload: CreateListingInput = {
    title,
    description,
    category,
    listingType,
    condition,
    price: listingType === 'free' ? 0 : Number(price) || 0,
    currency: '$',
    exchangeFor: listingType === 'exchange' ? exchangeFor : undefined,
    images,
  };

  const validateStep1 = (): boolean => {
    if (images.length === 0) {
      setErrors({ images: 'Please select at least one photograph of the item.' });
      return false;
    }
    setErrors({});
    return true;
  };

  const validateStep2 = (): boolean => {
    const { isValid, errors: validationErrors } = validateListingInput(currentPayload);
    setErrors(validationErrors);
    return isValid;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      if (validateStep2()) setStep(3);
    }
  };

  const handleBack = () => {
    if (step === 3) setStep(2);
    else if (step === 2) setStep(1);
  };

  const handleSubmit = async () => {
    const { isValid, errors: finalErrors } = validateListingInput(currentPayload);
    if (!isValid) {
      setErrors(finalErrors);
      Alert.alert('Validation Error', Object.values(finalErrors)[0]);
      return;
    }

    try {
      await onSubmit({ ...currentPayload, status: 'active' });
    } catch (err: any) {
      Alert.alert('Submission Error', err?.message || 'Could not publish listing.');
    }
  };

  const handleSaveDraft = async () => {
    const { isValid, errors: finalErrors } = validateListingInput(currentPayload);
    if (!isValid) {
      setErrors(finalErrors);
      Alert.alert('Validation Error', Object.values(finalErrors)[0]);
      return;
    }

    try {
      await onSubmit({ ...currentPayload, status: 'draft' });
    } catch (err: any) {
      Alert.alert('Draft Error', err?.message || 'Could not save draft.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardContainer}
    >
      {/* Step Indicator Header */}
      <View style={styles.stepsHeader}>
        <View style={styles.stepIndicatorItem}>
          <View style={[styles.stepCircle, step >= 1 && styles.stepCircleActive]}>
            <AppText variant="caption" style={[styles.stepNum, step >= 1 && styles.stepNumActive]}>
              1
            </AppText>
          </View>
          <AppText variant="caption" color={step >= 1 ? 'primary' : 'muted'}>
            Photos
          </AppText>
        </View>

        <View style={[styles.stepLine, step >= 2 && styles.stepLineActive]} />

        <View style={styles.stepIndicatorItem}>
          <View style={[styles.stepCircle, step >= 2 && styles.stepCircleActive]}>
            <AppText variant="caption" style={[styles.stepNum, step >= 2 && styles.stepNumActive]}>
              2
            </AppText>
          </View>
          <AppText variant="caption" color={step >= 2 ? 'primary' : 'muted'}>
            Details
          </AppText>
        </View>

        <View style={[styles.stepLine, step >= 3 && styles.stepLineActive]} />

        <View style={styles.stepIndicatorItem}>
          <View style={[styles.stepCircle, step >= 3 && styles.stepCircleActive]}>
            <AppText variant="caption" style={[styles.stepNum, step >= 3 && styles.stepNumActive]}>
              3
            </AppText>
          </View>
          <AppText variant="caption" color={step >= 3 ? 'primary' : 'muted'}>
            Review
          </AppText>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* ================= STEP 1: PHOTOS ================= */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            <View style={styles.stepTitleBlock}>
              <AppText variant="h2" serif color="primary">
                Item Photographs
              </AppText>
              <AppText variant="bodySmall" color="secondary">
                Upload clear images of your item. The first photo will be used as the listing thumbnail.
              </AppText>
            </View>

            <ListingImagePicker
              images={images}
              onChangeImages={(newImages) => {
                setImages(newImages);
                if (newImages.length > 0 && errors.images) {
                  setErrors((prev) => {
                    const copy = { ...prev };
                    delete copy.images;
                    return copy;
                  });
                }
              }}
              maxImages={5}
            />

            {errors.images && (
              <View style={styles.errorBanner}>
                <AlertCircle size={15} color={theme.colors.error} />
                <AppText variant="caption" style={styles.errorText}>
                  {errors.images}
                </AppText>
              </View>
            )}

            <View style={styles.safetyCard}>
              <ShieldAlert size={16} color={theme.colors.olive} />
              <AppText variant="caption" color="secondary" style={styles.safetyCardText}>
                Do not upload photos containing visible academic ID cards, student room keys, personal identification, or payment card numbers.
              </AppText>
            </View>

            <View style={styles.navButtons}>
              <AppButton
                variant="primary"
                title="Continue to Details"
                onPress={handleNext}
                disabled={images.length === 0}
              />
            </View>
          </View>
        )}

        {/* ================= STEP 2: DETAILS ================= */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <View style={styles.stepTitleBlock}>
              <AppText variant="h2" serif color="primary">
                Product Details
              </AppText>
              <AppText variant="bodySmall" color="secondary">
                Provide accurate information to help campus peers find your item.
              </AppText>
            </View>

            {errors.prohibited && (
              <View style={styles.prohibitedBanner}>
                <AlertCircle size={16} color={theme.colors.error} />
                <AppText variant="caption" style={styles.errorText}>
                  {errors.prohibited}
                </AppText>
              </View>
            )}

            {/* Listing Type Chips */}
            <View style={styles.fieldGroup}>
              <AppText variant="captionMedium" color="secondary" style={styles.fieldLabel}>
                LISTING INTENT
              </AppText>
              <View style={styles.chipRow}>
                {LISTING_TYPE_ITEMS.map((item) => {
                  const isSelected = listingType === item.id;
                  return (
                    <Pressable
                      key={item.id}
                      onPress={() => {
                        setListingType(item.id);
                        if (item.id === 'free') setPrice('0');
                      }}
                      style={[
                        styles.selectChip,
                        isSelected ? styles.selectChipActive : styles.selectChipInactive,
                      ]}
                    >
                      <AppText
                        variant="buttonSmall"
                        style={[
                          styles.chipLabel,
                          isSelected ? styles.chipLabelActive : styles.chipLabelInactive,
                        ]}
                      >
                        {item.label}
                      </AppText>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Title Input */}
            <View style={styles.fieldGroup}>
              <AppText variant="captionMedium" color="secondary" style={styles.fieldLabel}>
                TITLE *
              </AppText>
              <TextInput
                style={[styles.input, errors.title && styles.inputError]}
                placeholder="e.g. Campbell Biology 12th Ed or Desk Study Lamp"
                placeholderTextColor={theme.colors.textMuted}
                value={title}
                onChangeText={(t) => {
                  setTitle(t);
                  if (errors.title) {
                    setErrors((prev) => {
                      const copy = { ...prev };
                      delete copy.title;
                      return copy;
                    });
                  }
                }}
                maxLength={80}
              />
              {errors.title && (
                <AppText variant="caption" style={styles.fieldError}>
                  {errors.title}
                </AppText>
              )}
            </View>

            {/* Category selection */}
            <View style={styles.fieldGroup}>
              <AppText variant="captionMedium" color="secondary" style={styles.fieldLabel}>
                CATEGORY *
              </AppText>
              <View style={styles.chipRow}>
                {CATEGORY_ITEMS.filter((c) => c.id !== 'all' && c.id !== 'free_items').map((cat) => {
                  const isSelected = category === cat.id;
                  return (
                    <Pressable
                      key={cat.id}
                      onPress={() => setCategory(cat.id)}
                      style={[
                        styles.selectChip,
                        isSelected ? styles.selectChipActive : styles.selectChipInactive,
                      ]}
                    >
                      <AppText
                        variant="buttonSmall"
                        style={[
                          styles.chipLabel,
                          isSelected ? styles.chipLabelActive : styles.chipLabelInactive,
                        ]}
                      >
                        {cat.label}
                      </AppText>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Condition selection */}
            <View style={styles.fieldGroup}>
              <AppText variant="captionMedium" color="secondary" style={styles.fieldLabel}>
                CONDITION *
              </AppText>
              <View style={styles.chipRow}>
                {CONDITION_ITEMS.map((cond) => {
                  const isSelected = condition === cond.id;
                  return (
                    <Pressable
                      key={cond.id}
                      onPress={() => setCondition(cond.id)}
                      style={[
                        styles.selectChip,
                        isSelected ? styles.selectChipActive : styles.selectChipInactive,
                      ]}
                    >
                      <AppText
                        variant="buttonSmall"
                        style={[
                          styles.chipLabel,
                          isSelected ? styles.chipLabelActive : styles.chipLabelInactive,
                        ]}
                      >
                        {cond.label}
                      </AppText>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Dynamic Price / Exchange input */}
            {listingType === 'sell' && (
              <View style={styles.fieldGroup}>
                <AppText variant="captionMedium" color="secondary" style={styles.fieldLabel}>
                  PRICE ($) *
                </AppText>
                <TextInput
                  style={[styles.input, errors.price && styles.inputError]}
                  placeholder="e.g. 25"
                  placeholderTextColor={theme.colors.textMuted}
                  value={price}
                  onChangeText={(p) => {
                    setPrice(p);
                    if (errors.price) {
                      setErrors((prev) => {
                        const copy = { ...prev };
                        delete copy.price;
                        return copy;
                      });
                    }
                  }}
                  keyboardType="numeric"
                />
                {errors.price && (
                  <AppText variant="caption" style={styles.fieldError}>
                    {errors.price}
                  </AppText>
                )}
              </View>
            )}

            {listingType === 'exchange' && (
              <View style={styles.fieldGroup}>
                <AppText variant="captionMedium" color="secondary" style={styles.fieldLabel}>
                  DESIRED EXCHANGE ITEM *
                </AppText>
                <TextInput
                  style={[styles.input, errors.exchangeFor && styles.inputError]}
                  placeholder="e.g. Linear Algebra 5th Edition or scientific calculator"
                  placeholderTextColor={theme.colors.textMuted}
                  value={exchangeFor}
                  onChangeText={(e) => {
                    setExchangeFor(e);
                    if (errors.exchangeFor) {
                      setErrors((prev) => {
                        const copy = { ...prev };
                        delete copy.exchangeFor;
                        return copy;
                      });
                    }
                  }}
                  maxLength={100}
                />
                {errors.exchangeFor && (
                  <AppText variant="caption" style={styles.fieldError}>
                    {errors.exchangeFor}
                  </AppText>
                )}
              </View>
            )}

            {listingType === 'free' && (
              <View style={styles.freeNoticeBox}>
                <AppText variant="captionMedium" color="primary">
                  Free Student Giveaway
                </AppText>
                <AppText variant="caption" color="secondary">
                  This item will be listed with zero price and featured in the Free Items discovery section.
                </AppText>
              </View>
            )}

            {/* Description */}
            <View style={styles.fieldGroup}>
              <AppText variant="captionMedium" color="secondary" style={styles.fieldLabel}>
                SHORT DESCRIPTION *
              </AppText>
              <TextInput
                style={[styles.textArea, errors.description && styles.inputError]}
                placeholder="Mention condition details, edition, included accessories, and campus pickup location (e.g. Main Library or Dorm Porter lodge)."
                placeholderTextColor={theme.colors.textMuted}
                value={description}
                onChangeText={(d) => {
                  setDescription(d);
                  if (errors.description) {
                    setErrors((prev) => {
                      const copy = { ...prev };
                      delete copy.description;
                      return copy;
                    });
                  }
                }}
                multiline
                numberOfLines={4}
                maxLength={1000}
                textAlignVertical="top"
              />
              <View style={styles.charCountRow}>
                {errors.description ? (
                  <AppText variant="caption" style={styles.fieldError}>
                    {errors.description}
                  </AppText>
                ) : <View />}
                <AppText variant="caption" color="muted">
                  {description.length}/1000
                </AppText>
              </View>
            </View>

            {/* Nav Buttons */}
            <View style={styles.dualNavButtons}>
              <AppButton
                variant="outline"
                title="Back to Photos"
                onPress={handleBack}
                style={styles.halfBtn}
              />
              <AppButton
                variant="primary"
                title="Review Listing"
                onPress={handleNext}
                style={styles.halfBtn}
              />
            </View>
          </View>
        )}

        {/* ================= STEP 3: REVIEW ================= */}
        {step === 3 && (
          <View style={styles.stepContainer}>
            <View style={styles.stepTitleBlock}>
              <AppText variant="h2" serif color="primary">
                Review & Publish
              </AppText>
              <AppText variant="bodySmall" color="secondary">
                Please verify your listing details before publishing to the campus community.
              </AppText>
            </View>

            {/* Preview Card */}
            <AppCard variant="default" padding="md" style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewPriceRow}>
                  <AppText variant="h2" color="primary" style={styles.reviewPrice}>
                    {formatPrice(
                      listingType === 'free' ? 0 : Number(price),
                      '$',
                      listingType,
                      exchangeFor
                    )}
                  </AppText>
                  <ProductConditionBadge condition={condition} size="md" />
                </View>
                <AppText variant="bodyLarge" color="primary" style={styles.reviewTitle}>
                  {title}
                </AppText>
              </View>

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <AppText variant="caption" color="muted">
                    Category:
                  </AppText>
                  <AppText variant="captionMedium" color="primary">
                    {getCategoryLabel(category)}
                  </AppText>
                </View>

                <View style={styles.metaItem}>
                  <AppText variant="caption" color="muted">
                    Photos:
                  </AppText>
                  <AppText variant="captionMedium" color="primary">
                    {images.length} attached
                  </AppText>
                </View>
              </View>

              <View style={styles.divider} />

              <AppText variant="captionMedium" color="secondary" style={styles.descHeading}>
                DESCRIPTION
              </AppText>
              <AppText variant="bodySmall" color="primary" style={styles.reviewDesc}>
                {description}
              </AppText>
            </AppCard>

            {/* Student Code of Conduct & Prohibited items agreement */}
            <View style={styles.trustAgreement}>
              <Check size={16} color={theme.colors.olive} />
              <AppText variant="caption" color="secondary" style={styles.trustText}>
                I certify this listing complies with university regulations. Prohibited items (counterfeits, exam cheats, prescription meds, or weapons) lead to immediate account suspension.
              </AppText>
            </View>

            {/* Nav Buttons */}
            <View style={styles.dualNavButtons}>
              <AppButton
                variant="outline"
                title="Edit Details"
                onPress={handleBack}
                style={styles.halfBtn}
                disabled={isLoading}
              />
              <AppButton
                variant="primary"
                title={submitButtonText}
                onPress={handleSubmit}
                loading={isLoading}
                style={styles.halfBtn}
              />
            </View>

            {!isEditing && (
              <AppButton
                variant="ghost"
                title="Save as Draft for Later"
                onPress={handleSaveDraft}
                disabled={isLoading}
                style={{ marginTop: 10 }}
              />
            )}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  stepsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.screenPadding,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.borderSubtle,
  },
  stepIndicatorItem: {
    alignItems: 'center',
    gap: 3,
  },
  stepCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: theme.colors.maroon,
    borderColor: theme.colors.maroon,
  },
  stepNum: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  stepNumActive: {
    color: '#FBF7EF',
  },
  stepLine: {
    width: 32,
    height: 2,
    backgroundColor: theme.colors.border,
    marginHorizontal: 8,
    marginBottom: 14,
  },
  stepLineActive: {
    backgroundColor: theme.colors.maroon,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.md,
    paddingBottom: 40,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitleBlock: {
    marginBottom: theme.spacing.md,
  },
  fieldGroup: {
    marginBottom: theme.spacing.md,
  },
  fieldLabel: {
    letterSpacing: 0.6,
    marginBottom: 6,
    fontSize: 11,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectChip: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: theme.radius.full,
    borderWidth: 1,
  },
  selectChipInactive: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  },
  selectChipActive: {
    backgroundColor: theme.colors.maroon,
    borderColor: theme.colors.maroon,
  },
  chipLabel: {
    fontSize: 12,
  },
  chipLabelInactive: {
    color: theme.colors.textPrimary,
  },
  chipLabelActive: {
    color: '#FBF7EF',
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: theme.fontFamilies.sans.regular,
    color: theme.colors.textPrimary,
  },
  textArea: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: theme.fontFamilies.sans.regular,
    color: theme.colors.textPrimary,
    minHeight: 90,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  fieldError: {
    color: theme.colors.error,
    marginTop: 4,
  },
  charCountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  freeNoticeBox: {
    backgroundColor: theme.colors.oliveLight,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(115, 123, 75, 0.2)',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.errorLight,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    marginTop: 8,
  },
  prohibitedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.errorLight,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
  },
  errorText: {
    flex: 1,
    color: theme.colors.error,
    lineHeight: 16,
  },
  safetyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    marginTop: theme.spacing.sm,
  },
  safetyCardText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 15,
  },
  navButtons: {
    marginTop: theme.spacing.xl,
  },
  dualNavButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: theme.spacing.xl,
  },
  halfBtn: {
    flex: 1,
  },
  reviewCard: {
    marginBottom: theme.spacing.md,
  },
  reviewHeader: {
    marginBottom: theme.spacing.sm,
  },
  reviewPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  reviewPrice: {
    fontSize: 22,
    fontWeight: '700',
  },
  reviewTitle: {
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.borderSubtle,
    marginVertical: theme.spacing.sm,
  },
  descHeading: {
    fontSize: 10,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  reviewDesc: {
    lineHeight: 18,
  },
  trustAgreement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
  },
  trustText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 15,
  },
});
