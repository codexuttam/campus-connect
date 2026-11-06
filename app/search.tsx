import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, X, ChevronLeft, SlidersHorizontal, Users, FolderGit2, Compass, FileText, Layers } from 'lucide-react-native';
import { AppHeader } from '../components/ui/AppHeader';
import { AppText } from '../components/ui/AppText';
import { AppBadge } from '../components/ui/AppBadge';
import { IconButton } from '../components/ui/IconButton';
import { LoadingIndicator } from '../components/ui/LoadingIndicator';
import {
  SearchHistory,
  EmptySearchState,
  SearchResultCard,
  ProjectDetailsModal,
  UserProfileModal,
  FilterBottomSheet,
} from '../features/explore/components';
import {
  useGlobalSearch,
  useSearchHistory,
  useAddSearchHistory,
  useClearSearchHistory,
  useToggleConnection,
  useToggleFollow,
  useToggleBookmarkProject,
} from '../features/explore/hooks/useExplore';
import {
  StudentProfile,
  Project,
  Community,
  DiscoveryFilters,
} from '../features/explore/types';
import { Post } from '../features/feed/types';
import { theme } from '../theme';

type SearchCategoryTab = 'all' | 'students' | 'projects' | 'communities' | 'posts';

const RESULT_TABS: { id: SearchCategoryTab; label: string; icon: any }[] = [
  { id: 'all', label: 'All Results', icon: Layers },
  { id: 'students', label: 'People', icon: Users },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'communities', label: 'Communities', icon: Compass },
  { id: 'posts', label: 'Posts', icon: FileText },
];

export default function GlobalSearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [query, setQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<SearchCategoryTab>('all');
  const [isFilterSheetVisible, setIsFilterSheetVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<DiscoveryFilters>({
    selectedSkills: [],
  });

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);

  // Queries
  const {
    data: searchResults,
    isLoading: isSearchLoading,
    error: searchError,
    refetch,
  } = useGlobalSearch(query, activeFilters);

  const { data: searchHistory = [] } = useSearchHistory();

  // Mutations
  const addHistoryMutation = useAddSearchHistory();
  const clearHistoryMutation = useClearSearchHistory();
  const connectMutation = useToggleConnection();
  const followMutation = useToggleFollow();
  const bookmarkMutation = useToggleBookmarkProject();

  const handleSelectTerm = (term: string) => {
    setQuery(term);
    addHistoryMutation.mutate(term);
  };

  const handleSearchSubmit = () => {
    if (query.trim()) {
      addHistoryMutation.mutate(query.trim());
    }
  };

  const hasQuery = Boolean(query.trim());
  const students = searchResults?.students || [];
  const projects = searchResults?.projects || [];
  const communities = searchResults?.communities || [];
  const posts = searchResults?.posts || [];

  const totalResults = searchResults?.totalResults || 0;
  const hasNoResults = hasQuery && !isSearchLoading && totalResults === 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      {/* Top Search Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
        <View style={styles.searchBarRow}>
          <IconButton
            icon={<ChevronLeft size={22} color={theme.colors.textPrimary} />}
            variant="ghost"
            size="sm"
            onPress={() => router.back()}
            accessibilityLabel="Go back"
          />

          <View style={styles.inputWrapper}>
            <Search size={18} color={theme.colors.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="Search students, projects, circles..."
              placeholderTextColor={theme.colors.textMuted}
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
              autoFocus
              autoCorrect={false}
              selectionColor={theme.colors.maroon}
            />
            {query.length > 0 && (
              <Pressable
                onPress={() => setQuery('')}
                hitSlop={8}
                style={styles.clearButton}
                accessibilityLabel="Clear search input"
              >
                <X size={15} color={theme.colors.textMuted} />
              </Pressable>
            )}
          </View>

          <IconButton
            icon={
              <SlidersHorizontal
                size={20}
                color={
                  activeFilters.selectedSkills.length > 0
                    ? theme.colors.maroon
                    : theme.colors.textPrimary
                }
              />
            }
            variant={activeFilters.selectedSkills.length > 0 ? 'maroon' : 'surface'}
            size="sm"
            onPress={() => setIsFilterSheetVisible(true)}
            accessibilityLabel="Filter search"
          />
        </View>

        {/* Category Result Tabs (Visible when user has entered search or browsing) */}
        {hasQuery && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.resultTabsScroll}
          >
            {RESULT_TABS.map((tab) => {
              const isSelected = selectedTab === tab.id;
              const Icon = tab.icon;

              let count = 0;
              if (tab.id === 'all') count = totalResults;
              if (tab.id === 'students') count = students.length;
              if (tab.id === 'projects') count = projects.length;
              if (tab.id === 'communities') count = communities.length;
              if (tab.id === 'posts') count = posts.length;

              return (
                <Pressable
                  key={tab.id}
                  onPress={() => setSelectedTab(tab.id)}
                  style={[
                    styles.resultTabChip,
                    isSelected && styles.resultTabChipSelected,
                  ]}
                >
                  <Icon
                    size={12}
                    color={
                      isSelected
                        ? theme.colors.textInverse
                        : theme.colors.textSecondary
                    }
                  />
                  <AppText
                    variant="caption"
                    style={[
                      styles.resultTabText,
                      isSelected && styles.resultTabTextSelected,
                    ]}
                  >
                    {tab.label} ({count})
                  </AppText>
                </Pressable>
              );
            })}
          </ScrollView>
        )}
      </View>

      {/* Main Content Area */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {!hasQuery ? (
          // When no search entered: Display Search History & Suggested searches
          <SearchHistory
            history={searchHistory}
            onSelectTerm={handleSelectTerm}
            onRemoveTerm={() => {}}
            onClearHistory={() => clearHistoryMutation.mutate()}
          />
        ) : isSearchLoading ? (
          <View style={styles.loadingBox}>
            <LoadingIndicator size="small" label={`Searching campus directory for "${query}"...`} />
          </View>
        ) : searchError ? (
          <EmptySearchState type="error" onRetry={() => refetch()} />
        ) : hasNoResults ? (
          <EmptySearchState
            type="no_results"
            query={query}
            onResetQuery={() => setQuery('')}
          />
        ) : (
          // Categorized Search Results
          <View style={styles.resultsContainer}>
            {/* 1. Students / People */}
            {(selectedTab === 'all' || selectedTab === 'students') &&
              students.length > 0 && (
                <View style={styles.sectionBlock}>
                  <View style={styles.sectionHeader}>
                    <Users size={14} color={theme.colors.maroon} />
                    <AppText variant="captionMedium" color="secondary" style={styles.sectionKicker}>
                      SCHOLARS ({students.length})
                    </AppText>
                  </View>
                  {students.map((student) => (
                    <SearchResultCard
                      key={student.id}
                      type="student"
                      data={student}
                      onPress={() => setSelectedStudent(student)}
                    />
                  ))}
                </View>
              )}

            {/* 2. Projects */}
            {(selectedTab === 'all' || selectedTab === 'projects') &&
              projects.length > 0 && (
                <View style={styles.sectionBlock}>
                  <View style={styles.sectionHeader}>
                    <FolderGit2 size={14} color={theme.colors.olive} />
                    <AppText variant="captionMedium" color="secondary" style={styles.sectionKicker}>
                      PROJECTS ({projects.length})
                    </AppText>
                  </View>
                  {projects.map((proj) => (
                    <SearchResultCard
                      key={proj.id}
                      type="project"
                      data={proj}
                      onPress={() => setSelectedProject(proj)}
                    />
                  ))}
                </View>
              )}

            {/* 3. Communities */}
            {(selectedTab === 'all' || selectedTab === 'communities') &&
              communities.length > 0 && (
                <View style={styles.sectionBlock}>
                  <View style={styles.sectionHeader}>
                    <Compass size={14} color={theme.colors.maroon} />
                    <AppText variant="captionMedium" color="secondary" style={styles.sectionKicker}>
                      COMMUNITIES ({communities.length})
                    </AppText>
                  </View>
                  {communities.map((comm) => (
                    <SearchResultCard
                      key={comm.id}
                      type="community"
                      data={comm}
                      onPress={() => {}}
                    />
                  ))}
                </View>
              )}

            {/* 4. Posts */}
            {(selectedTab === 'all' || selectedTab === 'posts') &&
              posts.length > 0 && (
                <View style={styles.sectionBlock}>
                  <View style={styles.sectionHeader}>
                    <FileText size={14} color={theme.colors.textPrimary} />
                    <AppText variant="captionMedium" color="secondary" style={styles.sectionKicker}>
                      DISCUSSIONS ({posts.length})
                    </AppText>
                  </View>
                  {posts.map((post) => (
                    <SearchResultCard
                      key={post.id}
                      type="post"
                      data={post}
                      onPress={() =>
                        router.push({
                          pathname: '/post/[id]',
                          params: { id: post.id },
                        })
                      }
                    />
                  ))}
                </View>
              )}
          </View>
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderSubtle,
    paddingHorizontal: theme.spacing.screenPadding,
    paddingBottom: theme.spacing.sm,
  },
  searchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.sm,
    height: 42,
  },
  input: {
    flex: 1,
    height: '100%',
    marginLeft: 6,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamilies.sans.regular,
    fontSize: 14,
  },
  clearButton: {
    padding: 4,
  },
  resultTabsScroll: {
    gap: 6,
    paddingTop: theme.spacing.sm,
    alignItems: 'center',
  },
  resultTabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  resultTabChipSelected: {
    backgroundColor: theme.colors.maroon,
    borderColor: theme.colors.maroon,
  },
  resultTabText: {
    color: theme.colors.textSecondary,
    fontSize: 11,
  },
  resultTabTextSelected: {
    color: theme.colors.textInverse,
    fontFamily: theme.fontFamilies.sans.semiBold,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.sm,
  },
  loadingBox: {
    paddingVertical: theme.spacing.huge,
    alignItems: 'center',
  },
  resultsContainer: {
    paddingBottom: theme.spacing.xl,
  },
  sectionBlock: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: theme.spacing.sm,
  },
  sectionKicker: {
    fontSize: 10,
    letterSpacing: theme.letterSpacing.wider,
  },
});
