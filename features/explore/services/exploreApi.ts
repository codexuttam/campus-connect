import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StudentProfile,
  Project,
  Community,
  DiscoveryFilters,
  SearchResults,
} from '../types';
import {
  MOCK_STUDENTS,
  MOCK_PROJECTS,
  MOCK_COMMUNITIES,
  INITIAL_SEARCH_HISTORY,
} from './exploreMockData';
import { INITIAL_POSTS } from '../../feed/services/feedMockData';
import { Post } from '../../feed/types';

const EXPLORE_STORAGE_KEY = 'campusconnect.explore.v1';
const EXPLORE_STORAGE_VERSION = 1;

interface PersistedExploreState {
  version: number;
  students: StudentProfile[];
  projects: Project[];
  communities: Community[];
  searchHistory: string[];
}

class ExploreApiService {
  private students: StudentProfile[] = [...MOCK_STUDENTS];
  private projects: Project[] = [...MOCK_PROJECTS];
  private communities: Community[] = [...MOCK_COMMUNITIES];
  private posts: Post[] = [...INITIAL_POSTS];
  private searchHistory: string[] = [...INITIAL_SEARCH_HISTORY];
  private hydration: Promise<void> | null = null;

  private async ready(latencyMs = 120): Promise<void> {
    if (!this.hydration) {
      this.hydration = this.hydrate();
    }
    await this.hydration;
    await new Promise((r) => setTimeout(r, latencyMs));
  }

  private async hydrate(): Promise<void> {
    try {
      const raw = await AsyncStorage.getItem(EXPLORE_STORAGE_KEY);
      if (!raw) return;
      const state = JSON.parse(raw) as PersistedExploreState;
      if (state.version !== EXPLORE_STORAGE_VERSION) return;
      this.students = state.students;
      this.projects = state.projects;
      this.communities = state.communities;
      this.searchHistory = state.searchHistory;
    } catch {
      // Fall back to seed data
    }
  }

  private async persist(): Promise<void> {
    try {
      const state: PersistedExploreState = {
        version: EXPLORE_STORAGE_VERSION,
        students: this.students,
        projects: this.projects,
        communities: this.communities,
        searchHistory: this.searchHistory,
      };
      await AsyncStorage.setItem(EXPLORE_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Best-effort persistence
    }
  }

  // ================= DISCOVERY SECTIONS =================

  async fetchTrendingProjects(filters?: DiscoveryFilters): Promise<Project[]> {
    await this.ready(120);
    let res = [...this.projects];

    if (filters?.onlySeekingTeammates) {
      res = res.filter((p) => p.isSeekingTeammates);
    }
    if (filters?.selectedSkills && filters.selectedSkills.length > 0) {
      res = res.filter((p) =>
        p.technologies.some((tech) =>
          filters.selectedSkills.some((s) => s.toLowerCase() === tech.toLowerCase())
        )
      );
    }

    return res;
  }

  async fetchRecommendedStudents(filters?: DiscoveryFilters): Promise<StudentProfile[]> {
    await this.ready(120);
    let res = [...this.students];

    if (filters?.branch) {
      res = res.filter((s) =>
        s.user.courseOrBranch.toLowerCase().includes(filters.branch!.toLowerCase())
      );
    }

    if (filters?.selectedSkills && filters.selectedSkills.length > 0) {
      res = res.filter((s) =>
        s.skills.some((skill) =>
          filters.selectedSkills.some((sel) => sel.toLowerCase() === skill.toLowerCase())
        )
      );
    }

    return res;
  }

  async fetchPopularCommunities(filters?: DiscoveryFilters): Promise<Community[]> {
    await this.ready(120);
    let res = [...this.communities];

    if (filters?.onlyOfficialSocieties) {
      res = res.filter((c) => c.isOfficialSociety);
    }

    return res.sort((a, b) => b.memberCount - a.memberCount);
  }

  async fetchCampusHighlights(): Promise<Post[]> {
    await this.ready(80);
    return this.posts.slice(0, 3);
  }

  // ================= GLOBAL SEARCH =================

  async searchGlobal(
    query: string,
    filters?: DiscoveryFilters
  ): Promise<SearchResults> {
    await this.ready(150);

    const clean = query.trim().toLowerCase();

    if (!clean) {
      return {
        students: this.students.slice(0, 3),
        projects: this.projects.slice(0, 3),
        communities: this.communities.slice(0, 3),
        posts: this.posts.slice(0, 2),
        totalResults: 11,
      };
    }

    const matchedStudents = this.students.filter(
      (s) =>
        s.user.fullName.toLowerCase().includes(clean) ||
        s.user.courseOrBranch.toLowerCase().includes(clean) ||
        s.skills.some((k) => k.toLowerCase().includes(clean)) ||
        (s.bio && s.bio.toLowerCase().includes(clean))
    );

    const matchedProjects = this.projects.filter(
      (p) =>
        p.title.toLowerCase().includes(clean) ||
        p.tagline.toLowerCase().includes(clean) ||
        p.description.toLowerCase().includes(clean) ||
        p.technologies.some((t) => t.toLowerCase().includes(clean)) ||
        p.creator.fullName.toLowerCase().includes(clean)
    );

    const matchedCommunities = this.communities.filter(
      (c) =>
        c.name.toLowerCase().includes(clean) ||
        c.description.toLowerCase().includes(clean) ||
        c.category.toLowerCase().includes(clean)
    );

    const matchedPosts = this.posts.filter((p) =>
      p.content.toLowerCase().includes(clean)
    );

    const totalResults =
      matchedStudents.length +
      matchedProjects.length +
      matchedCommunities.length +
      matchedPosts.length;

    return {
      students: matchedStudents,
      projects: matchedProjects,
      communities: matchedCommunities,
      posts: matchedPosts,
      totalResults,
    };
  }

  // ================= ACTIONS =================

  async toggleConnection(studentId: string): Promise<'none' | 'pending' | 'connected'> {
    await this.ready(100);
    const idx = this.students.findIndex((s) => s.id === studentId);
    if (idx !== -1) {
      const current = this.students[idx].connectionStatus;
      let nextStatus: 'none' | 'pending' | 'connected' = 'pending';
      if (current === 'none') {
        nextStatus = 'pending';
      } else if (current === 'pending') {
        nextStatus = 'connected';
      } else {
        nextStatus = 'none';
      }
      this.students[idx] = { ...this.students[idx], connectionStatus: nextStatus };
      await this.persist();
      return nextStatus;
    }
    return 'none';
  }

  async toggleFollowStudent(studentId: string): Promise<boolean> {
    await this.ready(80);
    const idx = this.students.findIndex((s) => s.id === studentId);
    if (idx !== -1) {
      const nextFollow = !this.students[idx].isFollowing;
      this.students[idx] = { ...this.students[idx], isFollowing: nextFollow };
      await this.persist();
      return nextFollow;
    }
    return false;
  }

  async toggleBookmarkProject(projectId: string): Promise<boolean> {
    await this.ready(100);
    const idx = this.projects.findIndex((p) => p.id === projectId);
    if (idx !== -1) {
      const nextBookmarked = !this.projects[idx].isBookmarked;
      this.projects[idx] = { ...this.projects[idx], isBookmarked: nextBookmarked };
      await this.persist();
      return nextBookmarked;
    }
    return false;
  }

  async toggleCommunityMembership(communityId: string): Promise<boolean> {
    await this.ready(100);
    const idx = this.communities.findIndex((c) => c.id === communityId);
    if (idx !== -1) {
      const nextJoined = !this.communities[idx].isJoined;
      const countDelta = nextJoined ? 1 : -1;
      this.communities[idx] = {
        ...this.communities[idx],
        isJoined: nextJoined,
        memberCount: Math.max(0, this.communities[idx].memberCount + countDelta),
      };
      await this.persist();
      return nextJoined;
    }
    return false;
  }

  // ================= SEARCH HISTORY =================

  async getSearchHistory(): Promise<string[]> {
    await this.ready(40);
    return [...this.searchHistory];
  }

  async addSearchHistory(term: string): Promise<string[]> {
    await this.ready(20);
    const clean = term.trim();
    if (!clean) return this.searchHistory;
    this.searchHistory = [clean, ...this.searchHistory.filter((t) => t !== clean)].slice(
      0,
      8
    );
    await this.persist();
    return [...this.searchHistory];
  }

  async clearSearchHistory(): Promise<void> {
    await this.ready(20);
    this.searchHistory = [];
    await this.persist();
  }

  async removeSearchHistoryItem(term: string): Promise<string[]> {
    await this.ready(20);
    this.searchHistory = this.searchHistory.filter((t) => t !== term);
    await this.persist();
    return [...this.searchHistory];
  }
}

export const exploreApi = new ExploreApiService();
