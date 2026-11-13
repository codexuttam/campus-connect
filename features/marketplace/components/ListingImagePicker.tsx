import React from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, X, Star, Sparkles, ImagePlus } from 'lucide-react-native';
import { AppText } from '../../../components/ui/AppText';
import { theme } from '../../../theme';
import { showAlert } from '../../../services/dialog';

export interface ListingImagePickerProps {
  images: string[];
  onChangeImages: (images: string[]) => void;
  maxImages?: number;
}

const SAMPLE_CAMPUS_PHOTOS = [
  {
    label: 'Textbook',
    uri: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Electronics',
    uri: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Study Lamp',
    uri: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Headphones',
    uri: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
  },
];

export const ListingImagePicker: React.FC<ListingImagePickerProps> = ({
  images,
  onChangeImages,
  maxImages = 5,
}) => {
  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        showAlert(
          'Permission Needed',
          'CampusConnect requires camera access to take item photos.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newUri = result.assets[0].uri;
        onChangeImages([...images, newUri].slice(0, maxImages));
      }
    } catch (err: any) {
      showAlert('Camera Error', err?.message || 'Could not launch camera.');
    }
  };

  const handlePickImages = async () => {
    if (images.length >= maxImages) {
      showAlert('Limit Reached', `You can upload up to ${maxImages} images.`);
      return;
    }

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        showAlert(
          'Permission Needed',
          'CampusConnect requires media library access to select item photos.'
        );
        return;
      }

      const remainingSlots = maxImages - images.length;
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: remainingSlots,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newUris = result.assets.map((a) => a.uri);
        onChangeImages([...images, ...newUris].slice(0, maxImages));
      }
    } catch (err: any) {
      showAlert('Photo Selection Error', err?.message || 'Could not select images.');
    }
  };

  const handleAddSamplePhoto = (uri: string) => {
    if (images.length >= maxImages) return;
    if (images.includes(uri)) return;
    onChangeImages([...images, uri]);
  };

  const handleRemove = (index: number) => {
    onChangeImages(images.filter((_, i) => i !== index));
  };

  const handleSetCover = (index: number) => {
    if (index === 0) return;
    const selected = images[index];
    const rest = images.filter((_, i) => i !== index);
    onChangeImages([selected, ...rest]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <AppText variant="bodySmallMedium" color="primary">
          Item Photographs
        </AppText>
        <AppText variant="caption" color="secondary">
          {images.length}/{maxImages} • First image is cover
        </AppText>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {/* Add photo buttons: Camera & Gallery */}
        {images.length < maxImages && (
          <View style={styles.addButtonsGroup}>
            <Pressable
              onPress={handlePickImages}
              style={({ pressed }) => [
                styles.addButton,
                pressed && styles.addButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Add photos from library"
            >
              <ImagePlus size={22} color={theme.colors.maroon} strokeWidth={1.8} />
              <AppText variant="caption" color="secondary" style={styles.addText}>
                Gallery
              </AppText>
            </Pressable>

            <Pressable
              onPress={handleTakePhoto}
              style={({ pressed }) => [
                styles.addButton,
                pressed && styles.addButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Take photo with camera"
            >
              <Camera size={22} color={theme.colors.maroon} strokeWidth={1.8} />
              <AppText variant="caption" color="secondary" style={styles.addText}>
                Camera
              </AppText>
            </Pressable>
          </View>
        )}

        {/* Selected images preview */}
        {images.map((uri, index) => {
          const isCover = index === 0;
          return (
            <View key={`${uri}-${index}`} style={styles.imageCard}>
              <Image source={{ uri }} style={styles.thumbnail} resizeMode="cover" />

              {/* Cover badge */}
              {isCover ? (
                <View style={styles.coverBadge}>
                  <Star size={10} color="#FBF7EF" fill="#FBF7EF" />
                  <AppText variant="caption" style={styles.coverBadgeText}>
                    COVER
                  </AppText>
                </View>
              ) : (
                <Pressable
                  onPress={() => handleSetCover(index)}
                  style={styles.setCoverBtn}
                  hitSlop={6}
                >
                  <AppText variant="caption" style={styles.setCoverText}>
                    Make Cover
                  </AppText>
                </Pressable>
              )}

              {/* Remove button */}
              <Pressable
                onPress={() => handleRemove(index)}
                style={styles.removeBtn}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Remove photo"
              >
                <X size={12} color="#FBF7EF" strokeWidth={2.5} />
              </Pressable>
            </View>
          );
        })}
      </ScrollView>

      {/* Quick Sample Presets for Simulator / Web Preview Testing */}
      {images.length < maxImages && (
        <View style={styles.sampleSection}>
          <View style={styles.sampleHeader}>
            <Sparkles size={12} color={theme.colors.olive} />
            <AppText variant="caption" color="secondary">
              Quick-attach sample campus item photo:
            </AppText>
          </View>
          <View style={styles.sampleChips}>
            {SAMPLE_CAMPUS_PHOTOS.map((sample) => {
              const isAdded = images.includes(sample.uri);
              return (
                <Pressable
                  key={sample.label}
                  onPress={() => handleAddSamplePhoto(sample.uri)}
                  disabled={isAdded}
                  style={[
                    styles.sampleChip,
                    isAdded && styles.sampleChipDisabled,
                  ]}
                >
                  <AppText
                    variant="caption"
                    style={[
                      styles.sampleChipText,
                      isAdded && styles.sampleChipTextDisabled,
                    ]}
                  >
                    + {sample.label}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scrollList: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 4,
  },
  addButtonsGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  addButton: {
    width: 90,
    height: 90,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addButtonPressed: {
    backgroundColor: theme.colors.surfaceLight,
    opacity: 0.8,
  },
  addText: {
    fontSize: 10,
    fontWeight: '600',
  },
  imageCard: {
    width: 90,
    height: 90,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  coverBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: theme.colors.maroon,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: theme.radius.xs,
  },
  coverBadgeText: {
    color: '#FBF7EF',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  setCoverBtn: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(48, 43, 40, 0.75)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: theme.radius.xs,
  },
  setCoverText: {
    color: '#FBF7EF',
    fontSize: 8,
    fontWeight: '600',
  },
  removeBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(48, 43, 40, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sampleSection: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.borderSubtle,
  },
  sampleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  sampleChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sampleChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sampleChipDisabled: {
    opacity: 0.45,
  },
  sampleChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  sampleChipTextDisabled: {
    color: theme.colors.textMuted,
  },
});
