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

class ExploreApiService {
  private students: StudentProfile[] = [...MOCK_STUDENTS];
  private projects: Project[] = [...MOCK_PROJECTS];
  private communities: Community[] = [...MOCK_COMMUNITIES];
  private posts: Post[] = [...INITIAL_POSTS];
  private searchHistory: string[] = [...INITIAL_SEARCH_HISTORY];

  // ================= DISCOVERY SECTIONS =================

  async fetchTrendingProjects(filters?: DiscoveryFilters): Promise<Project[]> {
    await new Promise((r) => setTimeout(r, 150));
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
    await new Promise((r) => setTimeout(r, 150));
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
    await new Promise((r) => setTimeout(r, 150));
    let res = [...this.communities];

    if (filters?.onlyOfficialSocieties) {
      res = res.filter((c) => c.isOfficialSociety);
    }

    return res.sort((a, b) => b.memberCount - a.memberCount);
  }

  async fetchCampusHighlights(): Promise<Post[]> {
    await new Promise((r) => setTimeout(r, 100));
    return this.posts.slice(0, 3);
  }

  // ================= GLOBAL SEARCH =================

  async searchGlobal(
    query: string,
    filters?: DiscoveryFilters
  ): Promise<SearchResults> {
    await new Promise((r) => setTimeout(r, 200));

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
    await new Promise((r) => setTimeout(r, 150));
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
      return nextStatus;
    }
    return 'none';
  }

  async toggleFollowStudent(studentId: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 100));
    const idx = this.students.findIndex((s) => s.id === studentId);
    if (idx !== -1) {
      const nextFollow = !this.students[idx].isFollowing;
      this.students[idx] = { ...this.students[idx], isFollowing: nextFollow };
      return nextFollow;
    }
    return false;
  }

  async toggleBookmarkProject(projectId: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 150));
    const idx = this.projects.findIndex((p) => p.id === projectId);
    if (idx !== -1) {
      const nextBookmarked = !this.projects[idx].isBookmarked;
      this.projects[idx] = { ...this.projects[idx], isBookmarked: nextBookmarked };
      return nextBookmarked;
    }
    return false;
  }

  async toggleCommunityMembership(communityId: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 150));
    const idx = this.communities.findIndex((c) => c.id === communityId);
    if (idx !== -1) {
      const nextJoined = !this.communities[idx].isJoined;
      const countDelta = nextJoined ? 1 : -1;
      this.communities[idx] = {
        ...this.communities[idx],
        isJoined: nextJoined,
        memberCount: Math.max(0, this.communities[idx].memberCount + countDelta),
      };
      return nextJoined;
    }
    return false;
  }

  // ================= SEARCH HISTORY =================

  async getSearchHistory(): Promise<string[]> {
    return [...this.searchHistory];
  }

  async addSearchHistory(term: string): Promise<string[]> {
    const clean = term.trim();
    if (!clean) return this.searchHistory;
    this.searchHistory = [clean, ...this.searchHistory.filter((t) => t !== clean)].slice(
      0,
      8
    );
    return [...this.searchHistory];
  }

  async clearSearchHistory(): Promise<void> {
    this.searchHistory = [];
  }

  async removeSearchHistoryItem(term: string): Promise<string[]> {
    this.searchHistory = this.searchHistory.filter((t) => t !== term);
    return [...this.searchHistory];
  }
}

export const exploreApi = new ExploreApiService();
