import {
  Post,
  Story,
  ConnectionSuggestion,
  TrendingTopic,
  Comment,
  CreatePostPayload,
  CreateCommentPayload,
  PostCategory,
  UserSummary,
} from '../types';
import {
  INITIAL_POSTS,
  INITIAL_STORIES,
  INITIAL_COMMENTS,
  INITIAL_SUGGESTIONS,
  INITIAL_TRENDING,
  CURRENT_USER,
} from './feedMockData';

/**
 * Feed API Client Layer
 *
 * Implements data operations for CampusConnect Home Feed.
 * Structured cleanly so that when production REST/GraphQL endpoints
 * are connected, only this file is modified.
 */
class FeedApiService {
  private posts: Post[] = [...INITIAL_POSTS];
  private stories: Story[] = [...INITIAL_STORIES];
  private comments: Record<string, Comment[]> = { ...INITIAL_COMMENTS };
  private suggestions: ConnectionSuggestion[] = [...INITIAL_SUGGESTIONS];
  private trending: TrendingTopic[] = [...INITIAL_TRENDING];

  // ================= FEED OPERATIONS =================

  async fetchCampusFeed(params: {
    page?: number;
    pageSize?: number;
    filter?: 'for-you' | 'following';
    category?: PostCategory;
  }): Promise<{ posts: Post[]; hasMore: boolean; total: number }> {
    const { page = 1, pageSize = 10, filter = 'for-you', category = 'all' } = params;

    // Simulate minor asynchronous network latency
    await new Promise((resolve) => setTimeout(resolve, 200));

    let filtered = [...this.posts];

    if (filter === 'following') {
      // Simulate following feed (e.g., specific followed students/clubs)
      filtered = filtered.filter(
        (p) => p.author.id === 'usr_amara' || p.author.id === 'org_ai_soc'
      );
    }

    if (category && category !== 'all') {
      filtered = filtered.filter((p) => p.category === category);
    }

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginated = filtered.slice(start, end);

    return {
      posts: paginated,
      hasMore: end < filtered.length,
      total: filtered.length,
    };
  }

  async fetchPostById(id: string): Promise<Post | null> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const found = this.posts.find((p) => p.id === id);
    return found ? { ...found } : null;
  }

  async createPost(payload: CreatePostPayload, authorOverride?: UserSummary): Promise<Post> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const author = authorOverride || CURRENT_USER;

    const newPost: Post = {
      id: 'post_' + Date.now(),
      author,
      content: payload.content.trim(),
      category: payload.category || 'campus-life',
      visibility: payload.visibility || 'campus',
      createdAt: 'Just now',
      likesCount: 0,
      commentsCount: 0,
      isLiked: false,
      isSaved: false,
      isOwnPost: true,
      images: payload.images?.map((url, idx) => ({
        id: `img_${Date.now()}_${idx}`,
        url,
        aspectRatio: 1.5,
      })),
    };

    this.posts = [newPost, ...this.posts];
    this.comments[newPost.id] = [];

    return newPost;
  }

  async deletePost(postId: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    this.posts = this.posts.filter((p) => p.id !== postId);
    delete this.comments[postId];
    return true;
  }

  async toggleLike(postId: string): Promise<{ isLiked: boolean; likesCount: number }> {
    const postIndex = this.posts.findIndex((p) => p.id === postId);
    if (postIndex === -1) {
      throw new Error('Post not found');
    }

    const post = this.posts[postIndex];
    const willLike = !post.isLiked;
    const newLikesCount = willLike ? post.likesCount + 1 : Math.max(0, post.likesCount - 1);

    this.posts[postIndex] = {
      ...post,
      isLiked: willLike,
      likesCount: newLikesCount,
    };

    return { isLiked: willLike, likesCount: newLikesCount };
  }

  async toggleSave(postId: string): Promise<{ isSaved: boolean }> {
    const postIndex = this.posts.findIndex((p) => p.id === postId);
    if (postIndex === -1) {
      throw new Error('Post not found');
    }

    const post = this.posts[postIndex];
    const willSave = !post.isSaved;

    this.posts[postIndex] = {
      ...post,
      isSaved: willSave,
    };

    return { isSaved: willSave };
  }

  // ================= COMMENTS OPERATIONS =================

  async fetchComments(postId: string): Promise<Comment[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return [...(this.comments[postId] || [])];
  }

  async createComment(
    payload: CreateCommentPayload,
    authorOverride?: UserSummary
  ): Promise<Comment> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const author = authorOverride || CURRENT_USER;

    const newComment: Comment = {
      id: 'com_' + Date.now(),
      postId: payload.postId,
      author,
      content: payload.content.trim(),
      createdAt: 'Just now',
      likesCount: 0,
      isLiked: false,
      isOwnComment: true,
    };

    if (!this.comments[payload.postId]) {
      this.comments[payload.postId] = [];
    }

    this.comments[payload.postId] = [...this.comments[payload.postId], newComment];

    // Increment post comment count
    const postIndex = this.posts.findIndex((p) => p.id === payload.postId);
    if (postIndex !== -1) {
      this.posts[postIndex] = {
        ...this.posts[postIndex],
        commentsCount: this.posts[postIndex].commentsCount + 1,
      };
    }

    return newComment;
  }

  async deleteComment(postId: string, commentId: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 150));

    if (this.comments[postId]) {
      this.comments[postId] = this.comments[postId].filter((c) => c.id !== commentId);

      const postIndex = this.posts.findIndex((p) => p.id === postId);
      if (postIndex !== -1) {
        this.posts[postIndex] = {
          ...this.posts[postIndex],
          commentsCount: Math.max(0, this.posts[postIndex].commentsCount - 1),
        };
      }
    }

    return true;
  }

  async reportPost(postId: string, reason: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    // Telemetry / report queue in production
    return true;
  }

  // ================= STORIES / UPDATES OPERATIONS =================

  async fetchStories(): Promise<Story[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return [...this.stories];
  }

  async recordStoryView(storyId: string): Promise<boolean> {
    const idx = this.stories.findIndex((s) => s.id === storyId);
    if (idx !== -1) {
      this.stories[idx] = {
        ...this.stories[idx],
        isViewed: true,
      };
    }
    return true;
  }

  // ================= SUGGESTIONS & TRENDING =================

  async fetchSuggestedConnections(): Promise<ConnectionSuggestion[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return [...this.suggestions];
  }

  async toggleConnect(suggestionId: string): Promise<boolean> {
    const idx = this.suggestions.findIndex((s) => s.id === suggestionId);
    if (idx !== -1) {
      const current = this.suggestions[idx].isConnected;
      this.suggestions[idx] = {
        ...this.suggestions[idx],
        isConnected: !current,
      };
      return !current;
    }
    return false;
  }

  async fetchTrendingTopics(): Promise<TrendingTopic[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return [...this.trending];
  }
}

export const feedApi = new FeedApiService();

