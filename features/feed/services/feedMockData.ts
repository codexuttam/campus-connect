import {
  Post,
  Story,
  ConnectionSuggestion,
  TrendingTopic,
  Comment,
  UserSummary,
} from '../types';

export const CURRENT_USER: UserSummary = {
  id: 'usr_me',
  fullName: 'Uttamraj Singh',
  collegeName: 'Noida International University',
  courseOrBranch: '3rd Year • CSE (AI/ML) • Section C',
  graduationYear: '2027',
  avatarPreset: 'crimson',
  isVerified: true,
};

export const MOCK_USERS: Record<string, UserSummary> = {
  amara: {
    id: 'usr_amara',
    fullName: 'Priya Sharma',
    collegeName: 'Noida International University',
    courseOrBranch: '3rd Year • CSE (AI/ML) • Organizer',
    graduationYear: '2027',
    avatarPreset: 'olive',
    isVerified: true,
  },
  leo: {
    id: 'usr_leo',
    fullName: 'Aarav Mishra',
    collegeName: 'Noida International University',
    courseOrBranch: '3rd Year • CSE • NIU-24-14789',
    graduationYear: '2027',
    avatarPreset: 'espresso',
    isVerified: true,
  },
  elena: {
    id: 'usr_elena',
    fullName: 'Sneha Patil',
    collegeName: 'Noida International University',
    courseOrBranch: '3rd Year • CSE (AI/ML) • NIU-24-14876',
    graduationYear: '2027',
    avatarPreset: 'slate',
    isVerified: true,
  },
  tariq: {
    id: 'usr_tariq',
    fullName: 'Rohan Verma',
    collegeName: 'Noida International University',
    courseOrBranch: '2nd Year • IT • NIU-25-15021',
    graduationYear: '2028',
    avatarPreset: 'olive',
    isVerified: true,
  },
  ai_society: {
    id: 'org_ai_soc',
    fullName: 'NIU Coding Club',
    collegeName: 'Noida International University',
    courseOrBranch: 'Official Technical Society • 1.2k members',
    isVerified: true,
  },
  yard_bulletin: {
    id: 'org_yard_bulletin',
    fullName: 'NIU Campus Announcements',
    collegeName: 'Noida International University',
    courseOrBranch: 'Dean of Student Welfare Office',
    isVerified: true,
  },
};

export const INITIAL_STORIES: Story[] = [
  {
    id: 'story_1',
    author: MOCK_USERS.ai_society,
    type: 'club',
    title: 'Guest Colloquium',
    textSnippet: 'Tonight at 7:00 PM: "Epistemic Limits of Large Reasoning Models" in the Examination Schools. Tea from 6:30.',
    bgColor: '#702D3B',
    createdAt: '25m ago',
    expiresAt: '23h',
    isViewed: false,
  },
  {
    id: 'story_2',
    author: MOCK_USERS.amara,
    type: 'student',
    title: 'Study Circle',
    textSnippet: 'Revision table set up in Upper Reading Room, Radcliffe Camera. 4 seats open for macroeconomics problem sets.',
    bgColor: '#737B4B',
    createdAt: '1h ago',
    expiresAt: '23h',
    isViewed: false,
  },
  {
    id: 'story_3',
    author: MOCK_USERS.leo,
    type: 'student',
    title: 'Robotics Lab',
    textSnippet: 'Final autonomous drone test flight passed in the South Parks field. Hardware sprint concluded.',
    bgColor: '#302B28',
    createdAt: '3h ago',
    expiresAt: '21h',
    isViewed: false,
  },
  {
    id: 'story_4',
    author: MOCK_USERS.elena,
    type: 'student',
    title: 'Moot Court',
    textSnippet: 'Chambers finals commence at 2 PM. Public gallery seating open in the St Cross Building.',
    bgColor: '#4F6C7D',
    createdAt: '5h ago',
    expiresAt: '19h',
    isViewed: true,
  },
  {
    id: 'story_5',
    author: MOCK_USERS.yard_bulletin,
    type: 'society',
    title: 'Library Hours',
    textSnippet: 'Bodleian central complex extends 24-hour reading rooms for 5th-week collections.',
    bgColor: '#82796B',
    createdAt: '7h ago',
    expiresAt: '17h',
    isViewed: true,
  },
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post_1',
    author: MOCK_USERS.ai_society,
    content:
      "NIU CodeSprint '26 – 24 Hr Hackathon 🚀\n\nRegistrations are now open! Build, collaborate and solve real-world problems with your peers at Noida International University.\n\n📅 5 - 6 Dec 2025  ·  📍 NIU Campus Auditorium  ·  👥 Teams of 2-4  ·  🏆 ₹1,50,000 Prize Pool",
    category: 'events',
    visibility: 'campus',
    createdAt: '2h ago',
    likesCount: 124,
    commentsCount: 18,
    isLiked: true,
    isSaved: true,
    images: [
      {
        id: 'img_1',
        url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
        aspectRatio: 1.6,
      },
    ],
  },
  {
    id: 'post_2',
    author: MOCK_USERS.leo,
    content:
      'Looking for a partner for Smart India Hackathon (SIH Internal Round) 🚀\n\nNeed 2 teammates from CSE / IT (AI/ML or Full-Stack React Native + FastAPI). We already have our problem statement shortlisted. DM if interested!',
    category: 'research',
    visibility: 'campus',
    createdAt: '2h ago',
    likesCount: 58,
    commentsCount: 12,
    isLiked: false,
    isSaved: false,
  },
  {
    id: 'post_3',
    author: MOCK_USERS.elena,
    content:
      'Selling: DBMS (Korth) – 7th Edition (Like New) 📚\n\nPrice: ₹250 | Clean pages, zero markings, includes solved university PYQ notes. Available for pickup at NIU Central Library steps!',
    category: 'academic',
    visibility: 'campus',
    createdAt: '4h ago',
    likesCount: 34,
    commentsCount: 7,
    isLiked: false,
    isSaved: true,
    images: [
      {
        id: 'img_2',
        url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
        aspectRatio: 1.5,
      },
    ],
  },
  {
    id: 'post_4',
    author: MOCK_USERS.amara,
    content:
      'Live Webinar: AI in Real World & Research with LLMs 🎙️\n\nSpeaker: Dr. R. Kulkarni (8 Dec, 4:00 PM). Register via the Webinars tab to receive your verified participation certificate.',
    category: 'academic',
    visibility: 'campus',
    createdAt: '6h ago',
    likesCount: 76,
    commentsCount: 9,
    isLiked: true,
    isSaved: false,
  },
  {
    id: 'post_5',
    author: MOCK_USERS.yard_bulletin,
    content:
      'Campus Announcement: Central Library timings have been extended until 11:00 PM for end-semester preparations. IEEE Week Closing Session will take place on 20 Dec at the Main Auditorium.',
    category: 'campus-life',
    visibility: 'campus',
    createdAt: '8h ago',
    likesCount: 92,
    commentsCount: 5,
    isLiked: false,
    isSaved: false,
  },
];

export const INITIAL_COMMENTS: Record<string, Comment[]> = {
  post_1: [
    {
      id: 'com_1',
      postId: 'post_1',
      author: MOCK_USERS.leo,
      content: 'Early morning Bodleian is unrivaled. Best hours for uninterrupted work.',
      createdAt: '20m ago',
      likesCount: 3,
    },
    {
      id: 'com_2',
      postId: 'post_1',
      author: MOCK_USERS.elena,
      content: 'Good luck with Davies! His question on market equilibria was infamous last term.',
      createdAt: '12m ago',
      likesCount: 1,
    },
  ],
  post_2: [
    {
      id: 'com_3',
      postId: 'post_2',
      author: CURRENT_USER,
      content: 'Will paper abstracts be co-reviewed with Oxford Uehiro Centre faculty?',
      createdAt: '1h ago',
      likesCount: 5,
      isOwnComment: true,
    },
  ],
  post_3: [
    {
      id: 'com_4',
      postId: 'post_3',
      author: CURRENT_USER,
      content: 'Sent you a DM on campus chat — would love to discuss UI/UX and mobile client integration.',
      createdAt: '3h ago',
      likesCount: 2,
      isOwnComment: true,
    },
  ],
};

export const INITIAL_SUGGESTIONS: ConnectionSuggestion[] = [
  {
    id: 'sug_1',
    user: MOCK_USERS.amara,
    mutualCircles: 3,
    mutualCount: 14,
    reason: 'Economics & Management · Lady Margaret Hall',
    isConnected: false,
  },
  {
    id: 'sug_2',
    user: MOCK_USERS.leo,
    mutualCircles: 5,
    mutualCount: 22,
    reason: "Engineering Science · St. John's",
    isConnected: false,
  },
  {
    id: 'sug_3',
    user: MOCK_USERS.elena,
    mutualCircles: 2,
    mutualCount: 9,
    reason: 'Law & Jurisprudence · Merton',
    isConnected: false,
  },
  {
    id: 'sug_4',
    user: MOCK_USERS.tariq,
    mutualCircles: 4,
    mutualCount: 17,
    reason: 'Medicine & Health · Christ Church',
    isConnected: false,
  },
];

export const INITIAL_TRENDING: TrendingTopic[] = [
  {
    id: 'trend_1',
    tag: '#NIUCodeSprint26',
    title: '24-Hr Hackathon Registrations Open',
    postCount: 412,
    category: 'Hackathons',
  },
  {
    id: 'trend_2',
    tag: '#SIHInternalRound',
    title: 'Smart India Hackathon Team Formation',
    postCount: 186,
    category: 'Research',
  },
  {
    id: 'trend_3',
    tag: '#AIInRealWorld',
    title: 'Webinar with Dr. R. Kulkarni · 8 Dec',
    postCount: 745,
    category: 'Webinars',
  },
  {
    id: 'trend_4',
    tag: '#NIUBookExchange',
    title: 'Semester Textbook & Notes Swap',
    postCount: 328,
    category: 'Books',
  },
];

