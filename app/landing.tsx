import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Calendar,
  Code2,
  BookOpen,
  Video,
  Users,
  Bell,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Lock,
  Mail,
  User,
} from 'lucide-react-native';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { AppText } from '../components/ui/AppText';
import { AppButton } from '../components/ui/AppButton';
import { theme } from '../theme';
import { showAlert } from '../services/dialog';

type PublicPageTab =
  | 'landing'
  | 'features'
  | 'communities'
  | 'events'
  | 'about'
  | 'login'
  | 'signup'
  | 'forgot';

const FEATURE_TILES = [
  {
    id: 'events',
    label: 'Events & Sessions',
    desc: 'Campus fests, IEEE talks, seminars & cultural nights with 1-tap RSVP.',
    icon: Calendar,
    route: '/campus/events',
  },
  {
    id: 'hackathons',
    label: 'Hackathons',
    desc: 'NIU CodeSprint, SIH internal rounds, prize pools & team formation.',
    icon: Code2,
    route: '/campus/hackathons',
  },
  {
    id: 'books',
    label: 'Book Exchange',
    desc: 'Buy, sell, or swap engineering textbooks & handwritten notes in ₹.',
    icon: BookOpen,
    route: '/marketplace',
  },
  {
    id: 'webinars',
    label: 'Webinars',
    desc: 'Live sessions with industry mentors, alumni & research professors.',
    icon: Video,
    route: '/campus/webinars',
  },
  {
    id: 'communities',
    label: 'Communities',
    desc: '128+ verified student clubs including NIU Coding Club & AI/ML Group.',
    icon: Users,
    route: '/campus/communities',
  },
  {
    id: 'announcements',
    label: 'Announcements',
    desc: 'Official university circulars, exam schedules & library notices.',
    icon: Bell,
    route: '/(tabs)',
  },
];

export default function PublicLandingScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = width >= 860;

  const [activePage, setActivePage] = useState<PublicPageTab>('landing');
  const [emailInput, setEmailInput] = useState('uttamraj.singh@niu.edu.in');
  const [nameInput, setNameInput] = useState('Uttamraj Singh');
  const [erpInput, setErpInput] = useState('NIU-24-14789');
  const [passwordInput, setPasswordInput] = useState('••••••••••');

  return (
    <ScreenContainer scrollable safeTop padded={false} style={styles.container}>
      {/* ================= PUBLIC WEBSITE TOP NAVBAR ================= */}
      <View style={styles.navbar}>
        <Pressable
          onPress={() => setActivePage('landing')}
          style={styles.brandRow}
        >
          <View style={styles.diamondOuter}>
            <View style={styles.diamondInner} />
          </View>
          <AppText variant="h2" serif style={styles.brandTitle}>
            NIU Connect
          </AppText>
        </Pressable>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.navLinksRow}
        >
          {(
            [
              { id: 'landing', label: 'Home' },
              { id: 'features', label: 'Features' },
              { id: 'communities', label: 'Communities' },
              { id: 'events', label: 'Events' },
              { id: 'about', label: 'About' },
            ] as const
          ).map((nav) => {
            const isSelected = activePage === nav.id;
            return (
              <Pressable
                key={nav.id}
                onPress={() => setActivePage(nav.id)}
                style={[styles.navLinkBtn, isSelected && styles.navLinkBtnActive]}
              >
                <AppText
                  variant="bodySmallMedium"
                  style={isSelected ? styles.navLinkTextActive : styles.navLinkText}
                >
                  {nav.label}
                </AppText>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.navActions}>
          <Pressable
            onPress={() => setActivePage('login')}
            style={styles.loginBtn}
          >
            <AppText variant="captionMedium" color="primary">
              Log In
            </AppText>
          </Pressable>
          <Pressable
            onPress={() => setActivePage('signup')}
            style={styles.getStartedBtn}
          >
            <AppText variant="captionMedium" style={styles.getStartedText}>
              Get Started
            </AppText>
          </Pressable>
          <Pressable
            onPress={() => router.push('/(tabs)')}
            style={styles.dashboardBtn}
          >
            <AppText variant="captionMedium" style={styles.dashboardBtnText}>
              Student App →
            </AppText>
          </Pressable>
        </View>
      </View>

      {/* ================= HERO SECTION (ALWAYS VISIBLE ON LANDING) ================= */}
      {activePage === 'landing' && (
        <View style={styles.pageContent}>
          <View style={[styles.heroCard, isWide && styles.heroCardWide]}>
            {/* Geometric Diamond Accents */}
            <View style={styles.diamondBgTop} />
            <View style={styles.diamondBgBottom} />

            <View style={[styles.heroLeft, isWide && { flex: 1.15 }]}>
              <View style={styles.uniBadge}>
                <View style={styles.miniDiamond} />
                <AppText variant="captionMedium" color="primary">
                  Noida International University
                </AppText>
              </View>

              <AppText variant="h1" serif style={styles.heroHeading}>
                NIU Connect ✦
              </AppText>
              <AppText variant="h2" serif style={styles.heroSubheading}>
                Your Campus. Your Community.
              </AppText>

              <AppText variant="body" color="secondary" style={styles.heroDescription}>
                A student-first platform to collaborate, learn, participate in hackathons, attend webinars, exchange books and stay updated with every college event.
              </AppText>

              <View style={styles.heroCtaRow}>
                <Pressable
                  onPress={() => router.push('/(tabs)')}
                  style={styles.joinBtn}
                >
                  <AppText variant="button" style={styles.joinBtnText}>
                    Join NIU Connect
                  </AppText>
                  <ArrowRight size={16} color="#FFFFFF" />
                </Pressable>

                <Pressable
                  onPress={() => router.push('/admin')}
                  style={styles.organizerBtn}
                >
                  <AppText variant="button" color="primary">
                    For Organizers & Admins
                  </AppText>
                </Pressable>
              </View>

              <View style={styles.heroStatsStrip}>
                <View>
                  <AppText variant="h3" serif style={{ color: theme.colors.maroon }}>
                    4,862+
                  </AppText>
                  <AppText variant="caption" color="secondary">
                    Verified Students
                  </AppText>
                </View>
                <View style={styles.statDivider} />
                <View>
                  <AppText variant="h3" serif style={{ color: theme.colors.maroon }}>
                    128
                  </AppText>
                  <AppText variant="caption" color="secondary">
                    Active Communities
                  </AppText>
                </View>
                <View style={styles.statDivider} />
                <View>
                  <AppText variant="h3" serif style={{ color: theme.colors.maroon }}>
                    36+
                  </AppText>
                  <AppText variant="caption" color="secondary">
                    Events & Hackathons
                  </AppText>
                </View>
              </View>
            </View>

            {/* Right: NIU Campus Dome Visual Card */}
            <View style={[styles.heroRight, isWide && { flex: 0.95 }]}>
              <View style={styles.campusPhotoFrame}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
                  }}
                  style={styles.campusPhoto}
                  resizeMode="cover"
                />
                <View style={styles.campusOverlayBadge}>
                  <ShieldCheck size={15} color={theme.colors.maroon} />
                  <AppText variant="captionMedium" color="primary">
                    NIU Greater Noida Campus · Verified ERP Network
                  </AppText>
                </View>
              </View>
            </View>
          </View>

          {/* 6 Feature Cards Strip (Matching Bottom of Hero in Reference Image) */}
          <View style={styles.featureTilesRow}>
            {FEATURE_TILES.map((tile) => {
              const Icon = tile.icon;
              return (
                <Pressable
                  key={tile.id}
                  onPress={() => router.push(tile.route as any)}
                  style={[
                    styles.featureTile,
                    isWide ? { width: '15.5%' } : { width: '48%' },
                  ]}
                >
                  <View style={styles.featureTileIcon}>
                    <Icon size={20} color={theme.colors.maroon} />
                  </View>
                  <AppText
                    variant="captionMedium"
                    color="primary"
                    align="center"
                    style={styles.featureTileLabel}
                  >
                    {tile.label}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      {/* ================= FEATURES PAGE ================= */}
      {activePage === 'features' && (
        <View style={styles.pageContent}>
          <View style={styles.sectionHeaderBlock}>
            <AppText variant="captionMedium" style={styles.sectionKicker}>
              PLATFORM CAPABILITIES
            </AppText>
            <AppText variant="h1" serif color="primary">
              Everything Built for NIU Scholars
            </AppText>
            <AppText variant="body" color="secondary" style={{ marginTop: 4 }}>
              One unified luxury-academic network replacing fragmented WhatsApp groups and noticeboards.
            </AppText>
          </View>

          <View style={styles.grid3Col}>
            {FEATURE_TILES.map((f) => {
              const Icon = f.icon;
              return (
                <View
                  key={f.id}
                  style={[styles.detailCard, isWide ? { width: '31.8%' } : { width: '100%' }]}
                >
                  <View style={styles.featureTileIcon}>
                    <Icon size={20} color={theme.colors.maroon} />
                  </View>
                  <AppText variant="h3" serif color="primary" style={{ marginTop: 10 }}>
                    {f.label}
                  </AppText>
                  <AppText variant="bodySmall" color="secondary" style={{ marginTop: 4, marginBottom: 12 }}>
                    {f.desc}
                  </AppText>
                  <AppButton
                    title={`Explore ${f.label}`}
                    variant="outline"
                    size="sm"
                    onPress={() => router.push(f.route as any)}
                  />
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* ================= COMMUNITIES PREVIEW PAGE ================= */}
      {activePage === 'communities' && (
        <View style={styles.pageContent}>
          <View style={styles.sectionHeaderBlock}>
            <AppText variant="captionMedium" style={styles.sectionKicker}>
              128 ACTIVE STUDENT CLUBS
            </AppText>
            <AppText variant="h1" serif color="primary">
              NIU Communities Preview
            </AppText>
          </View>

          <View style={styles.grid3Col}>
            {[
              { name: 'NIU Coding Club', members: '1,242 members', posts: '3,890 posts', tag: 'Technical' },
              { name: 'AI/ML Study Group', members: '846 members', posts: '2,114 posts', tag: 'Research' },
              { name: 'Cricket @ NIU', members: '642 members', posts: '1,376 posts', tag: 'Sports' },
              { name: 'Books & Resources', members: '510 members', posts: '980 posts', tag: 'Academic' },
              { name: 'Design & Creative', members: '398 members', posts: '601 posts', tag: 'Design' },
              { name: 'NIU Robotics & IoT Club', members: '460 members', posts: '820 posts', tag: 'Hardware' },
            ].map((c) => (
              <View
                key={c.name}
                style={[styles.detailCard, isWide ? { width: '31.8%' } : { width: '100%' }]}
              >
                <AppText variant="captionMedium" style={{ color: theme.colors.maroon }}>
                  {c.tag}
                </AppText>
                <AppText variant="h3" serif color="primary" style={{ marginTop: 4 }}>
                  {c.name}
                </AppText>
                <AppText variant="caption" color="secondary" style={{ marginTop: 4, marginBottom: 12 }}>
                  {c.members} · {c.posts}
                </AppText>
                <AppButton
                  title="Open Community"
                  variant="primary"
                  size="sm"
                  onPress={() => router.push('/campus/communities')}
                />
              </View>
            ))}
          </View>
        </View>
      )}

      {/* ================= EVENTS PREVIEW PAGE ================= */}
      {activePage === 'events' && (
        <View style={styles.pageContent}>
          <View style={styles.sectionHeaderBlock}>
            <AppText variant="captionMedium" style={styles.sectionKicker}>
              HACKATHONS, WEBINARS & CAMPUS SESSIONS
            </AppText>
            <AppText variant="h1" serif color="primary">
              Upcoming Events at NIU
            </AppText>
          </View>

          <View style={styles.grid3Col}>
            {[
              {
                title: "NIU CodeSprint '26",
                date: '5 - 6 Dec 2025 • 24 Hr Hackathon',
                reg: '412 / 500 Registered',
                route: '/campus/hackathons',
              },
              {
                title: 'AI in Real World – Dr. R. Kulkarni',
                date: '8 Dec 2025, 4:00 PM • Live Webinar',
                reg: '745 / 1,000 Registered',
                route: '/campus/webinars',
              },
              {
                title: 'Tech Talk Series #3',
                date: '10 Dec 2025, 2:00 PM • Seminar Hall',
                reg: '356 / 400 Registered',
                route: '/campus/events',
              },
            ].map((ev) => (
              <View
                key={ev.title}
                style={[styles.detailCard, isWide ? { width: '31.8%' } : { width: '100%' }]}
              >
                <AppText variant="h3" serif color="primary">
                  {ev.title}
                </AppText>
                <AppText variant="caption" color="secondary" style={{ marginTop: 4 }}>
                  {ev.date}
                </AppText>
                <AppText variant="captionMedium" style={{ color: theme.colors.maroon, marginVertical: 10 }}>
                  {ev.reg}
                </AppText>
                <AppButton
                  title="View & Register"
                  variant="primary"
                  size="sm"
                  onPress={() => router.push(ev.route as any)}
                />
              </View>
            ))}
          </View>
        </View>
      )}

      {/* ================= ABOUT NIU CONNECT PAGE ================= */}
      {activePage === 'about' && (
        <View style={styles.pageContent}>
          <View style={styles.detailCard}>
            <AppText variant="captionMedium" style={styles.sectionKicker}>
              ABOUT NIU CONNECT
            </AppText>
            <AppText variant="h1" serif color="primary" style={{ marginBottom: 10 }}>
              Built for Noida International University
            </AppText>
            <AppText variant="body" color="secondary" style={{ lineHeight: 22, marginBottom: 16 }}>
              NIU Connect unites students across the School of Engineering & Technology (SET), School of Sciences, Business, Law, and Medical Sciences into a verified, distraction-free campus ecosystem. Every account is tied to an official NIU ERP ID and institutional email.
            </AppText>
            <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
              <AppButton
                title="Enter Student Dashboard"
                variant="primary"
                size="sm"
                onPress={() => router.push('/(tabs)')}
              />
              <AppButton
                title="Open Admin Portal"
                variant="outline"
                size="sm"
                onPress={() => router.push('/admin')}
              />
            </View>
          </View>
        </View>
      )}

      {/* ================= LOGIN / SIGN UP / FORGOT PASSWORD PREVIEWS ================= */}
      {(activePage === 'login' || activePage === 'signup' || activePage === 'forgot') && (
        <View style={styles.authPreviewWrapper}>
          <View style={styles.authCard}>
            <View style={styles.brandRow}>
              <View style={styles.diamondOuter}>
                <View style={styles.diamondInner} />
              </View>
              <AppText variant="h2" serif style={styles.brandTitle}>
                NIU Connect
              </AppText>
            </View>

            <AppText variant="h2" serif color="primary" style={{ marginTop: 14 }}>
              {activePage === 'login'
                ? 'Student & Organizer Sign In'
                : activePage === 'signup'
                ? 'Create Verified NIU Account'
                : 'Reset Institutional Password'}
            </AppText>
            <AppText variant="caption" color="secondary" style={{ marginBottom: 16 }}>
              {activePage === 'login'
                ? 'Sign in with your @niu.edu.in email or ERP ID.'
                : activePage === 'signup'
                ? 'Verify your Noida International University ERP ID to join.'
                : 'Enter your @niu.edu.in email to receive a reset link.'}
            </AppText>

            {activePage === 'signup' && (
              <>
                <AppText variant="captionMedium" color="secondary" style={styles.inputLabel}>
                  FULL NAME
                </AppText>
                <TextInput
                  style={styles.authInput}
                  value={nameInput}
                  onChangeText={setNameInput}
                  placeholder="e.g. Uttamraj Singh"
                />
                <AppText variant="captionMedium" color="secondary" style={styles.inputLabel}>
                  NIU ERP ID
                </AppText>
                <TextInput
                  style={styles.authInput}
                  value={erpInput}
                  onChangeText={setErpInput}
                  placeholder="e.g. NIU-24-14789"
                />
              </>
            )}

            <AppText variant="captionMedium" color="secondary" style={styles.inputLabel}>
              INSTITUTIONAL EMAIL
            </AppText>
            <TextInput
              style={styles.authInput}
              value={emailInput}
              onChangeText={setEmailInput}
              placeholder="student@niu.edu.in"
              autoCapitalize="none"
            />

            {activePage !== 'forgot' && (
              <>
                <AppText variant="captionMedium" color="secondary" style={styles.inputLabel}>
                  PASSWORD
                </AppText>
                <TextInput
                  style={styles.authInput}
                  value={passwordInput}
                  onChangeText={setPasswordInput}
                  secureTextEntry
                />
              </>
            )}

            <AppButton
              title={
                activePage === 'login'
                  ? 'Sign In to NIU Connect'
                  : activePage === 'signup'
                  ? 'Complete Student Verification'
                  : 'Send Password Reset Link'
              }
              variant="primary"
              fullWidth
              onPress={() => {
                if (activePage === 'forgot') {
                  showAlert(
                    'Reset Link Dispatched',
                    `A recovery link has been sent to ${emailInput}.`
                  );
                } else {
                  router.push('/(tabs)');
                }
              }}
              style={{ marginTop: 8 }}
            />

            <View style={styles.authSwitchRow}>
              {activePage !== 'login' && (
                <Pressable onPress={() => setActivePage('login')}>
                  <AppText variant="captionMedium" style={{ color: theme.colors.maroon }}>
                    Back to Log In
                  </AppText>
                </Pressable>
              )}
              {activePage === 'login' && (
                <>
                  <Pressable onPress={() => setActivePage('forgot')}>
                    <AppText variant="captionMedium" color="secondary">
                      Forgot Password?
                    </AppText>
                  </Pressable>
                  <Pressable onPress={() => setActivePage('signup')}>
                    <AppText variant="captionMedium" style={{ color: theme.colors.maroon }}>
                      Create Account →
                    </AppText>
                  </Pressable>
                </>
              )}
            </View>
          </View>
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
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
    width: 24,
    height: 24,
    borderRadius: 5,
    backgroundColor: theme.colors.maroon,
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  diamondInner: {
    width: 9,
    height: 9,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  brandTitle: {
    color: theme.colors.maroon,
    fontSize: 20,
  },
  navLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  navLinkBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
  },
  navLinkBtnActive: {
    backgroundColor: theme.colors.maroonLight,
  },
  navLinkText: {
    color: theme.colors.textSecondary,
  },
  navLinkTextActive: {
    color: theme.colors.maroon,
    fontWeight: '700',
  },
  navActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loginBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  getStartedBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.maroon,
  },
  getStartedText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  dashboardBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.maroonLight,
  },
  dashboardBtnText: {
    color: theme.colors.maroon,
    fontWeight: '700',
  },
  pageContent: {
    maxWidth: 1240,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: theme.spacing.screenPadding,
    paddingVertical: 20,
  },
  heroCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 24,
    overflow: 'hidden',
    position: 'relative',
    gap: 24,
  },
  heroCardWide: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 36,
  },
  diamondBgTop: {
    position: 'absolute',
    top: -60,
    left: -60,
    width: 160,
    height: 160,
    backgroundColor: theme.colors.maroonLight,
    transform: [{ rotate: '45deg' }],
    borderRadius: 24,
    opacity: 0.7,
  },
  diamondBgBottom: {
    position: 'absolute',
    bottom: -70,
    right: -50,
    width: 180,
    height: 180,
    backgroundColor: theme.colors.maroon,
    transform: [{ rotate: '45deg' }],
    borderRadius: 24,
    opacity: 0.12,
  },
  heroLeft: {
    zIndex: 2,
  },
  uniBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    marginBottom: 14,
  },
  miniDiamond: {
    width: 8,
    height: 8,
    backgroundColor: theme.colors.maroon,
    transform: [{ rotate: '45deg' }],
  },
  heroHeading: {
    fontSize: 38,
    lineHeight: 44,
    color: theme.colors.maroon,
  },
  heroSubheading: {
    fontSize: 24,
    lineHeight: 30,
    color: theme.colors.textPrimary,
    marginTop: 4,
    marginBottom: 12,
  },
  heroDescription: {
    lineHeight: 22,
    maxWidth: 520,
    marginBottom: 20,
  },
  heroCtaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  joinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.maroon,
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: theme.radius.full,
  },
  joinBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  organizerBtn: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: theme.radius.full,
  },
  heroStatsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: theme.colors.border,
  },
  heroRight: {
    zIndex: 2,
  },
  campusPhotoFrame: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: theme.colors.silver,
    backgroundColor: theme.colors.surface,
    height: 310,
    position: 'relative',
  },
  campusPhoto: {
    width: '100%',
    height: '100%',
  },
  campusOverlayBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  featureTilesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 18,
  },
  featureTile: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  featureTileIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.colors.maroonLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTileLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  sectionHeaderBlock: {
    marginBottom: 18,
  },
  sectionKicker: {
    color: theme.colors.maroon,
    letterSpacing: 1,
    marginBottom: 4,
  },
  grid3Col: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
  },
  detailCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 18,
  },
  authPreviewWrapper: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingVertical: 32,
    alignItems: 'center',
  },
  authCard: {
    maxWidth: 440,
    width: '100%',
    backgroundColor: theme.colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 24,
  },
  inputLabel: {
    fontSize: 10.5,
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  authInput: {
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
  authSwitchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
});
