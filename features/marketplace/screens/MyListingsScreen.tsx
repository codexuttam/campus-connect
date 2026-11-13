import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Tag, Edit3, Trash2, CheckCircle2, RotateCcw, Plus } from 'lucide-react-native';
import { ScreenContainer } from '../../../components/common/ScreenContainer';
import { AppHeader } from '../../../components/ui/AppHeader';
import { LoadingIndicator } from '../../../components/ui/LoadingIndicator';
import { AppText } from '../../../components/ui/AppText';
import { AppButton } from '../../../components/ui/AppButton';
import { AppCard } from '../../../components/ui/AppCard';
import { ProductConditionBadge } from '../components/ProductConditionBadge';
import { ProductStatusBadge } from '../components/ProductStatusBadge';
import {
  useMyListings,
  useMarkListingStatus,
  useDeleteListing,
} from '../hooks/useMarketplace';
import { MarketplaceListing, MarketplaceStatus } from '../types';
import { formatPrice, formatListingDate } from '../utils/formatters';
import { theme } from '../../../theme';
import { showAlert } from '../../../services/dialog';

type MyListingsTab = 'active' | 'sold' | 'draft';

export const MyListingsScreen: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<MyListingsTab>('active');

  const {
    data: listings = [],
    isLoading,
    isRefetching,
    refetch,
  } = useMyListings(activeTab as MarketplaceStatus);

  const markStatusMutation = useMarkListingStatus();
  const deleteMutation = useDeleteListing();

  const handleToggleSold = (listing: MarketplaceListing) => {
    const nextStatus: MarketplaceStatus = listing.status === 'sold' ? 'active' : 'sold';
    markStatusMutation.mutate({ id: listing.id, status: nextStatus });
  };

  const handlePublishDraft = (listing: MarketplaceListing) => {
    markStatusMutation.mutate({ id: listing.id, status: 'active' });
  };

  const handleDelete = (listing: MarketplaceListing) => {
    showAlert(
      'Delete Listing',
      `Are you sure you want to delete "${listing.title}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteMutation.mutate(listing.id),
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: MarketplaceListing }) => {
    const coverUri =
      item.images[0]?.imageUrl ||
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80';

    const formattedPrice = formatPrice(
      item.price,
      item.currency,
      item.listingType,
      item.exchangeFor
    );

    return (
      <AppCard variant="default" padding="sm" style={styles.card}>
        <Pressable
          onPress={() =>
            router.push({
              pathname: '/marketplace/[id]',
              params: { id: item.id },
            })
          }
          style={styles.cardRow}
        >
          <Image source={{ uri: coverUri }} style={styles.image} resizeMode="cover" />

          <View style={styles.cardInfo}>
            <View style={styles.priceRow}>
              <AppText variant="bodyMedium" color="primary" style={styles.priceText}>
                {formattedPrice}
              </AppText>
              <ProductStatusBadge status={item.status} size="sm" />
            </View>

            <AppText variant="bodySmall" color="primary" numberOfLines={2} style={styles.title}>
              {item.title}
            </AppText>

            <View style={styles.metaRow}>
              <ProductConditionBadge condition={item.condition} size="sm" />
              <AppText variant="caption" color="muted">
                {formatListingDate(item.createdAt)}
              </AppText>
              {typeof item.viewsCount === 'number' && (
                <AppText variant="caption" color="muted">
                  {item.viewsCount} views
                </AppText>
              )}
            </View>
          </View>
        </Pressable>

        {/* Action Controls */}
        <View style={styles.cardActions}>
          {item.status === 'draft' ? (
            <Pressable
              onPress={() => handlePublishDraft(item)}
              style={styles.actionBtn}
            >
              <RotateCcw size={14} color={theme.colors.olive} />
              <AppText variant="captionMedium" style={{ color: theme.colors.olive }}>
                Publish
              </AppText>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => handleToggleSold(item)}
              style={styles.actionBtn}
            >
              <CheckCircle2 size={14} color={theme.colors.textSecondary} />
              <AppText variant="captionMedium" color="secondary">
                {item.status === 'sold' ? 'Mark Available' : 'Mark Sold'}
              </AppText>
            </Pressable>
          )}

          <Pressable
            onPress={() =>
              router.push({
                pathname: '/marketplace/edit/[id]',
                params: { id: item.id },
              })
            }
            style={styles.actionBtn}
          >
            <Edit3 size={14} color={theme.colors.textSecondary} />
            <AppText variant="captionMedium" color="secondary">
              Edit
            </AppText>
          </Pressable>

          <Pressable
            onPress={() => handleDelete(item)}
            style={[styles.actionBtn, styles.deleteAction]}
          >
            <Trash2 size={14} color={theme.colors.error} />
            <AppText variant="captionMedium" style={{ color: theme.colors.error }}>
              Delete
            </AppText>
          </Pressable>
        </View>
      </AppCard>
    );
  };

  return (
    <ScreenContainer safeTop padded={false} style={styles.container}>
      <AppHeader
        title="My Listings"
        serifTitle
        borderBottom
        showBack
        onBack={() => router.back()}
        rightAction={
          <Pressable
            onPress={() => router.push('/marketplace/create')}
            style={styles.addBtn}
            accessibilityRole="button"
            accessibilityLabel="New listing"
          >
            <Plus size={20} color={theme.colors.maroon} />
          </Pressable>
        }
      />

      {/* Tabs: Active, Sold, Drafts */}
      <View style={styles.tabsContainer}>
        <Pressable
          onPress={() => setActiveTab('active')}
          style={[styles.tab, activeTab === 'active' && styles.tabActive]}
        >
          <AppText
            variant="buttonSmall"
            style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}
          >
            Active
          </AppText>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('sold')}
          style={[styles.tab, activeTab === 'sold' && styles.tabActive]}
        >
          <AppText
            variant="buttonSmall"
            style={[styles.tabText, activeTab === 'sold' && styles.tabTextActive]}
          >
            Sold
          </AppText>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('draft')}
          style={[styles.tab, activeTab === 'draft' && styles.tabActive]}
        >
          <AppText
            variant="buttonSmall"
            style={[styles.tabText, activeTab === 'draft' && styles.tabTextActive]}
          >
            Drafts
          </AppText>
        </Pressable>
      </View>

      {/* Listings List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <LoadingIndicator size="large" label="Loading your listings..." />
        </View>
      ) : (
        <FlatList
          data={listings}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
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
                <Tag size={32} color={theme.colors.textSecondary} strokeWidth={1.6} />
              </View>
              <AppText variant="h3" serif color="primary" align="center" style={styles.emptyTitle}>
                No {activeTab} listings
              </AppText>
              <AppText variant="bodySmall" color="secondary" align="center" style={styles.emptySub}>
                {activeTab === 'active'
                  ? "You don't have any active listings right now. Declutter your dorm room or sell used books."
                  : activeTab === 'sold'
                  ? 'Items you mark as sold will appear here for record-keeping.'
                  : 'Saved drafts will appear here.'}
              </AppText>
              {activeTab === 'active' && (
                <AppButton
                  variant="primary"
                  title="List an Item"
                  onPress={() => router.push('/marketplace/create')}
                  size="sm"
                />
              )}
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
  addBtn: {
    padding: 6,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.screenPadding,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.borderSubtle,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tabActive: {
    backgroundColor: theme.colors.maroon,
    borderColor: theme.colors.maroon,
  },
  tabText: {
    color: theme.colors.textPrimary,
  },
  tabTextActive: {
    color: '#FBF7EF',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.md,
    paddingBottom: 40,
    gap: 12,
  },
  card: {
    marginBottom: 4,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface,
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceText: {
    fontWeight: '700',
    fontSize: 16,
  },
  title: {
    marginVertical: 4,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.borderSubtle,
    marginTop: 10,
    paddingTop: 8,
    justifyContent: 'flex-end',
    gap: 14,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  deleteAction: {
    marginLeft: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.huge,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
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
