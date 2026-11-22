import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Modal, TextInput, ScrollView, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import {
  Settings,
  Layers,
  ExternalLink,
  LogOut,
  ShoppingBag,
  Bookmark,
  Tag,
  Plus,
  ChevronRight,
  X,
  ShieldCheck,
} from 'lucide-react-native';
import {
  AppText,
  AppCard,
  AppAvatar,
  AppBadge,
  AppButton,
  IconButton,
  Divider,
} from '../../components/ui';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import {
  useMyListings,
  useSavedListings,
  useBlockedSellers,
  useUnblockSeller,
} from '../../features/marketplace/hooks/useMarketplace';
import { theme } from '../../theme';
import { useAuth } from '../../hooks/useAuth';

const PROFILE_PREFS_KEY = 'campusconnect.profilePrefs.v1';
const DEFAULT_BIO =
  'Researching formal verification, distributed systems, and philosophy of mind. Open to study groups, lab collaborations, and textbook swaps.';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { data: myActiveListings = [] } = useMyListings('active');
  const { data: savedListings = [] } = useSavedListings();
  const { data: blockedSellers = [] } = useBlockedSellers();
  const unblockMutation = useUnblockSeller();

  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [bio, setBio] = useState(DEFAULT_BIO);
  const [draftBio, setDraftBio] = useState(DEFAULT_BIO);
  const [pushEnabled, setPushEnabled] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(PROFILE_PREFS_KEY)
      .then((raw) => {
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (typeof parsed.bio === 'string') {
          setBio(parsed.bio);
          setDraftBio(parsed.bio);
        }
        if (typeof parsed.pushEnabled === 'boolean') {
          setPushEnabled(parsed.pushEnabled);
        }
      })
      .catch(() => {});
  }, []);

  const savePrefs = (nextBio: string, nextPush: boolean) => {
    setBio(nextBio);
    setPushEnabled(nextPush);
    AsyncStorage.setItem(
      PROFILE_PREFS_KEY,
      JSON.stringify({ bio: nextBio, pushEnabled: nextPush })
    ).catch(() => {});
  };

  const fullName = user?.fullName || 'Julian Vance';
  const course = user?.courseOrBranch || 'Computer Science & Philosophy';
  const collegeName = user?.collegeName || 'Balliol College';
  const gradYear = user?.graduationYear ? `Class of '${user.graduationYear.slice(-2)}` : "Class of '26";
  const isVerified = user?.collegeVerificationStatus === 'verified';

  const handleSignOut = async () => {
    await logout();
    router.replace('/(auth)/welcome');
  };

  return (
    <ScreenContainer scrollable safeTop padded={false}>
      <View style={styles.header}>
        <AppText variant="captionMedium" color="secondary" style={styles.kicker}>
          IDENTITY
        </AppText>
        <View style={styles.headerRow}>
          <AppText variant="h1" serif color="primary">
            Student Profile
          </AppText>
          <IconButton
            icon={
              <Settings
                size={theme.icons.sizes.header}
                color={theme.colors.textPrimary}
                strokeWidth={theme.icons.strokeWidth.default}
              />
            }
            variant="surface"
            size="sm"
            onPress={() => {
              setDraftBio(bio);
              setIsSettingsVisible(true);
            }}
            accessibilityLabel="Settings"
          />
        </View>
      </View>

      <View style={styles.content}>
        {/* Profile Identity Card (Read.cv Academic Dossier style) */}
        <AppCard variant="default" padding="lg" style={styles.identityCard}>
          <View style={styles.avatarRow}>
            <AppAvatar name={fullName} size="lg" borderColor={theme.colors.maroon} />
            <View style={styles.identityText}>
              <AppText variant="h2" serif color="primary">
                {fullName}
              </AppText>
              <AppText variant="bodySmall" color="secondary">
                {course}
              </AppText>
              <View style={styles.badgeRow}>
                <AppBadge label={gradYear} variant="maroon" size="sm" />
                <AppBadge label={collegeName} variant="olive" size="sm" />
                {isVerified ? (
                  <AppBadge label="Verified" variant="olive" size="sm" dot />
                ) : null}
              </View>
            </View>
          </View>

          <Divider spacing="sm" />

          <AppText variant="bodySmall" color="secondary" style={styles.bioText}>
            {bio}
          </AppText>

          <View style={styles.interestChipsRow}>
            {['Distributed Systems', 'Formal Logic', 'AI Safety', 'Rowing Club'].map((tag) => (
              <View key={tag} style={styles.interestChip}>
                <AppText variant="caption" color="secondary" style={styles.interestChipText}>
                  {tag}
                </AppText>
              </View>
            ))}
          </View>
        </AppCard>

        {/* Campus Marketplace Activity Hub */}
        <AppCard variant="default" padding="md" style={styles.marketplaceHubCard}>
          <View style={styles.systemHeader}>
            <View style={[styles.iconTag, { backgroundColor: theme.colors.maroonLight }]}>
              <ShoppingBag size={18} color={theme.colors.maroon} />
            </View>
            <View style={styles.systemTitleCol}>
              <AppText variant="bodySmallMedium" color="primary">
                Campus Marketplace
              </AppText>
              <AppText variant="caption" color="secondary">
                Manage your listings, saved items & peer trades
              </AppText>
            </View>
            <Pressable
              onPress={() => router.push('/marketplace/create')}
              style={styles.sellPill}
            >
              <Plus size={12} color="#FBF7EF" strokeWidth={2.5} />
              <AppText variant="caption" style={styles.sellPillText}>
                Sell
              </AppText>
            </Pressable>
          </View>

          <Divider spacing="sm" />

          <View style={styles.marketplaceActionGrid}>
            <Pressable
              onPress={() => router.push('/marketplace/my-listings')}
              style={styles.marketplaceActionItem}
            >
              <View style={styles.marketplaceActionLeft}>
                <Tag size={16} color={theme.colors.maroon} />
                <View>
                  <AppText variant="bodySmallMedium" color="primary">
                    My Listings
                  </AppText>
                  <AppText variant="caption" color="secondary">
                    {myActiveListings.length} active on campus
                  </AppText>
                </View>
              </View>
              <ChevronRight size={16} color={theme.colors.textSecondary} />
            </Pressable>

            <Pressable
              onPress={() => router.push('/marketplace/saved')}
              style={styles.marketplaceActionItem}
            >
              <View style={styles.marketplaceActionLeft}>
                <Bookmark size={16} color={theme.colors.olive} />
                <View>
                  <AppText variant="bodySmallMedium" color="primary">
                    Saved Items
                  </AppText>
                  <AppText variant="caption" color="secondary">
                    {savedListings.length} bookmarked
                  </AppText>
                </View>
              </View>
              <ChevronRight size={16} color={theme.colors.textSecondary} />
            </Pressable>
          </View>

          <AppButton
            title="Browse Campus Marketplace"
            variant="outline"
            size="sm"
            onPress={() => router.push('/marketplace')}
            style={{ marginTop: 10 }}
          />
        </AppCard>

        {/* System & Architecture Quick Access */}
        <AppCard variant="surface" padding="md" style={styles.systemCard}>
          <View style={styles.systemHeader}>
            <View style={styles.iconTag}>
              <Layers size={18} color={theme.colors.maroon} />
            </View>
            <View style={styles.systemTitleCol}>
              <AppText variant="bodySmallMedium" color="primary">
                Design System Inspector
              </AppText>
              <AppText variant="caption" color="secondary">
                Inspect and test all 10 centralized components
              </AppText>
            </View>
          </View>

          <Divider spacing="sm" />

          <AppButton
            title="Launch Component Showcase"
            variant="outline"
            size="sm"
            trailingIcon={
              <ExternalLink size={14} color={theme.colors.maroon} strokeWidth={2} />
            }
            onPress={() => router.push('/showcase')}
            style={styles.showcaseButton}
          />
        </AppCard>

        {/* Placeholder Information Blocks */}
        <View style={styles.statsRow}>
          <AppCard variant="default" padding="md" style={styles.statBox}>
            <AppText variant="caption" color="secondary">
              CLUBS
            </AppText>
            <AppText variant="h2" serif color="maroon">
              4
            </AppText>
          </AppCard>

          <AppCard variant="default" padding="md" style={styles.statBox}>
            <AppText variant="caption" color="secondary">
              CREDITS
            </AppText>
            <AppText variant="h2" serif color="olive">
              18
            </AppText>
          </AppCard>

          <AppCard variant="default" padding="md" style={styles.statBox}>
            <AppText variant="caption" color="secondary">
              ROLE
            </AppText>
            <AppText variant="h3" color="primary" style={styles.roleStat}>
              Student
            </AppText>
          </AppCard>
        </View>

        {/* Authentication & Session Management Action */}
        <View style={styles.sessionCard}>
          <AppButton
            title="Sign Out of CampusConnect"
            variant="secondary"
            size="md"
            fullWidth
            leadingIcon={
              <LogOut
                size={16}
                color={theme.colors.textPrimary}
                strokeWidth={theme.icons.strokeWidth.default}
              />
            }
            onPress={handleSignOut}
          />
        </View>
      </View>

      {/* Settings & Campus Safety Modal */}
      <Modal
        visible={isSettingsVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsSettingsVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <Pressable
            style={styles.modalDismiss}
            onPress={() => setIsSettingsVisible(false)}
          />
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <AppText variant="h3" serif color="primary">
                Profile & Safety Settings
              </AppText>
              <Pressable
                onPress={() => setIsSettingsVisible(false)}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Close settings"
              >
                <X size={18} color={theme.colors.textPrimary} />
              </Pressable>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <AppText variant="captionMedium" color="secondary" style={styles.modalLabel}>
                ACADEMIC BIO
              </AppText>
              <TextInput
                style={styles.bioInput}
                value={draftBio}
                onChangeText={setDraftBio}
                multiline
                numberOfLines={3}
                maxLength={220}
                placeholder="Share your research interests or study goals..."
                placeholderTextColor={theme.colors.textMuted}
              />

              <View style={styles.settingToggleRow}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <AppText variant="bodySmallMedium" color="primary">
                    Campus Activity Alerts
                  </AppText>
                  <AppText variant="caption" color="secondary">
                    Notify on marketplace messages and post replies
                  </AppText>
                </View>
                <Switch
                  value={pushEnabled}
                  onValueChange={(val) => savePrefs(bio, val)}
                  trackColor={{ false: theme.colors.border, true: theme.colors.maroon }}
                  thumbColor="#FBF7EF"
                />
              </View>

              <AppText variant="captionMedium" color="secondary" style={[styles.modalLabel, { marginTop: 16 }]}>
                BLOCKED MARKETPLACE SELLERS ({blockedSellers.length})
              </AppText>
              {blockedSellers.length === 0 ? (
                <View style={styles.emptyBlockedBox}>
                  <ShieldCheck size={16} color={theme.colors.olive} />
                  <AppText variant="caption" color="secondary">
                    No sellers blocked. You can hide any seller from a listing page.
                  </AppText>
                </View>
              ) : (
                <View style={styles.blockedList}>
                  {blockedSellers.map((sellerId) => (
                    <View key={sellerId} style={styles.blockedRow}>
                      <AppText variant="bodySmall" color="primary">
                        Seller #{sellerId.slice(-8)}
                      </AppText>
                      <Pressable
                        onPress={() => unblockMutation.mutate(sellerId)}
                        style={styles.unblockBtn}
                      >
                        <AppText variant="captionMedium" style={styles.unblockText}>
                          Unblock
                        </AppText>
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <AppButton
                title="Save Profile Settings"
                variant="primary"
                fullWidth
                onPress={() => {
                  savePrefs(draftBio.trim() || DEFAULT_BIO, pushEnabled);
                  setIsSettingsVisible(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
  },
  kicker: {
    letterSpacing: theme.letterSpacing.wider,
    marginBottom: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingBottom: theme.spacing.huge,
  },
  identityCard: {
    marginBottom: theme.spacing.lg,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  identityText: {
    marginLeft: theme.spacing.lg,
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.sm,
  },
  bioText: {
    lineHeight: 19,
    marginBottom: 10,
  },
  interestChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  interestChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  interestChipText: {
    fontSize: 11,
    fontWeight: '500',
  },
  systemCard: {
    marginBottom: theme.spacing.lg,
  },
  marketplaceHubCard: {
    marginBottom: theme.spacing.lg,
  },
  sellPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: theme.colors.maroon,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radius.full,
  },
  sellPillText: {
    color: '#FBF7EF',
    fontWeight: '700',
    fontSize: 11,
  },
  marketplaceActionGrid: {
    gap: 8,
  },
  marketplaceActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  marketplaceActionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  systemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconTag: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  systemTitleCol: {
    flex: 1,
  },
  showcaseButton: {
    marginTop: theme.spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
  },
  roleStat: {
    marginTop: 4,
  },
  sessionCard: {
    marginTop: theme.spacing.sm,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(48, 43, 40, 0.45)',
    justifyContent: 'flex-end',
  },
  modalDismiss: {
    flex: 1,
  },
  modalSheet: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    maxHeight: '80%',
    paddingBottom: 28,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.screenPadding,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  modalBody: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: 14,
  },
  modalLabel: {
    fontSize: 10.5,
    letterSpacing: 0.7,
    marginBottom: 6,
  },
  bioInput: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 10,
    fontSize: 13.5,
    fontFamily: theme.fontFamilies.sans.regular,
    color: theme.colors.textPrimary,
    minHeight: 74,
    textAlignVertical: 'top',
    marginBottom: 14,
  },
  settingToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 12,
  },
  emptyBlockedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 10,
  },
  blockedList: {
    gap: 8,
  },
  blockedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  unblockBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.maroonLight,
  },
  unblockText: {
    color: theme.colors.maroon,
    fontSize: 11,
  },
  modalFooter: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: 14,
  },
});
