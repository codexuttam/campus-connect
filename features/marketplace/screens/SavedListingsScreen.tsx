import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Bookmark, Sparkles } from 'lucide-react-native';
import { ScreenContainer } from '../../../components/common/ScreenContainer';
import { AppHeader } from '../../../components/ui/AppHeader';
import { LoadingIndicator } from '../../../components/ui/LoadingIndicator';
import { AppText } from '../../../components/ui/AppText';
import { AppButton } from '../../../components/ui/AppButton';
import { MarketplaceProductCard } from '../components/MarketplaceProductCard';
import { useSavedListings, useToggleSaveListing } from '../hooks/useMarketplace';
import { MarketplaceListing } from '../types';
import { theme } from '../../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_GAP = 12;
const PADDING = theme.spacing.screenPadding;
const CARD_WIDTH = (SCREEN_WIDTH - PADDING * 2 - COLUMN_GAP) / 2;

export const SavedListingsScreen: React.FC = () => {
  const router = useRouter();

  const {
    data: savedListings = [],
    isLoading,
    isRefetching,
    refetch,
  } = useSavedListings();

  const toggleSaveMutation = useToggleSaveListing();

  const renderItem = ({ item }: { item: MarketplaceListing }) => (
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
      <AppHeader
        title="Saved Listings"
        serifTitle
        borderBottom
        showBack
        onBack={() => router.back()}
      />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <LoadingIndicator size="large" label="Loading saved items..." />
        </View>
      ) : (
        <FlatList
          data={savedListings}
          renderItem={renderItem}
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
                <Bookmark size={36} color={theme.colors.textSecondary} strokeWidth={1.6} />
              </View>
              <AppText variant="h3" serif color="primary" align="center" style={styles.emptyTitle}>
                No saved items yet
              </AppText>
              <AppText variant="bodySmall" color="secondary" align="center" style={styles.emptySub}>
                When you bookmark textbooks, gadgets, or dorm essentials, they will be kept here for quick access.
              </AppText>
              <AppButton
                variant="primary"
                title="Explore Marketplace"
                onPress={() => router.push('/marketplace')}
                size="sm"
              />
            </View>
          }
        />
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
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
    paddingTop: theme.spacing.md,
    paddingBottom: 40,
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
});
