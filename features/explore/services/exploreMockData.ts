import { StudentProfile, Project, Community } from '../types';
import { MOCK_USERS } from '../../feed/services/feedMockData';
import { Post } from '../../feed/types';

export const MOCK_STUDENTS: StudentProfile[] = [
  {
    id: 'stu_1',
    user: MOCK_USERS.amara,
    bio: 'Economics & Management finalist at LMH. Focus on market design, public policy analytics, and macroprudential regulation.',
    skills: ['Econometrics', 'Stata', 'Game Theory'],
    interests: ['Venture Capital', 'Energy Markets', 'Rowing'],
    mutualConnections: 14,
    connectionStatus: 'none',
    isFollowing: false,
    projectsCount: 2,
    communitiesCount: 4,
  },
  {
    id: 'stu_2',
    user: MOCK_USERS.leo,
    bio: 'Fourth year engineer at St. John’s. Building distributed robotics controllers and high-throughput embedded telemetry.',
    skills: ['Rust', 'PyTorch', 'FPGA'],
    interests: ['Autonomous Flight', 'Robotics', 'Hardware'],
    mutualConnections: 22,
    connectionStatus: 'connected',
    isFollowing: true,
    projectsCount: 3,
    communitiesCount: 5,
  },
  {
    id: 'stu_3',
    user: MOCK_USERS.elena,
    bio: 'Law scholar at Merton. Editorial contributor for Oxford University Law Journal. Researching AI copyright & algorithmic accountability.',
    skills: ['Constitutional Law', 'Legal Writing', 'IP Strategy'],
    interests: ['Moot Court', 'Jurisprudence', 'Philosophy'],
    mutualConnections: 9,
    connectionStatus: 'none',
    isFollowing: false,
    projectsCount: 1,
    communitiesCount: 3,
  },
  {
    id: 'stu_4',
    user: MOCK_USERS.tariq,
    bio: 'Medical sciences candidate at Christ Church. Computational neuroscience and cardiovascular pharmacology researcher.',
    skills: ['Bioinformatics', 'R', 'Clinical Trials'],
    interests: ['Neuroscience', 'Public Health', 'Tennis'],
    mutualConnections: 17,
    connectionStatus: 'pending',
    isFollowing: true,
    projectsCount: 2,
    communitiesCount: 3,
  },
  {
    id: 'stu_5',
    user: {
      id: 'usr_maya',
      fullName: 'Maya Lin',
      collegeName: 'Wadham College',
      courseOrBranch: 'Mathematics & Computer Science',
      graduationYear: '2027',
      avatarPreset: 'espresso',
      isVerified: true,
    },
    bio: 'Pure math and formal verification. Interested in interactive theorem provers (Lean 4) and algebraic topology.',
    skills: ['Lean 4', 'Type Theory', 'Haskell'],
    interests: ['Formal Math', 'Cryptography', 'Classical Piano'],
    mutualConnections: 8,
    connectionStatus: 'none',
    isFollowing: false,
    projectsCount: 1,
    communitiesCount: 2,
  },
  {
    id: 'stu_6',
    user: {
      id: 'usr_siddharth',
      fullName: 'Siddharth Rao',
      collegeName: 'New College',
      courseOrBranch: 'Fine Art & Digital Media',
      graduationYear: '2026',
      avatarPreset: 'crimson',
      isVerified: true,
    },
    bio: 'Typography enthusiast and product designer. Building editorial publications and tactile mobile interfaces for scholars.',
    skills: ['Figma', 'Design Systems', 'React Native'],
    interests: ['Typography', 'Architecture', 'Printmaking'],
    mutualConnections: 12,
    connectionStatus: 'none',
    isFollowing: false,
    projectsCount: 4,
    communitiesCount: 4,
  },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj_1',
    title: 'Aletheia Neural Verifier',
    tagline: 'Formal verification framework for transformer reasoning traces.',
    description:
      'Developing rigorous bounds on attention head activation trajectories to guarantee that student mathematical derivations contain zero hallucinatory steps.',
    thumbnail:
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    creator: MOCK_USERS.leo,
    technologies: ['PyTorch', 'Rust', 'CUDA'],
    category: 'AI / ML',
    teamSize: 3,
    maxTeamSize: 5,
    isSeekingTeammates: true,
    seekingRoles: ['Mathematical Logic Specialist', 'Frontend Visualizer'],
    isBookmarked: true,
    createdAt: '3 days ago',
    likesCount: 68,
  },
  {
    id: 'proj_2',
    title: 'Radcliffe Digital Archive OCR',
    tagline: 'Specialized 17th-century manuscript paleography transcription.',
    description:
      'Digitizing and indexing uncataloged handwritten collections from the Bodleian Lower Reading Rooms using vision-language models with human-in-the-loop expert corrections.',
    thumbnail:
      'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80',
    creator: MOCK_USERS.elena,
    technologies: ['Python', 'Vision Models', 'Elasticsearch'],
    category: 'Open Source',
    teamSize: 4,
    maxTeamSize: 4,
    isSeekingTeammates: false,
    isBookmarked: false,
    createdAt: '1 week ago',
    likesCount: 45,
  },
  {
    id: 'proj_3',
    title: 'PulseTelemetry MedSens',
    tagline: 'Ultra-low power wearable biosensor for nocturnal heart telemetry.',
    description:
      'Collaborative engineering between Christ Church clinical medicine and Department of Engineering Science, validated in clinical trials.',
    thumbnail:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    creator: MOCK_USERS.tariq,
    technologies: ['Embedded C', 'Biomed Sensors', 'BLE'],
    category: 'Biotech',
    teamSize: 2,
    maxTeamSize: 4,
    isSeekingTeammates: true,
    seekingRoles: ['Embedded Firmware Engineer'],
    isBookmarked: false,
    createdAt: '4 days ago',
    likesCount: 52,
  },
  {
    id: 'proj_4',
    title: 'Agora Campus Exchange',
    tagline: 'Peer-to-peer textbook and lab equipment circulation network.',
    description:
      'Zero-fee decentralized college bazaar connecting students across colleges for verified academic resources and collegiate memorabilia.',
    thumbnail:
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
    creator: MOCK_USERS.amara,
    technologies: ['React Native', 'Expo', 'TypeScript'],
    category: 'Social Impact',
    teamSize: 2,
    maxTeamSize: 3,
    isSeekingTeammates: true,
    seekingRoles: ['Mobile UI Designer'],
    isBookmarked: true,
    createdAt: '2 weeks ago',
    likesCount: 89,
  },
];

export const MOCK_COMMUNITIES: Community[] = [
  {
    id: 'comm_1',
    name: 'NIU Coding Club',
    category: 'Coding',
    description:
      'Official programming & competitive coding society of Noida International University. Hosts NIU CodeSprint, LeetCode sprints, and SIH prep.',
    coverImage:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    memberCount: 1242,
    isJoined: true,
    isOfficialSociety: true,
    meetingSchedule: 'Wednesdays & Fridays at 4:30 PM',
    collegeAffiliation: 'Noida International University · SET',
  },
  {
    id: 'comm_2',
    name: 'AI/ML Study Group',
    category: 'AI / ML',
    description:
      'Deep learning, LLM research, computer vision labs, and Kaggle competitions for NIU CSE (AI/ML) scholars.',
    coverImage:
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    memberCount: 846,
    isJoined: true,
    isOfficialSociety: true,
    meetingSchedule: 'Thursdays at 4:00 PM · AI Lab 3',
    collegeAffiliation: 'Noida International University · CSE (AI/ML)',
  },
  {
    id: 'comm_3',
    name: 'Cricket @ NIU',
    category: 'Sports',
    description:
      'NIU inter-school cricket tournaments, evening practice nets, and university sports contingent trials.',
    coverImage:
      'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
    memberCount: 642,
    isJoined: true,
    isOfficialSociety: true,
    meetingSchedule: 'Daily 5:00 PM · NIU Sports Complex',
    collegeAffiliation: 'NIU Sports Council',
  },
  {
    id: 'comm_4',
    name: 'Books & Resources Exchange',
    category: 'Cultural societies',
    description:
      'Peer textbook exchange, semester notes repository, previous year question papers, and Gate/Placement prep material.',
    coverImage:
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
    memberCount: 510,
    isJoined: false,
    isOfficialSociety: true,
    meetingSchedule: 'Central Library Reading Lounge',
    collegeAffiliation: 'Noida International University',
  },
  {
    id: 'comm_5',
    name: 'Design & Creative Guild',
    category: 'Design',
    description:
      'UI/UX designers, Figma creators, photographers, and brand storytellers crafting products at NIU.',
    coverImage:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    memberCount: 398,
    isJoined: false,
    isOfficialSociety: false,
    meetingSchedule: 'Saturdays at 2:00 PM',
    collegeAffiliation: 'NIU Innovation Hub',
  },
];

export const INITIAL_SEARCH_HISTORY: string[] = [
  "NIU CodeSprint '26 Hackathon",
  'DBMS Korth 7th Edition',
  'AI in Real World Webinar',
  'SIH Internal Round Teammates',
];
