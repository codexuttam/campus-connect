import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Pressable,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, PackageOpen, Plus, Tag } from 'lucide-react-native';
import { ScreenContainer } from '../../../components/common/ScreenContainer';
import { LoadingIndicator } from '../../../components/ui/LoadingIndicator';
import { AppText } from '../../../components/ui/AppText';
import { AppButton } from '../../../components/ui/AppButton';
import {
  MarketplaceHeader,
  MarketplaceSearchBar,
  MarketplaceCategoryChips,
  MarketplaceProductCard,
  MarketplaceFilterSheet,
} from '../components';
import {
  useMarketplaceListings,
  useSavedListings,
  useToggleSaveListing,
  useDebounce,
} from '../hooks/useMarketplace';
import {
  MarketplaceCategory,
  MarketplaceFilters,
  MarketplaceListing,
} from '../types';
import { theme } from '../../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_GAP = 12;
const PADDING = theme.spacing.screenPadding;
const CARD_WIDTH = (SCREEN_WIDTH - PADDING * 2 - COLUMN_GAP) / 2;

type SectionTab = 'recent' | 'recommended' | 'free';

export const MarketplaceHomeScreen: React.FC = () => {
  const router = useRouter();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MarketplaceCategory>('all');
  const [activeTab, setActiveTab] = useState<SectionTab>('recent');
  const [isFilterSheetVisible, setIsFilterSheetVisible] = useState(false);
  const [filters, setFilters] = useState<MarketplaceFilters>({
    sortBy: 'newest',
  });

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Compute combined filter query
  const effectiveFilters: MarketplaceFilters = useMemo(() => {
    const combined: MarketplaceFilters = {
      ...filters,
      query: debouncedSearch,
      category: activeTab === 'free' ? 'free_items' : selectedCategory,
    };
    return combined;
  }, [filters, debouncedSearch, selectedCategory, activeTab]);

  // Queries & Mutations
  const {
    data: listings = [],
    isLoading,
    isRefetching,
    refetch,
  } = useMarketplaceListings(effectiveFilters);

  const { data: savedListings = [] } = useSavedListings();
  const toggleSaveMutation = useToggleSaveListing();

  // Filter listings based on active tab if no explicit search is overriding
  const displayedListings = useMemo(() => {
    if (debouncedSearch.trim().length > 0) {
      return listings;
    }
    if (activeTab === 'recommended') {
      // Prioritize high-view or like-new items from verified students
      return [...listings].sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));
    }
    if (activeTab === 'free') {
      return listings.filter((l) => l.listingType === 'free' || l.price === 0);
    }
    return listings;
  }, [listings, activeTab, debouncedSearch]);

  const hasActiveAdvancedFilters =
    Boolean(filters.minPrice) ||
    Boolean(filters.maxPrice) ||
    Boolean(filters.condition) ||
    Boolean(filters.listingType) ||
    filters.sortBy !== 'newest';

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setActiveTab('recent');
    setFilters({ sortBy: 'newest' });
  };

  const renderProductItem = ({ item }: { item: MarketplaceListing }) => (
    <MarketplaceProductCard
      listing={item}
      width={CARD_WIDTH}
      onPress={() =>
        router.push({
          pathname: '/marketplace/[id]',
          params: { id: item.id },
        })
      }
      onToggleSave={() => toggleSaveMutation.mutate(item.id)}
    />
  );

  return (
    <ScreenContainer safeTop padded={false} style={styles.container}>
      {/* Marketplace Header */}
      <MarketplaceHeader
        savedCount={savedListings.length}
        showBack={false}
      />

      {/* Search Bar with Filter Sheet Trigger */}
      <MarketplaceSearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={() => setSearchQuery('')}
        onFilterPress={() => setIsFilterSheetVisible(true)}
        hasActiveFilters={hasActiveAdvancedFilters}
      />

      {/* Horizontal Category Chips */}
      <MarketplaceCategoryChips
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          if (cat === 'free_items') {
            setActiveTab('free');
          }
        }}
      />

      {/* Progressive Disclosure Section Pills (Recent, Recommended, Free Items) */}
      <View style={styles.sectionTabsWrapper}>
        <View style={styles.sectionTabs}>
          <Pressable
            onPress={() => setActiveTab('recent')}
            style={[styles.sectionTab, activeTab === 'recent' && styles.sectionTabActive]}
          >
            <AppText
              variant="captionMedium"
              style={[styles.sectionTabText, activeTab === 'recent' && styles.sectionTabTextActive]}
            >
              Recent Listings
            </AppText>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab('recommended')}
            style={[styles.sectionTab, activeTab === 'recommended' && styles.sectionTabActive]}
          >
            <AppText
              variant="captionMedium"
              style={[styles.sectionTabText, activeTab === 'recommended' && styles.sectionTabTextActive]}
            >
              Recommended
            </AppText>
          </Pressable>

          <Pressable
            onPress={() => {
              setActiveTab('free');
              setSelectedCategory('free_items');
            }}
            style={[styles.sectionTab, activeTab === 'free' && styles.sectionTabActive]}
          >
            <AppText
              variant="captionMedium"
              style={[styles.sectionTabText, activeTab === 'free' && styles.sectionTabTextActive]}
            >
              Free Items
            </AppText>
          </Pressable>
        </View>
      </View>

      {/* Two-Column Responsive Virtualized Grid */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <LoadingIndicator size="large" label="Browsing campus marketplace..." />
        </View>
      ) : (
        <FlatList
          data={displayedListings}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => {
                refetch();
              }}
              tintColor={theme.colors.maroon}
              colors={[theme.colors.maroon]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <PackageOpen size={36} color={theme.colors.textSecondary} strokeWidth={1.5} />
              </View>
              <AppText variant="h3" serif color="primary" align="center" style={styles.emptyTitle}>
                No listings found
              </AppText>
              <AppText variant="bodySmall" color="secondary" align="center" style={styles.emptySub}>
                {searchQuery
                  ? `No campus products match "${searchQuery}". Try a broader term or reset filters.`
                  : 'There are currently no listings in this category. Be the first to list an item!'}
              </AppText>
              <View style={styles.emptyActions}>
                {(searchQuery || selectedCategory !== 'all' || hasActiveAdvancedFilters) && (
                  <AppButton
                    variant="outline"
                    title="Reset All Filters"
                    onPress={handleClearFilters}
                    size="sm"
                  />
                )}
                <AppButton
                  variant="primary"
                  title="List an Item"
                  onPress={() => router.push('/marketplace/create')}
                  size="sm"
                />
              </View>
            </View>
          }
        />
      )}

      {/* Filter Bottom Sheet Modal */}
      <MarketplaceFilterSheet
        visible={isFilterSheetVisible}
        filters={filters}
        onApply={(newFilters) => setFilters(newFilters)}
        onReset={() => setFilters({ sortBy: 'newest' })}
        onClose={() => setIsFilterSheetVisible(false)}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  sectionTabsWrapper: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingVertical: 8,
    backgroundColor: theme.colors.background,
  },
  sectionTabs: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.sm,
    padding: 3,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sectionTab: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.xs,
  },
  sectionTabActive: {
    backgroundColor: theme.colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  sectionTabText: {
    color: theme.colors.textSecondary,
    fontSize: 11,
  },
  sectionTabTextActive: {
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.screenPadding,
    gap: COLUMN_GAP,
  },
  listContent: {
    paddingTop: theme.spacing.sm,
    paddingBottom: 60,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.huge,
  },
  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  emptyTitle: {
    marginBottom: 6,
  },
  emptySub: {
    maxWidth: 290,
    lineHeight: 18,
    marginBottom: theme.spacing.lg,
  },
  emptyActions: {
    flexDirection: 'row',
    gap: 10,
  },
});
