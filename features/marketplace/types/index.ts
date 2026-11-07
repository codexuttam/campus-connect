/**
 * CampusConnect Marketplace Type Definitions
 *
 * Section 06: Student-to-Student Campus Marketplace
 * Peer-to-peer discovery platform for verified college students.
 */

export type MarketplaceCategory =
  | 'all'
  | 'books'
  | 'electronics'
  | 'accessories'
  | 'hostel_essentials'
  | 'stationery'
  | 'free_items'
  | 'other';

export type MarketplaceListingType = 'sell' | 'exchange' | 'free';

export type MarketplaceCondition = 'new' | 'like_new' | 'good' | 'fair';

export type MarketplaceStatus = 'draft' | 'active' | 'reserved' | 'sold' | 'removed';

export type MarketplaceSortOption = 'newest' | 'price_low' | 'price_high';

export type MarketplaceReportReason =
  | 'prohibited_item'
  | 'counterfeit_or_fraud'
  | 'suspicious_pricing'
  | 'inappropriate_content'
  | 'harassment_or_spam'
  | 'not_a_student'
  | 'other';

export interface MarketplaceImage {
  id: string;
  listingId: string;
  imageUrl: string;
  sortOrder: number;
  isCover?: boolean;
}

export interface MarketplaceSeller {
  id: string;
  fullName: string;
  avatarUrl?: string;
  collegeId: string;
  collegeName: string;
  courseOrBranch?: string;
  graduationYear?: string;
  isCollegeVerified: boolean;
  memberSince?: string;
  activeListingsCount?: number;
  soldCount?: number;
}

export interface MarketplaceListing {
  id: string;
  sellerId: string;
  collegeId: string;
  collegeName?: string;
  title: string;
  description: string;
  category: MarketplaceCategory;
  listingType: MarketplaceListingType;
  condition: MarketplaceCondition;
  price: number;
  currency: string;
  exchangeFor?: string; // Required when listingType === 'exchange'
  status: MarketplaceStatus;
  images: MarketplaceImage[];
  seller: MarketplaceSeller;
  isSaved?: boolean;
  savedCount?: number;
  viewsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MarketplaceBookmark {
  id: string;
  listingId: string;
  userId: string;
  createdAt: string;
}

export interface MarketplaceReport {
  id: string;
  listingId: string;
  reporterId: string;
  reason: MarketplaceReportReason;
  details?: string;
  status: 'pending' | 'reviewed' | 'dismissed' | 'resolved';
  createdAt: string;
}

export interface MarketplaceFilters {
  query?: string;
  category?: MarketplaceCategory;
  condition?: MarketplaceCondition;
  listingType?: MarketplaceListingType;
  minPrice?: number;
  maxPrice?: number;
  collegeOnly?: boolean;
  sortBy?: MarketplaceSortOption;
}

export interface CreateListingInput {
  title: string;
  description: string;
  category: MarketplaceCategory;
  listingType: MarketplaceListingType;
  condition: MarketplaceCondition;
  price: number;
  currency?: string;
  exchangeFor?: string;
  images: string[]; // local URIs or URLs
  status?: MarketplaceStatus;
}

export interface UpdateListingInput extends Partial<CreateListingInput> {
  status?: MarketplaceStatus;
}

export interface CreateReportInput {
  listingId: string;
  reason: MarketplaceReportReason;
  details?: string;
}

export interface MarketplaceConversationContext {
  listingId: string;
  listingTitle: string;
  listingPrice: number;
  listingType: MarketplaceListingType;
  listingThumbnail: string;
  sellerId: string;
  sellerName: string;
}

