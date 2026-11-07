import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../../components/common/ScreenContainer';
import { AppHeader } from '../../../components/ui/AppHeader';
import { ListingForm } from '../components/ListingForm';
import { useCreateListing } from '../hooks/useMarketplace';
import { CreateListingInput } from '../types';
import { theme } from '../../../theme';

export const CreateListingScreen: React.FC = () => {
  const router = useRouter();
  const createMutation = useCreateListing();

  const handlePublish = async (values: CreateListingInput) => {
    const created = await createMutation.mutateAsync(values);
    if (created.status === 'draft') {
      router.replace('/marketplace/my-listings');
    } else {
      router.replace({
        pathname: '/marketplace/[id]',
        params: { id: created.id },
      });
    }
  };

  return (
    <ScreenContainer safeTop padded={false} style={styles.container}>
      <AppHeader
        title="Sell an Item"
        serifTitle
        borderBottom
        showBack
        onBack={() => router.back()}
      />
      <ListingForm
        onSubmit={handlePublish}
        isLoading={createMutation.isPending}
        submitButtonText="Publish to Campus"
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
});
