import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Bookmark, Sparkles } from 'lucide-react-native';
import { AppText } from '../../../components/ui/AppText';
import { ProductConditionBadge } from './ProductConditionBadge';
import { MarketplaceListing } from '../types';
import { formatPrice } from '../utils/formatters';
import { theme } from '../../../theme';

export interface MarketplaceProductCardProps {
  listing: MarketplaceListing;
  onPress: () => void;
  onToggleSave?: () => void;
  style?: StyleProp<ViewStyle>;
  width?: number;
}

export const MarketplaceProductCard: React.FC<MarketplaceProductCardProps> = ({
  listing,
  onPress,
  onToggleSave,
  style,
  width,
}) => {
  const [imageError, setImageError] = useState(false);

  const coverImage =
    listing.images.find((img) => img.isCover)?.imageUrl ||
    listing.images[0]?.imageUrl ||
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';

  const isSold = listing.status === 'sold';
  const isReserved = listing.status === 'reserved';
  const formattedPrice = formatPrice(
    listing.price,
    listing.currency,
    listing.listingType,
    listing.exchangeFor
  );

  return (
    <View
      style={[
        styles.card,
        width ? { width } : styles.defaultWidth,
        style,
      ]}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.mainPressable,
          pressed && styles.pressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`${listing.title}, ${formattedPrice}`}
      >
        {/* 1:1 Aspect Ratio Product Thumbnail Container */}
        <View style={styles.imageContainer}>
          {imageError ? (
            <View style={styles.imageFallback}>
              <Sparkles size={24} color={theme.colors.textMuted} />
            </View>
          ) : (
            <Image
              source={{ uri: coverImage }}
              style={styles.image}
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          )}

          {/* Sold / Reserved Status Overlay */}
          {isSold && (
            <View style={styles.soldOverlay}>
              <View style={styles.soldPill}>
                <AppText variant="caption" style={styles.soldText}>
                  SOLD
                </AppText>
              </View>
            </View>
          )}
          {!isSold && isReserved && (
            <View style={styles.reservedOverlay}>
              <View style={styles.reservedPill}>
                <AppText variant="caption" style={styles.reservedText}>
                  RESERVED
                </AppText>
              </View>
            </View>
          )}
        </View>

        {/* Card Body */}
        <View style={styles.details}>
          {/* Price & Listing Type */}
          <View style={styles.priceRow}>
            <AppText
              variant="bodyMedium"
              style={[
                styles.priceText,
                listing.listingType === 'free' && styles.freePriceText,
                listing.listingType === 'exchange' && styles.exchangePriceText,
              ]}
              numberOfLines={1}
            >
              {formattedPrice}
            </AppText>
          </View>

          {/* Product Title (Max 2 lines) */}
          <AppText
            variant="bodySmall"
            color="primary"
            style={styles.title}
            numberOfLines={2}
          >
            {listing.title}
          </AppText>

          {/* Condition & College/Time Footer */}
          <View style={styles.footerRow}>
            <ProductConditionBadge condition={listing.condition} size="sm" />
            {listing.seller.isCollegeVerified && (
              <AppText variant="caption" color="secondary" style={styles.verifiedDot}>
                Verified
              </AppText>
            )}
          </View>
        </View>
      </Pressable>

      {/* Bookmark Icon Button: Positioned as sibling overlay on top of card */}
      {onToggleSave && (
        <Pressable
          onPress={onToggleSave}
          hitSlop={8}
          style={({ pressed }) => [
            styles.saveButton,
            listing.isSaved && styles.saveButtonActive,
            pressed && styles.saveButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={listing.isSaved ? 'Unsave listing' : 'Save listing'}
        >
          <Bookmark
            size={15}
            color={listing.isSaved ? theme.colors.maroon : theme.colors.textPrimary}
            fill={listing.isSaved ? theme.colors.maroon : 'transparent'}
            strokeWidth={2}
          />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
  },
  defaultWidth: {
    flex: 1,
  },
  mainPressable: {
    flex: 1,
  },
  pressed: {
    backgroundColor: theme.colors.cardHover,
    opacity: 0.95,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1, // Strict 1:1 image ratio
    backgroundColor: theme.colors.surface,
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceLight,
  },
  soldOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(48, 43, 40, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  soldPill: {
    backgroundColor: '#302B28',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.xs,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  soldText: {
    color: '#FBF7EF',
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 0.8,
  },
  reservedOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(243, 235, 221, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reservedPill: {
    backgroundColor: theme.colors.warningLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.xs,
    borderWidth: 1,
    borderColor: theme.colors.warning,
  },
  reservedText: {
    color: theme.colors.warning,
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 0.6,
  },
  saveButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(251, 247, 239, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  saveButtonActive: {
    backgroundColor: theme.colors.card,
  },
  saveButtonPressed: {
    transform: [{ scale: 0.92 }],
  },
  details: {
    padding: theme.spacing.sm,
    flexDirection: 'column',
  },
  priceRow: {
    marginBottom: 2,
  },
  priceText: {
    color: theme.colors.textPrimary,
    fontWeight: '700',
    fontSize: 15,
  },
  freePriceText: {
    color: theme.colors.olive,
    fontWeight: '700',
  },
  exchangePriceText: {
    color: theme.colors.maroon,
    fontWeight: '600',
    fontSize: 13,
  },
  title: {
    lineHeight: 18,
    minHeight: 36,
    marginBottom: 6,
    color: theme.colors.textPrimary,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  verifiedDot: {
    fontSize: 10,
    color: theme.colors.olive,
    fontWeight: '600',
  },
});
