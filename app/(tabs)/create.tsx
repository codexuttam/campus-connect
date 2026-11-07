import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ShoppingBag, ChevronRight } from 'lucide-react-native';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { AppHeader } from '../../components/ui/AppHeader';
import { AppText } from '../../components/ui/AppText';
import { CreatePostForm } from '../../features/feed/components/CreatePostForm';
import { useCreatePost } from '../../features/feed/hooks/useFeed';
import { PostCategory, PostVisibility } from '../../features/feed/types';
import { theme } from '../../theme';

export default function CreateScreen() {
  const router = useRouter();
  const createPostMutation = useCreatePost();

  const handlePublish = async (data: {
    content: string;
    images?: string[];
    category: PostCategory;
    visibility: PostVisibility;
  }) => {
    await createPostMutation.mutateAsync(data);
    router.replace('/(tabs)');
  };

  return (
    <ScreenContainer scrollable safeTop padded={false} style={styles.container}>
      <AppHeader
        title="New Discussion"
        serifTitle
        borderBottom={false}
      />

      <View style={styles.content}>
        <View style={styles.kickerSection}>
          <AppText variant="captionMedium" color="secondary" style={styles.kicker}>
            CAMPUS DISCOURSE
          </AppText>
          <AppText variant="h1" serif color="primary" style={styles.title}>
            Publish to Campus
          </AppText>
          <AppText variant="bodySmall" color="secondary">
            Share research inquiries, project collaborations, or student notices.
          </AppText>
        </View>

        <Pressable
          onPress={() => router.push('/marketplace/create')}
          style={({ pressed }) => [styles.marketplaceBanner, pressed && styles.marketplaceBannerPressed]}
          accessibilityRole="button"
          accessibilityLabel="Sell on campus marketplace"
        >
          <View style={styles.bannerLeft}>
            <View style={styles.bannerIcon}>
              <ShoppingBag size={18} color={theme.colors.maroon} />
            </View>
            <View>
              <AppText variant="captionMedium" color="primary">
                Selling textbooks, electronics, or dorm gear?
              </AppText>
              <AppText variant="caption" color="secondary">
                List on the Campus Marketplace
              </AppText>
            </View>
          </View>
          <ChevronRight size={16} color={theme.colors.textSecondary} />
        </Pressable>

        <CreatePostForm
          onPublish={handlePublish}
          isLoading={createPostMutation.isPending}
          onCancel={() => router.back()}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingBottom: theme.spacing.massive,
  },
  kickerSection: {
    marginBottom: theme.spacing.md,
  },
  kicker: {
    letterSpacing: theme.letterSpacing.wider,
    marginBottom: 2,
    fontSize: 11,
  },
  title: {
    marginBottom: 4,
  },
  marketplaceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    padding: 10,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  marketplaceBannerPressed: {
    backgroundColor: theme.colors.surfaceLight,
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bannerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.maroonLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
