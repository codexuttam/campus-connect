import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { feedApi } from '../services/feedApi';
import {
  Post,
  PostCategory,
  CreatePostPayload,
  CreateCommentPayload,
  UserSummary,
} from '../types';
import { useAuth } from '../../../hooks/useAuth';

export const FEED_QUERY_KEYS = {
  feed: (filter: string, category: string) => ['feed', filter, category] as const,
  post: (id: string) => ['post', id] as const,
  comments: (postId: string) => ['comments', postId] as const,
  stories: () => ['stories'] as const,
  suggestions: () => ['suggestions'] as const,
  trending: () => ['trending'] as const,
};

export function useCampusFeed(params: {
  filter: 'for-you' | 'following';
  category: PostCategory;
}) {
  const { filter, category } = params;

  return useQuery({
    queryKey: FEED_QUERY_KEYS.feed(filter, category),
    queryFn: () => feedApi.fetchCampusFeed({ filter, category, page: 1, pageSize: 20 }),
  });
}

export function usePostDetails(postId: string) {
  return useQuery({
    queryKey: FEED_QUERY_KEYS.post(postId),
    queryFn: () => feedApi.fetchPostById(postId),
    enabled: Boolean(postId),
  });
}

export function usePostComments(postId: string) {
  return useQuery({
    queryKey: FEED_QUERY_KEYS.comments(postId),
    queryFn: () => feedApi.fetchComments(postId),
    enabled: Boolean(postId),
  });
}

export function useStories() {
  return useQuery({
    queryKey: FEED_QUERY_KEYS.stories(),
    queryFn: () => feedApi.fetchStories(),
  });
}

export function useSuggestedConnections() {
  return useQuery({
    queryKey: FEED_QUERY_KEYS.suggestions(),
    queryFn: () => feedApi.fetchSuggestedConnections(),
  });
}

export function useTrendingTopics() {
  return useQuery({
    queryKey: FEED_QUERY_KEYS.trending(),
    queryFn: () => feedApi.fetchTrendingTopics(),
  });
}

// ================= MUTATIONS =================

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => feedApi.toggleLike(postId),
    onSuccess: (data, postId) => {
      // Invalidate active feed and post details
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: FEED_QUERY_KEYS.post(postId) });
    },
  });
}

export function useSavePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => feedApi.toggleSave(postId),
    onSuccess: (data, postId) => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: FEED_QUERY_KEYS.post(postId) });
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (payload: CreatePostPayload) => {
      const authorSummary: UserSummary | undefined = user
        ? {
            id: user.id,
            fullName: user.fullName,
            collegeName: user.collegeName || 'Oxford University',
            courseOrBranch: user.courseOrBranch || 'Scholar',
            graduationYear: user.graduationYear,
            avatarPreset: user.avatarPreset,
            isVerified: user.collegeVerificationStatus === 'verified',
          }
        : undefined;

      return feedApi.createPost(payload, authorSummary);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => feedApi.deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (payload: CreateCommentPayload) => {
      const authorSummary: UserSummary | undefined = user
        ? {
            id: user.id,
            fullName: user.fullName,
            collegeName: user.collegeName || 'Oxford University',
            courseOrBranch: user.courseOrBranch || 'Scholar',
            graduationYear: user.graduationYear,
            avatarPreset: user.avatarPreset,
            isVerified: user.collegeVerificationStatus === 'verified',
          }
        : undefined;

      return feedApi.createComment(payload, authorSummary);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: FEED_QUERY_KEYS.comments(variables.postId) });
      queryClient.invalidateQueries({ queryKey: FEED_QUERY_KEYS.post(variables.postId) });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: { postId: string; commentId: string }) =>
      feedApi.deleteComment(vars.postId, vars.commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: FEED_QUERY_KEYS.comments(variables.postId) });
      queryClient.invalidateQueries({ queryKey: FEED_QUERY_KEYS.post(variables.postId) });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

export function useRecordStoryView() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (storyId: string) => feedApi.recordStoryView(storyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FEED_QUERY_KEYS.stories() });
    },
  });
}

export function useToggleConnect() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (suggestionId: string) => feedApi.toggleConnect(suggestionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FEED_QUERY_KEYS.suggestions() });
    },
  });
}

export function useReportPost() {
  return useMutation({
    mutationFn: (vars: { postId: string; reason: string }) =>
      feedApi.reportPost(vars.postId, vars.reason),
  });
}
