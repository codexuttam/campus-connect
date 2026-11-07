import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { MarketplaceImage } from '../types';
import { theme } from '../../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface ProductImageGalleryProps {
  images: MarketplaceImage[];
  height?: number;
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  height = SCREEN_WIDTH * 0.95,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const displayImages = images.length > 0
    ? images
    : [
        {
          id: 'placeholder',
          listingId: '',
          imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
          sortOrder: 0,
        },
      ];

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / SCREEN_WIDTH);
    if (index !== activeIndex && index >= 0 && index < displayImages.length) {
      setActiveIndex(index);
    }
  };

  return (
    <View style={[styles.container, { height }]}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scroll}
      >
        {displayImages.map((img) => (
          <View key={img.id} style={[styles.imageWrapper, { width: SCREEN_WIDTH, height }]}>
            <Image
              source={{ uri: img.imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        ))}
      </ScrollView>

      {/* Pagination dots (only if multiple images) */}
      {displayImages.length > 1 && (
        <View style={styles.pagination}>
          {displayImages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === activeIndex ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  pagination: {
    position: 'absolute',
    bottom: 12,
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
});

