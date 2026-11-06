import { UserSummary, Post } from '../../feed/types';

export type ExploreCategory = 'all' | 'people' | 'projects' | 'communities';

export interface StudentProfile {
  id: string;
  user: UserSummary;
  bio?: string;
  skills: string[];
  interests: string[];
  mutualConnections: number;
  connectionStatus: 'none' | 'pending' | 'connected';
  isFollowing: boolean;
  projectsCount?: number;
  communitiesCount?: number;
}

export type ProjectCategory =
  | 'AI / ML'
  | 'Robotics'
  | 'Design'
  | 'FinTech'
  | 'Social Impact'
  | 'Biotech'
  | 'Open Source';

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  thumbnail: string;
  creator: UserSummary;
  technologies: string[];
  category: ProjectCategory;
  teamSize: number;
  maxTeamSize: number;
  isSeekingTeammates: boolean;
  seekingRoles?: string[];
  isBookmarked: boolean;
  createdAt: string;
  likesCount: number;
}

export type CommunityCategory =
  | 'Coding'
  | 'AI / ML'
  | 'Design'
  | 'Entrepreneurship'
  | 'Photography'
  | 'Sports'
  | 'Cultural societies';

export interface Community {
  id: string;
  name: string;
  category: CommunityCategory;
  description: string;
  coverImage: string;
  memberCount: number;
  isJoined: boolean;
  isOfficialSociety: boolean;
  meetingSchedule?: string;
  collegeAffiliation: string;
}

export interface DiscoveryFilters {
  category?: ExploreCategory;
  selectedSkills: string[];
  branch?: string;
  graduationYear?: string;
  onlySeekingTeammates?: boolean;
  onlyOfficialSocieties?: boolean;
  collegeScope?: 'my_college' | 'all_campuses';
  sortBy?: 'popular' | 'newest' | 'relevance';
}

export interface SearchResults {
  students: StudentProfile[];
  projects: Project[];
  communities: Community[];
  posts: Post[];
  totalResults: number;
}
