import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useFocusEffect } from 'expo-router';
import { Sparkles, AlertCircle, PenSquare, ShoppingBag } from 'lucide-react-native';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { AppText } from '../../components/ui/AppText';
import { AppAvatar } from '../../components/ui/AppAvatar';
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
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem('campusconnect.notifications.v1')
        .then((raw) => {
          if (!raw) {
            setHasUnreadNotifications(true);
            return;
          }
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setHasUnreadNotifications(parsed.some((n) => !n.isRead));
          }
        })
        .catch(() => {});
    }, [])
  );

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
        onMarketplacePress={() => router.push('/marketplace')}
        hasUnreadNotifications={hasUnreadNotifications}
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

            {/* 2.5 Quick Inline Campus Composer Prompt (Substack / Threads style) */}
            <View style={styles.composerCard}>
              <Pressable
                onPress={() => router.push('/(tabs)/create')}
                style={styles.composerTopRow}
              >
                <AppAvatar name={user?.fullName || 'Julian Vance'} size="sm" />
                <View style={styles.composerPromptBox}>
                  <AppText variant="bodySmall" color="muted">
                    Share a research note, question, or campus update...
                  </AppText>
                </View>
              </Pressable>
              <View style={styles.composerActionsRow}>
                <Pressable
                  onPress={() => router.push('/(tabs)/create')}
                  style={styles.composerChip}
                >
                  <PenSquare size={13} color={theme.colors.maroon} />
                  <AppText variant="captionMedium" color="primary">
                    Post Note
                  </AppText>
                </Pressable>
                <Pressable
                  onPress={() => router.push('/marketplace/create')}
                  style={styles.composerChip}
                >
                  <ShoppingBag size={13} color={theme.colors.olive} />
                  <AppText variant="captionMedium" color="primary">
                    Sell or Swap Item
                  </AppText>
                </Pressable>
              </View>
            </View>

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
  composerCard: {
    marginHorizontal: theme.spacing.screenPadding,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 12,
    gap: 10,
  },
  composerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  composerPromptBox: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  composerActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 2,
  },
  composerChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
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
