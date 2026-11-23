import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Code2,
  Calendar,
  Video,
  Users,
  Briefcase,
  BookOpen,
  MapPin,
  HelpCircle,
  GraduationCap,
  Trophy,
  Clock,
  CheckCircle2,
  Plus,
  ArrowLeft,
  Sparkles,
  UserPlus,
} from 'lucide-react-native';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { AppText } from '../../components/ui/AppText';
import { AppAvatar } from '../../components/ui/AppAvatar';
import { AppBadge } from '../../components/ui/AppBadge';
import { AppButton } from '../../components/ui/AppButton';
import { theme } from '../../theme';
import { showAlert } from '../../services/dialog';

type CampusModuleKey =
  | 'hackathons'
  | 'events'
  | 'webinars'
  | 'communities'
  | 'careers'
  | 'resources'
  | 'lost-found'
  | 'college'
  | 'help';

const MODULE_TABS: { id: CampusModuleKey; label: string; icon: any }[] = [
  { id: 'hackathons', label: 'Hackathons', icon: Code2 },
  { id: 'events', label: 'Events & Calendar', icon: Calendar },
  { id: 'webinars', label: 'Webinars', icon: Video },
  { id: 'communities', label: 'Communities', icon: Users },
  { id: 'careers', label: 'Careers', icon: Briefcase },
  { id: 'resources', label: 'Academic Resources', icon: BookOpen },
  { id: 'lost-found', label: 'Lost & Found', icon: MapPin },
  { id: 'college', label: 'My College', icon: GraduationCap },
  { id: 'help', label: 'Help Center', icon: HelpCircle },
];

const HACKATHONS = [
  {
    id: 'hack-1',
    title: "NIU CodeSprint '26",
    date: '5 - 6 Dec 2025 • 24 Hr Hackathon',
    prize: '₹1,50,000 Prize Pool',
    venue: 'NIU Main Auditorium & Innovation Labs',
    teamSize: 'Teams of 2–4',
    registered: '412 / 500',
    status: 'Active',
    tracks: ['Generative AI & Agents', 'Campus FinTech', 'Smart Healthcare', 'Open Innovation'],
    description:
      'Noida International University flagship 24-hour coding marathon organized by NIU Coding Club. Build working prototypes judged by industry engineering leaders.',
  },
  {
    id: 'hack-2',
    title: 'Hackemon 2.0 – Inter-College',
    date: '20 - 21 Jan 2026 • Inter-College Sprint',
    prize: '₹1,00,000 Prize Pool',
    venue: 'School of Engineering & Technology (SET)',
    teamSize: 'Teams of 3–4',
    registered: '189 / 300',
    status: 'Upcoming',
    tracks: ['Web3 & Cybersecurity', 'EdTech', 'Climate & Sustainability'],
    description:
      '36-hour inter-university hackathon bringing together top builders across NCR for hardware and software product sprints.',
  },
  {
    id: 'hack-3',
    title: 'SIH Internal Round 2026',
    date: '15 Dec 2025 • NIU Campus',
    prize: 'National Nomination + ₹50,000 Seed Grant',
    venue: 'Seminar Hall A, Block 3',
    teamSize: 'Teams of 6 (Mandatory 1 Female Member)',
    registered: '76 / 100',
    status: 'Open',
    tracks: ['Ministry Problem Statements', 'Smart Automation', 'MedTech'],
    description:
      'Official Smart India Hackathon internal shortlisting round for Noida International University teams.',
  },
];

const TEAMMATES_FINDER = [
  {
    id: 'tm-1',
    name: 'Ankit Das',
    branch: '3rd Year • CSE • NIU-24-14902',
    skills: ['React Native', 'FastAPI', 'Docker'],
    lookingFor: 'Looking for AI/ML & UI/UX partner for Smart India Hackathon',
  },
  {
    id: 'tm-2',
    name: 'Priya Sharma',
    branch: '3rd Year • CSE (AI/ML) • NIU-24-14803',
    skills: ['PyTorch', 'LangChain', 'Python'],
    lookingFor: 'Building an LLM agent for NIU CodeSprint ’26 — need 1 frontend dev',
  },
  {
    id: 'tm-3',
    name: 'Karan Singh',
    branch: '3rd Year • ECE • NIU-25-15043',
    skills: ['IoT', 'Embedded C', 'ESP32'],
    lookingFor: 'Seeking cloud/mobile developer for Smart Healthcare track',
  },
];

const WEBINARS = [
  {
    id: 'web-1',
    title: 'AI in Real World: From Transformers to Production Agents',
    speaker: 'Dr. R. Kulkarni',
    role: 'Principal AI Scientist & Visiting Chair',
    date: '8 Dec 2025, 4:00 PM',
    registered: '745 / 1,000',
    status: 'Live Soon',
    topics: ['RAG Architectures', 'Latency Optimization', 'Evaluation Benchmarks'],
  },
  {
    id: 'web-2',
    title: 'Career in Product & AI Engineering',
    speaker: 'Ananya Mehta',
    role: 'Senior Product Manager @ Microsoft',
    date: '14 Dec 2025, 5:00 PM',
    registered: '518 / 800',
    status: 'Scheduled',
    topics: ['Resume Shortlisting', 'AI PM Case Studies', 'Off-Campus Referrals'],
  },
  {
    id: 'web-3',
    title: 'Research with LLMs & Writing Publishable IEEE Papers',
    speaker: 'Prof. S. Verma',
    role: 'Dean of Research, SET • NIU',
    date: '21 Dec 2025, 4:00 PM',
    registered: '430 / 600',
    status: 'Scheduled',
    topics: ['Literature Review', 'Reproducible Experiments', 'IEEE LaTeX Templates'],
  },
];

const EVENTS_LIST = [
  {
    id: 'ev-1',
    title: 'Tech Talk Series #3: System Design at Scale',
    date: '10 Dec 2025, 2:00 PM',
    venue: 'Seminar Hall, Block B',
    registered: '356 / 400',
    status: 'Open',
    schedule: [
      { time: '02:00 PM', topic: 'Keynote: Distributed Caching & Queues' },
      { time: '03:15 PM', topic: 'Live Architecture Breakdown & Q&A' },
      { time: '04:00 PM', topic: 'Student Networking & Refreshments' },
    ],
  },
  {
    id: 'ev-2',
    title: 'IEEE Week – Closing Ceremony & Project Awards',
    date: '20 Dec 2025, 11:00 AM',
    venue: 'NIU Main Auditorium',
    registered: '921 / 1,200',
    status: 'Open',
    schedule: [
      { time: '11:00 AM', topic: 'Exhibition of Top 20 Student Capstone Projects' },
      { time: '01:00 PM', topic: 'Award Distribution by Vice Chancellor' },
    ],
  },
  {
    id: 'ev-3',
    title: 'NIU Alumni Interaction & Placement Mentorship',
    date: '27 Dec 2025, 4:00 PM',
    venue: 'Hybrid • Auditorium & Online',
    registered: '268 / 500',
    status: 'Scheduled',
    schedule: [
      { time: '04:00 PM', topic: 'Panel with Class of 2022–2024 Software Engineers' },
      { time: '05:00 PM', topic: '1-on-1 Mock Interview Signups' },
    ],
  },
];

export default function CampusModuleScreen() {
  const router = useRouter();
  const { module } = useLocalSearchParams<{ module?: string }>();
  const { width } = useWindowDimensions();
  const isWide = width >= 840;

  const initialKey = (MODULE_TABS.find((t) => t.id === module)?.id || 'hackathons') as CampusModuleKey;
  const [activeModule, setActiveModule] = useState<CampusModuleKey>(initialKey);

  useEffect(() => {
    if (module && MODULE_TABS.some((t) => t.id === module)) {
      setActiveModule(module as CampusModuleKey);
    }
  }, [module]);

  // Sub-views state
  const [hackSubTab, setHackSubTab] = useState<'list' | 'details' | 'team' | 'teammates'>('list');
  const [selectedHackId, setSelectedHackId] = useState('hack-1');
  const [registeredIds, setRegisteredIds] = useState<string[]>(['hack-1']);
  const [invitedTeammateIds, setInvitedTeammateIds] = useState<string[]>([]);
  const [teamName, setTeamName] = useState('NIU Neural Mavericks');

  // Communities create state
  const [commSubTab, setCommSubTab] = useState<'list' | 'create'>('list');
  const [newCommName, setNewCommName] = useState('');
  const [newCommDesc, setNewCommDesc] = useState('');
  const [joinedCommIds, setJoinedCommIds] = useState<string[]>(['NIU Coding Club', 'AI/ML Study Group']);

  const selectedHackathon = HACKATHONS.find((h) => h.id === selectedHackId) || HACKATHONS[0];

  const toggleRegister = (id: string, title: string) => {
    if (registeredIds.includes(id)) {
      setRegisteredIds(registeredIds.filter((item) => item !== id));
    } else {
      setRegisteredIds([...registeredIds, id]);
      showAlert(
        'Registration Confirmed',
        `Your NIU ERP profile is now registered for "${title}". Confirmation pass added to your Student Dashboard.`
      );
    }
  };

  return (
    <ScreenContainer scrollable safeTop padded={false} style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.topLeft}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backBtn}
            hitSlop={8}
          >
            <ArrowLeft size={19} color={theme.colors.textPrimary} />
          </Pressable>
          <View style={styles.diamondOuter}>
            <View style={styles.diamondInner} />
          </View>
          <View>
            <AppText variant="h3" serif style={{ color: theme.colors.maroon }}>
              NIU Connect
            </AppText>
            <AppText variant="caption" color="secondary">
              Noida International University · Campus Ecosystem
            </AppText>
          </View>
        </View>

        <View style={styles.topActions}>
          <Pressable
            onPress={() => router.push('/(tabs)')}
            style={styles.topPill}
          >
            <AppText variant="captionMedium" color="primary">
              Dashboard
            </AppText>
          </Pressable>
          <Pressable
            onPress={() => router.push('/admin')}
            style={[styles.topPill, { backgroundColor: theme.colors.maroon }]}
          >
            <AppText variant="captionMedium" style={{ color: '#FFFFFF' }}>
              Admin Portal
            </AppText>
          </Pressable>
        </View>
      </View>

      {/* Module Switcher Strip */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.moduleTabsRow}
      >
        {MODULE_TABS.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeModule === tab.id;
          return (
            <Pressable
              key={tab.id}
              onPress={() => setActiveModule(tab.id)}
              style={[styles.moduleChip, isSelected && styles.moduleChipActive]}
            >
              <Icon
                size={14}
                color={isSelected ? '#FFFFFF' : theme.colors.textSecondary}
              />
              <AppText
                variant="captionMedium"
                style={isSelected ? styles.moduleChipTextActive : styles.moduleChipText}
              >
                {tab.label}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.body}>
        {/* ================= 1. HACKATHONS (LISTINGS, DETAILS, TEAM, FIND TEAMMATES) ================= */}
        {activeModule === 'hackathons' && (
          <View>
            <View style={styles.subTabsBar}>
              {(
                [
                  { id: 'list', label: 'Hackathon Listings' },
                  { id: 'details', label: 'Hackathon Details' },
                  { id: 'team', label: 'Team Management' },
                  { id: 'teammates', label: 'Find Teammates' },
                ] as const
              ).map((st) => (
                <Pressable
                  key={st.id}
                  onPress={() => setHackSubTab(st.id)}
                  style={[styles.subTabBtn, hackSubTab === st.id && styles.subTabBtnActive]}
                >
                  <AppText
                    variant="captionMedium"
                    style={hackSubTab === st.id ? styles.subTabTextActive : styles.subTabText}
                  >
                    {st.label}
                  </AppText>
                </Pressable>
              ))}
            </View>

            {hackSubTab === 'list' && (
              <View style={styles.cardsStack}>
                {HACKATHONS.map((h) => {
                  const isReg = registeredIds.includes(h.id);
                  return (
                    <View key={h.id} style={styles.featureCard}>
                      <View style={styles.cardTopRow}>
                        <AppBadge label={h.status} variant="maroon" size="sm" />
                        <AppText variant="captionMedium" style={{ color: theme.colors.maroon }}>
                          {h.prize}
                        </AppText>
                      </View>
                      <AppText variant="h2" serif color="primary" style={{ marginTop: 6 }}>
                        {h.title}
                      </AppText>
                      <AppText variant="caption" color="secondary" style={{ marginTop: 2 }}>
                        {h.date} · {h.venue}
                      </AppText>
                      <AppText variant="bodySmall" color="secondary" style={{ marginVertical: 10 }}>
                        {h.description}
                      </AppText>
                      <View style={styles.tagsWrap}>
                        {h.tracks.map((tr) => (
                          <View key={tr} style={styles.tagPill}>
                            <AppText variant="caption" color="primary">
                              {tr}
                            </AppText>
                          </View>
                        ))}
                      </View>
                      <View style={styles.cardFooterRow}>
                        <AppText variant="captionMedium" color="secondary">
                          Registrations: {h.registered} · {h.teamSize}
                        </AppText>
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                          <AppButton
                            title="Details"
                            variant="outline"
                            size="sm"
                            onPress={() => {
                              setSelectedHackId(h.id);
                              setHackSubTab('details');
                            }}
                          />
                          <AppButton
                            title={isReg ? 'Registered ✓' : 'Register Now'}
                            variant={isReg ? 'secondary' : 'primary'}
                            size="sm"
                            onPress={() => toggleRegister(h.id, h.title)}
                          />
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            {hackSubTab === 'details' && (
              <View style={styles.featureCard}>
                <View style={styles.heroBannerMaroon}>
                  <AppBadge label={selectedHackathon.status} variant="neutral" size="sm" />
                  <AppText variant="h1" serif style={{ color: '#FFFFFF', marginTop: 8 }}>
                    {selectedHackathon.title}
                  </AppText>
                  <AppText variant="bodySmall" style={{ color: 'rgba(255,255,255,0.86)', marginTop: 4 }}>
                    {selectedHackathon.date} · {selectedHackathon.venue}
                  </AppText>
                  <AppText variant="h3" serif style={{ color: '#FFFFFF', marginTop: 12 }}>
                    🏆 {selectedHackathon.prize}
                  </AppText>
                </View>

                <AppText variant="body" color="primary" style={{ marginVertical: 12, lineHeight: 22 }}>
                  {selectedHackathon.description}
                </AppText>

                <AppText variant="captionMedium" color="secondary" style={{ marginBottom: 8 }}>
                  PROBLEM STATEMENT TRACKS
                </AppText>
                <View style={styles.tagsWrap}>
                  {selectedHackathon.tracks.map((tr) => (
                    <View key={tr} style={styles.tagPill}>
                      <AppText variant="captionMedium" color="primary">
                        {tr}
                      </AppText>
                    </View>
                  ))}
                </View>

                <View style={[styles.cardFooterRow, { marginTop: 18 }]}>
                  <AppButton
                    title="Manage My Team"
                    variant="outline"
                    size="sm"
                    onPress={() => setHackSubTab('team')}
                  />
                  <AppButton
                    title={
                      registeredIds.includes(selectedHackathon.id)
                        ? 'Registered ✓'
                        : 'Confirm Team Registration'
                    }
                    variant="primary"
                    size="sm"
                    onPress={() => toggleRegister(selectedHackathon.id, selectedHackathon.title)}
                  />
                </View>
              </View>
            )}

            {hackSubTab === 'team' && (
              <View style={styles.featureCard}>
                <AppText variant="h2" serif color="primary">
                  Team Management — {selectedHackathon.title}
                </AppText>
                <AppText variant="caption" color="secondary" style={{ marginBottom: 14 }}>
                  Configure your squad roles and invite verified NIU peers.
                </AppText>

                <AppText variant="captionMedium" color="secondary" style={{ marginBottom: 4 }}>
                  TEAM NAME
                </AppText>
                <TextInput
                  style={styles.input}
                  value={teamName}
                  onChangeText={setTeamName}
                />

                <AppText variant="captionMedium" color="secondary" style={{ marginTop: 8, marginBottom: 8 }}>
                  ACTIVE SQUAD MEMBERS (3 / 4)
                </AppText>
                {[
                  { name: 'Uttamraj Singh (Lead)', role: 'AI/ML & Architecture · CSE 3rd Yr' },
                  { name: 'Priya Sharma', role: 'LLM & Backend · CSE 3rd Yr' },
                  { name: 'Rohan Verma', role: 'Full-Stack & UI · IT 2nd Yr' },
                ].map((m) => (
                  <View key={m.name} style={styles.memberRow}>
                    <AppAvatar name={m.name} size="sm" style={{ backgroundColor: theme.colors.maroon }} />
                    <View style={{ flex: 1 }}>
                      <AppText variant="bodySmallMedium" color="primary">
                        {m.name}
                      </AppText>
                      <AppText variant="caption" color="secondary">
                        {m.role}
                      </AppText>
                    </View>
                    <AppBadge label="Confirmed" variant="olive" size="sm" />
                  </View>
                ))}

                <View style={{ marginTop: 14, flexDirection: 'row', gap: 10 }}>
                  <AppButton
                    title="Find 4th Teammate"
                    variant="primary"
                    size="sm"
                    onPress={() => setHackSubTab('teammates')}
                  />
                </View>
              </View>
            )}

            {hackSubTab === 'teammates' && (
              <View style={styles.cardsStack}>
                {TEAMMATES_FINDER.map((tm) => {
                  const isInvited = invitedTeammateIds.includes(tm.id);
                  return (
                    <View key={tm.id} style={styles.featureCard}>
                      <View style={styles.memberRow}>
                        <AppAvatar name={tm.name} size="md" style={{ backgroundColor: theme.colors.maroon }} />
                        <View style={{ flex: 1 }}>
                          <AppText variant="bodyMedium" color="primary">
                            {tm.name}
                          </AppText>
                          <AppText variant="caption" color="secondary">
                            {tm.branch}
                          </AppText>
                        </View>
                        <AppButton
                          title={isInvited ? 'Invite Sent ✓' : 'Invite to Team'}
                          variant={isInvited ? 'secondary' : 'primary'}
                          size="sm"
                          onPress={() => {
                            if (!isInvited) {
                              setInvitedTeammateIds([...invitedTeammateIds, tm.id]);
                              showAlert('Teammate Invited', `Sent a team invite to ${tm.name} for ${teamName}.`);
                            }
                          }}
                        />
                      </View>
                      <AppText variant="bodySmall" color="primary" style={{ marginVertical: 8 }}>
                        {tm.lookingFor}
                      </AppText>
                      <View style={styles.tagsWrap}>
                        {tm.skills.map((s) => (
                          <View key={s} style={styles.tagPill}>
                            <AppText variant="caption" color="primary">
                              {s}
                            </AppText>
                          </View>
                        ))}
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}

        {/* ================= 2. EVENTS CALENDAR & SESSION SCHEDULE ================= */}
        {activeModule === 'events' && (
          <View style={styles.cardsStack}>
            {EVENTS_LIST.map((ev) => {
              const isReg = registeredIds.includes(ev.id);
              return (
                <View key={ev.id} style={styles.featureCard}>
                  <View style={styles.cardTopRow}>
                    <AppBadge label={ev.status} variant="olive" size="sm" />
                    <AppText variant="captionMedium" style={{ color: theme.colors.maroon }}>
                      {ev.registered} Registered
                    </AppText>
                  </View>
                  <AppText variant="h2" serif color="primary" style={{ marginTop: 6 }}>
                    {ev.title}
                  </AppText>
                  <AppText variant="caption" color="secondary" style={{ marginBottom: 10 }}>
                    📅 {ev.date}  ·  📍 {ev.venue}
                  </AppText>

                  <AppText variant="captionMedium" color="secondary" style={{ marginBottom: 6 }}>
                    SESSION SCHEDULE
                  </AppText>
                  {ev.schedule.map((slot) => (
                    <View key={slot.time} style={styles.scheduleSlot}>
                      <AppText variant="captionMedium" style={{ color: theme.colors.maroon, width: 74 }}>
                        {slot.time}
                      </AppText>
                      <AppText variant="bodySmall" color="primary" style={{ flex: 1 }}>
                        {slot.topic}
                      </AppText>
                    </View>
                  ))}

                  <View style={[styles.cardFooterRow, { marginTop: 12 }]}>
                    <AppText variant="caption" color="secondary">
                      Verified NIU Student Pass Included
                    </AppText>
                    <AppButton
                      title={isReg ? 'RSVP Confirmed ✓' : 'RSVP for Event'}
                      variant={isReg ? 'secondary' : 'primary'}
                      size="sm"
                      onPress={() => toggleRegister(ev.id, ev.title)}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* ================= 3. WEBINARS & SPEAKER CARDS ================= */}
        {activeModule === 'webinars' && (
          <View style={styles.cardsStack}>
            {WEBINARS.map((w) => {
              const isReg = registeredIds.includes(w.id);
              return (
                <View key={w.id} style={styles.featureCard}>
                  <View style={styles.cardTopRow}>
                    <AppBadge label={w.status} variant="maroon" size="sm" />
                    <AppText variant="caption" color="secondary">
                      {w.registered} Registered
                    </AppText>
                  </View>
                  <AppText variant="h2" serif color="primary" style={{ marginTop: 6 }}>
                    {w.title}
                  </AppText>
                  <View style={[styles.memberRow, { marginVertical: 10 }]}>
                    <AppAvatar name={w.speaker} size="sm" style={{ backgroundColor: theme.colors.maroon }} />
                    <View style={{ flex: 1 }}>
                      <AppText variant="bodySmallMedium" color="primary">
                        Speaker: {w.speaker}
                      </AppText>
                      <AppText variant="caption" color="secondary">
                        {w.role} · {w.date}
                      </AppText>
                    </View>
                  </View>
                  <View style={styles.tagsWrap}>
                    {w.topics.map((t) => (
                      <View key={t} style={styles.tagPill}>
                        <AppText variant="caption" color="primary">
                          {t}
                        </AppText>
                      </View>
                    ))}
                  </View>
                  <View style={[styles.cardFooterRow, { marginTop: 12 }]}>
                    <AppText variant="caption" color="secondary">
                      Includes e-Certificate
                    </AppText>
                    <AppButton
                      title={isReg ? 'Seat Reserved ✓' : 'Register for Webinar'}
                      variant={isReg ? 'secondary' : 'primary'}
                      size="sm"
                      onPress={() => toggleRegister(w.id, w.title)}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* ================= 4. COMMUNITIES & CREATE COMMUNITY ================= */}
        {activeModule === 'communities' && (
          <View>
            <View style={styles.subTabsBar}>
              <Pressable
                onPress={() => setCommSubTab('list')}
                style={[styles.subTabBtn, commSubTab === 'list' && styles.subTabBtnActive]}
              >
                <AppText
                  variant="captionMedium"
                  style={commSubTab === 'list' ? styles.subTabTextActive : styles.subTabText}
                >
                  All NIU Communities (128)
                </AppText>
              </Pressable>
              <Pressable
                onPress={() => setCommSubTab('create')}
                style={[styles.subTabBtn, commSubTab === 'create' && styles.subTabBtnActive]}
              >
                <AppText
                  variant="captionMedium"
                  style={commSubTab === 'create' ? styles.subTabTextActive : styles.subTabText}
                >
                  + Create Community
                </AppText>
              </Pressable>
            </View>

            {commSubTab === 'list' ? (
              <View style={styles.cardsStack}>
                {[
                  { name: 'NIU Coding Club', members: '1,242', posts: '3,890', desc: 'Competitive coding, hackathons, and open-source development at NIU.' },
                  { name: 'AI/ML Study Group', members: '846', posts: '2,114', desc: 'Deep learning reading group, LLM fine-tuning sprints, and research papers.' },
                  { name: 'Cricket @ NIU', members: '642', posts: '1,376', desc: 'Official university cricket squad updates, trials, and inter-school fixtures.' },
                  { name: 'Books & Resources', members: '510', posts: '980', desc: 'Semester book exchange, handwritten notes, and exam preparation circles.' },
                  { name: 'Design & Creative', members: '398', posts: '601', desc: 'UI/UX design critiques, Figma workshops, and campus photography.' },
                ].map((c) => {
                  const isJoined = joinedCommIds.includes(c.name);
                  return (
                    <View key={c.name} style={styles.featureCard}>
                      <View style={styles.memberRow}>
                        <AppAvatar name={c.name} size="md" style={{ backgroundColor: theme.colors.maroon }} />
                        <View style={{ flex: 1 }}>
                          <AppText variant="h3" serif color="primary">
                            {c.name}
                          </AppText>
                          <AppText variant="caption" color="secondary">
                            {c.members} members · {c.posts} posts
                          </AppText>
                        </View>
                        <AppButton
                          title={isJoined ? 'Joined ✓' : 'Join'}
                          variant={isJoined ? 'secondary' : 'primary'}
                          size="sm"
                          onPress={() => {
                            if (isJoined) {
                              setJoinedCommIds(joinedCommIds.filter((n) => n !== c.name));
                            } else {
                              setJoinedCommIds([...joinedCommIds, c.name]);
                            }
                          }}
                        />
                      </View>
                      <AppText variant="bodySmall" color="secondary" style={{ marginTop: 8 }}>
                        {c.desc}
                      </AppText>
                    </View>
                  );
                })}
              </View>
            ) : (
              <View style={styles.featureCard}>
                <AppText variant="h2" serif color="primary" style={{ marginBottom: 4 }}>
                  Launch a New NIU Student Community
                </AppText>
                <AppText variant="caption" color="secondary" style={{ marginBottom: 14 }}>
                  New societies are reviewed by the Student Council & Dean of Student Welfare.
                </AppText>
                <AppText variant="captionMedium" color="secondary" style={{ marginBottom: 4 }}>
                  COMMUNITY NAME
                </AppText>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. NIU Quantum Computing Circle"
                  value={newCommName}
                  onChangeText={setNewCommName}
                />
                <AppText variant="captionMedium" color="secondary" style={{ marginBottom: 4 }}>
                  MISSION & WEEKLY SCHEDULE
                </AppText>
                <TextInput
                  style={[styles.input, { height: 80, textAlignVertical: 'top', paddingTop: 10 }]}
                  placeholder="Describe your club activities and meeting timings..."
                  multiline
                  value={newCommDesc}
                  onChangeText={setNewCommDesc}
                />
                <AppButton
                  title="Submit Community Proposal"
                  variant="primary"
                  onPress={() => {
                    if (!newCommName.trim()) {
                      showAlert('Missing Name', 'Please enter a community name.');
                      return;
                    }
                    setJoinedCommIds([...joinedCommIds, newCommName.trim()]);
                    setNewCommName('');
                    setNewCommDesc('');
                    setCommSubTab('list');
                    showAlert('Community Created', 'Your community has been published to NIU Connect.');
                  }}
                />
              </View>
            )}
          </View>
        )}

        {/* ================= 5. CAREER OPPORTUNITIES ================= */}
        {activeModule === 'careers' && (
          <View style={styles.cardsStack}>
            {[
              {
                role: 'Software Engineering Intern (AI / Full-Stack)',
                company: 'Microsoft India (R&D) · via NIU Placement Cell',
                stipend: '₹80,000 / month',
                deadline: 'Apply by 18 Dec 2025',
              },
              {
                role: 'Machine Learning Research Fellow',
                company: 'NIU Center for Applied AI & Robotics',
                stipend: '₹25,000 / month Grant',
                deadline: 'Apply by 22 Dec 2025',
              },
              {
                role: 'Product Design & Frontend Intern',
                company: 'Razorpay · NCR Campus Drive',
                stipend: '₹55,000 / month',
                deadline: 'Apply by 28 Dec 2025',
              },
            ].map((job) => (
              <View key={job.role} style={styles.featureCard}>
                <AppText variant="h3" serif color="primary">
                  {job.role}
                </AppText>
                <AppText variant="bodySmall" color="secondary" style={{ marginTop: 2 }}>
                  {job.company}
                </AppText>
                <View style={[styles.cardFooterRow, { marginTop: 12 }]}>
                  <AppText variant="captionMedium" style={{ color: theme.colors.maroon }}>
                    {job.stipend} · {job.deadline}
                  </AppText>
                  <AppButton
                    title="Apply with ERP Profile"
                    variant="primary"
                    size="sm"
                    onPress={() =>
                      showAlert(
                        'Application Submitted',
                        `Your verified NIU ERP profile has been submitted for ${job.role}.`
                      )
                    }
                  />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ================= 6. ACADEMIC RESOURCES ================= */}
        {activeModule === 'resources' && (
          <View style={styles.cardsStack}>
            {[
              { title: 'CSE (AI/ML) 5th Sem – Complete PYQ & Solved Papers Archive', meta: 'PDF Bundle · 428 Downloads · Verified by Faculty' },
              { title: 'DBMS (Korth) & Operating Systems Lecture Slides + Lab Manuals', meta: 'NIU SET Repository · Updated Nov 2025' },
              { title: 'Deep Learning & Transformer Architectures – Lab Notebooks', meta: 'Jupyter / Colab Repository · AI/ML Study Group' },
            ].map((res) => (
              <View key={res.title} style={styles.featureCard}>
                <AppText variant="h3" serif color="primary">
                  {res.title}
                </AppText>
                <AppText variant="caption" color="secondary" style={{ marginTop: 4, marginBottom: 12 }}>
                  {res.meta}
                </AppText>
                <AppButton
                  title="Open Resource in Reader"
                  variant="outline"
                  size="sm"
                  onPress={() =>
                    showAlert('Resource Opened', `Loaded "${res.title}" in your NIU Academic Reader.`)
                  }
                />
              </View>
            ))}
          </View>
        )}

        {/* ================= 7. LOST AND FOUND ================= */}
        {activeModule === 'lost-found' && (
          <View style={styles.cardsStack}>
            {[
              { item: 'Found: Apple AirPods Pro Case (White)', loc: 'Deposited at SET Block B Reception · 2h ago', status: 'Found' },
              { item: 'Lost: NIU Student ID Card (ERP: NIU-24-14890)', loc: 'Last seen near Central Library 2nd Floor · 5h ago', status: 'Lost' },
              { item: 'Found: Casio FX-991EX Scientific Calculator', loc: 'Seminar Hall A Front Desk · Yesterday', status: 'Found' },
            ].map((lf) => (
              <View key={lf.item} style={styles.featureCard}>
                <View style={styles.cardTopRow}>
                  <AppBadge label={lf.status} variant={lf.status === 'Found' ? 'olive' : 'maroon'} size="sm" />
                  <AppText variant="caption" color="secondary">
                    {lf.loc}
                  </AppText>
                </View>
                <AppText variant="h3" serif color="primary" style={{ marginVertical: 8 }}>
                  {lf.item}
                </AppText>
                <AppButton
                  title="Contact Finder / Claim"
                  variant="outline"
                  size="sm"
                  onPress={() => router.push('/(tabs)/chats')}
                />
              </View>
            ))}
          </View>
        )}

        {/* ================= 8. MY COLLEGE & 9. HELP CENTER ================= */}
        {(activeModule === 'college' || activeModule === 'help') && (
          <View style={styles.featureCard}>
            <AppText variant="captionMedium" style={{ color: theme.colors.maroon, marginBottom: 4 }}>
              {activeModule === 'college' ? 'NOIDA INTERNATIONAL UNIVERSITY' : 'NIU CONNECT HELP CENTER'}
            </AppText>
            <AppText variant="h2" serif color="primary" style={{ marginBottom: 8 }}>
              {activeModule === 'college'
                ? 'School of Engineering & Technology (SET)'
                : 'Student Support & Verification Desk'}
            </AppText>
            <AppText variant="bodySmall" color="secondary" style={{ lineHeight: 20, marginBottom: 16 }}>
              {activeModule === 'college'
                ? 'Yamuna Expressway, Sector 17A, Greater Noida, Uttar Pradesh 203201. Official campus portal for 4,862+ verified students, 128 societies, and faculty mentors.'
                : 'Need assistance with ERP ID verification, hackathon registration, or reporting a marketplace listing? Our student moderation council responds within 2 hours.'}
            </AppText>
            <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
              <AppButton
                title="Open Book Exchange"
                variant="primary"
                size="sm"
                onPress={() => router.push('/marketplace')}
              />
              <AppButton
                title="Message Campus Support"
                variant="outline"
                size="sm"
                onPress={() => router.push('/(tabs)/chats')}
              />
            </View>
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.screenPadding,
    paddingVertical: 12,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  topLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backBtn: {
    padding: 4,
  },
  diamondOuter: {
    width: 22,
    height: 22,
    borderRadius: 4,
    backgroundColor: theme.colors.maroon,
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  diamondInner: {
    width: 8,
    height: 8,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  topPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
  },
  moduleTabsRow: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  moduleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  moduleChipActive: {
    backgroundColor: theme.colors.maroon,
    borderColor: theme.colors.maroon,
  },
  moduleChipText: {
    color: theme.colors.textSecondary,
  },
  moduleChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  body: {
    maxWidth: 1040,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: theme.spacing.screenPadding,
    paddingVertical: 18,
  },
  subTabsBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  subTabBtn: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  subTabBtnActive: {
    backgroundColor: theme.colors.maroonLight,
    borderColor: theme.colors.maroon,
  },
  subTabText: {
    color: theme.colors.textSecondary,
  },
  subTabTextActive: {
    color: theme.colors.maroon,
    fontWeight: '700',
  },
  cardsStack: {
    gap: 14,
  },
  featureCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 18,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderSubtle,
  },
  heroBannerMaroon: {
    backgroundColor: theme.colors.maroon,
    borderRadius: theme.radius.md,
    padding: 18,
  },
  input: {
    height: 42,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 12,
    fontSize: 13.5,
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  scheduleSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.borderSubtle,
  },
});
