import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { AppHeader } from '../components/ui/AppHeader';
import { AppText } from '../components/ui/AppText';
import { CreatePostForm } from '../features/feed/components/CreatePostForm';
import { useCreatePost } from '../features/feed/hooks/useFeed';
import { PostCategory, PostVisibility } from '../features/feed/types';
import { theme } from '../theme';

export default function CreatePostModalScreen() {
  const router = useRouter();
  const createPostMutation = useCreatePost();

  const handlePublish = async (data: {
    content: string;
    images?: string[];
    category: PostCategory;
    visibility: PostVisibility;
  }) => {
    await createPostMutation.mutateAsync(data);
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <ScreenContainer scrollable safeTop padded={false} style={styles.container}>
      <AppHeader
        title="Create Post"
        serifTitle
        showBack
        onBack={() => router.back()}
        borderBottom={false}
      />

      <View style={styles.content}>
        <View style={styles.kickerSection}>
          <AppText variant="captionMedium" color="secondary" style={styles.kicker}>
            CAMPUS DISCOURSE
          </AppText>
          <AppText variant="h2" serif color="primary" style={styles.title}>
            Share an Update
          </AppText>
        </View>

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
});
