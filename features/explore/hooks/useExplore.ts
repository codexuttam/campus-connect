import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { exploreApi } from '../services/exploreApi';
import { DiscoveryFilters } from '../types';

export const EXPLORE_QUERY_KEYS = {
  trendingProjects: (filters?: DiscoveryFilters) => ['explore', 'projects', filters] as const,
  recommendedStudents: (filters?: DiscoveryFilters) => ['explore', 'students', filters] as const,
  popularCommunities: (filters?: DiscoveryFilters) => ['explore', 'communities', filters] as const,
  campusHighlights: () => ['explore', 'highlights'] as const,
  search: (query: string, filters?: DiscoveryFilters) => ['explore', 'search', query, filters] as const,
  searchHistory: () => ['explore', 'searchHistory'] as const,
};

export function useDebounce<T>(value: T, delay = 250): T {
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

export function useTrendingProjects(filters?: DiscoveryFilters) {
  return useQuery({
    queryKey: EXPLORE_QUERY_KEYS.trendingProjects(filters),
    queryFn: () => exploreApi.fetchTrendingProjects(filters),
  });
}

export function useRecommendedStudents(filters?: DiscoveryFilters) {
  return useQuery({
    queryKey: EXPLORE_QUERY_KEYS.recommendedStudents(filters),
    queryFn: () => exploreApi.fetchRecommendedStudents(filters),
  });
}

export function usePopularCommunities(filters?: DiscoveryFilters) {
  return useQuery({
    queryKey: EXPLORE_QUERY_KEYS.popularCommunities(filters),
    queryFn: () => exploreApi.fetchPopularCommunities(filters),
  });
}

export function useCampusHighlights() {
  return useQuery({
    queryKey: EXPLORE_QUERY_KEYS.campusHighlights(),
    queryFn: () => exploreApi.fetchCampusHighlights(),
  });
}

export function useGlobalSearch(query: string, filters?: DiscoveryFilters) {
  const debouncedQuery = useDebounce(query, 300);

  return useQuery({
    queryKey: EXPLORE_QUERY_KEYS.search(debouncedQuery, filters),
    queryFn: () => exploreApi.searchGlobal(debouncedQuery, filters),
  });
}

export function useSearchHistory() {
  return useQuery({
    queryKey: EXPLORE_QUERY_KEYS.searchHistory(),
    queryFn: () => exploreApi.getSearchHistory(),
  });
}

// ================= MUTATIONS =================

export function useToggleConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (studentId: string) => exploreApi.toggleConnection(studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['explore'] });
    },
  });
}

export function useToggleFollow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (studentId: string) => exploreApi.toggleFollowStudent(studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['explore'] });
    },
  });
}

export function useToggleBookmarkProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => exploreApi.toggleBookmarkProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['explore'] });
    },
  });
}

export function useToggleCommunityMembership() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (communityId: string) => exploreApi.toggleCommunityMembership(communityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['explore'] });
    },
  });
}

export function useAddSearchHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (term: string) => exploreApi.addSearchHistory(term),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPLORE_QUERY_KEYS.searchHistory() });
    },
  });
}

export function useClearSearchHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => exploreApi.clearSearchHistory(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPLORE_QUERY_KEYS.searchHistory() });
    },
  });
}
