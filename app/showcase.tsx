import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Sparkles,
  Heart,
  Send,
  Search,
  Bell,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react-native';
import {
  AppText,
  AppButton,
  AppInput,
  AppCard,
  AppAvatar,
  AppBadge,
  AppHeader,
  IconButton,
  Divider,
  LoadingIndicator,
} from '../components/ui';
import { theme } from '../theme';

export default function ShowcaseScreen() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [buttonLoading, setButtonLoading] = useState(false);

  return (
    <View style={styles.root}>
      <AppHeader
        title="Design System"
        subtitle="Tokens & Components Showcase"
        serifTitle
        showBack
        onBack={() => router.back()}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Color Palette Verification */}
        <View style={styles.section}>
          <AppText variant="captionMedium" color="secondary" style={styles.sectionKicker}>
            PALETTE VERIFICATION
          </AppText>
          <AppText variant="h2" serif color="primary" style={styles.sectionHeading}>
            Strict University Aesthetic
          </AppText>

          <View style={styles.swatchGrid}>
            <View style={[styles.swatchItem, { backgroundColor: theme.colors.background }]}>
              <AppText variant="captionMedium" color="primary">#F3EBDD</AppText>
              <AppText variant="caption" color="secondary">Background</AppText>
            </View>
            <View style={[styles.swatchItem, { backgroundColor: theme.colors.maroon }]}>
              <AppText variant="captionMedium" color="inverse">#702D3B</AppText>
              <AppText variant="caption" color="inverse">Maroon</AppText>
            </View>
            <View style={[styles.swatchItem, { backgroundColor: theme.colors.olive }]}>
              <AppText variant="captionMedium" color="inverse">#737B4B</AppText>
              <AppText variant="caption" color="inverse">Olive</AppText>
            </View>
            <View style={[styles.swatchItem, { backgroundColor: theme.colors.surface }]}>
              <AppText variant="captionMedium" color="primary">#E6DCCB</AppText>
              <AppText variant="caption" color="secondary">Surface</AppText>
            </View>
            <View style={[styles.swatchItem, { backgroundColor: theme.colors.card }]}>
              <AppText variant="captionMedium" color="primary">#FBF7EF</AppText>
              <AppText variant="caption" color="secondary">Card</AppText>
            </View>
            <View style={[styles.swatchItem, { backgroundColor: theme.colors.textPrimary }]}>
              <AppText variant="captionMedium" color="inverse">#302B28</AppText>
              <AppText variant="caption" color="inverse">Main Text</AppText>
            </View>
          </View>
        </View>

        <Divider spacing="md" />

        {/* Typography System */}
        <View style={styles.section}>
          <AppText variant="captionMedium" color="secondary" style={styles.sectionKicker}>
            TYPOGRAPHY
          </AppText>
          <AppText variant="h2" serif color="primary" style={styles.sectionHeading}>
            DM Sans & Editorial Lora
          </AppText>

          <View style={styles.typeBlock}>
            <AppText variant="display" color="primary">Display 28px Bold</AppText>
            <AppText variant="h1" serif color="primary">H1 Lora 24px Editorial</AppText>
            <AppText variant="h2" color="primary">H2 DM Sans 20px SemiBold</AppText>
            <AppText variant="h3" color="primary">H3 DM Sans 17px SemiBold</AppText>
            <AppText variant="bodyLarge" color="secondary">Body Large 16px Regular</AppText>
            <AppText variant="body" color="primary">Body 15px Regular — Content-light, high legibility text.</AppText>
            <AppText variant="bodySmall" color="secondary">Body Small 13px Regular</AppText>
            <AppText variant="captionMedium" color="muted">CAPTION 12px MEDIUM / TRACKED</AppText>
            <AppText variant="editorialItalic" color="maroon">"Occasional editorial serif accent in Lora italic."</AppText>
          </View>
        </View>

        <Divider spacing="md" />

        {/* AppButton Showcase */}
        <View style={styles.section}>
          <AppText variant="captionMedium" color="secondary" style={styles.sectionKicker}>
            INTERACTIVE BUTTONS
          </AppText>
          <AppText variant="h2" serif color="primary" style={styles.sectionHeading}>
            AppButton Variants & Sizes
          </AppText>

          <View style={styles.componentGroup}>
            <AppButton
              title="Primary Maroon Button"
              variant="primary"
              leadingIcon={<Sparkles size={16} color={theme.colors.textInverse} />}
              onPress={() => setButtonLoading(!buttonLoading)}
            />
            <AppButton
              title="Olive Green Button"
              variant="olive"
              trailingIcon={<Calendar size={16} color={theme.colors.textInverse} />}
            />
            <AppButton
              title="Secondary Surface Button"
              variant="secondary"
            />
            <AppButton
              title="Outline Button"
              variant="outline"
            />
            <AppButton
              title="Ghost Button"
              variant="ghost"
            />
            <AppButton
              title="Simulated Loading State"
              variant="primary"
              loading={buttonLoading}
              onPress={() => setButtonLoading(false)}
            />
            <AppButton
              title="Disabled Button"
              variant="primary"
              disabled
            />
          </View>
        </View>

        <Divider spacing="md" />

        {/* AppInput Showcase */}
        <View style={styles.section}>
          <AppText variant="captionMedium" color="secondary" style={styles.sectionKicker}>
            FORM INPUTS
          </AppText>
          <AppText variant="h2" serif color="primary" style={styles.sectionHeading}>
            AppInput Component
          </AppText>

          <View style={styles.componentGroup}>
            <AppInput
              label="Standard Field"
              placeholder="e.g. library@oxford.edu"
              value={inputValue}
              onChangeText={setInputValue}
              helperText="Enter your verified university email address."
            />

            <AppInput
              label="Search Input with Leading Icon"
              placeholder="Search seminars..."
              leadingIcon={
                <Search
                  size={18}
                  color={theme.colors.textMuted}
                  strokeWidth={theme.icons.strokeWidth.default}
                />
              }
            />

            <AppInput
              label="Error State Validation"
              placeholder="Invalid student ID"
              defaultValue="abc-123"
              error="Student ID must be numeric."
            />
          </View>
        </View>

        <Divider spacing="md" />

        {/* AppCard Showcase */}
        <View style={styles.section}>
          <AppText variant="captionMedium" color="secondary" style={styles.sectionKicker}>
            CONTAINERS
          </AppText>
          <AppText variant="h2" serif color="primary" style={styles.sectionHeading}>
            AppCard Variants (16px Radius)
          </AppText>

          <View style={styles.componentGroup}>
            <AppCard variant="default" padding="md">
              <AppText variant="h3" color="primary">Default Card (#FBF7EF)</AppText>
              <AppText variant="bodySmall" color="secondary" style={styles.cardText}>
                Subtle border with minimal paper elevation.
              </AppText>
            </AppCard>

            <AppCard variant="surface" padding="md">
              <AppText variant="h3" color="primary">Surface Card (#E6DCCB)</AppText>
              <AppText variant="bodySmall" color="secondary" style={styles.cardText}>
                Secondary surface tint for nested metadata.
              </AppText>
            </AppCard>

            <AppCard variant="outlined" padding="md">
              <AppText variant="h3" color="primary">Outlined Card</AppText>
              <AppText variant="bodySmall" color="secondary" style={styles.cardText}>
                High-contrast structured container.
              </AppText>
            </AppCard>

            <AppCard variant="maroon" padding="md">
              <AppText variant="h3" color="maroon">Maroon Accent Card</AppText>
              <AppText variant="bodySmall" color="secondary" style={styles.cardText}>
                Reserved for urgent notices and editorial callouts.
              </AppText>
            </AppCard>
          </View>
        </View>

        <Divider spacing="md" />

        {/* AppAvatar & AppBadge & IconButtons */}
        <View style={styles.section}>
          <AppText variant="captionMedium" color="secondary" style={styles.sectionKicker}>
            AVATARS & BADGES
          </AppText>
          <AppText variant="h2" serif color="primary" style={styles.sectionHeading}>
            Micro-components
          </AppText>

          {/* Avatars */}
          <AppText variant="captionMedium" color="secondary" style={styles.subSectionTitle}>
            AppAvatar Sizes
          </AppText>
          <View style={styles.avatarRow}>
            <AppAvatar name="Avery Hayes" size="xs" />
            <AppAvatar name="Amara Patel" size="sm" />
            <AppAvatar name="Julian Vance" size="md" />
            <AppAvatar name="Clara Oswald" size="lg" borderColor={theme.colors.maroon} />
            <AppAvatar name="Elena Rostova" size="xl" borderColor={theme.colors.olive} />
          </View>

          {/* Badges */}
          <AppText variant="captionMedium" color="secondary" style={styles.subSectionTitle}>
            AppBadge Variants
          </AppText>
          <View style={styles.badgeWrap}>
            <AppBadge label="MAROON ACCENT" variant="maroon" size="md" dot />
            <AppBadge label="OLIVE ACCENT" variant="olive" size="md" dot />
            <AppBadge label="NEUTRAL CHIP" variant="neutral" size="md" />
            <AppBadge label="OUTLINE PILL" variant="outline" size="md" />
            <AppBadge label="COMPACT" variant="maroon" size="sm" />
            <AppBadge label="FEATURED" variant="olive" size="sm" icon={<Sparkles size={10} color={theme.colors.oliveDark} />} />
          </View>

          {/* Icon Buttons */}
          <AppText variant="captionMedium" color="secondary" style={styles.subSectionTitle}>
            IconButton Shapes & Variants
          </AppText>
          <View style={styles.iconButtonRow}>
            <IconButton
              icon={<Heart size={18} color={theme.colors.maroon} />}
              variant="default"
              accessibilityLabel="Like"
            />
            <IconButton
              icon={<Bell size={18} color={theme.colors.textPrimary} />}
              variant="surface"
              accessibilityLabel="Notifications"
            />
            <IconButton
              icon={<Send size={18} color={theme.colors.textInverse} />}
              variant="maroon"
              accessibilityLabel="Send message"
            />
            <IconButton
              icon={<CheckCircle2 size={18} color={theme.colors.textInverse} />}
              variant="olive"
              shape="square"
              accessibilityLabel="Complete action"
            />
            <IconButton
              icon={<Layers size={18} color={theme.colors.textSecondary} />}
              variant="ghost"
              accessibilityLabel="Layers"
            />
          </View>
        </View>

        <Divider spacing="md" />

        {/* Loading Indicator */}
        <View style={styles.section}>
          <AppText variant="captionMedium" color="secondary" style={styles.sectionKicker}>
            FEEDBACK
          </AppText>
          <AppText variant="h2" serif color="primary" style={styles.sectionHeading}>
            LoadingIndicator
          </AppText>
          <LoadingIndicator label="SYNCHRONIZING REPOSITORY..." />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingBottom: theme.spacing.massive,
  },
  section: {
    paddingVertical: theme.spacing.sm,
  },
  sectionKicker: {
    letterSpacing: theme.letterSpacing.wider,
    marginBottom: 4,
  },
  sectionHeading: {
    marginBottom: theme.spacing.md,
  },
  swatchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  swatchItem: {
    width: '30%',
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: 70,
    justifyContent: 'space-between',
  },
  typeBlock: {
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  componentGroup: {
    gap: theme.spacing.md,
  },
  cardText: {
    marginTop: 4,
  },
  subSectionTitle: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    letterSpacing: theme.letterSpacing.wider,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  badgeWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  iconButtonRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    alignItems: 'center',
  },
});

