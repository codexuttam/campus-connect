import {
  MarketplaceListing,
  MarketplaceFilters,
  CreateListingInput,
  UpdateListingInput,
  CreateReportInput,
  MarketplaceStatus,
  MarketplaceReport,
  MarketplaceImage,
} from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { INITIAL_MARKETPLACE_LISTINGS } from './marketplaceMockData';
import { UserProfile } from '../../../types/auth';

const STORAGE_KEY = 'campusconnect.marketplace.v1';
const STORAGE_VERSION = 1;

interface PersistedMarketplaceState {
  version: number;
  listings: MarketplaceListing[];
  savedListingIds: string[];
  reports: MarketplaceReport[];
}

class MarketplaceApiService {
  private listings: MarketplaceListing[] = [...INITIAL_MARKETPLACE_LISTINGS];
  private savedListingIds: Set<string> = new Set(['listing-2']);
  private reports: MarketplaceReport[] = [];
  private hydration: Promise<void> | null = null;

  // ================= PERSISTENCE =================

  /** Load persisted marketplace state once, then simulate network latency. */
  private async ready(latencyMs = 100): Promise<void> {
    if (!this.hydration) {
      this.hydration = this.hydrate();
    }
    await this.hydration;
    await new Promise((r) => setTimeout(r, latencyMs));
  }

  private async hydrate(): Promise<void> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const state = JSON.parse(raw) as PersistedMarketplaceState;
      if (state.version !== STORAGE_VERSION) return;
      this.listings = state.listings;
      this.savedListingIds = new Set(state.savedListingIds);
      this.reports = state.reports;
    } catch {
      // Corrupt or unavailable storage: fall back to seed data
    }
  }

  private async persist(): Promise<void> {
    try {
      const state: PersistedMarketplaceState = {
        version: STORAGE_VERSION,
        listings: this.listings,
        savedListingIds: Array.from(this.savedListingIds),
        reports: this.reports,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Persistence is best-effort; in-memory state remains authoritative
    }
  }

  // ================= FETCH LISTINGS =================

  async fetchListings(filters?: MarketplaceFilters): Promise<MarketplaceListing[]> {
    await this.ready(120);
    let items = this.listings.filter((item) => item.status !== 'removed' && item.status !== 'draft');

    if (filters) {
      // Category Filter
      if (filters.category && filters.category !== 'all') {
        if (filters.category === 'free_items') {
          items = items.filter((item) => item.listingType === 'free' || item.price === 0);
        } else {
          items = items.filter((item) => item.category === filters.category);
        }
      }

      // Condition Filter
      if (filters.condition) {
        items = items.filter((item) => item.condition === filters.condition);
      }

      // Listing Type Filter
      if (filters.listingType) {
        items = items.filter((item) => item.listingType === filters.listingType);
      }

      // Price Range Filter
      if (filters.minPrice !== undefined && filters.minPrice > 0) {
        items = items.filter((item) => item.price >= filters.minPrice!);
      }
      if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
        items = items.filter((item) => item.price <= filters.maxPrice!);
      }

      // Search Query Filter
      if (filters.query && filters.query.trim().length > 0) {
        const q = filters.query.toLowerCase().trim();
        items = items.filter(
          (item) =>
            item.title.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q) ||
            (item.exchangeFor && item.exchangeFor.toLowerCase().includes(q))
        );
      }

      // Sorting
      if (filters.sortBy === 'price_low') {
        items.sort((a, b) => a.price - b.price);
      } else if (filters.sortBy === 'price_high') {
        items.sort((a, b) => b.price - a.price);
      } else {
        // default 'newest'
        items.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
    }

    // Attach current saved state
    return items.map((item) => ({
      ...item,
      isSaved: this.savedListingIds.has(item.id),
    }));
  }

  // ================= LISTING DETAILS =================

  async fetchListingDetails(id: string): Promise<MarketplaceListing> {
    await this.ready(100);
    const item = this.listings.find((l) => l.id === id);
    if (!item) {
      throw new Error('Listing not found');
    }

    // Increment view count
    item.viewsCount = (item.viewsCount || 0) + 1;

    return {
      ...item,
      isSaved: this.savedListingIds.has(item.id),
    };
  }

  // ================= CREATE LISTING =================

  async createListing(
    input: CreateListingInput,
    user: UserProfile
  ): Promise<MarketplaceListing> {
    await this.ready(200);

    const listingId = `listing-${Date.now()}`;
    const images: MarketplaceImage[] = (input.images || []).map((uri, index) => ({
      id: `img-${listingId}-${index}`,
      listingId,
      imageUrl: uri,
      sortOrder: index,
      isCover: index === 0,
    }));

    const isVerified = user.collegeVerificationStatus === 'verified';

    const newListing: MarketplaceListing = {
      id: listingId,
      sellerId: user.id || 'user-local',
      collegeId: user.collegeId || 'oxford',
      collegeName: user.collegeName || 'University College',
      title: input.title.trim(),
      description: input.description.trim(),
      category: input.category,
      listingType: input.listingType,
      condition: input.condition,
      price: input.listingType === 'free' ? 0 : Number(input.price) || 0,
      currency: input.currency || '$',
      exchangeFor: input.listingType === 'exchange' ? input.exchangeFor?.trim() : undefined,
      status: input.status || 'active',
      images,
      seller: {
        id: user.id || 'user-local',
        fullName: user.fullName || 'Student Seller',
        avatarUrl: user.avatarUrl,
        collegeId: user.collegeId || 'oxford',
        collegeName: user.collegeName || 'University College',
        courseOrBranch: user.courseOrBranch || 'Campus Scholar',
        graduationYear: user.graduationYear,
        isCollegeVerified: isVerified,
        memberSince: 'Current Term',
        activeListingsCount: 1,
        soldCount: 0,
      },
      isSaved: false,
      savedCount: 0,
      viewsCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Prepend to listings
    this.listings.unshift(newListing);
    await this.persist();
    return newListing;
  }

  // ================= UPDATE LISTING =================

  async updateListing(
    id: string,
    input: UpdateListingInput,
    userId: string
  ): Promise<MarketplaceListing> {
    await this.ready(150);
    const index = this.listings.findIndex((l) => l.id === id);
    if (index === -1) {
      throw new Error('Listing not found');
    }

    const current = this.listings[index];
    if (current.sellerId !== userId && userId !== 'user-local') {
      throw new Error('Unauthorized: You can only edit your own listings.');
    }

    let updatedImages = current.images;
    if (input.images) {
      updatedImages = input.images.map((uri, idx) => ({
        id: `img-${id}-${idx}`,
        listingId: id,
        imageUrl: uri,
        sortOrder: idx,
        isCover: idx === 0,
      }));
    }

    const updated: MarketplaceListing = {
      ...current,
      title: input.title !== undefined ? input.title.trim() : current.title,
      description: input.description !== undefined ? input.description.trim() : current.description,
      category: input.category || current.category,
      listingType: input.listingType || current.listingType,
      condition: input.condition || current.condition,
      price:
        input.listingType === 'free'
          ? 0
          : input.price !== undefined
          ? Number(input.price)
          : current.price,
      exchangeFor:
        input.listingType === 'exchange'
          ? input.exchangeFor?.trim()
          : input.listingType
          ? undefined
          : current.exchangeFor,
      status: input.status || current.status,
      images: updatedImages,
      updatedAt: new Date().toISOString(),
    };

    this.listings[index] = updated;
    await this.persist();
    return {
      ...updated,
      isSaved: this.savedListingIds.has(updated.id),
    };
  }

  // ================= DELETE LISTING =================

  async deleteListing(id: string, userId: string): Promise<{ success: boolean }> {
    await this.ready(120);
    const item = this.listings.find((l) => l.id === id);
    if (!item) {
      throw new Error('Listing not found');
    }

    if (item.sellerId !== userId && userId !== 'user-local') {
      throw new Error('Unauthorized: You can only remove your own listings.');
    }

    item.status = 'removed';
    this.listings = this.listings.filter((l) => l.id !== id);
    this.savedListingIds.delete(id);
    await this.persist();
    return { success: true };
  }

  // ================= SAVE / BOOKMARK =================

  async toggleSaveListing(id: string): Promise<{ isSaved: boolean }> {
    await this.ready(80);
    const item = this.listings.find((l) => l.id === id);
    if (!item) {
      throw new Error('Listing not found');
    }

    let isSaved: boolean;
    if (this.savedListingIds.has(id)) {
      this.savedListingIds.delete(id);
      item.savedCount = Math.max(0, (item.savedCount || 1) - 1);
      isSaved = false;
    } else {
      this.savedListingIds.add(id);
      item.savedCount = (item.savedCount || 0) + 1;
      isSaved = true;
    }

    await this.persist();
    return { isSaved };
  }

  // ================= SAVED LISTINGS =================

  async fetchSavedListings(): Promise<MarketplaceListing[]> {
    await this.ready(100);
    return this.listings
      .filter((l) => this.savedListingIds.has(l.id) && l.status !== 'removed')
      .map((item) => ({
        ...item,
        isSaved: true,
      }));
  }

  // ================= MY LISTINGS =================

  async fetchMyListings(
    userId: string,
    status?: MarketplaceStatus
  ): Promise<MarketplaceListing[]> {
    await this.ready(100);
    const effectiveUserId = userId || 'user-local';

    let items = this.listings.filter(
      (l) => l.sellerId === effectiveUserId && l.status !== 'removed'
    );

    if (status) {
      items = items.filter((l) => l.status === status);
    }

    return items.map((item) => ({
      ...item,
      isSaved: this.savedListingIds.has(item.id),
    }));
  }

  // ================= MARK LISTING STATUS =================

  async markListingStatus(
    id: string,
    status: MarketplaceStatus,
    userId: string
  ): Promise<MarketplaceListing> {
    await this.ready(120);
    const index = this.listings.findIndex((l) => l.id === id);
    if (index === -1) {
      throw new Error('Listing not found');
    }

    const current = this.listings[index];
    if (current.sellerId !== userId && userId !== 'user-local') {
      throw new Error('Unauthorized: You can only change status of your own listings.');
    }

    current.status = status;
    current.updatedAt = new Date().toISOString();
    await this.persist();

    return {
      ...current,
      isSaved: this.savedListingIds.has(current.id),
    };
  }

  // ================= REPORT LISTING =================

  async reportListing(
    input: CreateReportInput,
    reporterId: string
  ): Promise<{ success: boolean; reportId: string }> {
    await this.ready(150);
    const reportId = `report-${Date.now()}`;
    const newReport: MarketplaceReport = {
      id: reportId,
      listingId: input.listingId,
      reporterId: reporterId || 'user-local',
      reason: input.reason,
      details: input.details,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    this.reports.push(newReport);
    await this.persist();
    return { success: true, reportId };
  }
}

export const marketplaceApi = new MarketplaceApiService();

