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
    name: 'Oxford AI & Ethics Society',
    category: 'AI / ML',
    description:
      'Intercollegiate society holding weekly debates, reading circles on technical alignment, and research hackathons.',
    coverImage:
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    memberCount: 520,
    isJoined: true,
    isOfficialSociety: true,
    meetingSchedule: 'Wednesdays at 7:00 PM',
    collegeAffiliation: 'University of Oxford',
  },
  {
    id: 'comm_2',
    name: 'Oxford Developers & Designers Guild',
    category: 'Coding',
    description:
      'Student guild building production open-source software, campus tools, and mobile apps.',
    coverImage:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    memberCount: 380,
    isJoined: false,
    isOfficialSociety: true,
    meetingSchedule: 'Thursdays at 6:30 PM',
    collegeAffiliation: 'University of Oxford',
  },
  {
    id: 'comm_3',
    name: 'Radcliffe Camera Evening Reading Circle',
    category: 'Cultural societies',
    description:
      'Dedicated focused study cohort meeting for silent collective revision and post-library collegiate discussion.',
    coverImage:
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
    memberCount: 240,
    isJoined: true,
    isOfficialSociety: false,
    meetingSchedule: 'Daily 7:00 PM – 10:00 PM',
    collegeAffiliation: 'Bodleian Libraries Cohort',
  },
  {
    id: 'comm_4',
    name: 'Oxford Union Debate Society',
    category: 'Cultural societies',
    description:
      'The world-renowned collegiate debating union hosting world leaders, scholars, and weekly parliamentary debates.',
    coverImage:
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
    memberCount: 1450,
    isJoined: false,
    isOfficialSociety: true,
    meetingSchedule: 'Thursdays at 8:30 PM',
    collegeAffiliation: 'University of Oxford',
  },
  {
    id: 'comm_5',
    name: 'Oxford Venture & Founder Collective',
    category: 'Entrepreneurship',
    description:
      'Student entrepreneurs, founders, and engineers validating commercial research and raising seed capital.',
    coverImage:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    memberCount: 310,
    isJoined: false,
    isOfficialSociety: false,
    meetingSchedule: 'Bi-weekly on Saturdays',
    collegeAffiliation: 'Saïd Business School Hub',
  },
];

export const INITIAL_SEARCH_HISTORY: string[] = [
  'Epistemic Limits in Reasoning',
  'Radcliffe Camera collection hours',
  'Undergraduate Philosophy Paper Prize',
  'HackOxford team formation',
];
