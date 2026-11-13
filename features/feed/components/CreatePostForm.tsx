import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Image,
  Pressable,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {
  Image as ImageIcon,
  X,
  Send,
  Eye,
  Globe,
  Users,
  Sparkles,
  AlertCircle,
} from 'lucide-react-native';
import { AppText } from '../../../components/ui/AppText';
import { AppButton } from '../../../components/ui/AppButton';
import { AppAvatar } from '../../../components/ui/AppAvatar';
import { AppBadge } from '../../../components/ui/AppBadge';
import { PostCategory, PostVisibility } from '../types';
import { useAuth } from '../../../hooks/useAuth';
import { theme } from '../../../theme';
import { showAlert } from '../../../services/dialog';

export interface CreatePostFormProps {
  onPublish: (data: {
    content: string;
    images?: string[];
    category: PostCategory;
    visibility: PostVisibility;
  }) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

const CATEGORIES: { id: PostCategory; label: string }[] = [
  { id: 'campus-life', label: 'Campus Life' },
  { id: 'academic', label: 'Academic' },
  { id: 'research', label: 'Research' },
  { id: 'events', label: 'Events' },
  { id: 'clubs', label: 'Clubs' },
];

const VISIBILITIES: { id: PostVisibility; label: string; icon: any }[] = [
  { id: 'campus', label: 'Campus Only', icon: Users },
  { id: 'course', label: 'Course Circle', icon: Sparkles },
  { id: 'public', label: 'Public Feed', icon: Globe },
];

const MAX_CHAR_LIMIT = 500;

export const CreatePostForm: React.FC<CreatePostFormProps> = ({
  onPublish,
  isLoading = false,
  onCancel,
}) => {
  const { user } = useAuth();

  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PostCategory>('campus-life');
  const [selectedVisibility, setSelectedVisibility] = useState<PostVisibility>('campus');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const characterCount = content.length;
  const isOverLimit = characterCount > MAX_CHAR_LIMIT;

  const handlePickImages = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        showAlert(
          'Permission Required',
          'CampusConnect requires media library permissions to attach photos.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: 4,
      });

      if (!result.canceled && result.assets) {
        const newUris = result.assets.map((a) => a.uri);
        setSelectedImages((prev) => [...prev, ...newUris].slice(0, 4));
      }
    } catch (err: any) {
      showAlert('Image Picker Error', err?.message || 'Could not access photos.');
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePublish = async () => {
    setError(null);

    const trimmed = content.trim();
    if (!trimmed && selectedImages.length === 0) {
      setError('Please write some text or attach an image.');
      return;
    }

    if (isOverLimit) {
      setError(`Post exceeds the ${MAX_CHAR_LIMIT} character limit.`);
      return;
    }

    await onPublish({
      content: trimmed,
      images: selectedImages.length > 0 ? selectedImages : undefined,
      category: selectedCategory,
      visibility: selectedVisibility,
    });
  };

  return (
    <View style={styles.container}>
      {/* Author Bar & Visibility */}
      <View style={styles.authorBar}>
        <AppAvatar
          name={user?.fullName || 'Student Scholar'}
          size="md"
          style={{ backgroundColor: theme.colors.maroon }}
        />
        <View style={styles.authorMeta}>
          <AppText variant="bodySmallMedium" color="primary">
            {user?.fullName || 'Student Scholar'}
          </AppText>
          <AppText variant="caption" color="secondary" style={styles.metaSubtitle}>
            Posting to {user?.collegeName || 'Oxford'}
          </AppText>
        </View>

        {/* Visibility Chip Selector */}
        <View style={styles.visibilityPillRow}>
          {VISIBILITIES.map((v) => {
            const isSelected = selectedVisibility === v.id;
            const Icon = v.icon;
            return (
              <Pressable
                key={v.id}
                onPress={() => setSelectedVisibility(v.id)}
                style={[
                  styles.visibilityChip,
                  isSelected && styles.visibilityChipSelected,
                ]}
              >
                <Icon
                  size={11}
                  color={isSelected ? theme.colors.maroon : theme.colors.textMuted}
                />
                <AppText
                  variant="caption"
                  style={[
                    styles.visibilityText,
                    isSelected && styles.visibilityTextSelected,
                  ]}
                >
                  {v.label}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Error alert banner */}
      {error && (
        <View style={styles.errorBanner}>
          <AlertCircle size={14} color={theme.colors.error} />
          <AppText variant="caption" style={styles.errorText}>
            {error}
          </AppText>
        </View>
      )}

      {/* Post Text Input */}
      <TextInput
        style={styles.textInput}
        placeholder="Share a campus update, research note, or discussion topic..."
        placeholderTextColor={theme.colors.textMuted}
        value={content}
        onChangeText={(t) => {
          setContent(t);
          if (error) setError(null);
        }}
        multiline
        textAlignVertical="top"
        selectionColor={theme.colors.maroon}
        maxLength={MAX_CHAR_LIMIT + 50}
      />

      {/* Image Preview Row */}
      {selectedImages.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.imagePreviewsScroll}
        >
          {selectedImages.map((uri, index) => (
            <View key={uri + index} style={styles.imagePreviewWrapper}>
              <Image source={{ uri }} style={styles.imagePreview} />
              <Pressable
                onPress={() => handleRemoveImage(index)}
                style={styles.removeImageBadge}
                hitSlop={6}
              >
                <X size={12} color={theme.colors.textInverse} strokeWidth={2.5} />
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Category Pills Selector */}
      <View style={styles.categorySection}>
        <AppText variant="captionMedium" color="secondary" style={styles.categoryLabel}>
          CATEGORY
        </AppText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryChipsRow}
        >
          {CATEGORIES.map((c) => {
            const isSelected = selectedCategory === c.id;
            return (
              <Pressable
                key={c.id}
                onPress={() => setSelectedCategory(c.id)}
                style={[
                  styles.categoryChip,
                  isSelected && styles.categoryChipSelected,
                ]}
              >
                <AppText
                  variant="caption"
                  style={[
                    styles.categoryChipText,
                    isSelected && styles.categoryChipTextSelected,
                  ]}
                >
                  {c.label}
                </AppText>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Bottom Bar: Attach Image, Character Count, Publish */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomLeftActions}>
          <Pressable
            onPress={handlePickImages}
            style={styles.attachButton}
            accessibilityRole="button"
            accessibilityLabel="Attach photo from gallery"
          >
            <ImageIcon size={20} color={theme.colors.maroon} />
            <AppText variant="captionMedium" style={styles.attachLabel}>
              Photo ({selectedImages.length}/4)
            </AppText>
          </Pressable>

          <AppText
            variant="caption"
            color={isOverLimit ? 'error' : 'muted'}
            style={styles.charCounter}
          >
            {characterCount}/{MAX_CHAR_LIMIT}
          </AppText>
        </View>

        <AppButton
          title="Publish"
          variant="primary"
          size="md"
          loading={isLoading}
          disabled={(!content.trim() && selectedImages.length === 0) || isOverLimit}
          trailingIcon={
            <Send size={14} color={theme.colors.textInverse} strokeWidth={2} />
          }
          onPress={handlePublish}
          style={styles.publishButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
  },
  authorBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  authorMeta: {
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  metaSubtitle: {
    fontSize: 11,
  },
  visibilityPillRow: {
    flexDirection: 'row',
    gap: 4,
  },
  visibilityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: theme.radius.xs,
    backgroundColor: theme.colors.surface,
  },
  visibilityChipSelected: {
    backgroundColor: theme.colors.maroonLight,
  },
  visibilityText: {
    color: theme.colors.textSecondary,
    fontSize: 10,
  },
  visibilityTextSelected: {
    color: theme.colors.maroon,
    fontFamily: theme.fontFamilies.sans.semiBold,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.errorLight,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    marginBottom: theme.spacing.sm,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
  },
  textInput: {
    minHeight: 120,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamilies.sans.regular,
    fontSize: 15,
    lineHeight: 22,
    padding: 0,
    marginBottom: theme.spacing.md,
  },
  imagePreviewsScroll: {
    gap: 10,
    paddingBottom: theme.spacing.md,
  },
  imagePreviewWrapper: {
    position: 'relative',
    width: 80,
    height: 80,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeImageBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: theme.radius.full,
    backgroundColor: '#302B28CC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categorySection: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderSubtle,
    paddingTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  categoryLabel: {
    fontSize: 10,
    letterSpacing: theme.letterSpacing.wider,
    marginBottom: 6,
  },
  categoryChipsRow: {
    gap: 6,
  },
  categoryChip: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  categoryChipSelected: {
    backgroundColor: theme.colors.maroon,
    borderColor: theme.colors.maroon,
  },
  categoryChipText: {
    color: theme.colors.textSecondary,
    fontSize: 11,
  },
  categoryChipTextSelected: {
    color: theme.colors.textInverse,
    fontFamily: theme.fontFamilies.sans.semiBold,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderSubtle,
    paddingTop: theme.spacing.sm,
  },
  bottomLeftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4,
  },
  attachLabel: {
    color: theme.colors.maroon,
    fontSize: 12,
  },
  charCounter: {
    fontSize: 11,
  },
  publishButton: {
    minWidth: 100,
  },
});
