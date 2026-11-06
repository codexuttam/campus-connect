import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  Pressable,
  Share,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Send,
  MoreHorizontal,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react-native';
import { AppHeader } from '../../components/ui/AppHeader';
import { AppText } from '../../components/ui/AppText';
import { AppAvatar } from '../../components/ui/AppAvatar';
import { AppBadge } from '../../components/ui/AppBadge';
import { AppCard } from '../../components/ui/AppCard';
import { IconButton } from '../../components/ui/IconButton';
import { LoadingIndicator } from '../../components/ui/LoadingIndicator';
import { CommentItem } from '../../features/feed/components/CommentItem';
import {
  usePostDetails,
  usePostComments,
  useLikePost,
  useSavePost,
  useCreateComment,
  useDeleteComment,
  useDeletePost,
  useReportPost,
} from '../../features/feed/hooks/useFeed';
import { theme } from '../../theme';

export default function PostDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const postId = id as string;

  const { data: post, isLoading: isPostLoading, error: postError } = usePostDetails(postId);
  const { data: comments = [], isLoading: isCommentsLoading } = usePostComments(postId);

  const likeMutation = useLikePost();
  const saveMutation = useSavePost();
  const createCommentMutation = useCreateComment();
  const deleteCommentMutation = useDeleteComment();
  const deletePostMutation = useDeletePost();
  const reportMutation = useReportPost();

  const [commentText, setCommentText] = useState('');

  const handleSendComment = async () => {
    const trimmed = commentText.trim();
    if (!trimmed) return;

    await createCommentMutation.mutateAsync({
      postId,
      content: trimmed,
    });
    setCommentText('');
  };

  const handleShare = async () => {
    if (!post) return;
    try {
      await Share.share({
        message: `${post.author.fullName} on CampusConnect: "${post.content.slice(0, 100)}..."`,
      });
    } catch {
      // Ignored
    }
  };

  const handleMoreActions = () => {
    if (!post) return;
    if (post.isOwnPost) {
      Alert.alert('Post Options', 'Manage this post', [
        {
          text: 'Delete Post',
          style: 'destructive',
          onPress: async () => {
            await deletePostMutation.mutateAsync(post.id);
            router.back();
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]);
    } else {
      Alert.alert('Report Post', 'Flag this content for campus moderation', [
        {
          text: 'Report Content',
          style: 'destructive',
          onPress: () => {
            reportMutation.mutate({ postId: post.id, reason: 'Reported by user' });
            Alert.alert('Thank you', 'Our campus moderation team has been notified.');
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  };

  if (isPostLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <AppHeader
          title="Discussion"
          serifTitle
          showBack
          onBack={() => router.back()}
        />
        <LoadingIndicator size="small" label="Loading post details..." />
      </View>
    );
  }

  if (postError || !post) {
    return (
      <View style={[styles.container, styles.center]}>
        <AppHeader
          title="Discussion"
          serifTitle
          showBack
          onBack={() => router.back()}
        />
        <AlertCircle size={32} color={theme.colors.error} />
        <AppText variant="bodyMedium" color="primary" style={styles.errorTitle}>
          Discussion Not Found
        </AppText>
        <AppText variant="caption" color="secondary" align="center">
          This post may have been removed or is no longer accessible.
        </AppText>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <AppHeader
        title="Discussion"
        serifTitle
        showBack
        onBack={() => router.back()}
        rightAction={
          <IconButton
            icon={<MoreHorizontal size={20} color={theme.colors.textPrimary} />}
            variant="ghost"
            size="sm"
            onPress={handleMoreActions}
            accessibilityLabel="More post actions"
          />
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Post Container Card */}
        <AppCard variant="default" padding="lg" style={styles.postCard}>
          {/* Author Header */}
          <View style={styles.authorRow}>
            <AppAvatar
              name={post.author.fullName}
              size="md"
              style={{
                backgroundColor:
                  post.author.avatarPreset === 'olive'
                    ? theme.colors.olive
                    : theme.colors.maroon,
              }}
            />
            <View style={styles.authorMeta}>
              <View style={styles.nameRow}>
                <AppText variant="bodyMedium" color="primary">
                  {post.author.fullName}
                </AppText>
                {post.author.isVerified ? (
                  <ShieldCheck size={14} color={theme.colors.olive} />
                ) : null}
              </View>
              <AppText variant="caption" color="secondary">
                {post.author.courseOrBranch} · {post.author.collegeName}
              </AppText>
              <AppText variant="caption" color="muted" style={styles.metaTime}>
                {post.createdAt} · {post.visibility.toUpperCase()}
              </AppText>
            </View>

            {post.category && post.category !== 'all' ? (
              <AppBadge
                label={post.category.replace('-', ' ').toUpperCase()}
                variant={post.category === 'academic' ? 'olive' : 'maroon'}
                size="sm"
              />
            ) : null}
          </View>

          {/* Full Post Text */}
          <AppText variant="bodyLarge" color="primary" style={styles.postBodyText}>
            {post.content}
          </AppText>

          {/* Full Images Display */}
          {post.images && post.images.length > 0 ? (
            <View style={styles.imagesContainer}>
              {post.images.map((img, idx) => (
                <View key={img.id || idx} style={styles.imageWrapper}>
                  <Image
                    source={{ uri: img.url }}
                    style={[
                      styles.postImage,
                      { aspectRatio: img.aspectRatio || 1.5 },
                    ]}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </View>
          ) : null}

          {/* Interactive Actions Row */}
          <View style={styles.actionsBar}>
            <View style={styles.actionGroup}>
              {/* Like */}
              <Pressable
                onPress={() => likeMutation.mutate(post.id)}
                style={styles.actionButton}
                hitSlop={8}
              >
                <Heart
                  size={20}
                  color={post.isLiked ? theme.colors.maroon : theme.colors.textSecondary}
                  fill={post.isLiked ? theme.colors.maroon : 'transparent'}
                />
                <AppText
                  variant="bodySmall"
                  color={post.isLiked ? 'maroon' : 'secondary'}
                >
                  {post.likesCount}
                </AppText>
              </Pressable>

              {/* Comments count */}
              <View style={styles.actionButton}>
                <MessageCircle size={20} color={theme.colors.textSecondary} />
                <AppText variant="bodySmall" color="secondary">
                  {post.commentsCount}
                </AppText>
              </View>
            </View>

            <View style={styles.actionGroup}>
              {/* Save */}
              <Pressable
                onPress={() => saveMutation.mutate(post.id)}
                style={styles.actionButton}
                hitSlop={8}
              >
                <Bookmark
                  size={20}
                  color={post.isSaved ? theme.colors.maroon : theme.colors.textSecondary}
                  fill={post.isSaved ? theme.colors.maroon : 'transparent'}
                />
              </Pressable>

              {/* Share */}
              <Pressable onPress={handleShare} style={styles.actionButton} hitSlop={8}>
                <Share2 size={20} color={theme.colors.textSecondary} />
              </Pressable>
            </View>
          </View>
        </AppCard>

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <AppText variant="captionMedium" color="secondary" style={styles.commentsTitle}>
            RESPONSES & INQUIRIES ({comments.length})
          </AppText>

          {isCommentsLoading ? (
            <LoadingIndicator size="small" label="Loading comments..." />
          ) : comments.length === 0 ? (
            <View style={styles.emptyCommentsBox}>
              <AppText variant="caption" color="muted" align="center">
                No replies yet. Join the dialogue below.
              </AppText>
            </View>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onDelete={() =>
                  deleteCommentMutation.mutate({ postId: post.id, commentId: comment.id })
                }
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Add Comment Input */}
      <View style={[styles.bottomCommentBar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add an inquiry or perspective..."
          placeholderTextColor={theme.colors.textMuted}
          value={commentText}
          onChangeText={setCommentText}
          selectionColor={theme.colors.maroon}
          multiline
          maxLength={300}
        />
        <IconButton
          icon={<Send size={16} color={theme.colors.textInverse} />}
          variant="maroon"
          size="sm"
          disabled={!commentText.trim() || createCommentMutation.isPending}
          onPress={handleSendComment}
          accessibilityLabel="Send comment"
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  errorTitle: {
    marginTop: theme.spacing.md,
    marginBottom: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.sm,
  },
  postCard: {
    marginBottom: theme.spacing.lg,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  authorMeta: {
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaTime: {
    fontSize: 10,
    marginTop: 2,
  },
  postBodyText: {
    lineHeight: 24,
    marginBottom: theme.spacing.md,
  },
  imagesContainer: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  imageWrapper: {
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
  },
  postImage: {
    width: '100%',
  },
  actionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderSubtle,
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  commentsSection: {
    marginBottom: theme.spacing.xl,
  },
  commentsTitle: {
    fontSize: 11,
    letterSpacing: theme.letterSpacing.wide,
    marginBottom: theme.spacing.md,
  },
  emptyCommentsBox: {
    paddingVertical: theme.spacing.xl,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  bottomCommentBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: 8,
    gap: 8,
  },
  commentInput: {
    flex: 1,
    minHeight: 38,
    maxHeight: 100,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 8,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamilies.sans.regular,
    fontSize: 14,
  },
});
