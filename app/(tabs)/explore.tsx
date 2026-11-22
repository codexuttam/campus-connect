import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ShoppingBag, FolderGit2, Users, Compass as CompassIcon } from 'lucide-react-native';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { LoadingIndicator } from '../../components/ui/LoadingIndicator';
import { AppText } from '../../components/ui/AppText';
import { AppButton } from '../../components/ui/AppButton';
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
  CommunityDetailsModal,
} from '../../features/explore/components';
import { PostCard } from '../../features/feed/components/PostCard';
import { MarketplaceProductCard } from '../../features/marketplace/components/MarketplaceProductCard';
import {
  useMarketplaceListings,
  useToggleSaveListing as useToggleSaveMarketplaceListing,
} from '../../features/marketplace/hooks/useMarketplace';
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
  Community,
} from '../../features/explore/types';
import { theme } from '../../theme';

export default function ExploreScreen() {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const gridCardWidth = Math.max(135, (screenWidth - theme.spacing.screenPadding * 2 - 12) / 2);

  // State
  const [selectedCategory, setSelectedCategory] = useState<ExploreCategory>('all');
  const [isFilterSheetVisible, setIsFilterSheetVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<DiscoveryFilters>({
    selectedSkills: [],
  });

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);

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

  const {
    data: marketplaceListings = [],
    isLoading: isMarketplaceLoading,
    refetch: refetchMarketplace,
  } = useMarketplaceListings({ sortBy: 'newest' });

  // Mutations
  const connectMutation = useToggleConnection();
  const followMutation = useToggleFollow();
  const bookmarkMutation = useToggleBookmarkProject();
  const communityMutation = useToggleCommunityMembership();
  const saveMarketplaceMutation = useToggleSaveMarketplaceListing();

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
      refetchMarketplace(),
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
        {/* Quick Campus Index Bento Row (Read.cv / Are.na style) */}
        {selectedCategory === 'all' && (
          <View style={styles.bentoGrid}>
            <Pressable
              onPress={() => router.push('/marketplace')}
              style={styles.bentoCard}
            >
              <View style={[styles.bentoIconWrap, { backgroundColor: theme.colors.maroonLight }]}>
                <ShoppingBag size={15} color={theme.colors.maroon} />
              </View>
              <View>
                <AppText variant="bodySmallMedium" color="primary">
                  Marketplace
                </AppText>
                <AppText variant="caption" color="secondary">
                  {marketplaceListings.length} campus listings
                </AppText>
              </View>
            </Pressable>

            <Pressable
              onPress={() => setSelectedCategory('projects')}
              style={styles.bentoCard}
            >
              <View style={[styles.bentoIconWrap, { backgroundColor: theme.colors.oliveLight }]}>
                <FolderGit2 size={15} color={theme.colors.olive} />
              </View>
              <View>
                <AppText variant="bodySmallMedium" color="primary">
                  Projects
                </AppText>
                <AppText variant="caption" color="secondary">
                  {projects.length} open labs
                </AppText>
              </View>
            </Pressable>

            <Pressable
              onPress={() => setSelectedCategory('people')}
              style={styles.bentoCard}
            >
              <View style={[styles.bentoIconWrap, { backgroundColor: theme.colors.surface }]}>
                <Users size={15} color={theme.colors.textPrimary} />
              </View>
              <View>
                <AppText variant="bodySmallMedium" color="primary">
                  Scholars
                </AppText>
                <AppText variant="caption" color="secondary">
                  {students.length} verified peers
                </AppText>
              </View>
            </Pressable>

            <Pressable
              onPress={() => setSelectedCategory('communities')}
              style={styles.bentoCard}
            >
              <View style={[styles.bentoIconWrap, { backgroundColor: theme.colors.surface }]}>
                <CompassIcon size={15} color={theme.colors.maroon} />
              </View>
              <View>
                <AppText variant="bodySmallMedium" color="primary">
                  Societies
                </AppText>
                <AppText variant="caption" color="secondary">
                  {communities.length} active clubs
                </AppText>
              </View>
            </Pressable>
          </View>
        )}

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
                    onPress={() => setSelectedCommunity(community)}
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
                    onPress={() => setSelectedCommunity(community)}
                    onToggleJoin={() => communityMutation.mutate(community.id)}
                    compact
                  />
                ))}
              </ScrollView>
            )}
          </DiscoverySection>
        )}

        {/* Section: Campus Marketplace */}
        {(selectedCategory === 'all' || selectedCategory === 'marketplace') && (
          <DiscoverySection
            title="Campus Marketplace"
            kicker="PEER-TO-PEER COMMERCE"
            subtitle="Textbooks, tech, dorm essentials & free student items"
            onViewAll={() => router.push('/marketplace')}
          >
            {isMarketplaceLoading ? (
              <LoadingIndicator size="small" label="Loading campus items..." />
            ) : selectedCategory === 'marketplace' ? (
              <View style={styles.verticalList}>
                <View style={styles.marketplaceQuickRow}>
                  <AppButton
                    variant="outline"
                    title="Full Marketplace & Filters"
                    size="sm"
                    onPress={() => router.push('/marketplace')}
                    style={{ flex: 1 }}
                  />
                  <AppButton
                    variant="primary"
                    title="+ Sell an Item"
                    size="sm"
                    onPress={() => router.push('/marketplace/create')}
                    style={{ flex: 1 }}
                  />
                </View>

                <View style={styles.marketplaceGrid}>
                  {marketplaceListings.map((item) => (
                    <MarketplaceProductCard
                      key={item.id}
                      listing={item}
                      width={gridCardWidth}
                      onPress={() =>
                        router.push({
                          pathname: '/marketplace/[id]',
                          params: { id: item.id },
                        })
                      }
                      onToggleSave={() => saveMarketplaceMutation.mutate(item.id)}
                    />
                  ))}
                </View>
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {marketplaceListings.slice(0, 6).map((item) => (
                  <View key={item.id} style={{ width: 156, marginRight: 12 }}>
                    <MarketplaceProductCard
                      listing={item}
                      onPress={() =>
                        router.push({
                          pathname: '/marketplace/[id]',
                          params: { id: item.id },
                        })
                      }
                      onToggleSave={() => saveMarketplaceMutation.mutate(item.id)}
                    />
                  </View>
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

      {/* Community Details Modal */}
      <CommunityDetailsModal
        community={selectedCommunity}
        visible={selectedCommunity !== null}
        onClose={() => setSelectedCommunity(null)}
        onToggleJoin={() => {
          if (selectedCommunity) {
            communityMutation.mutate(selectedCommunity.id);
            const nextJoined = !selectedCommunity.isJoined;
            setSelectedCommunity({
              ...selectedCommunity,
              isJoined: nextJoined,
              memberCount: Math.max(
                0,
                selectedCommunity.memberCount + (nextJoined ? 1 : -1)
              ),
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
  bentoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.sm,
    rowGap: 10,
  },
  bentoCard: {
    width: '48.5%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  bentoIconWrap: {
    width: 32,
    height: 32,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontalScroll: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingBottom: theme.spacing.xs,
  },
  verticalList: {
    paddingHorizontal: theme.spacing.screenPadding,
  },
  marketplaceQuickRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: theme.spacing.md,
  },
  marketplaceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
