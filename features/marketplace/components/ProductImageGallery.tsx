import React, { useState, useRef } from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { AppText } from '../../../components/ui/AppText';
import { MarketplaceImage } from '../types';
import { theme } from '../../../theme';

export interface ProductImageGalleryProps {
  images: MarketplaceImage[];
  height?: number;
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  height,
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const galleryHeight = height || Math.min(screenWidth * 0.92, 420);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<React.ComponentRef<typeof ScrollView>>(null);

  const displayImages =
    images.length > 0
      ? images
      : [
          {
            id: 'placeholder',
            listingId: '',
            imageUrl:
              'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
            sortOrder: 0,
          },
        ];

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / screenWidth);
    if (index !== activeIndex && index >= 0 && index < displayImages.length) {
      setActiveIndex(index);
    }
  };

  const scrollToIndex = (index: number) => {
    setActiveIndex(index);
    scrollRef.current?.scrollTo({ x: index * screenWidth, animated: true });
  };

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, { height: galleryHeight }]}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scroll}
        >
          {displayImages.map((img) => (
            <View
              key={img.id}
              style={[
                styles.imageWrapper,
                { width: screenWidth, height: galleryHeight },
              ]}
            >
              <Image
                source={{ uri: img.imageUrl }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          ))}
        </ScrollView>

        {/* Image Counter Pill & Pagination Dots */}
        {displayImages.length > 1 && (
          <>
            <View style={styles.counterPill}>
              <AppText variant="caption" style={styles.counterText}>
                {activeIndex + 1} / {displayImages.length}
              </AppText>
            </View>

            <View style={styles.pagination}>
              {displayImages.map((_, index) => (
                <Pressable
                  key={index}
                  onPress={() => scrollToIndex(index)}
                  hitSlop={6}
                  style={[
                    styles.dot,
                    index === activeIndex ? styles.activeDot : styles.inactiveDot,
                  ]}
                />
              ))}
            </View>
          </>
        )}
      </View>

      {/* Thumbnail Strip for Multi-Photo Listings */}
      {displayImages.length > 1 && (
        <View style={styles.thumbnailStrip}>
          {displayImages.map((img, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <Pressable
                key={img.id}
                onPress={() => scrollToIndex(idx)}
                style={[
                  styles.thumbItem,
                  isSelected && styles.thumbItemSelected,
                ]}
              >
                <Image
                  source={{ uri: img.imageUrl }}
                  style={styles.thumbImage}
                  resizeMode="cover"
                />
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    backgroundColor: theme.colors.background,
  },
  container: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    position: 'relative',
  },
  scroll: {
    flex: 1,
  },
  imageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  counterPill: {
    position: 'absolute',
    bottom: 12,
    right: 16,
    backgroundColor: 'rgba(48, 43, 40, 0.72)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.full,
  },
  counterText: {
    color: '#FBF7EF',
    fontSize: 11,
    fontWeight: '600',
  },
  pagination: {
    position: 'absolute',
    bottom: 14,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  activeDot: {
    width: 18,
    backgroundColor: theme.colors.card,
  },
  inactiveDot: {
    width: 6,
    backgroundColor: 'rgba(251, 247, 239, 0.5)',
  },
  thumbnailStrip: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: 10,
    paddingBottom: 2,
    gap: 8,
  },
  thumbItem: {
    width: 52,
    height: 52,
    borderRadius: theme.radius.sm,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    opacity: 0.65,
  },
  thumbItemSelected: {
    borderColor: theme.colors.maroon,
    opacity: 1,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
});
