/**
 * CampusConnect Feed Data Models
 */

export interface UserSummary {
  id: string;
  fullName: string;
  email?: string;
  avatarUrl?: string;
  avatarPreset?: string;
  collegeName: string;
  courseOrBranch: string;
  graduationYear?: string;
  isVerified?: boolean;
}

export type PostCategory =
  | 'all'
  | 'academic'
  | 'campus-life'
  | 'research'
  | 'events'
  | 'clubs';

export type PostVisibility = 'campus' | 'course' | 'public';

export interface PostImage {
  id: string;
  url: string;
  aspectRatio?: number;
  width?: number;
  height?: number;
}

export interface Post {
  id: string;
  author: UserSummary;
  content: string;
  images?: PostImage[];
  category: PostCategory;
  visibility: PostVisibility;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isSaved: boolean;
  isOwnPost?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  author: UserSummary;
  content: string;
  createdAt: string;
  likesCount?: number;
  isLiked?: boolean;
  isOwnComment?: boolean;
}

export interface Story {
  id: string;
  author: UserSummary;
  type: 'student' | 'club' | 'society';
  title?: string;
  mediaUrl?: string;
  textSnippet?: string;
  bgColor?: string;
  createdAt: string;
  expiresAt: string;
  isViewed: boolean;
}

export interface StoryView {
  storyId: string;
  viewedAt: string;
}

export interface FeedPagination {
  page: number;
  pageSize: number;
  hasMore: boolean;
  total: number;
}

export interface ConnectionSuggestion {
  id: string;
  user: UserSummary;
  mutualCircles: number;
  mutualCount: number;
  reason?: string;
  isConnected: boolean;
}

export interface TrendingTopic {
  id: string;
  tag: string;
  title: string;
  postCount: number;
  category: string;
}

export interface CreatePostPayload {
  content: string;
  images?: string[];
  category: PostCategory;
  visibility: PostVisibility;
}

export interface CreateCommentPayload {
  postId: string;
  content: string;
}

