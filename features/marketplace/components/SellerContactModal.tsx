import React, { useState } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Pressable,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { X, MessageSquare, ShieldCheck, Bookmark, CheckCircle2, Copy } from 'lucide-react-native';
import { AppText } from '../../../components/ui/AppText';
import { AppButton } from '../../../components/ui/AppButton';
import { AppCard } from '../../../components/ui/AppCard';
import { AppAvatar } from '../../../components/ui/AppAvatar';
import { MarketplaceListing, MarketplaceConversationContext } from '../types';
import { formatPrice } from '../utils/formatters';
import { theme } from '../../../theme';
import { showAlert } from '../../../services/dialog';

export interface SellerContactModalProps {
  visible: boolean;
  listing: MarketplaceListing;
  onClose: () => void;
  onSaveListing?: () => void;
}

export const SellerContactModal: React.FC<SellerContactModalProps> = ({
  visible,
  listing,
  onClose,
  onSaveListing,
}) => {
  const router = useRouter();
  const [inquiryLogged, setInquiryLogged] = useState(false);

  const context: MarketplaceConversationContext = {
    listingId: listing.id,
    listingTitle: listing.title,
    listingPrice: listing.price,
    listingType: listing.listingType,
    listingThumbnail: listing.images[0]?.imageUrl || '',
    sellerId: listing.seller.id,
    sellerName: listing.seller.fullName,
  };

  const coverImage =
    listing.images[0]?.imageUrl ||
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';

  const formattedPrice = formatPrice(
    listing.price,
    listing.currency,
    listing.listingType,
    listing.exchangeFor
  );

  const handleLogAvailability = () => {
    setInquiryLogged(true);
    showAlert(
      'Availability Request Queued',
      `An interest request for "${listing.title}" has been placed in your activity log. Once direct messaging unlocks in the student network, you can immediately coordinate meetup with ${listing.seller.fullName}.`
    );
  };

  const handleNavigateToChats = () => {
    onClose();
    // Navigate to chats screen passing typed params
    router.push({
      pathname: '/(tabs)/chats',
      params: {
        listingId: listing.id,
        sellerId: listing.seller.id,
        sellerName: listing.seller.fullName,
      },
    });
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
            <View style={styles.headerTitleRow}>
              <MessageSquare size={20} color={theme.colors.maroon} />
              <AppText variant="h3" serif color="primary">
                Contact Seller
              </AppText>
            </View>
            <Pressable
              onPress={onClose}
              hitSlop={8}
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Close dialog"
            >
              <X size={18} color={theme.colors.textPrimary} />
            </Pressable>
          </View>

          <View style={styles.content}>
            {/* Compact Listing Preview (Section 11 requirement) */}
            <View style={styles.previewCard}>
              <Image source={{ uri: coverImage }} style={styles.previewImage} resizeMode="cover" />
              <View style={styles.previewInfo}>
                <AppText variant="captionMedium" color="primary" numberOfLines={1}>
                  {listing.title}
                </AppText>
                <AppText variant="bodySmallMedium" color="primary" style={styles.priceHighlight}>
                  {formattedPrice}
                </AppText>
                <AppText variant="caption" color="secondary">
                  Seller: {listing.seller.fullName}
                </AppText>
              </View>
            </View>

            {/* Seller Affiliation & Verification */}
            <View style={styles.sellerRow}>
              <AppAvatar
                name={listing.seller.fullName}
                source={listing.seller.avatarUrl ? { uri: listing.seller.avatarUrl } : undefined}
                size="md"
              />
              <View style={styles.sellerMeta}>
                <View style={styles.nameBadgeRow}>
                  <AppText variant="bodySmallMedium" color="primary">
                    {listing.seller.fullName}
                  </AppText>
                  {listing.seller.isCollegeVerified && (
                    <View style={styles.verifiedChip}>
                      <CheckCircle2 size={12} color={theme.colors.olive} strokeWidth={2.4} />
                      <AppText variant="caption" style={styles.verifiedChipText}>
                        Verified
                      </AppText>
                    </View>
                  )}
                </View>
                <AppText variant="caption" color="secondary">
                  {listing.seller.collegeName}
                </AppText>
              </View>
            </View>

            {/* Honest Messaging Status Banner (Section 11 requirement) */}
            <AppCard variant="surface" padding="md" style={styles.honestNoticeCard}>
              <View style={styles.noticeIconCircle}>
                <MessageSquare size={22} color={theme.colors.maroon} strokeWidth={1.8} />
              </View>
              <AppText variant="bodySmallMedium" color="primary" align="center" style={styles.noticeTitle}>
                Direct Peer Chat Integration
              </AppText>
              <AppText variant="caption" color="secondary" align="center" style={styles.noticeBody}>
                Student real-time end-to-end messaging is being integrated into the Chats tab. You can bookmark this item to your Saved items or queue an availability request.
              </AppText>
            </AppCard>

            {/* Campus Safe Meetup reminder */}
            <View style={styles.safeHint}>
              <ShieldCheck size={16} color={theme.colors.olive} />
              <AppText variant="caption" color="secondary" style={styles.safeHintText}>
                Never share personal passwords, financial PINs, or private home addresses.
              </AppText>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.footer}>
            {onSaveListing && (
              <AppButton
                variant="outline"
                title={listing.isSaved ? 'Saved in Bookmarks' : 'Save Listing'}
                onPress={onSaveListing}
                style={styles.footerBtn}
              />
            )}
            <AppButton
              variant="primary"
              title={inquiryLogged ? 'Request Logged' : 'Inquire Availability'}
              onPress={handleLogAvailability}
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
    paddingBottom: 28,
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
    paddingTop: theme.spacing.md,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 8,
    gap: 10,
    marginBottom: theme.spacing.md,
  },
  previewImage: {
    width: 50,
    height: 50,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surfaceLight,
  },
  previewInfo: {
    flex: 1,
  },
  priceHighlight: {
    color: theme.colors.maroon,
    fontWeight: '700',
    marginTop: 1,
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: theme.spacing.md,
  },
  sellerMeta: {
    flex: 1,
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  verifiedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: theme.colors.oliveLight,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: theme.radius.xs,
  },
  verifiedChipText: {
    color: theme.colors.olive,
    fontSize: 9,
    fontWeight: '600',
  },
  honestNoticeCard: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  noticeIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.maroonLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  noticeTitle: {
    marginBottom: 4,
  },
  noticeBody: {
    lineHeight: 16,
    maxWidth: 290,
  },
  safeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.surface,
    padding: 10,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
  },
  safeHintText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 15,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.screenPadding,
    gap: 12,
  },
  footerBtn: {
    flex: 1,
  },
});
