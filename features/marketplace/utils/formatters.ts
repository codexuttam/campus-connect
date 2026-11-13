import {
  MarketplaceCondition,
  MarketplaceCategory,
  MarketplaceListingType,
  MarketplaceStatus,
} from '../types';

/**
 * Single source of truth for the marketplace currency symbol.
 * Change this one value (e.g. to '₹') to switch the whole marketplace.
 */
export const MARKETPLACE_CURRENCY = '$';

/** Formats a plain amount with the marketplace currency, e.g. $1,200 */
export function formatAmount(amount: number): string {
  return `${MARKETPLACE_CURRENCY}${Number(amount).toLocaleString()}`;
}

export const CATEGORY_ITEMS: { id: MarketplaceCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'books', label: 'Books' },
  { id: 'electronics', label: 'Electronics' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'hostel_essentials', label: 'Hostel Essentials' },
  { id: 'stationery', label: 'Stationery' },
  { id: 'free_items', label: 'Free Items' },
  { id: 'other', label: 'Other' },
];

export const CONDITION_ITEMS: { id: MarketplaceCondition; label: string }[] = [
  { id: 'new', label: 'New' },
  { id: 'like_new', label: 'Like New' },
  { id: 'good', label: 'Good' },
  { id: 'fair', label: 'Fair' },
];

export const LISTING_TYPE_ITEMS: { id: MarketplaceListingType; label: string }[] = [
  { id: 'sell', label: 'Sell' },
  { id: 'exchange', label: 'Exchange' },
  { id: 'free', label: 'Free' },
];

export function formatPrice(
  price: number,
  currency = MARKETPLACE_CURRENCY,
  listingType: MarketplaceListingType = 'sell',
  exchangeFor?: string
): string {
  if (listingType === 'free' || price === 0) {
    return 'Free';
  }
  if (listingType === 'exchange') {
    return exchangeFor ? `Swap: ${exchangeFor}` : 'Swap / Exchange';
  }
  return `${currency}${Number(price).toLocaleString()}`;
}

export function getConditionLabel(condition: MarketplaceCondition): string {
  switch (condition) {
    case 'new':
      return 'New';
    case 'like_new':
      return 'Like New';
    case 'good':
      return 'Good';
    case 'fair':
      return 'Fair';
    default:
      return condition;
  }
}

export function getCategoryLabel(category: MarketplaceCategory): string {
  const match = CATEGORY_ITEMS.find((c) => c.id === category);
  return match ? match.label : 'General';
}

export function getStatusLabel(status: MarketplaceStatus): string {
  switch (status) {
    case 'active':
      return 'Available';
    case 'sold':
      return 'Sold';
    case 'reserved':
      return 'Reserved';
    case 'draft':
      return 'Draft';
    case 'removed':
      return 'Removed';
    default:
      return status;
  }
}

export function formatListingDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return diffMins <= 1 ? 'Just now' : `${diffMins}m ago`;
    }
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    if (diffDays < 7) {
      return `${diffDays}d ago`;
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Recently';
  }
}

