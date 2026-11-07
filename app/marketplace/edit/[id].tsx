import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { EditListingScreen } from '../../../features/marketplace/screens/EditListingScreen';

export default function EditListingRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <EditListingScreen id={id || ''} />;
}

