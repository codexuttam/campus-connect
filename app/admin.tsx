import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Switch,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Flag,
  Compass,
  Code2,
  Video,
  Calendar,
  BookOpen,
  ClipboardList,
  Megaphone,
  BarChart3,
  KeyRound,
  Settings,
  Search,
  Plus,
  Check,
  X,
  Download,
  ArrowLeft,
} from 'lucide-react-native';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { AppText } from '../components/ui/AppText';
import { AppAvatar } from '../components/ui/AppAvatar';
import { AppBadge } from '../components/ui/AppBadge';
import { AppButton } from '../components/ui/AppButton';
import { theme } from '../theme';
import { showAlert } from '../services/dialog';

type AdminSection =
  | 'dashboard'
  | 'users'
  | 'verification'
  | 'moderation'
  | 'communities'
  | 'hackathons'
  | 'webinars'
  | 'events'
  | 'books'
  | 'registrations'
  | 'announcements'
  | 'reports'
  | 'roles'
  | 'settings';

const ADMIN_NAV: { id: AdminSection; label: string; icon: any }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'verification', label: 'Student Verification', icon: ShieldCheck },
  { id: 'moderation', label: 'Moderation', icon: Flag },
  { id: 'communities', label: 'Communities', icon: Compass },
  { id: 'hackathons', label: 'Hackathons', icon: Code2 },
  { id: 'webinars', label: 'Webinars', icon: Video },
  { id: 'events', label: 'Events & Sessions', icon: Calendar },
  { id: 'books', label: 'Book Exchange', icon: BookOpen },
  { id: 'registrations', label: 'Registrations', icon: ClipboardList },
  { id: 'announcements', label: 'Announcements', icon: Megaphone },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'roles', label: 'Roles & Permissions', icon: KeyRound },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const INITIAL_USERS = [
  { id: '1', name: 'Aarav Mishra', erp: 'NIU-24-14789', branch: 'CSE', year: '3rd', role: 'Student', status: 'Active' },
  { id: '2', name: 'Priya Sharma', erp: 'NIU-24-14803', branch: 'CSE (AI/ML)', year: '3rd', role: 'Organizer', status: 'Active' },
  { id: '3', name: 'Rohan Verma', erp: 'NIU-25-15021', branch: 'IT', year: '2nd', role: 'Student', status: 'Active' },
  { id: '4', name: 'Sneha Patil', erp: 'NIU-24-14876', branch: 'CSE (AI/ML)', year: '3rd', role: 'Student', status: 'Suspended' },
  { id: '5', name: 'Karan Singh', erp: 'NIU-25-15043', branch: 'ECE', year: '3rd', role: 'Student', status: 'Active' },
  { id: '6', name: 'Uttamraj Singh', erp: 'NIU-24-14701', branch: 'CSE (AI/ML)', year: '3rd', role: 'Admin', status: 'Active' },
];

const INITIAL_POST_MODERATION = [
  {
    id: 'pm-1',
    author: 'Ankit Das',
    time: '2h ago',
    title: 'Looking for a partner for Smart India Hackathon 🚀',
    body: 'Need teammates from CSE/IT, DM if interested!',
    state: 'pending',
  },
  {
    id: 'pm-2',
    author: 'Neha Gupta',
    time: '4h ago',
    title: 'Selling: DBMS (Korth) – Like New',
    body: 'Price: ₹350 | DM for details.',
    state: 'pending',
  },
  {
    id: 'pm-3',
    author: 'Rishi Tomar',
    time: '6h ago',
    title: 'Event: Workshop on GenAI (Unofficial)',
    body: 'Join this external workshop on Sunday...',
    state: 'pending',
  },
];

const INITIAL_BOOK_MODERATION = [
  {
    id: 'bm-1',
    title: 'DBMS (Korth) – 7th Ed.',
    seller: 'by Rohan Verma • ₹250',
    state: 'pending',
  },
  {
    id: 'bm-2',
    title: 'ML by Andrew Ng',
    seller: 'by Sneha Patil • ₹450',
    state: 'pending',
  },
  {
    id: 'bm-3',
    title: 'Operating System Concepts (10th Ed)',
    seller: 'by Aarav Mishra • ₹320',
    state: 'pending',
  },
];

export default function AdminPortalScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 920;

  const [section, setSection] = useState<AdminSection>('dashboard');
  const [users, setUsers] = useState(INITIAL_USERS);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleTab, setUserRoleTab] = useState<'All' | 'Student' | 'Organizer' | 'Admin'>('All');

  const [postQueue, setPostQueue] = useState(INITIAL_POST_MODERATION);
  const [bookQueue, setBookQueue] = useState(INITIAL_BOOK_MODERATION);
  const [autoModeration, setAutoModeration] = useState(true);
  const [erpVerificationRequired, setErpVerificationRequired] = useState(true);

  const filteredUsers = users.filter((u) => {
    const matchesRole = userRoleTab === 'All' || u.role === userRoleTab;
    const q = userSearch.trim().toLowerCase();
    const matchesSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.erp.toLowerCase().includes(q) ||
      u.branch.toLowerCase().includes(q);
    return matchesRole && matchesSearch;
  });

  const toggleUserStatus = (id: string) => {
    setUsers(
      users.map((u) =>
        u.id === id
          ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' }
          : u
      )
    );
  };

  const handleModeratePost = (id: string, nextState: 'approved' | 'rejected') => {
    setPostQueue(postQueue.map((p) => (p.id === id ? { ...p, state: nextState } : p)));
  };

  const handleModerateBook = (id: string, nextState: 'approved' | 'rejected') => {
    setBookQueue(bookQueue.map((b) => (b.id === id ? { ...b, state: nextState } : b)));
  };

  return (
    <ScreenContainer safeTop padded={false} style={styles.container}>
      {/* Top Admin Header */}
      <View style={styles.topHeader}>
        <View style={styles.brandRow}>
          <Pressable onPress={() => router.push('/(tabs)')} style={{ padding: 4 }}>
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
              Admin Portal · Noida International University
            </AppText>
          </View>
        </View>

        <View style={styles.topHeaderActions}>
          <Pressable
            onPress={() => router.push('/landing')}
            style={styles.switchBtn}
          >
            <AppText variant="captionMedium" color="primary">
              Public Site
            </AppText>
          </Pressable>
          <Pressable
            onPress={() => router.push('/(tabs)')}
            style={[styles.switchBtn, { backgroundColor: theme.colors.maroon }]}
          >
            <AppText variant="captionMedium" style={{ color: '#FFFFFF' }}>
              Student App →
            </AppText>
          </Pressable>
        </View>
      </View>

      {/* Mobile horizontal nav when not desktop */}
      {!isDesktop && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.mobileNavStrip}
        >
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            const isSelected = section === item.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => setSection(item.id)}
                style={[styles.mobileNavChip, isSelected && styles.mobileNavChipActive]}
              >
                <Icon size={13} color={isSelected ? '#FFFFFF' : theme.colors.textSecondary} />
                <AppText
                  variant="captionMedium"
                  style={isSelected ? { color: '#FFFFFF' } : { color: theme.colors.textPrimary }}
                >
                  {item.label}
                </AppText>
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      <View style={styles.bodyWrapper}>
        {/* Left Sidebar on Desktop */}
        {isDesktop && (
          <View style={styles.sidebar}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sidebarContent}>
              {ADMIN_NAV.map((item) => {
                const Icon = item.icon;
                const isSelected = section === item.id;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => setSection(item.id)}
                    style={[styles.sidebarItem, isSelected && styles.sidebarItemActive]}
                  >
                    <Icon
                      size={16}
                      color={isSelected ? '#FFFFFF' : theme.colors.textSecondary}
                    />
                    <AppText
                      variant="bodySmallMedium"
                      style={isSelected ? styles.sidebarTextActive : styles.sidebarText}
                    >
                      {item.label}
                    </AppText>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Main Admin Content Area */}
        <ScrollView
          style={styles.mainArea}
          contentContainerStyle={styles.mainScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ================= 1. ADMIN DASHBOARD ================= */}
          {section === 'dashboard' && (
            <View>
              <View style={styles.pageTitleRow}>
                <View>
                  <AppText variant="h1" serif color="primary">
                    Admin Dashboard
                  </AppText>
                  <AppText variant="caption" color="secondary">
                    Overview of platform activity and campus engagement · Last 30 Days
                  </AppText>
                </View>
              </View>

              {/* 4 KPI Cards */}
              <View style={styles.kpiRow}>
                {[
                  { label: 'Total Students', value: '4,862', delta: '+ 12.4%' },
                  { label: 'Active Communities', value: '128', delta: '+ 6.1%' },
                  { label: 'Events & Sessions', value: '36', delta: '+ 20.0%' },
                  { label: 'Hackathons', value: '12', delta: '+ 33.3%' },
                ].map((kpi) => (
                  <View key={kpi.label} style={styles.kpiCard}>
                    <AppText variant="h1" serif style={{ color: theme.colors.maroon }}>
                      {kpi.value}
                    </AppText>
                    <AppText variant="captionMedium" color="secondary" style={{ marginTop: 2 }}>
                      {kpi.label}
                    </AppText>
                    <AppText variant="captionMedium" style={styles.deltaGreen}>
                      {kpi.delta}
                    </AppText>
                  </View>
                ))}
              </View>

              {/* Platform Activity & Engagement Cards */}
              <View style={styles.chartsRow}>
                <View style={[styles.panelCard, { flex: 1.5 }]}>
                  <View style={styles.cardTopRow}>
                    <AppText variant="h3" serif color="primary">
                      Platform Activity
                    </AppText>
                    <View style={styles.activeUsersPill}>
                      <AppText variant="bodySmallMedium" style={{ color: theme.colors.maroon }}>
                        3,842 Active Users
                      </AppText>
                    </View>
                  </View>
                  <View style={styles.barChartArea}>
                    {[
                      { date: 'Oct 24', pct: 38 },
                      { date: 'Oct 28', pct: 52 },
                      { date: 'Nov 1', pct: 48 },
                      { date: 'Nov 5', pct: 64 },
                      { date: 'Nov 9', pct: 58 },
                      { date: 'Nov 13', pct: 82 },
                      { date: 'Nov 17', pct: 95 },
                    ].map((pt) => (
                      <View key={pt.date} style={styles.barCol}>
                        <View style={styles.barTrack}>
                          <View style={[styles.barFill, { height: `${pt.pct}%` }]} />
                        </View>
                        <AppText variant="caption" color="muted" style={{ fontSize: 10 }}>
                          {pt.date}
                        </AppText>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={[styles.panelCard, { flex: 1 }]}>
                  <AppText variant="h3" serif color="primary">
                    Engagement
                  </AppText>
                  <View style={styles.donutCircle}>
                    <AppText variant="h1" serif style={{ color: theme.colors.maroon }}>
                      86%
                    </AppText>
                    <AppText variant="caption" color="secondary">
                      Active
                    </AppText>
                  </View>
                  <View style={{ gap: 6 }}>
                    {[
                      { label: 'Posts', val: '42%', color: theme.colors.maroon },
                      { label: 'Events', val: '24%', color: '#861E35' },
                      { label: 'Communities', val: '18%', color: '#9F3048' },
                      { label: 'Others', val: '16%', color: '#C8C9CE' },
                    ].map((row) => (
                      <View key={row.label} style={styles.legendRow}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <View style={[styles.legendDot, { backgroundColor: row.color }]} />
                          <AppText variant="caption" color="secondary">
                            {row.label}
                          </AppText>
                        </View>
                        <AppText variant="captionMedium" color="primary">
                          {row.val}
                        </AppText>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* ================= 2. USER MANAGEMENT ================= */}
          {section === 'users' && (
            <View>
              <AppText variant="h1" serif color="primary">
                User Management
              </AppText>
              <AppText variant="caption" color="secondary" style={{ marginBottom: 14 }}>
                Manage all student and organizer accounts
              </AppText>

              <View style={styles.filterPillsRow}>
                {(
                  [
                    { id: 'All', label: 'All Users (4,862)' },
                    { id: 'Student', label: 'Students (4,712)' },
                    { id: 'Organizer', label: 'Organizers (118)' },
                    { id: 'Admin', label: 'Admins (32)' },
                  ] as const
                ).map((t) => (
                  <Pressable
                    key={t.id}
                    onPress={() => setUserRoleTab(t.id)}
                    style={[styles.pillTab, userRoleTab === t.id && styles.pillTabActive]}
                  >
                    <AppText
                      variant="captionMedium"
                      style={userRoleTab === t.id ? { color: '#FFFFFF' } : { color: theme.colors.textPrimary }}
                    >
                      {t.label}
                    </AppText>
                  </Pressable>
                ))}
              </View>

              <View style={styles.searchBox}>
                <Search size={15} color={theme.colors.textMuted} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by name, ERP ID, or branch..."
                  placeholderTextColor={theme.colors.textMuted}
                  value={userSearch}
                  onChangeText={setUserSearch}
                />
              </View>

              <View style={styles.panelCard}>
                {filteredUsers.map((u, idx) => (
                  <View key={u.id} style={styles.tableRow}>
                    <AppText variant="caption" color="muted" style={{ width: 22 }}>
                      {idx + 1}
                    </AppText>
                    <AppAvatar name={u.name} size="sm" style={{ backgroundColor: theme.colors.maroon }} />
                    <View style={{ flex: 1.2 }}>
                      <AppText variant="bodySmallMedium" color="primary">
                        {u.name}
                      </AppText>
                      <AppText variant="caption" color="secondary">
                        {u.erp}
                      </AppText>
                    </View>
                    <AppText variant="captionMedium" color="primary" style={{ flex: 0.9 }}>
                      {u.branch} · {u.year}
                    </AppText>
                    <AppText variant="caption" color="secondary" style={{ width: 70 }}>
                      {u.role}
                    </AppText>
                    <Pressable
                      onPress={() => toggleUserStatus(u.id)}
                      style={[
                        styles.statusBadge,
                        u.status === 'Active' ? styles.statusActive : styles.statusSuspended,
                      ]}
                    >
                      <AppText
                        variant="captionMedium"
                        style={
                          u.status === 'Active'
                            ? { color: theme.colors.success }
                            : { color: theme.colors.error }
                        }
                      >
                        {u.status}
                      </AppText>
                    </Pressable>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ================= 3. STUDENT VERIFICATION ================= */}
          {section === 'verification' && (
            <View>
              <AppText variant="h1" serif color="primary">
                Student ERP & ID Verification
              </AppText>
              <AppText variant="caption" color="secondary" style={{ marginBottom: 14 }}>
                Review pending institutional ID uploads and ERP records
              </AppText>
              <View style={styles.panelCard}>
                {[
                  { name: 'Divya Chauhan', erp: 'NIU-25-15108', branch: 'B.Tech CSE (AI/ML) • 1st Year' },
                  { name: 'Harshvardhan Rao', erp: 'NIU-24-14944', branch: 'BBA • 2nd Year' },
                ].map((v) => (
                  <View key={v.erp} style={styles.tableRow}>
                    <AppAvatar name={v.name} size="sm" style={{ backgroundColor: theme.colors.maroon }} />
                    <View style={{ flex: 1 }}>
                      <AppText variant="bodySmallMedium" color="primary">
                        {v.name} ({v.erp})
                      </AppText>
                      <AppText variant="caption" color="secondary">
                        {v.branch} · Institutional ID Card Attached
                      </AppText>
                    </View>
                    <AppButton
                      title="Verify ERP"
                      variant="primary"
                      size="sm"
                      onPress={() =>
                        showAlert('Student Verified', `${v.name} (${v.erp}) has been granted a Verified NIU badge.`)
                      }
                    />
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ================= 4. POST MODERATION ================= */}
          {section === 'moderation' && (
            <View>
              <AppText variant="h1" serif color="primary">
                Post Moderation
              </AppText>
              <AppText variant="caption" color="secondary" style={{ marginBottom: 14 }}>
                Review and manage reported or pending posts
              </AppText>

              <View style={{ gap: 12 }}>
                {postQueue.map((p) => (
                  <View key={p.id} style={styles.panelCard}>
                    <View style={styles.tableRow}>
                      <AppAvatar name={p.author} size="sm" style={{ backgroundColor: theme.colors.maroon }} />
                      <View style={{ flex: 1 }}>
                        <AppText variant="caption" color="secondary">
                          {p.author} • {p.time}
                        </AppText>
                        <AppText variant="bodySmallMedium" color="primary" style={{ marginTop: 2 }}>
                          {p.title}
                        </AppText>
                        <AppText variant="caption" color="secondary" style={{ marginTop: 2 }}>
                          {p.body}
                        </AppText>
                      </View>
                      {p.state === 'pending' ? (
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                          <Pressable
                            onPress={() => handleModeratePost(p.id, 'approved')}
                            style={styles.approveBtn}
                          >
                            <Check size={13} color={theme.colors.success} />
                            <AppText variant="captionMedium" style={{ color: theme.colors.success }}>
                              Approve
                            </AppText>
                          </Pressable>
                          <Pressable
                            onPress={() => handleModeratePost(p.id, 'rejected')}
                            style={styles.rejectBtn}
                          >
                            <X size={13} color={theme.colors.error} />
                            <AppText variant="captionMedium" style={{ color: theme.colors.error }}>
                              Reject
                            </AppText>
                          </Pressable>
                        </View>
                      ) : (
                        <AppBadge
                          label={p.state.toUpperCase()}
                          variant={p.state === 'approved' ? 'olive' : 'maroon'}
                          size="sm"
                        />
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ================= 5. COMMUNITY MANAGEMENT ================= */}
          {section === 'communities' && (
            <View>
              <View style={styles.cardTopRow}>
                <View>
                  <AppText variant="h1" serif color="primary">
                    Community Management
                  </AppText>
                  <AppText variant="caption" color="secondary">
                    Create, manage and monitor student communities
                  </AppText>
                </View>
                <AppButton
                  title="+ Create Community"
                  variant="primary"
                  size="sm"
                  onPress={() => router.push('/campus/communities')}
                />
              </View>

              <View style={[styles.panelCard, { marginTop: 14 }]}>
                {[
                  { name: 'NIU Coding Club', members: '1,242', posts: '3,890', status: 'Active' },
                  { name: 'AI/ML Study Group', members: '846', posts: '2,114', status: 'Active' },
                  { name: 'Cricket @ NIU', members: '642', posts: '1,376', status: 'Active' },
                  { name: 'Books & Resources', members: '510', posts: '980', status: 'Active' },
                  { name: 'Design & Creative', members: '398', posts: '601', status: 'Inactive' },
                ].map((c) => (
                  <View key={c.name} style={styles.tableRow}>
                    <AppAvatar name={c.name} size="sm" style={{ backgroundColor: theme.colors.maroon }} />
                    <AppText variant="bodySmallMedium" color="primary" style={{ flex: 1.4 }}>
                      {c.name}
                    </AppText>
                    <AppText variant="caption" color="secondary" style={{ flex: 0.8 }}>
                      {c.members} members
                    </AppText>
                    <AppText variant="caption" color="secondary" style={{ flex: 0.8 }}>
                      {c.posts} posts
                    </AppText>
                    <View
                      style={[
                        styles.statusBadge,
                        c.status === 'Active' ? styles.statusActive : styles.statusSuspended,
                      ]}
                    >
                      <AppText
                        variant="captionMedium"
                        style={
                          c.status === 'Active'
                            ? { color: theme.colors.success }
                            : { color: theme.colors.error }
                        }
                      >
                        {c.status}
                      </AppText>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ================= 6. HACKATHON MANAGEMENT ================= */}
          {section === 'hackathons' && (
            <View>
              <View style={styles.cardTopRow}>
                <View>
                  <AppText variant="h1" serif color="primary">
                    Hackathon Management
                  </AppText>
                  <AppText variant="caption" color="secondary">
                    Create, manage and track hackathon events
                  </AppText>
                </View>
                <AppButton
                  title="+ Create Hackathon"
                  variant="primary"
                  size="sm"
                  onPress={() => showAlert('Create Hackathon', 'Hackathon creation wizard ready.')}
                />
              </View>

              <View style={{ gap: 12, marginTop: 14 }}>
                {[
                  { title: "NIU CodeSprint '26", meta: '5 - 6 Dec 2025 • 24 Hr Hackathon', reg: 'Registrations: 412 / 500', status: 'Active' },
                  { title: 'Hackemon 2.0', meta: '20 - 21 Jan 2026 • Inter-College', reg: 'Registrations: 189 / 300', status: 'Upcoming' },
                  { title: 'SIH Internal Round', meta: '15 Dec 2025 • NIU Campus', reg: 'Registrations: 76 / 100', status: 'Open' },
                ].map((h) => (
                  <View key={h.title} style={styles.panelCard}>
                    <View style={styles.tableRow}>
                      <View style={{ flex: 1 }}>
                        <AppText variant="h3" serif color="primary">
                          {h.title}
                        </AppText>
                        <AppText variant="caption" color="secondary">
                          {h.meta} · {h.reg}
                        </AppText>
                      </View>
                      <AppBadge label={h.status} variant="olive" size="sm" />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ================= 7. WEBINAR MANAGEMENT ================= */}
          {section === 'webinars' && (
            <View>
              <View style={styles.cardTopRow}>
                <View>
                  <AppText variant="h1" serif color="primary">
                    Webinar Management
                  </AppText>
                  <AppText variant="caption" color="secondary">
                    Schedule and manage webinars
                  </AppText>
                </View>
                <AppButton
                  title="+ Schedule Webinar"
                  variant="primary"
                  size="sm"
                  onPress={() => showAlert('Schedule Webinar', 'Webinar scheduling drawer ready.')}
                />
              </View>

              <View style={{ gap: 12, marginTop: 14 }}>
                {[
                  { title: 'AI in Real World', meta: '8 Dec 2025, 4:00 PM • Speaker: Dr. R. Kulkarni', status: 'Live Soon' },
                  { title: 'Career in Product & AI', meta: '14 Dec 2025, 5:00 PM • Speaker: PM @ Microsoft', status: 'Scheduled' },
                  { title: 'Research with LLMs', meta: '21 Dec 2025, 4:00 PM • Registered: 430 / 600', status: 'Scheduled' },
                ].map((w) => (
                  <View key={w.title} style={styles.panelCard}>
                    <View style={styles.tableRow}>
                      <View style={{ flex: 1 }}>
                        <AppText variant="h3" serif color="primary">
                          {w.title}
                        </AppText>
                        <AppText variant="caption" color="secondary">
                          {w.meta}
                        </AppText>
                      </View>
                      <AppBadge label={w.status} variant="maroon" size="sm" />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ================= 8. EVENTS & SESSIONS MANAGEMENT ================= */}
          {section === 'events' && (
            <View>
              <View style={styles.cardTopRow}>
                <View>
                  <AppText variant="h1" serif color="primary">
                    Events & Sessions
                  </AppText>
                  <AppText variant="caption" color="secondary">
                    Manage college events, workshops and sessions
                  </AppText>
                </View>
                <AppButton
                  title="+ Create Event"
                  variant="primary"
                  size="sm"
                  onPress={() => showAlert('Create Event', 'Campus event publisher opened.')}
                />
              </View>

              <View style={{ gap: 12, marginTop: 14 }}>
                {[
                  { title: 'Tech Talk Series #3', meta: '10 Dec 2025, 2:00 PM • Seminar Hall • Registered: 356', status: 'Open' },
                  { title: 'IEEE Week – Closing Session', meta: '20 Dec 2025, 11:00 AM • Auditorium • Registered: 921', status: 'Open' },
                  { title: 'Alumni Interaction', meta: '27 Dec 2025, 4:00 PM • Online • Registered: 268', status: 'Scheduled' },
                ].map((e) => (
                  <View key={e.title} style={styles.panelCard}>
                    <View style={styles.tableRow}>
                      <View style={{ flex: 1 }}>
                        <AppText variant="h3" serif color="primary">
                          {e.title}
                        </AppText>
                        <AppText variant="caption" color="secondary">
                          {e.meta}
                        </AppText>
                      </View>
                      <AppBadge label={e.status} variant="olive" size="sm" />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ================= 9. BOOK EXCHANGE MODERATION ================= */}
          {section === 'books' && (
            <View>
              <AppText variant="h1" serif color="primary">
                Book Exchange Moderation
              </AppText>
              <AppText variant="caption" color="secondary" style={{ marginBottom: 14 }}>
                Review, approve and manage student book listings
              </AppText>

              <View style={{ gap: 12 }}>
                {bookQueue.map((b) => (
                  <View key={b.id} style={styles.panelCard}>
                    <View style={styles.tableRow}>
                      <View style={{ flex: 1 }}>
                        <AppText variant="bodySmallMedium" color="primary">
                          {b.title}
                        </AppText>
                        <AppText variant="caption" color="secondary">
                          {b.seller}
                        </AppText>
                      </View>
                      {b.state === 'pending' ? (
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                          <Pressable
                            onPress={() => handleModerateBook(b.id, 'approved')}
                            style={styles.approveBtn}
                          >
                            <AppText variant="captionMedium" style={{ color: theme.colors.success }}>
                              Approve
                            </AppText>
                          </Pressable>
                          <Pressable
                            onPress={() => handleModerateBook(b.id, 'rejected')}
                            style={styles.rejectBtn}
                          >
                            <AppText variant="captionMedium" style={{ color: theme.colors.error }}>
                              Reject
                            </AppText>
                          </Pressable>
                        </View>
                      ) : (
                        <AppBadge
                          label={b.state.toUpperCase()}
                          variant={b.state === 'approved' ? 'olive' : 'maroon'}
                          size="sm"
                        />
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ================= 10. REGISTRATIONS ================= */}
          {section === 'registrations' && (
            <View>
              <View style={styles.cardTopRow}>
                <View>
                  <AppText variant="h1" serif color="primary">
                    Registrations
                  </AppText>
                  <AppText variant="caption" color="secondary">
                    View and manage event and hackathon registrations
                  </AppText>
                </View>
                <AppButton
                  title="Export CSV"
                  variant="outline"
                  size="sm"
                  onPress={() => showAlert('Export Ready', 'Exported 2,434 registration records to CSV.')}
                />
              </View>

              <View style={[styles.panelCard, { marginTop: 14 }]}>
                {[
                  { name: "NIU CodeSprint '26", reg: '412', cap: '500', status: 'Open' },
                  { name: 'AI in Real World (Webinar)', reg: '745', cap: '1,000', status: 'Open' },
                  { name: 'Tech Talk Series #3', reg: '356', cap: '400', status: 'Open' },
                  { name: 'IEEE Week – Closing Session', reg: '921', cap: '1,200', status: 'Open' },
                ].map((r) => (
                  <View key={r.name} style={styles.tableRow}>
                    <AppText variant="bodySmallMedium" color="primary" style={{ flex: 1.5 }}>
                      {r.name}
                    </AppText>
                    <AppText variant="captionMedium" color="primary" style={{ flex: 0.7 }}>
                      {r.reg} Registered
                    </AppText>
                    <AppText variant="caption" color="secondary" style={{ flex: 0.7 }}>
                      Cap: {r.cap}
                    </AppText>
                    <View style={[styles.statusBadge, styles.statusActive]}>
                      <AppText variant="captionMedium" style={{ color: theme.colors.success }}>
                        {r.status}
                      </AppText>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ================= 11. ANNOUNCEMENTS ================= */}
          {section === 'announcements' && (
            <View>
              <View style={styles.cardTopRow}>
                <View>
                  <AppText variant="h1" serif color="primary">
                    Announcements
                  </AppText>
                  <AppText variant="caption" color="secondary">
                    Create and publish important campus updates
                  </AppText>
                </View>
                <AppButton
                  title="+ New Announcement"
                  variant="primary"
                  size="sm"
                  onPress={() => showAlert('New Announcement', 'Campus broadcast composer ready.')}
                />
              </View>

              <View style={{ gap: 12, marginTop: 14 }}>
                {[
                  { title: 'Winter Break Notice', time: 'Published • 2h ago' },
                  { title: 'IEEE Week – Schedule Update', time: 'Published • 1 day ago' },
                  { title: 'Library Timings Extended', time: 'Published • 3 days ago' },
                ].map((a) => (
                  <View key={a.title} style={styles.panelCard}>
                    <AppText variant="h3" serif color="primary">
                      {a.title}
                    </AppText>
                    <AppText variant="caption" color="secondary" style={{ marginTop: 2 }}>
                      {a.time}
                    </AppText>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ================= 12. ANALYTICS & REPORTS ================= */}
          {section === 'reports' && (
            <View>
              <View style={styles.cardTopRow}>
                <View>
                  <AppText variant="h1" serif color="primary">
                    Reports & Analytics
                  </AppText>
                  <AppText variant="caption" color="secondary">
                    Platform reports and insights (Last 6 Months)
                  </AppText>
                </View>
                <AppButton
                  title="Download Report"
                  variant="outline"
                  size="sm"
                  onPress={() => showAlert('Report Downloaded', 'NIU Connect 6-month executive report generated.')}
                />
              </View>

              <View style={[styles.kpiRow, { marginTop: 14 }]}>
                <View style={styles.kpiCard}>
                  <AppText variant="caption" color="secondary">
                    Total Registrations
                  </AppText>
                  <AppText variant="h1" serif style={{ color: theme.colors.maroon }}>
                    6,428
                  </AppText>
                  <AppText variant="captionMedium" style={styles.deltaGreen}>
                    ↑ +24.8%
                  </AppText>
                </View>
                <View style={styles.kpiCard}>
                  <AppText variant="caption" color="secondary">
                    Reported Content
                  </AppText>
                  <AppText variant="h1" serif style={{ color: theme.colors.maroon }}>
                    36
                  </AppText>
                  <AppText variant="captionMedium" style={styles.deltaGreen}>
                    ↓ -18.2%
                  </AppText>
                </View>
              </View>
            </View>
          )}

          {/* ================= 13. ROLES & PERMISSIONS & 14. ADMIN SETTINGS ================= */}
          {(section === 'roles' || section === 'settings') && (
            <View>
              <AppText variant="h1" serif color="primary">
                {section === 'roles' ? 'Roles & Permissions' : 'Admin Settings'}
              </AppText>
              <AppText variant="caption" color="secondary" style={{ marginBottom: 14 }}>
                Configure platform, roles and policies for Noida International University
              </AppText>

              <View style={{ gap: 12 }}>
                <View style={styles.panelCard}>
                  <View style={styles.tableRow}>
                    <View style={{ flex: 1 }}>
                      <AppText variant="bodySmallMedium" color="primary">
                        Mandatory NIU ERP ID Verification
                      </AppText>
                      <AppText variant="caption" color="secondary">
                        Require valid NIU-XX-XXXXX ERP format before allowing posts or book listings
                      </AppText>
                    </View>
                    <Switch
                      value={erpVerificationRequired}
                      onValueChange={setErpVerificationRequired}
                      trackColor={{ false: theme.colors.border, true: theme.colors.maroon }}
                      thumbColor="#FFFFFF"
                    />
                  </View>
                </View>

                <View style={styles.panelCard}>
                  <View style={styles.tableRow}>
                    <View style={{ flex: 1 }}>
                      <AppText variant="bodySmallMedium" color="primary">
                        Automated Prohibited Keyword Moderation
                      </AppText>
                      <AppText variant="caption" color="secondary">
                        Auto-hold posts or book listings matching restricted items
                      </AppText>
                    </View>
                    <Switch
                      value={autoModeration}
                      onValueChange={setAutoModeration}
                      trackColor={{ false: theme.colors.border, true: theme.colors.maroon }}
                      thumbColor="#FFFFFF"
                    />
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.screenPadding,
    paddingVertical: 12,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  topHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
  },
  mobileNavStrip: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingVertical: 10,
    gap: 8,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  mobileNavChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  mobileNavChipActive: {
    backgroundColor: theme.colors.maroon,
    borderColor: theme.colors.maroon,
  },
  bodyWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 230,
    backgroundColor: theme.colors.card,
    borderRightWidth: 1,
    borderRightColor: theme.colors.border,
  },
  sidebarContent: {
    padding: 12,
    gap: 3,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: theme.radius.md,
  },
  sidebarItemActive: {
    backgroundColor: theme.colors.maroon,
  },
  sidebarText: {
    color: theme.colors.textPrimary,
  },
  sidebarTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  mainArea: {
    flex: 1,
  },
  mainScrollContent: {
    padding: 20,
    paddingBottom: 80,
    maxWidth: 1120,
  },
  pageTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  kpiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  kpiCard: {
    flex: 1,
    minWidth: 150,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 16,
  },
  deltaGreen: {
    color: theme.colors.success,
    marginTop: 4,
  },
  chartsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  panelCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 16,
    minWidth: 260,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },
  activeUsersPill: {
    backgroundColor: theme.colors.maroonLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
  },
  barChartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 150,
    paddingTop: 20,
    marginTop: 10,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  barTrack: {
    width: 22,
    height: 110,
    backgroundColor: theme.colors.background,
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: theme.colors.maroon,
    borderRadius: 6,
  },
  donutCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 10,
    borderColor: theme.colors.maroon,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  filterPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  pillTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  pillTabActive: {
    backgroundColor: theme.colors.maroon,
    borderColor: theme.colors.maroon,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
    height: 40,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    color: theme.colors.textPrimary,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.borderSubtle,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
  },
  statusActive: {
    backgroundColor: theme.colors.successLight,
  },
  statusSuspended: {
    backgroundColor: theme.colors.errorLight,
  },
  approveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.successLight,
  },
  rejectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.errorLight,
  },
});
