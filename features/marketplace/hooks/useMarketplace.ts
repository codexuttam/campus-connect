import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { marketplaceApi } from '../services/marketplaceApi';
import {
  MarketplaceFilters,
  CreateListingInput,
  UpdateListingInput,
  CreateReportInput,
  MarketplaceStatus,
} from '../types';
import { useAuthStore } from '../../../store/useAuthStore';

export const MARKETPLACE_QUERY_KEYS = {
  all: ['marketplace'] as const,
  listings: (filters?: MarketplaceFilters) => ['marketplace', 'listings', filters] as const,
  details: (id: string) => ['marketplace', 'detail', id] as const,
  saved: () => ['marketplace', 'saved'] as const,
  myListings: (status?: MarketplaceStatus) => ['marketplace', 'my', status] as const,
};

export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useMarketplaceListings(filters?: MarketplaceFilters) {
  return useQuery({
    queryKey: MARKETPLACE_QUERY_KEYS.listings(filters),
    queryFn: () => marketplaceApi.fetchListings(filters),
  });
}

export function useMarketplaceListingDetails(id?: string) {
  return useQuery({
    queryKey: MARKETPLACE_QUERY_KEYS.details(id || ''),
    queryFn: () => marketplaceApi.fetchListingDetails(id!),
    enabled: Boolean(id),
  });
}

export function useSavedListings() {
  return useQuery({
    queryKey: MARKETPLACE_QUERY_KEYS.saved(),
    queryFn: () => marketplaceApi.fetchSavedListings(),
  });
}

export function useMyListings(status?: MarketplaceStatus) {
  const user = useAuthStore((s) => s.user);
  const userId = user?.id || 'user-local';

  return useQuery({
    queryKey: MARKETPLACE_QUERY_KEYS.myListings(status),
    queryFn: () => marketplaceApi.fetchMyListings(userId, status),
  });
}

export function useToggleSaveListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => marketplaceApi.toggleSaveListing(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: MARKETPLACE_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: MARKETPLACE_QUERY_KEYS.details(id) });
      queryClient.invalidateQueries({ queryKey: MARKETPLACE_QUERY_KEYS.saved() });
    },
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: (input: CreateListingInput) => {
      const fallbackUser = {
        id: 'user-local',
        email: 'student@ox.ac.uk',
        fullName: 'Julian Thorne',
        collegeId: 'oxford',
        collegeName: 'University of Oxford',
        courseOrBranch: 'Biochemistry',
        graduationYear: '2026',
        collegeVerificationStatus: 'verified' as const,
        authStatus: 'fully_onboarded' as const,
        createdAt: new Date().toISOString(),
      };
      return marketplaceApi.createListing(input, user || fallbackUser);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MARKETPLACE_QUERY_KEYS.all });
    },
  });
}

export function useUpdateListing() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const userId = user?.id || 'user-local';

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateListingInput }) =>
      marketplaceApi.updateListing(id, data, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: MARKETPLACE_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: MARKETPLACE_QUERY_KEYS.details(variables.id) });
    },
  });
}

export function useDeleteListing() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const userId = user?.id || 'user-local';

  return useMutation({
    mutationFn: (id: string) => marketplaceApi.deleteListing(id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MARKETPLACE_QUERY_KEYS.all });
    },
  });
}

export function useMarkListingStatus() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const userId = user?.id || 'user-local';

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: MarketplaceStatus }) =>
      marketplaceApi.markListingStatus(id, status, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: MARKETPLACE_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: MARKETPLACE_QUERY_KEYS.details(variables.id) });
    },
  });
}

export function useReportListing() {
  const user = useAuthStore((s) => s.user);
  const reporterId = user?.id || 'user-local';

  return useMutation({
    mutationFn: (input: CreateReportInput) =>
      marketplaceApi.reportListing(input, reporterId),
  });
}

