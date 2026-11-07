import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ProductDetailsScreen } from '../../features/marketplace/screens/ProductDetailsScreen';

export default function ProductDetailsRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <ProductDetailsScreen id={id || ''} />;
}

