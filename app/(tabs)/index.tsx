import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Pressable,
  TextInput,
  Image,
  useWindowDimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useFocusEffect } from 'expo-router';
import {
  Sparkles,
  AlertCircle,
  Home,
  Compass,
  Calendar,
  Code2,
  BookOpen,
  Video,
  Users,
  MessageSquare,
  Bell,
  Bookmark,
  GraduationCap,
  Settings,
  Plus,
  Image as ImageIcon,
  BarChart2,
  HelpCircle,
  ChevronRight,
  MapPin,
  Briefcase,
  Shield,
  Globe,
} from 'lucide-react-native';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { AppText } from '../../components/ui/AppText';
import { AppAvatar } from '../../components/ui/AppAvatar';
import { AppButton } from '../../components/ui/AppButton';
import { LoadingIndicator } from '../../components/ui/LoadingIndicator';
import {
  HomeHeader,
  StoryList,
  StoryViewer,
  PostCard,
  SuggestedUserSection,
} from '../../features/feed/components';
import {
  useCampusFeed,
  useStories,
  useSuggestedConnections,
  useLikePost,
  useSavePost,
  useDeletePost,
  useToggleConnect,
  useRecordStoryView,
  useReportPost,
  useCreatePost,
} from '../../features/feed/hooks/useFeed';
import { PostCategory } from '../../features/feed/types';
import { useAuth } from '../../hooks/useAuth';
import { theme } from '../../theme';
import { showAlert } from '../../services/dialog';

type DashboardTab = 'for-you' | 'following' | 'events' | 'hackathons' | 'books' | 'announcements';

const UPCOMING_EVENTS = [
  {
    id: 'ev-1',
    title: "NIU CodeSprint '26",
    meta: '5 - 6 Dec • Hackathon',
    cta: 'Register',
    primary: true,
    route: '/campus/hackathons',
  },
  {
    id: 'ev-2',
    title: 'AI in Real World',
    meta: '8 Dec, 4 PM • Webinar',
    cta: 'Join',
    primary: true,
    route: '/campus/webinars',
  },
  {
    id: 'ev-3',
    title: 'Tech Talk Series #3',
    meta: '10 Dec, 2 PM • Session',
    cta: 'RSVP',
    primary: false,
    route: '/campus/events',
  },
];

const MY_COMMUNITIES = [
  { id: 'c-1', name: 'NIU Coding Club', members: '1.2k members', route: '/campus/communities' },
  { id: 'c-2', name: 'AI/ML Study Group', members: '846 members', route: '/campus/communities' },
  { id: 'c-3', name: 'Cricket @ NIU', members: '642 members', route: '/campus/communities' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { width: screenWidth } = useWindowDimensions();
  const isDesktop = screenWidth >= 980;

  const [activeTab, setActiveTab] = useState<DashboardTab>('for-you');
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const [quickPostText, setQuickPostText] = useState('');
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem('campusconnect.notifications.v1')
        .then((raw) => {
          if (!raw) {
            setHasUnreadNotifications(true);
            return;
          }
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setHasUnreadNotifications(parsed.some((n) => !n.isRead));
          }
        })
        .catch(() => {});
    }, [])
  );

  const feedFilter: 'for-you' | 'following' = activeTab === 'following' ? 'following' : 'for-you';
  const selectedCategory: PostCategory =
    activeTab === 'events' || activeTab === 'hackathons'
      ? 'events'
      : activeTab === 'books'
      ? 'academic'
      : activeTab === 'announcements'
      ? 'campus-life'
      : 'all';

  // Queries
  const {
    data: feedData,
    isLoading: isFeedLoading,
    isRefetching: isFeedRefetching,
    refetch: refetchFeed,
    error: feedError,
  } = useCampusFeed({ filter: feedFilter, category: selectedCategory });

  const { data: stories = [] } = useStories();
  const { data: suggestions = [] } = useSuggestedConnections();

  // Mutations
  const likeMutation = useLikePost();
  const saveMutation = useSavePost();
  const deleteMutation = useDeletePost();
  const connectMutation = useToggleConnect();
  const storyViewMutation = useRecordStoryView();
  const reportMutation = useReportPost();
  const createPostMutation = useCreatePost();

  const posts = feedData?.posts || [];
  const studentName = user?.fullName || 'Uttamraj Singh';
  const studentSubtitle = user?.courseOrBranch || '3rd Year • CSE (AI/ML) • Section C';

  const handleQuickPublish = async () => {
    const trimmed = quickPostText.trim();
    if (!trimmed) {
      router.push('/(tabs)/create');
      return;
    }
    await createPostMutation.mutateAsync({
      content: trimmed,
      category: 'campus-life',
      visibility: 'campus',
    });
    setQuickPostText('');
  };

  const toggleEventRsvp = (eventId: string, title: string) => {
    if (registeredEventIds.includes(eventId)) {
      setRegisteredEventIds(registeredEventIds.filter((id) => id !== eventId));
    } else {
      setRegisteredEventIds([...registeredEventIds, eventId]);
      showAlert(
        'Registration Confirmed',
        `You are registered for ${title} at Noida International University.`
      );
    }
  };

  const LEFT_NAV_ITEMS = [
    { label: 'Home', icon: Home, active: true, onPress: () => {} },
    { label: 'Explore', icon: Compass, onPress: () => router.push('/(tabs)/explore') },
    { label: 'Events', icon: Calendar, onPress: () => router.push('/campus/events') },
    { label: 'Hackathons', icon: Code2, onPress: () => router.push('/campus/hackathons') },
    { label: 'Book Exchange', icon: BookOpen, onPress: () => router.push('/marketplace') },
    { label: 'Webinars', icon: Video, onPress: () => router.push('/campus/webinars') },
    { label: 'Communities', icon: Users, onPress: () => router.push('/campus/communities') },
    { label: 'Messages', icon: MessageSquare, badge: '3', onPress: () => router.push('/(tabs)/chats') },
    { label: 'Notifications', icon: Bell, onPress: () => router.push('/notifications') },
    { label: 'Saved', icon: Bookmark, onPress: () => router.push('/saved-bookmarks') },
    { label: 'My College', icon: GraduationCap, onPress: () => router.push('/campus/college') },
    { label: 'Settings', icon: Settings, onPress: () => router.push('/(tabs)/profile') },
  ];

  return (
    <ScreenContainer safeTop padded={false} style={styles.container}>
      {/* Top NIU Connect Navbar */}
      <HomeHeader
        campusName="Noida International University"
        userName={studentName}
        onSearchPress={() => router.push('/search')}
        onNotificationsPress={() => router.push('/notifications')}
        onMarketplacePress={() => router.push('/marketplace')}
        onMessagesPress={() => router.push('/(tabs)/chats')}
        onAdminPress={() => router.push('/admin')}
        onLandingPress={() => router.push('/landing')}
        onProfilePress={() => router.push('/(tabs)/profile')}
        hasUnreadNotifications={hasUnreadNotifications}
      />

      <View style={styles.dashboardBody}>
        {/* ================= LEFT SIDEBAR (3-Column Desktop Layout) ================= */}
        {isDesktop && (
          <View style={styles.leftSidebar}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sidebarScroll}>
              {LEFT_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <Pressable
                    key={item.label}
                    onPress={item.onPress}
                    style={[
                      styles.navItem,
                      item.active && styles.navItemActive,
                    ]}
                  >
                    <View style={styles.navItemLeft}>
                      <Icon
                        size={17}
                        color={item.active ? '#FFFFFF' : theme.colors.textSecondary}
                        strokeWidth={item.active ? 2.2 : 1.8}
                      />
                      <AppText
                        variant="bodySmallMedium"
                        style={item.active ? styles.navTextActive : styles.navText}
                      >
                        {item.label}
                      </AppText>
                    </View>
                    {item.badge && (
                      <View style={styles.navBadge}>
                        <AppText variant="caption" style={styles.navBadgeText}>
                          {item.badge}
                        </AppText>
                      </View>
                    )}
                  </Pressable>
                );
              })}

              <Pressable
                onPress={() => router.push('/(tabs)/create')}
                style={styles.sidebarCreateBtn}
              >
                <Plus size={16} color="#FFFFFF" strokeWidth={2.5} />
                <AppText variant="buttonSmall" style={styles.sidebarCreateText}>
                  Create Post
                </AppText>
              </Pressable>

              <View style={styles.sidebarPortalBox}>
                <Pressable
                  onPress={() => router.push('/admin')}
                  style={styles.sidebarPortalLink}
                >
                  <Shield size={14} color={theme.colors.maroon} />
                  <AppText variant="captionMedium" color="primary">
                    Admin Portal (14 Views)
                  </AppText>
                </Pressable>
                <Pressable
                  onPress={() => router.push('/landing')}
                  style={styles.sidebarPortalLink}
                >
                  <Globe size={14} color={theme.colors.maroon} />
                  <AppText variant="captionMedium" color="primary">
                    Public Website Preview
                  </AppText>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        )}

        {/* ================= CENTER FEED COLUMN ================= */}
        <ScrollView
          style={styles.centerColumn}
          contentContainerStyle={styles.centerScrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isFeedRefetching}
              onRefresh={() => {
                refetchFeed();
              }}
              tintColor={theme.colors.maroon}
              colors={[theme.colors.maroon]}
            />
          }
        >
          {/* 1. Personalized NIU Connect Welcome Hero Banner */}
          <View style={styles.welcomeHero}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
              }}
              style={styles.heroBgImage}
              resizeMode="cover"
            />
            <View style={styles.heroOverlay} />
            <View style={styles.heroDiamondAccent} />

            <View style={styles.heroContent}>
              <AppText variant="body" style={styles.heroGreeting}>
                Welcome back,
              </AppText>
              <AppText variant="h1" serif style={styles.heroName}>
                {studentName} 👋
              </AppText>
              <AppText variant="caption" style={styles.heroMeta}>
                {studentSubtitle}
              </AppText>

              {/* Quick Hero Action Pills */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.heroPillsRow}
              >
                {[
                  { label: 'Post', icon: Plus, route: '/(tabs)/create' },
                  { label: 'Event', icon: Calendar, route: '/campus/events' },
                  { label: 'Book', icon: BookOpen, route: '/marketplace' },
                  { label: 'Poll', icon: BarChart2, route: '/(tabs)/create' },
                  { label: 'Q&A', icon: HelpCircle, route: '/campus/help' },
                ].map((action) => {
                  const ActionIcon = action.icon;
                  return (
                    <Pressable
                      key={action.label}
                      onPress={() => router.push(action.route as any)}
                      style={styles.heroActionPill}
                    >
                      <ActionIcon size={12} color="#FFFFFF" />
                      <AppText variant="captionMedium" style={styles.heroActionPillText}>
                        {action.label}
                      </AppText>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          </View>

          {/* Mobile 4-Tile Quick Modules Row (Events, Hackathons, Books, Webinars) */}
          {!isDesktop && (
            <View style={styles.mobileQuickGrid}>
              {[
                { label: 'Events', icon: Calendar, route: '/campus/events' },
                { label: 'Hackathons', icon: Code2, route: '/campus/hackathons' },
                { label: 'Books', icon: BookOpen, route: '/marketplace' },
                { label: 'Webinars', icon: Video, route: '/campus/webinars' },
              ].map((tile) => {
                const TileIcon = tile.icon;
                return (
                  <Pressable
                    key={tile.label}
                    onPress={() => router.push(tile.route as any)}
                    style={styles.mobileQuickTile}
                  >
                    <View style={styles.mobileTileIconCircle}>
                      <TileIcon size={17} color={theme.colors.maroon} />
                    </View>
                    <AppText variant="captionMedium" color="primary" style={styles.mobileTileLabel}>
                      {tile.label}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
          )}

          {/* 2. Student Post Composer ("What's happening at NIU?") */}
          <View style={styles.composerCard}>
            <View style={styles.composerTopRow}>
              <AppAvatar
                name={studentName}
                size="sm"
                style={{ backgroundColor: theme.colors.maroon }}
              />
              <TextInput
                style={styles.composerInput}
                placeholder="What's happening at NIU?"
                placeholderTextColor={theme.colors.textMuted}
                value={quickPostText}
                onChangeText={setQuickPostText}
                onSubmitEditing={handleQuickPublish}
              />
            </View>
            <View style={styles.composerBottomRow}>
              <View style={styles.composerMediaOptions}>
                <Pressable
                  onPress={() => router.push('/(tabs)/create')}
                  style={styles.mediaOptionBtn}
                >
                  <ImageIcon size={14} color={theme.colors.maroon} />
                  <AppText variant="captionMedium" color="secondary">
                    Photo
                  </AppText>
                </Pressable>
                <Pressable
                  onPress={() => router.push('/campus/events')}
                  style={styles.mediaOptionBtn}
                >
                  <Calendar size={14} color={theme.colors.maroon} />
                  <AppText variant="captionMedium" color="secondary">
                    Event
                  </AppText>
                </Pressable>
                <Pressable
                  onPress={() => router.push('/(tabs)/create')}
                  style={styles.mediaOptionBtn}
                >
                  <BarChart2 size={14} color={theme.colors.maroon} />
                  <AppText variant="captionMedium" color="secondary">
                    Poll
                  </AppText>
                </Pressable>
              </View>

              <Pressable
                onPress={handleQuickPublish}
                style={styles.composerPostBtn}
              >
                <AppText variant="captionMedium" style={styles.composerPostBtnText}>
                  Post
                </AppText>
              </Pressable>
            </View>
          </View>

          {/* 3. Campus Stories Strip */}
          <StoryList
            stories={stories}
            onSelectStory={(index) => setActiveStoryIndex(index)}
            onAddStoryPress={() => router.push('/create-post')}
            currentUserName={studentName}
          />

          {/* 4. Feed Category Filter Pills (For You, Following, Events, Hackathons, Books, Announcements) */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.feedTabsRow}
          >
            {(
              [
                { id: 'for-you', label: 'For You' },
                { id: 'following', label: 'Following' },
                { id: 'events', label: 'Events' },
                { id: 'hackathons', label: 'Hackathons' },
                { id: 'books', label: 'Books' },
                { id: 'announcements', label: 'Announcements' },
              ] as const
            ).map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <Pressable
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id)}
                  style={[
                    styles.feedTabPill,
                    isSelected && styles.feedTabPillActive,
                  ]}
                >
                  <AppText
                    variant="captionMedium"
                    style={isSelected ? styles.feedTabTextActive : styles.feedTabText}
                  >
                    {tab.label}
                  </AppText>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* 5. Feed Posts List */}
          {isFeedLoading ? (
            <View style={styles.centerContainer}>
              <LoadingIndicator size="small" label="Loading NIU campus feed..." />
            </View>
          ) : feedError ? (
            <View style={styles.centerContainer}>
              <AlertCircle size={24} color={theme.colors.error} />
              <AppText variant="bodySmall" color="error" style={styles.emptyText}>
                Failed to load feed. Pull down to refresh.
              </AppText>
              <AppButton
                title="Retry"
                variant="outline"
                size="sm"
                onPress={() => refetchFeed()}
                style={styles.retryButton}
              />
            </View>
          ) : posts.length === 0 ? (
            <View style={styles.emptyCard}>
              <Sparkles size={28} color={theme.colors.maroon} />
              <AppText variant="h3" serif color="primary" align="center" style={styles.emptyTitle}>
                No Posts in This Tab Yet
              </AppText>
              <AppText variant="bodySmall" color="secondary" align="center" style={styles.emptyText}>
                Share an update or switch tabs to browse NIU campus discussions.
              </AppText>
            </View>
          ) : (
            posts.map((item, index) => (
              <View key={item.id}>
                <PostCard
                  post={item}
                  onPress={() =>
                    router.push({
                      pathname: '/post/[id]',
                      params: { id: item.id },
                    })
                  }
                  onLike={() => likeMutation.mutate(item.id)}
                  onSave={() => saveMutation.mutate(item.id)}
                  onDelete={() => deleteMutation.mutate(item.id)}
                  onReport={(reason) => reportMutation.mutate({ postId: item.id, reason })}
                />
                {index === 1 && suggestions.length > 0 && (
                  <SuggestedUserSection
                    suggestions={suggestions}
                    onToggleConnect={(id) => connectMutation.mutate(id)}
                  />
                )}
              </View>
            ))
          )}
        </ScrollView>

        {/* ================= RIGHT SIDEBAR (3-Column Desktop Layout) ================= */}
        {isDesktop && (
          <View style={styles.rightSidebar}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sidebarScroll}>
              {/* Widget 1: Upcoming Events */}
              <View style={styles.widgetCard}>
                <View style={styles.widgetHeader}>
                  <View style={styles.widgetTitleRow}>
                    <Calendar size={15} color={theme.colors.maroon} />
                    <AppText variant="bodySmallMedium" color="primary">
                      Upcoming Events
                    </AppText>
                  </View>
                  <Pressable onPress={() => router.push('/campus/events')}>
                    <AppText variant="captionMedium" style={styles.viewAllLink}>
                      View All →
                    </AppText>
                  </Pressable>
                </View>

                <View style={styles.widgetList}>
                  {UPCOMING_EVENTS.map((ev) => {
                    const isReg = registeredEventIds.includes(ev.id);
                    return (
                      <View key={ev.id} style={styles.eventRow}>
                        <Pressable
                          onPress={() => router.push(ev.route as any)}
                          style={styles.eventInfo}
                        >
                          <AppText variant="bodySmallMedium" color="primary" numberOfLines={1}>
                            {ev.title}
                          </AppText>
                          <AppText variant="caption" color="secondary">
                            {ev.meta}
                          </AppText>
                        </Pressable>
                        <Pressable
                          onPress={() => toggleEventRsvp(ev.id, ev.title)}
                          style={[
                            styles.eventCtaBtn,
                            ev.primary && !isReg ? styles.eventCtaPrimary : styles.eventCtaOutline,
                          ]}
                        >
                          <AppText
                            variant="captionMedium"
                            style={
                              ev.primary && !isReg
                                ? styles.eventCtaTextPrimary
                                : styles.eventCtaTextOutline
                            }
                          >
                            {isReg ? 'Joined ✓' : ev.cta}
                          </AppText>
                        </Pressable>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* Widget 2: My Communities */}
              <View style={styles.widgetCard}>
                <View style={styles.widgetHeader}>
                  <View style={styles.widgetTitleRow}>
                    <Users size={15} color={theme.colors.maroon} />
                    <AppText variant="bodySmallMedium" color="primary">
                      My Communities
                    </AppText>
                  </View>
                  <Pressable onPress={() => router.push('/campus/communities')}>
                    <AppText variant="captionMedium" style={styles.viewAllLink}>
                      Manage →
                    </AppText>
                  </Pressable>
                </View>

                <View style={styles.widgetList}>
                  {MY_COMMUNITIES.map((comm) => (
                    <Pressable
                      key={comm.id}
                      onPress={() => router.push(comm.route as any)}
                      style={styles.communityRow}
                    >
                      <AppAvatar
                        name={comm.name}
                        size="sm"
                        style={{ backgroundColor: theme.colors.maroon }}
                      />
                      <View style={{ flex: 1 }}>
                        <AppText variant="bodySmallMedium" color="primary" numberOfLines={1}>
                          {comm.name}
                        </AppText>
                        <AppText variant="caption" color="secondary">
                          {comm.members}
                        </AppText>
                      </View>
                      <ChevronRight size={14} color={theme.colors.textMuted} />
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Widget 3: Quick Links */}
              <View style={styles.widgetCard}>
                <View style={styles.widgetHeader}>
                  <AppText variant="bodySmallMedium" color="primary">
                    Quick Links
                  </AppText>
                </View>
                <View style={styles.quickLinksGrid}>
                  {[
                    { label: 'Library', icon: BookOpen, route: '/campus/resources' },
                    { label: 'Placement', icon: Briefcase, route: '/campus/careers' },
                    { label: 'Lost & Found', icon: MapPin, route: '/campus/lost-found' },
                    { label: 'Help Center', icon: HelpCircle, route: '/campus/help' },
                  ].map((link) => {
                    const LinkIcon = link.icon;
                    return (
                      <Pressable
                        key={link.label}
                        onPress={() => router.push(link.route as any)}
                        style={styles.quickLinkTile}
                      >
                        <LinkIcon size={16} color={theme.colors.maroon} />
                        <AppText variant="captionMedium" color="primary">
                          {link.label}
                        </AppText>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </ScrollView>
          </View>
        )}
      </View>

      {/* Fullscreen Story Viewer */}
      <StoryViewer
        visible={activeStoryIndex !== null}
        stories={stories}
        initialIndex={activeStoryIndex ?? 0}
        onClose={() => setActiveStoryIndex(null)}
        onRecordView={(id) => storyViewMutation.mutate(id)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  dashboardBody: {
    flex: 1,
    flexDirection: 'row',
    maxWidth: 1380,
    width: '100%',
    alignSelf: 'center',
  },
  leftSidebar: {
    width: 230,
    borderRightWidth: 1,
    borderRightColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  sidebarScroll: {
    padding: 14,
    gap: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: theme.radius.md,
  },
  navItemActive: {
    backgroundColor: theme.colors.maroon,
  },
  navItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  navText: {
    color: theme.colors.textPrimary,
  },
  navTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  navBadge: {
    backgroundColor: theme.colors.maroon,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  navBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  sidebarCreateBtn: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: theme.colors.maroon,
    paddingVertical: 11,
    borderRadius: theme.radius.md,
  },
  sidebarCreateText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sidebarPortalBox: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: 8,
  },
  sidebarPortalLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.maroonLight,
  },
  centerColumn: {
    flex: 1,
  },
  centerScrollContent: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: 14,
    paddingBottom: 90,
  },
  welcomeHero: {
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.maroon,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: theme.colors.burgundy,
  },
  heroBgImage: {
    ...StyleSheet.absoluteFill,
    opacity: 0.25,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(100, 20, 38, 0.78)',
  },
  heroDiamondAccent: {
    position: 'absolute',
    right: -30,
    top: -30,
    width: 130,
    height: 130,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    transform: [{ rotate: '45deg' }],
    borderRadius: 16,
  },
  heroContent: {
    padding: 18,
  },
  heroGreeting: {
    color: 'rgba(255, 255, 255, 0.88)',
    fontSize: 15,
  },
  heroName: {
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 30,
    marginTop: 2,
  },
  heroMeta: {
    color: 'rgba(255, 255, 255, 0.82)',
    marginTop: 4,
    marginBottom: 14,
  },
  heroPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  heroActionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.28)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
  },
  heroActionPillText: {
    color: '#FFFFFF',
    fontSize: 11.5,
  },
  mobileQuickGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 14,
  },
  mobileQuickTile: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  mobileTileIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: theme.colors.maroonLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileTileLabel: {
    fontSize: 11,
  },
  composerCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 12,
    marginBottom: 14,
    gap: 10,
  },
  composerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  composerInput: {
    flex: 1,
    height: 38,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.full,
    paddingHorizontal: 14,
    fontSize: 13.5,
    fontFamily: theme.fontFamilies.sans.regular,
    color: theme.colors.textPrimary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  composerBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 2,
  },
  composerMediaOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  mediaOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4,
  },
  composerPostBtn: {
    backgroundColor: theme.colors.maroon,
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: theme.radius.full,
  },
  composerPostBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  feedTabsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 10,
    marginBottom: 4,
  },
  feedTabPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  feedTabPillActive: {
    backgroundColor: theme.colors.maroon,
    borderColor: theme.colors.maroon,
  },
  feedTabText: {
    color: theme.colors.textSecondary,
  },
  feedTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  rightSidebar: {
    width: 300,
    borderLeftWidth: 1,
    borderLeftColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  widgetCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 14,
    marginBottom: 12,
  },
  widgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  widgetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  viewAllLink: {
    color: theme.colors.maroon,
    fontSize: 11.5,
  },
  widgetList: {
    gap: 10,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingVertical: 4,
  },
  eventInfo: {
    flex: 1,
  },
  eventCtaBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: theme.radius.full,
    borderWidth: 1,
  },
  eventCtaPrimary: {
    backgroundColor: theme.colors.maroon,
    borderColor: theme.colors.maroon,
  },
  eventCtaOutline: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.borderStrong,
  },
  eventCtaTextPrimary: {
    color: '#FFFFFF',
    fontSize: 11,
  },
  eventCtaTextOutline: {
    color: theme.colors.textPrimary,
    fontSize: 11,
  },
  communityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
  },
  quickLinksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickLinkTile: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  centerContainer: {
    paddingVertical: theme.spacing.massive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    marginVertical: theme.spacing.xxl,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyTitle: {
    marginTop: theme.spacing.md,
    marginBottom: 4,
  },
  emptyText: {
    marginTop: 4,
    maxWidth: 260,
    lineHeight: 18,
  },
  retryButton: {
    marginTop: theme.spacing.md,
  },
});
