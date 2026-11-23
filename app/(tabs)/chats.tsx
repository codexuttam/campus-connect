import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  MessageSquare,
  ShoppingBag,
  Send,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react-native';
import {
  AppText,
  AppCard,
  AppAvatar,
} from '../../components/ui';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { theme } from '../../theme';

const CHATS_STORAGE_KEY = 'campusconnect.chats.v2';

interface ChatMessage {
  id: string;
  sender: 'me' | 'peer';
  text: string;
  timestamp: string;
}

interface ChatThread {
  id: string;
  peerName: string;
  peerRole: string;
  category: 'marketplace' | 'academic';
  unreadCount: number;
  updatedAt: string;
  listingContext?: {
    listingId: string;
    listingTitle: string;
    listingPrice: string;
    listingThumbnail?: string;
  };
  messages: ChatMessage[];
}

const INITIAL_THREADS: ChatThread[] = [
  {
    id: 'thread-marketplace-1',
    peerName: 'Rohan Verma',
    peerRole: '2nd Year • IT • NIU-25-15021',
    category: 'marketplace',
    unreadCount: 1,
    updatedAt: '10m',
    listingContext: {
      listingId: 'listing-1',
      listingTitle: 'DBMS (Korth) – 7th Edition + Solved Semester Notes',
      listingPrice: '₹250',
      listingThumbnail:
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
    },
    messages: [
      {
        id: 'm-1',
        sender: 'peer',
        text: 'Hi Uttamraj! Yes, the DBMS Korth 7th Edition textbook and solved PYQ notes are still available. We can meet at the NIU Central Library steps at 2 PM.',
        timestamp: '10:42 AM',
      },
    ],
  },
  {
    id: 'thread-codesprint-26',
    peerName: 'NIU Coding Club',
    peerRole: "NIU CodeSprint '26 • Organizer Desk",
    category: 'academic',
    unreadCount: 1,
    updatedAt: '12m',
    messages: [
      {
        id: 'm-2',
        sender: 'peer',
        text: 'Team NIU Neural Mavericks is shortlisted for the Generative AI track! Check-in opens at 8:30 AM in the Main Auditorium.',
        timestamp: '10:30 AM',
      },
    ],
  },
  {
    id: 'thread-sneha',
    peerName: 'Sneha Patil',
    peerRole: '3rd Year • CSE (AI/ML) • NIU-24-14876',
    category: 'marketplace',
    unreadCount: 0,
    updatedAt: '2h',
    listingContext: {
      listingId: 'listing-2',
      listingTitle: 'Machine Learning by Andrew Ng & Deep Learning Notes',
      listingPrice: '₹450',
      listingThumbnail:
        'https://images.unsplash.com/photo-1532012164546-f432f2e37b73?auto=format&fit=crop&w=400&q=80',
    },
    messages: [
      {
        id: 'm-3',
        sender: 'me',
        text: 'Hey Sneha, does this include the Transformer & CNN derivation sheets?',
        timestamp: 'Yesterday',
      },
      {
        id: 'm-4',
        sender: 'peer',
        text: 'Yes! All 6 modules plus the CSE (AI/ML) lab notebooks are bound together.',
        timestamp: 'Yesterday',
      },
    ],
  },
];

const QUICK_REPLIES = [
  'Is this book still available?',
  'Can we meet at NIU Central Library?',
  'Can I inspect it after the 2 PM lecture?',
];

export default function ChatsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isTwoPanel = width >= 820;

  const {
    listingId,
    listingTitle,
    listingPrice,
    listingThumbnail,
    sellerId,
    sellerName,
  } = useLocalSearchParams<{
    listingId?: string;
    listingTitle?: string;
    listingPrice?: string;
    listingThumbnail?: string;
    sellerId?: string;
    sellerName?: string;
  }>();

  const [threads, setThreads] = useState<ChatThread[]>(INITIAL_THREADS);
  const [filterTab, setFilterTab] = useState<'all' | 'marketplace' | 'academic'>('all');
  const [activeThreadId, setActiveThreadId] = useState<string | null>(
    isTwoPanel ? INITIAL_THREADS[0].id : null
  );
  const [draftText, setDraftText] = useState('');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(CHATS_STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setThreads(parsed);
          }
        }
      })
      .catch(() => {})
      .finally(() => setHydrated(true));
  }, []);

  const persistThreads = (next: ChatThread[]) => {
    setThreads(next);
    AsyncStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  };

  useEffect(() => {
    if (!hydrated || !listingId) return;

    setThreads((prev) => {
      const existing = prev.find((t) => t.listingContext?.listingId === listingId);
      if (existing) {
        setActiveThreadId(existing.id);
        return prev;
      }

      const newThreadId = `thread-listing-${listingId}`;
      const newThread: ChatThread = {
        id: newThreadId,
        peerName: sellerName || 'NIU Student Seller',
        peerRole: `Verified NIU Student • (${sellerId || 'NIU'})`,
        category: 'marketplace',
        unreadCount: 0,
        updatedAt: 'Just now',
        listingContext: {
          listingId,
          listingTitle: listingTitle || `Book Listing #${listingId.slice(-6)}`,
          listingPrice: listingPrice || 'NIU Book Exchange',
          listingThumbnail,
        },
        messages: [
          {
            id: `msg-${Date.now()}`,
            sender: 'peer',
            text: `Hi! Feel free to ask any questions about "${
              listingTitle || 'this book'
            }" or suggest a pickup time at NIU Central Library.`,
            timestamp: 'Just now',
          },
        ],
      };

      const next = [newThread, ...prev];
      AsyncStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      setActiveThreadId(newThreadId);
      return next;
    });
  }, [hydrated, listingId, listingTitle, listingPrice, listingThumbnail, sellerId, sellerName]);

  const activeThread = useMemo(
    () => threads.find((t) => t.id === activeThreadId) || (isTwoPanel ? threads[0] : null),
    [threads, activeThreadId, isTwoPanel]
  );

  const filteredThreads = useMemo(() => {
    if (filterTab === 'all') return threads;
    return threads.filter((t) => t.category === filterTab);
  }, [threads, filterTab]);

  const handleOpenThread = (threadId: string) => {
    setActiveThreadId(threadId);
    const next = threads.map((t) => (t.id === threadId ? { ...t, unreadCount: 0 } : t));
    persistThreads(next);
  };

  const handleSendMessage = (textToSend?: string) => {
    const content = (textToSend ?? draftText).trim();
    if (!content || !activeThread) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      text: content,
      timestamp: 'Just now',
    };

    const next = threads.map((t) =>
      t.id === activeThread.id
        ? {
            ...t,
            updatedAt: 'Just now',
            messages: [...t.messages, newMsg],
          }
        : t
    );
    persistThreads(next);
    if (!textToSend) setDraftText('');
  };

  const renderThreadList = () => (
    <View style={[styles.listPane, isTwoPanel && styles.listPaneDesktop]}>
      <View style={styles.header}>
        <View>
          <AppText variant="captionMedium" color="secondary" style={styles.kicker}>
            NIU DIRECT MESSAGES
          </AppText>
          <AppText variant="h1" serif color="primary">
            Messages
          </AppText>
        </View>
      </View>

      <View style={styles.filterTabsRow}>
        {(
          [
            { id: 'all', label: 'All' },
            { id: 'marketplace', label: 'Book Exchange' },
            { id: 'academic', label: 'Clubs & Teams' },
          ] as const
        ).map((tab) => {
          const isSelected = filterTab === tab.id;
          return (
            <Pressable
              key={tab.id}
              onPress={() => setFilterTab(tab.id)}
              style={[styles.filterChip, isSelected && styles.filterChipSelected]}
            >
              <AppText
                variant="captionMedium"
                style={isSelected ? styles.filterChipTextSelected : styles.filterChipText}
              >
                {tab.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {filteredThreads.map((thread) => {
          const lastMsg = thread.messages[thread.messages.length - 1];
          const isSelected = activeThread?.id === thread.id && isTwoPanel;
          return (
            <Pressable
              key={thread.id}
              onPress={() => handleOpenThread(thread.id)}
            >
              <AppCard
                variant="default"
                padding="sm"
                style={[
                  styles.conversationCard,
                  isSelected && styles.conversationCardSelected,
                ]}
              >
                <View style={styles.chatRow}>
                  <AppAvatar
                    name={thread.peerName}
                    size="md"
                    style={{ backgroundColor: theme.colors.maroon }}
                  />
                  <View style={styles.chatInfo}>
                    <View style={styles.chatTopRow}>
                      <AppText variant="bodySmallMedium" color="primary" numberOfLines={1}>
                        {thread.peerName}
                      </AppText>
                      <AppText variant="caption" color="muted">
                        {thread.updatedAt}
                      </AppText>
                    </View>

                    {thread.listingContext && (
                      <View style={styles.inlineListingPill}>
                        <ShoppingBag size={11} color={theme.colors.maroon} />
                        <AppText
                          variant="caption"
                          color="primary"
                          numberOfLines={1}
                          style={styles.inlineListingText}
                        >
                          {thread.listingContext.listingTitle} • {thread.listingContext.listingPrice}
                        </AppText>
                      </View>
                    )}

                    <AppText variant="caption" color="secondary" numberOfLines={1}>
                      {lastMsg?.sender === 'me' ? `You: ${lastMsg.text}` : lastMsg?.text}
                    </AppText>
                  </View>
                  {thread.unreadCount > 0 && <View style={styles.unreadDot} />}
                </View>
              </AppCard>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderActiveThread = () => {
    if (!activeThread) return null;
    return (
      <View style={styles.threadScreen}>
        {/* Thread Header */}
        <View style={styles.threadHeader}>
          {!isTwoPanel && (
            <Pressable
              onPress={() => setActiveThreadId(null)}
              style={styles.backBtn}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Back to conversations"
            >
              <ArrowLeft size={20} color={theme.colors.textPrimary} />
            </Pressable>
          )}
          <AppAvatar
            name={activeThread.peerName}
            size="sm"
            style={{ backgroundColor: theme.colors.maroon }}
          />
          <View style={styles.threadHeaderMeta}>
            <View style={styles.peerNameRow}>
              <AppText variant="bodySmallMedium" color="primary" numberOfLines={1}>
                {activeThread.peerName}
              </AppText>
              <CheckCircle2 size={12} color={theme.colors.maroon} />
            </View>
            <AppText variant="caption" color="secondary" numberOfLines={1}>
              {activeThread.peerRole}
            </AppText>
          </View>
        </View>

        {/* Compact Listing Preview Card */}
        {activeThread.listingContext && (
          <Pressable
            onPress={() =>
              router.push({
                pathname: '/marketplace/[id]',
                params: { id: activeThread.listingContext!.listingId },
              })
            }
            style={styles.listingPreviewBanner}
          >
            {activeThread.listingContext.listingThumbnail ? (
              <Image
                source={{ uri: activeThread.listingContext.listingThumbnail }}
                style={styles.listingThumb}
              />
            ) : (
              <View style={[styles.listingThumb, styles.listingThumbFallback]}>
                <ShoppingBag size={16} color={theme.colors.maroon} />
              </View>
            )}
            <View style={styles.listingPreviewText}>
              <AppText variant="captionMedium" color="primary" numberOfLines={1}>
                {activeThread.listingContext.listingTitle}
              </AppText>
              <AppText variant="caption" style={styles.listingPriceText}>
                {activeThread.listingContext.listingPrice}
              </AppText>
            </View>
            <ExternalLink size={14} color={theme.colors.textSecondary} />
          </Pressable>
        )}

        {/* Messages Scroll */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {activeThread.messages.map((msg) => {
              const isMe = msg.sender === 'me';
              return (
                <View
                  key={msg.id}
                  style={[
                    styles.bubbleRow,
                    isMe ? styles.bubbleRowMe : styles.bubbleRowPeer,
                  ]}
                >
                  <View
                    style={[
                      styles.bubble,
                      isMe ? styles.bubbleMe : styles.bubblePeer,
                    ]}
                  >
                    <AppText
                      variant="bodySmall"
                      style={isMe ? styles.bubbleTextMe : styles.bubbleTextPeer}
                    >
                      {msg.text}
                    </AppText>
                    <AppText
                      variant="caption"
                      style={[
                        styles.timestampText,
                        isMe ? styles.timestampMe : styles.timestampPeer,
                      ]}
                    >
                      {msg.timestamp}
                    </AppText>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Quick Campus Inquiry Replies */}
          {activeThread.category === 'marketplace' && (
            <View style={styles.quickRepliesBar}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.quickRepliesContent}
              >
                {QUICK_REPLIES.map((prompt) => (
                  <Pressable
                    key={prompt}
                    onPress={() => handleSendMessage(prompt)}
                    style={styles.quickReplyChip}
                  >
                    <AppText variant="caption" color="primary">
                      {prompt}
                    </AppText>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Message Input Bar */}
          <View style={styles.composerBar}>
            <TextInput
              style={styles.composerInput}
              placeholder="Write a message to your NIU peer..."
              placeholderTextColor={theme.colors.textMuted}
              value={draftText}
              onChangeText={setDraftText}
              onSubmitEditing={() => handleSendMessage()}
              returnKeyType="send"
            />
            <Pressable
              onPress={() => handleSendMessage()}
              disabled={!draftText.trim()}
              style={[
                styles.sendBtn,
                !draftText.trim() && styles.sendBtnDisabled,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Send message"
            >
              <Send size={16} color="#FFFFFF" />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  };

  if (isTwoPanel) {
    return (
      <ScreenContainer safeTop padded={false} style={styles.twoPanelWrapper}>
        {renderThreadList()}
        {renderActiveThread()}
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer safeTop padded={false} style={{ flex: 1 }}>
      {activeThreadId ? renderActiveThread() : renderThreadList()}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  twoPanelWrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
  },
  listPane: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listPaneDesktop: {
    width: 350,
    maxWidth: 370,
    flex: undefined,
    borderRightWidth: 1,
    borderRightColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
  },
  kicker: {
    letterSpacing: theme.letterSpacing.wider,
    marginBottom: 2,
  },
  filterTabsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: theme.spacing.screenPadding,
    paddingBottom: theme.spacing.md,
  },
  filterChip: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterChipSelected: {
    backgroundColor: theme.colors.maroon,
    borderColor: theme.colors.maroon,
  },
  filterChipText: {
    color: theme.colors.textPrimary,
  },
  filterChipTextSelected: {
    color: '#FFFFFF',
  },
  content: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingBottom: 32,
  },
  conversationCard: {
    marginBottom: theme.spacing.sm,
  },
  conversationCardSelected: {
    borderColor: theme.colors.maroon,
    backgroundColor: theme.colors.maroonLight,
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.xs,
  },
  chatInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
    marginRight: theme.spacing.sm,
    gap: 2,
  },
  chatTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inlineListingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: theme.colors.surface,
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: theme.radius.sm,
    marginVertical: 2,
  },
  inlineListingText: {
    fontSize: 11,
    fontWeight: '500',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.maroon,
  },
  threadScreen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  threadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: theme.spacing.screenPadding,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  backBtn: {
    padding: 4,
  },
  threadHeaderMeta: {
    flex: 1,
  },
  peerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  listingPreviewBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: theme.spacing.screenPadding,
    paddingVertical: 9,
    backgroundColor: theme.colors.maroonLight,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  listingThumb: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.card,
  },
  listingThumbFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  listingPreviewText: {
    flex: 1,
  },
  listingPriceText: {
    color: theme.colors.maroon,
    fontWeight: '700',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: theme.spacing.screenPadding,
    gap: 10,
  },
  bubbleRow: {
    flexDirection: 'row',
  },
  bubbleRowMe: {
    justifyContent: 'flex-end',
  },
  bubbleRowPeer: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: theme.radius.md,
  },
  bubbleMe: {
    backgroundColor: theme.colors.maroon,
  },
  bubblePeer: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  bubbleTextMe: {
    color: '#FFFFFF',
  },
  bubbleTextPeer: {
    color: theme.colors.textPrimary,
  },
  timestampText: {
    fontSize: 10,
    marginTop: 4,
  },
  timestampMe: {
    color: 'rgba(255, 255, 255, 0.78)',
    textAlign: 'right',
  },
  timestampPeer: {
    color: theme.colors.textMuted,
  },
  quickRepliesBar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
    paddingVertical: 8,
    backgroundColor: theme.colors.background,
  },
  quickRepliesContent: {
    paddingHorizontal: theme.spacing.screenPadding,
    gap: 8,
  },
  quickReplyChip: {
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  composerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: theme.spacing.screenPadding,
    paddingVertical: 10,
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  composerInput: {
    flex: 1,
    height: 40,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 14,
    fontSize: 14,
    fontFamily: theme.fontFamilies.sans.regular,
    color: theme.colors.textPrimary,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.maroon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.45,
  },
});
