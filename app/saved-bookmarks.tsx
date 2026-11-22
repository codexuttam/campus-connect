import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Bookmark, FolderGit2, FileText } from 'lucide-react-native';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { AppHeader } from '../components/ui/AppHeader';
import { AppText } from '../components/ui/AppText';
import { AppCard } from '../components/ui/AppCard';
import { AppButton } from '../components/ui/AppButton';
import { PostCard } from '../features/feed/components/PostCard';
import { ProjectCard } from '../features/explore/components/ProjectCard';
import { ProjectDetailsModal } from '../features/explore/components/ProjectDetailsModal';
import {
  useCampusFeed,
  useLikePost,
  useSavePost,
  useDeletePost,
  useReportPost,
} from '../features/feed/hooks/useFeed';
import {
  useTrendingProjects,
  useToggleBookmarkProject,
} from '../features/explore/hooks/useExplore';
import { Project } from '../features/explore/types';
import { theme } from '../theme';

type BookmarksTab = 'posts' | 'projects';

export default function SavedBookmarksScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<BookmarksTab>('posts');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const { data: feedData } = useCampusFeed({ filter: 'for-you', category: 'all' });
  const { data: projects = [] } = useTrendingProjects();

  const likeMutation = useLikePost();
  const savePostMutation = useSavePost();
  const deleteMutation = useDeletePost();
  const reportMutation = useReportPost();
  const bookmarkProjectMutation = useToggleBookmarkProject();

  const savedPosts = (feedData?.posts || []).filter((p) => p.isSaved);
  const bookmarkedProjects = projects.filter((p) => p.isBookmarked);

  return (
    <ScreenContainer scrollable safeTop padded={false} style={styles.container}>
      <AppHeader
        title="Saved Bookmarks"
        serifTitle
        showBack
        onBack={() => router.back()}
        borderBottom={false}
      />

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <Pressable
          onPress={() => setActiveTab('posts')}
          style={[styles.tabPill, activeTab === 'posts' && styles.tabPillActive]}
        >
          <FileText
            size={13}
            color={activeTab === 'posts' ? '#FBF7EF' : theme.colors.textPrimary}
          />
          <AppText
            variant="captionMedium"
            style={activeTab === 'posts' ? styles.tabTextActive : styles.tabText}
          >
            Discussions ({savedPosts.length})
          </AppText>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('projects')}
          style={[styles.tabPill, activeTab === 'projects' && styles.tabPillActive]}
        >
          <FolderGit2
            size={13}
            color={activeTab === 'projects' ? '#FBF7EF' : theme.colors.textPrimary}
          />
          <AppText
            variant="captionMedium"
            style={activeTab === 'projects' ? styles.tabTextActive : styles.tabText}
          >
            Projects ({bookmarkedProjects.length})
          </AppText>
        </Pressable>
      </View>

      <View style={styles.content}>
        {activeTab === 'posts' ? (
          savedPosts.length === 0 ? (
            <AppCard variant="surface" padding="lg" style={styles.emptyCard}>
              <Bookmark size={28} color={theme.colors.textMuted} />
              <AppText variant="h3" serif color="primary" style={styles.emptyTitle}>
                No saved discussions
              </AppText>
              <AppText variant="bodySmall" color="secondary" align="center" style={styles.emptySub}>
                Bookmark interesting campus threads from the Home feed to revisit them here.
              </AppText>
              <AppButton
                title="Browse Home Feed"
                variant="primary"
                size="sm"
                onPress={() => router.push('/(tabs)')}
              />
            </AppCard>
          ) : (
            savedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onPress={() =>
                  router.push({ pathname: '/post/[id]', params: { id: post.id } })
                }
                onLike={() => likeMutation.mutate(post.id)}
                onSave={() => savePostMutation.mutate(post.id)}
                onDelete={() => deleteMutation.mutate(post.id)}
                onReport={(reason) => reportMutation.mutate({ postId: post.id, reason })}
              />
            ))
          )
        ) : bookmarkedProjects.length === 0 ? (
          <AppCard variant="surface" padding="lg" style={styles.emptyCard}>
            <FolderGit2 size={28} color={theme.colors.textMuted} />
            <AppText variant="h3" serif color="primary" style={styles.emptyTitle}>
              No bookmarked projects
            </AppText>
            <AppText variant="bodySmall" color="secondary" align="center" style={styles.emptySub}>
              Save student labs and startup projects in Explore to track collaborations.
            </AppText>
            <AppButton
              title="Explore Projects"
              variant="primary"
              size="sm"
              onPress={() => router.push('/(tabs)/explore')}
            />
          </AppCard>
        ) : (
          bookmarkedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onPress={() => setSelectedProject(project)}
              onBookmark={() => bookmarkProjectMutation.mutate(project.id)}
            />
          ))
        )}
      </View>

      <ProjectDetailsModal
        project={selectedProject}
        visible={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
        onBookmark={() => {
          if (selectedProject) {
            bookmarkProjectMutation.mutate(selectedProject.id);
            setSelectedProject({
              ...selectedProject,
              isBookmarked: !selectedProject.isBookmarked,
            });
          }
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.md,
  },
  tabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tabPillActive: {
    backgroundColor: theme.colors.maroon,
    borderColor: theme.colors.maroon,
  },
  tabText: {
    color: theme.colors.textPrimary,
  },
  tabTextActive: {
    color: '#FBF7EF',
  },
  content: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingBottom: theme.spacing.huge,
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyTitle: {
    marginTop: 10,
    marginBottom: 4,
  },
  emptySub: {
    maxWidth: 270,
    lineHeight: 18,
    marginBottom: theme.spacing.md,
  },
});
