import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Share,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Bookmark,
  Share2,
  Flag,
  Edit3,
  CheckCircle,
  Trash2,
  Tag,
  ShieldCheck,
  Eye,
  Calendar,
} from 'lucide-react-native';
import { ScreenContainer } from '../../../components/common/ScreenContainer';
import { LoadingIndicator } from '../../../components/ui/LoadingIndicator';
import { AppText } from '../../../components/ui/AppText';
import { AppButton } from '../../../components/ui/AppButton';
import { AppBadge } from '../../../components/ui/AppBadge';
import {
  ProductImageGallery,
  ProductConditionBadge,
  ProductStatusBadge,
  SellerInfoCard,
  MarketplaceReportModal,
  SellerContactModal,
} from '../components';
import {
  useMarketplaceListingDetails,
  useToggleSaveListing,
  useMarkListingStatus,
  useDeleteListing,
  useReportListing,
} from '../hooks/useMarketplace';
import { formatPrice, formatListingDate, getCategoryLabel } from '../utils/formatters';
import { useAuthStore } from '../../../store/useAuthStore';
import { theme } from '../../../theme';

export interface ProductDetailsScreenProps {
  id: string;
}

export const ProductDetailsScreen: React.FC<ProductDetailsScreenProps> = ({ id }) => {
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.user);

  // Modals state
  const [isContactModalVisible, setIsContactModalVisible] = useState(false);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);

  // Queries & Mutations
  const { data: listing, isLoading, error } = useMarketplaceListingDetails(id);
  const toggleSaveMutation = useToggleSaveListing();
  const markStatusMutation = useMarkListingStatus();
  const deleteMutation = useDeleteListing();
  const reportMutation = useReportListing();

  if (isLoading) {
    return (
      <ScreenContainer safeTop padded={false} style={styles.centerContainer}>
        <LoadingIndicator size="large" label="Loading listing details..." />
      </ScreenContainer>
    );
  }

  if (error || !listing) {
    return (
      <ScreenContainer safeTop padded={false} style={styles.centerContainer}>
        <AppText variant="h3" serif color="primary" style={{ marginBottom: 8 }}>
          Listing Not Found
        </AppText>
        <AppText variant="bodySmall" color="secondary" style={{ marginBottom: 16 }}>
          This item may have been removed or is no longer accessible.
        </AppText>
        <AppButton title="Back to Marketplace" onPress={() => router.back()} size="sm" />
      </ScreenContainer>
    );
  }

  const isOwner =
    Boolean(currentUser?.id && listing.sellerId === currentUser.id) ||
    listing.sellerId === 'user-local';

  const isSold = listing.status === 'sold';
  const isReserved = listing.status === 'reserved';

  const formattedPrice = formatPrice(
    listing.price,
    listing.currency,
    listing.listingType,
    listing.exchangeFor
  );

  const handleShare = async () => {
    try {
      await Share.share({
        title: listing.title,
        message: `Check out "${listing.title}" on CampusConnect Marketplace: ${formattedPrice} (${listing.seller.collegeName})`,
      });
    } catch {
      // ignore
    }
  };

  const handleToggleSoldStatus = () => {
    const nextStatus = isSold ? 'active' : 'sold';
    markStatusMutation.mutate({ id: listing.id, status: nextStatus });
  };

  const handleDeleteListing = () => {
    Alert.alert(
      'Remove Listing',
      'Are you sure you want to permanently delete this listing? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteMutation.mutateAsync(listing.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer safeTop padded={false} style={styles.container}>
      {/* Top Floating Navigation Bar */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          style={styles.circleButton}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <ArrowLeft size={20} color={theme.colors.textPrimary} strokeWidth={2} />
        </Pressable>

        <View style={styles.topBarActions}>
          <Pressable
            onPress={handleShare}
            style={styles.circleButton}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Share listing"
          >
            <Share2 size={18} color={theme.colors.textPrimary} strokeWidth={1.8} />
          </Pressable>

          <Pressable
            onPress={() => toggleSaveMutation.mutate(listing.id)}
            style={[styles.circleButton, listing.isSaved && styles.circleButtonSaved]}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Bookmark listing"
          >
            <Bookmark
              size={18}
              color={listing.isSaved ? theme.colors.maroon : theme.colors.textPrimary}
              fill={listing.isSaved ? theme.colors.maroon : 'transparent'}
              strokeWidth={1.8}
            />
          </Pressable>

          {!isOwner && (
            <Pressable
              onPress={() => setIsReportModalVisible(true)}
              style={styles.circleButton}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Report listing"
            >
              <Flag size={17} color={theme.colors.textSecondary} strokeWidth={1.8} />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Swipeable Image Gallery */}
        <ProductImageGallery images={listing.images} />

        {/* Content Body */}
        <View style={styles.body}>
          {/* Price & Badges Row */}
          <View style={styles.headerRow}>
            <View>
              <AppText
                variant="display"
                style={[
                  styles.priceText,
                  listing.listingType === 'free' && styles.freePrice,
                  listing.listingType === 'exchange' && styles.exchangePrice,
                ]}
              >
                {formattedPrice}
              </AppText>
              {listing.listingType === 'exchange' && listing.exchangeFor && (
                <AppText variant="captionMedium" color="secondary" style={styles.exchangeSubtitle}>
                  Desired: {listing.exchangeFor}
                </AppText>
              )}
            </View>

            <View style={styles.badgesCol}>
              <ProductConditionBadge condition={listing.condition} size="md" />
              <ProductStatusBadge status={listing.status} size="md" />
            </View>
          </View>

          {/* Product Title */}
          <AppText variant="h2" serif color="primary" style={styles.productTitle}>
            {listing.title}
          </AppText>

          {/* Category & Date Metadata */}
          <View style={styles.metaRow}>
            <View style={styles.metaChip}>
              <Tag size={12} color={theme.colors.textSecondary} />
              <AppText variant="caption" color="secondary">
                {getCategoryLabel(listing.category)}
              </AppText>
            </View>

            <View style={styles.metaChip}>
              <Calendar size={12} color={theme.colors.textSecondary} />
              <AppText variant="caption" color="secondary">
                Listed {formatListingDate(listing.createdAt)}
              </AppText>
            </View>

            {listing.viewsCount ? (
              <View style={styles.metaChip}>
                <Eye size={12} color={theme.colors.textSecondary} />
                <AppText variant="caption" color="secondary">
                  {listing.viewsCount} views
                </AppText>
              </View>
            ) : null}
          </View>

          <View style={styles.divider} />

          {/* Short Description */}
          <View style={styles.sectionBlock}>
            <AppText variant="captionMedium" color="secondary" style={styles.sectionHeader}>
              DESCRIPTION
            </AppText>
            <AppText variant="body" color="primary" style={styles.descriptionText}>
              {listing.description}
            </AppText>
          </View>

          <View style={styles.divider} />

          {/* Seller Profile Card (With verified college check) */}
          <View style={styles.sectionBlock}>
            <AppText variant="captionMedium" color="secondary" style={styles.sectionHeader}>
              COLLEGE SELLER
            </AppText>
            <SellerInfoCard seller={listing.seller} />
          </View>

          {/* Owner Management Controls (For listing owner) */}
          {isOwner && (
            <View style={styles.ownerControlsCard}>
              <AppText variant="captionMedium" color="secondary" style={styles.ownerHeading}>
                LISTING MANAGEMENT
              </AppText>
              <View style={styles.ownerButtonsRow}>
                <AppButton
                  variant="outline"
                  title={isSold ? 'Mark as Available' : 'Mark as Sold'}
                  onPress={handleToggleSoldStatus}
                  size="sm"
                  style={styles.ownerBtn}
                />
                <AppButton
                  variant="outline"
                  title="Edit"
                  onPress={() =>
                    router.push({
                      pathname: '/marketplace/edit/[id]',
                      params: { id: listing.id },
                    })
                  }
                  size="sm"
                  style={styles.ownerBtn}
                />
                <AppButton
                  variant="outline"
                  title="Delete"
                  onPress={handleDeleteListing}
                  size="sm"
                  style={[styles.ownerBtn, styles.deleteBtn]}
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View style={styles.bottomBar}>
        {!isOwner ? (
          <View style={styles.bottomBarContent}>
            <Pressable
              onPress={() => toggleSaveMutation.mutate(listing.id)}
              style={[styles.bookmarkButton, listing.isSaved && styles.bookmarkButtonActive]}
              accessibilityRole="button"
              accessibilityLabel="Save listing"
            >
              <Bookmark
                size={20}
                color={listing.isSaved ? theme.colors.maroon : theme.colors.textPrimary}
                fill={listing.isSaved ? theme.colors.maroon : 'transparent'}
              />
            </Pressable>

            <AppButton
              variant="primary"
              title={isSold ? 'Item Sold' : 'Contact Seller'}
              disabled={isSold}
              onPress={() => setIsContactModalVisible(true)}
              style={styles.contactBtn}
            />
          </View>
        ) : (
          <View style={styles.bottomBarContent}>
            <AppButton
              variant="primary"
              title={isSold ? 'Reactivate Listing' : 'Mark as Sold'}
              onPress={handleToggleSoldStatus}
              style={{ flex: 1 }}
            />
          </View>
        )}
      </View>

      {/* Contact Seller Modal */}
      <SellerContactModal
        visible={isContactModalVisible}
        listing={listing}
        onClose={() => setIsContactModalVisible(false)}
        onSaveListing={() => toggleSaveMutation.mutate(listing.id)}
      />

      {/* Report Listing Modal */}
      <MarketplaceReportModal
        visible={isReportModalVisible}
        listingTitle={listing.title}
        onClose={() => setIsReportModalVisible(false)}
        onSubmitReport={async (reason, details) => {
          await reportMutation.mutateAsync({
            listingId: listing.id,
            reason,
            details,
          });
        }}
        isLoading={reportMutation.isPending}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  topBar: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.screenPadding,
  },
  topBarActions: {
    flexDirection: 'row',
    gap: 8,
  },
  circleButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(251, 247, 239, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  circleButtonSaved: {
    backgroundColor: theme.colors.card,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  body: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  priceText: {
    fontSize: 28,
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  freePrice: {
    color: theme.colors.olive,
  },
  exchangePrice: {
    color: theme.colors.maroon,
    fontSize: 22,
  },
  exchangeSubtitle: {
    marginTop: 2,
    fontSize: 12,
  },
  badgesCol: {
    alignItems: 'flex-end',
    gap: 4,
  },
  productTitle: {
    marginBottom: 10,
    lineHeight: 28,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: theme.spacing.sm,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.borderSubtle,
    marginVertical: theme.spacing.md,
  },
  sectionBlock: {
    marginVertical: 4,
  },
  sectionHeader: {
    letterSpacing: 0.8,
    marginBottom: 6,
    fontSize: 10,
  },
  descriptionText: {
    lineHeight: 22,
  },
  ownerControlsCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginTop: theme.spacing.lg,
  },
  ownerHeading: {
    letterSpacing: 0.8,
    marginBottom: 10,
    fontSize: 10,
  },
  ownerButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  ownerBtn: {
    flex: 1,
  },
  deleteBtn: {
    borderColor: theme.colors.error,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: 12,
    paddingBottom: 28,
  },
  bottomBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bookmarkButton: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkButtonActive: {
    backgroundColor: theme.colors.surfaceLight,
  },
  contactBtn: {
    flex: 1,
  },
});

