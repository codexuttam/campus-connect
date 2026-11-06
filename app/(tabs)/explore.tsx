import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { LoadingIndicator } from '../../components/ui/LoadingIndicator';
import {
  ExploreHeader,
  CategoryFilter,
  StudentDiscoveryCard,
  ProjectCard,
  CommunityCard,
  DiscoverySection,
  FilterBottomSheet,
  ProjectDetailsModal,
  UserProfileModal,
} from '../../features/explore/components';
import { PostCard } from '../../features/feed/components/PostCard';
import {
  useTrendingProjects,
  useRecommendedStudents,
  usePopularCommunities,
  useCampusHighlights,
  useToggleConnection,
  useToggleFollow,
  useToggleBookmarkProject,
  useToggleCommunityMembership,
} from '../../features/explore/hooks/useExplore';
import {
  useLikePost,
  useSavePost,
  useDeletePost,
  useReportPost,
} from '../../features/feed/hooks/useFeed';
import {
  ExploreCategory,
  DiscoveryFilters,
  Project,
  StudentProfile,
} from '../../features/explore/types';
import { theme } from '../../theme';

export default function ExploreScreen() {
  const router = useRouter();

  // State
  const [selectedCategory, setSelectedCategory] = useState<ExploreCategory>('all');
  const [isFilterSheetVisible, setIsFilterSheetVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<DiscoveryFilters>({
    selectedSkills: [],
  });

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);

  // Queries
  const {
    data: projects = [],
    isLoading: isProjectsLoading,
    refetch: refetchProjects,
  } = useTrendingProjects(activeFilters);

  const {
    data: students = [],
    isLoading: isStudentsLoading,
    refetch: refetchStudents,
  } = useRecommendedStudents(activeFilters);

  const {
    data: communities = [],
    isLoading: isCommunitiesLoading,
    refetch: refetchCommunities,
  } = usePopularCommunities(activeFilters);

  const { data: highlights = [], refetch: refetchHighlights } = useCampusHighlights();

  // Mutations
  const connectMutation = useToggleConnection();
  const followMutation = useToggleFollow();
  const bookmarkMutation = useToggleBookmarkProject();
  const communityMutation = useToggleCommunityMembership();

  const likePostMutation = useLikePost();
  const savePostMutation = useSavePost();
  const deletePostMutation = useDeletePost();
  const reportPostMutation = useReportPost();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      refetchProjects(),
      refetchStudents(),
      refetchCommunities(),
      refetchHighlights(),
    ]);
    setIsRefreshing(false);
  };

  const hasActiveFilters =
    activeFilters.selectedSkills.length > 0 ||
    Boolean(activeFilters.branch) ||
    Boolean(activeFilters.graduationYear) ||
    Boolean(activeFilters.onlySeekingTeammates) ||
    Boolean(activeFilters.onlyOfficialSocieties);

  const showProjects = selectedCategory === 'all' || selectedCategory === 'projects';
  const showPeople = selectedCategory === 'all' || selectedCategory === 'people';
  const showCommunities = selectedCategory === 'all' || selectedCategory === 'communities';
  const showHighlights = selectedCategory === 'all';

  return (
    <ScreenContainer safeTop padded={false} style={styles.container}>
      {/* Header with Title, Search Bar Trigger, & Filter Icon */}
      <ExploreHeader
        onSearchPress={() => router.push('/search')}
        onFilterPress={() => setIsFilterSheetVisible(true)}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Horizontally Scrollable Category Pills */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.maroon}
            colors={[theme.colors.maroon]}
          />
        }
      >
        {/* Section A: Trending Projects */}
        {showProjects && (
          <DiscoverySection
            title="Trending Projects"
            kicker="INNOVATION & RESEARCH"
            subtitle="Student initiatives, startups & laboratory projects"
            onViewAll={() => setSelectedCategory('projects')}
          >
            {isProjectsLoading ? (
              <LoadingIndicator size="small" label="Loading student projects..." />
            ) : selectedCategory === 'projects' ? (
              // Vertical list when filtered to projects
              <View style={styles.verticalList}>
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onPress={() => setSelectedProject(project)}
                    onBookmark={() => bookmarkMutation.mutate(project.id)}
                  />
                ))}
              </View>
            ) : (
              // Horizontal carousel on 'all'
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onPress={() => setSelectedProject(project)}
                    onBookmark={() => bookmarkMutation.mutate(project.id)}
                    compact
                  />
                ))}
              </ScrollView>
            )}
          </DiscoverySection>
        )}

        {/* Section B: People to Discover */}
        {showPeople && (
          <DiscoverySection
            title="People to Discover"
            kicker="SCHOLAR NETWORK"
            subtitle="Connect with peers sharing your research & skills"
            onViewAll={() => setSelectedCategory('people')}
          >
            {isStudentsLoading ? (
              <LoadingIndicator size="small" label="Finding scholars..." />
            ) : selectedCategory === 'people' ? (
              // Vertical list when filtered to people
              <View style={styles.verticalList}>
                {students.map((student) => (
                  <StudentDiscoveryCard
                    key={student.id}
                    student={student}
                    onPress={() => setSelectedStudent(student)}
                    onToggleConnect={() => connectMutation.mutate(student.id)}
                    onToggleFollow={() => followMutation.mutate(student.id)}
                  />
                ))}
              </View>
            ) : (
              // Horizontal carousel on 'all'
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {students.map((student) => (
                  <StudentDiscoveryCard
                    key={student.id}
                    student={student}
                    onPress={() => setSelectedStudent(student)}
                    onToggleConnect={() => connectMutation.mutate(student.id)}
                    onToggleFollow={() => followMutation.mutate(student.id)}
                    compact
                  />
                ))}
              </ScrollView>
            )}
          </DiscoverySection>
        )}

        {/* Section C: Popular Communities */}
        {showCommunities && (
          <DiscoverySection
            title="Popular Communities"
            kicker="STUDENT SOCIETIES & GUILDS"
            subtitle="Official college unions, sports & special interest circles"
            onViewAll={() => setSelectedCategory('communities')}
          >
            {isCommunitiesLoading ? (
              <LoadingIndicator size="small" label="Loading communities..." />
            ) : selectedCategory === 'communities' ? (
              // Vertical list when filtered to communities
              <View style={styles.verticalList}>
                {communities.map((community) => (
                  <CommunityCard
                    key={community.id}
                    community={community}
                    onPress={() => {}}
                    onToggleJoin={() => communityMutation.mutate(community.id)}
                  />
                ))}
              </View>
            ) : (
              // Horizontal carousel on 'all'
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {communities.map((community) => (
                  <CommunityCard
                    key={community.id}
                    community={community}
                    onPress={() => {}}
                    onToggleJoin={() => communityMutation.mutate(community.id)}
                    compact
                  />
                ))}
              </ScrollView>
            )}
          </DiscoverySection>
        )}

        {/* Section D: Campus Highlights (reusing Post components) */}
        {showHighlights && highlights.length > 0 && (
          <DiscoverySection
            title="Campus Highlights"
            kicker="ACTIVE DISCUSSIONS"
            subtitle="Engaging scholarly threads and campus bulletins"
          >
            <View style={styles.verticalList}>
              {highlights.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onPress={() =>
                    router.push({
                      pathname: '/post/[id]',
                      params: { id: post.id },
                    })
                  }
                  onLike={() => likePostMutation.mutate(post.id)}
                  onSave={() => savePostMutation.mutate(post.id)}
                  onDelete={() => deletePostMutation.mutate(post.id)}
                  onReport={(reason) =>
                    reportPostMutation.mutate({ postId: post.id, reason })
                  }
                />
              ))}
            </View>
          </DiscoverySection>
        )}
      </ScrollView>

      {/* Filter Bottom Sheet */}
      <FilterBottomSheet
        visible={isFilterSheetVisible}
        filters={activeFilters}
        onApply={(f) => setActiveFilters(f)}
        onReset={() => setActiveFilters({ selectedSkills: [] })}
        onClose={() => setIsFilterSheetVisible(false)}
      />

      {/* Project Details Modal */}
      <ProjectDetailsModal
        project={selectedProject}
        visible={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
        onBookmark={() => {
          if (selectedProject) {
            bookmarkMutation.mutate(selectedProject.id);
            setSelectedProject({
              ...selectedProject,
              isBookmarked: !selectedProject.isBookmarked,
            });
          }
        }}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        student={selectedStudent}
        visible={selectedStudent !== null}
        onClose={() => setSelectedStudent(null)}
        onToggleConnect={() => {
          if (selectedStudent) {
            connectMutation.mutate(selectedStudent.id);
            const current = selectedStudent.connectionStatus;
            setSelectedStudent({
              ...selectedStudent,
              connectionStatus:
                current === 'none'
                  ? 'pending'
                  : current === 'pending'
                  ? 'connected'
                  : 'none',
            });
          }
        }}
        onToggleFollow={() => {
          if (selectedStudent) {
            followMutation.mutate(selectedStudent.id);
            setSelectedStudent({
              ...selectedStudent,
              isFollowing: !selectedStudent.isFollowing,
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.massive,
  },
  horizontalScroll: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingBottom: theme.spacing.xs,
  },
  verticalList: {
    paddingHorizontal: theme.spacing.screenPadding,
  },
});
