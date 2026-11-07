import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../../components/common/ScreenContainer';
import { AppHeader } from '../../../components/ui/AppHeader';
import { LoadingIndicator } from '../../../components/ui/LoadingIndicator';
import { AppText } from '../../../components/ui/AppText';
import { AppButton } from '../../../components/ui/AppButton';
import { ListingForm } from '../components/ListingForm';
import { useMarketplaceListingDetails, useUpdateListing } from '../hooks/useMarketplace';
import { CreateListingInput } from '../types';
import { useAuthStore } from '../../../store/useAuthStore';
import { theme } from '../../../theme';

export interface EditListingScreenProps {
  id: string;
}

export const EditListingScreen: React.FC<EditListingScreenProps> = ({ id }) => {
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.user);

  const { data: listing, isLoading, error } = useMarketplaceListingDetails(id);
  const updateMutation = useUpdateListing();

  if (isLoading) {
    return (
      <ScreenContainer safeTop padded={false} style={styles.centerContainer}>
        <LoadingIndicator size="large" label="Loading listing for edit..." />
      </ScreenContainer>
    );
  }

  if (error || !listing) {
    return (
      <ScreenContainer safeTop padded={false} style={styles.centerContainer}>
        <AppText variant="h3" serif color="primary" style={{ marginBottom: 8 }}>
          Listing Not Found
        </AppText>
        <AppButton title="Go Back" onPress={() => router.back()} size="sm" />
      </ScreenContainer>
    );
  }

  const isOwner =
    Boolean(currentUser?.id && listing.sellerId === currentUser.id) ||
    listing.sellerId === 'user-local';

  if (!isOwner) {
    return (
      <ScreenContainer safeTop padded={false} style={styles.centerContainer}>
        <AppText variant="h3" serif color="primary" style={{ marginBottom: 8 }}>
          Unauthorized
        </AppText>
        <AppText variant="bodySmall" color="secondary" style={{ marginBottom: 16 }}>
          Only the seller of this listing may edit its details.
        </AppText>
        <AppButton title="Go Back" onPress={() => router.back()} size="sm" />
      </ScreenContainer>
    );
  }

  const initialValues: Partial<CreateListingInput> = {
    title: listing.title,
    description: listing.description,
    category: listing.category,
    listingType: listing.listingType,
    condition: listing.condition,
    price: listing.price,
    exchangeFor: listing.exchangeFor,
    images: listing.images.map((img) => img.imageUrl),
  };

  const handleUpdate = async (values: CreateListingInput) => {
    await updateMutation.mutateAsync({
      id: listing.id,
      data: values,
    });
    router.back();
  };

  return (
    <ScreenContainer safeTop padded={false} style={styles.container}>
      <AppHeader
        title="Edit Listing"
        serifTitle
        borderBottom
        showBack
        onBack={() => router.back()}
      />
      <ListingForm
        initialValues={initialValues}
        onSubmit={handleUpdate}
        isLoading={updateMutation.isPending}
        submitButtonText="Save Changes"
        isEditing
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
});
