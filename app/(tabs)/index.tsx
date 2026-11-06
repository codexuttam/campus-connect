import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, Plus, AlertCircle } from 'lucide-react-native';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { AppText } from '../../components/ui/AppText';
import { AppCard } from '../../components/ui/AppCard';
import { AppButton } from '../../components/ui/AppButton';
import { LoadingIndicator } from '../../components/ui/LoadingIndicator';
import {
  HomeHeader,
  FeedFilter,
  StoryList,
  StoryViewer,
  PostCard,
  SuggestedUserSection,
  TrendingSection,
} from '../../features/feed/components';
import {
  useCampusFeed,
  useStories,
  useSuggestedConnections,
  useTrendingTopics,
  useLikePost,
  useSavePost,
  useDeletePost,
  useToggleConnect,
  useRecordStoryView,
  useReportPost,
} from '../../features/feed/hooks/useFeed';
import { Post, PostCategory } from '../../features/feed/types';
import { useAuth } from '../../hooks/useAuth';
import { theme } from '../../theme';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [feedFilter, setFeedFilter] = useState<'for-you' | 'following'>('for-you');
  const [selectedCategory, setSelectedCategory] = useState<PostCategory>('all');
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

  // Queries
  const {
    data: feedData,
    isLoading: isFeedLoading,
    isRefetching: isFeedRefetching,
    refetch: refetchFeed,
    error: feedError,
  } = useCampusFeed({ filter: feedFilter, category: selectedCategory });

  const { data: stories = [] } = useStories();
  const { data: suggestions = [] } = useSuggestedConnections();
  const { data: trending = [] } = useTrendingTopics();

  // Mutations
  const likeMutation = useLikePost();
  const saveMutation = useSavePost();
  const deleteMutation = useDeletePost();
  const connectMutation = useToggleConnect();
  const storyViewMutation = useRecordStoryView();
  const reportMutation = useReportPost();

  const posts = feedData?.posts || [];

  const handleRefresh = async () => {
    await refetchFeed();
  };

  const handlePostPress = (postId: string) => {
    router.push({
      pathname: '/post/[id]',
      params: { id: postId },
    });
  };

  return (
    <ScreenContainer safeTop padded={false} style={styles.container}>
      {/* Top Campus Header */}
      <HomeHeader
        campusName={user?.collegeName ? `${user.collegeName} · The Yard` : 'Oxford · The Yard'}
        onSearchPress={() => router.push('/search')}
        onNotificationsPress={() => router.push('/notifications')}
        hasUnreadNotifications
      />

      {/* Main Feed FlatList */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={isFeedRefetching}
            onRefresh={handleRefresh}
            tintColor={theme.colors.maroon}
            colors={[theme.colors.maroon]}
          />
        }
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.headerSections}>
            {/* 1. Feed Segmented Tabs & Category Pills */}
            <FeedFilter
              activeTab={feedFilter}
              onTabChange={setFeedFilter}
              activeCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />

            {/* 2. Campus Updates / Stories */}
            <StoryList
              stories={stories}
              onSelectStory={(index) => setActiveStoryIndex(index)}
              onAddStoryPress={() => router.push('/create-post')}
              currentUserName={user?.fullName || 'You'}
            />

            {/* 3. Trending on Campus Discussions */}
            <TrendingSection
              topics={trending}
              onSelectTopic={(topic) => {
                // If trending topic has matching category or tag
                router.push('/search');
              }}
            />
          </View>
        }
        renderItem={({ item, index }) => (
          <View key={item.id} style={styles.postItemWrapper}>
            <PostCard
              post={item}
              onPress={() => handlePostPress(item.id)}
              onLike={() => likeMutation.mutate(item.id)}
              onSave={() => saveMutation.mutate(item.id)}
              onDelete={() => deleteMutation.mutate(item.id)}
              onReport={(reason) => reportMutation.mutate({ postId: item.id, reason })}
            />

            {/* Intersperse Suggested Connections naturally after the 2nd post */}
            {index === 1 && suggestions.length > 0 && (
              <SuggestedUserSection
                suggestions={suggestions}
                onToggleConnect={(id) => connectMutation.mutate(id)}
              />
            )}
          </View>
        )}
        ListEmptyComponent={
          isFeedLoading ? (
            <View style={styles.centerContainer}>
              <LoadingIndicator size="small" label="Loading campus discussions..." />
            </View>
          ) : feedError ? (
            <View style={styles.centerContainer}>
              <AlertCircle size={24} color={theme.colors.error} />
              <AppText variant="bodySmall" color="error" style={styles.emptyText}>
                Failed to load feed. Pull down to refresh.
              </AppText>
              <AppButton
                title="Retry"
                variant="outline"
                size="sm"
                onPress={() => refetchFeed()}
                style={styles.retryButton}
              />
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <Sparkles size={28} color={theme.colors.maroon} />
              <AppText variant="h3" serif color="primary" align="center" style={styles.emptyTitle}>
                Quiet in This Circle
              </AppText>
              <AppText variant="bodySmall" color="secondary" align="center" style={styles.emptyText}>
                No posts found for this category. Start the dialogue or explore other academic circles.
              </AppText>
              <AppButton
                title="Create a Post"
                variant="primary"
                size="sm"
                onPress={() => router.push('/(tabs)/create')}
                style={styles.createButton}
              />
            </View>
          )
        }
      />

      {/* Fullscreen Story Viewer */}
      <StoryViewer
        visible={activeStoryIndex !== null}
        stories={stories}
        initialIndex={activeStoryIndex ?? 0}
        onClose={() => setActiveStoryIndex(null)}
        onRecordView={(id) => storyViewMutation.mutate(id)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },
  listContent: {
    paddingBottom: theme.spacing.massive,
  },
  headerSections: {
    marginBottom: theme.spacing.sm,
  },
  postItemWrapper: {
    paddingHorizontal: theme.spacing.screenPadding,
  },
  centerContainer: {
    paddingVertical: theme.spacing.massive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    marginHorizontal: theme.spacing.screenPadding,
    marginVertical: theme.spacing.xxxl,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyTitle: {
    marginTop: theme.spacing.md,
    marginBottom: 4,
  },
  emptyText: {
    marginTop: 4,
    maxWidth: 260,
    lineHeight: 18,
  },
  retryButton: {
    marginTop: theme.spacing.md,
  },
  createButton: {
    marginTop: theme.spacing.lg,
  },
});
