import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
  Share,
} from 'react-native';
import { MoreHorizontal, Flag, Trash2, ShieldCheck } from 'lucide-react-native';
import { AppText } from '../../../components/ui/AppText';
import { AppCard } from '../../../components/ui/AppCard';
import { AppAvatar } from '../../../components/ui/AppAvatar';
import { AppBadge } from '../../../components/ui/AppBadge';
import { IconButton } from '../../../components/ui/IconButton';
import { PostActions } from './PostActions';
import { Post } from '../types';
import { theme } from '../../../theme';
import { showAlert } from '../../../services/dialog';

export interface PostCardProps {
  post: Post;
  onPress: () => void;
  onLike: () => void;
  onSave: () => void;
  onDelete?: () => void;
  onReport?: (reason: string) => void;
}

const { width } = Dimensions.get('window');

const CATEGORY_LABELS: Record<string, string> = {
  academic: 'Academic',
  'campus-life': 'Campus Life',
  research: 'Research',
  events: 'Event',
  clubs: 'Club / Society',
};

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onPress,
  onLike,
  onSave,
  onDelete,
  onReport,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const images = post.images || [];
  const hasImages = images.length > 0;
  const isTextLong = post.content.length > 130 || post.content.includes('\n\n');

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${post.author.fullName} on CampusConnect: "${post.content.slice(0, 100)}..."`,
      });
    } catch {
      // Ignored
    }
  };

  const handleMorePress = () => {
    if (post.isOwnPost) {
      showAlert('Post Options', 'Manage your published post', [
        {
          text: 'Delete Post',
          style: 'destructive',
          onPress: onDelete,
        },
        { text: 'Cancel', style: 'cancel' },
      ]);
    } else {
      showAlert('Report Post', 'Flag this content for campus review', [
        {
          text: 'Inappropriate Content',
          style: 'destructive',
          onPress: () => onReport?.('Inappropriate content'),
        },
        {
          text: 'Misleading Academic Info',
          onPress: () => onReport?.('Misleading academic info'),
        },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  };

  return (
    <AppCard variant="default" padding="md" style={styles.card}>
      {/* Header: Author Info & More Action */}
      <View style={styles.headerRow}>
        <Pressable style={styles.authorGroup} onPress={onPress}>
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
          <View style={styles.authorTextCol}>
            <View style={styles.nameRow}>
              <AppText variant="bodySmallMedium" color="primary" numberOfLines={1}>
                {post.author.fullName}
              </AppText>
              {post.author.isVerified ? (
                <ShieldCheck size={13} color={theme.colors.olive} />
              ) : null}
            </View>
            <AppText variant="caption" color="secondary" numberOfLines={1}>
              {post.author.courseOrBranch} · {post.createdAt}
            </AppText>
          </View>
        </Pressable>

        <View style={styles.headerRight}>
          {post.category && post.category !== 'all' ? (
            <AppBadge
              label={CATEGORY_LABELS[post.category] || post.category}
              variant={post.category === 'academic' ? 'olive' : 'maroon'}
              size="sm"
            />
          ) : null}

          <IconButton
            icon={
              <MoreHorizontal
                size={18}
                color={theme.colors.textMuted}
                strokeWidth={theme.icons.strokeWidth.default}
              />
            }
            variant="ghost"
            size="sm"
            onPress={handleMorePress}
            accessibilityLabel="More post actions"
          />
        </View>
      </View>

      {/* Post Text Body */}
      <Pressable onPress={onPress} style={styles.bodyPressable}>
        <AppText
          variant="body"
          color="primary"
          numberOfLines={isExpanded ? undefined : 2}
          style={styles.contentText}
        >
          {post.content}
        </AppText>
      </Pressable>

      {/* Show more/less toggle button if text is long */}
      {isTextLong && (
        <Pressable
          onPress={() => setIsExpanded(!isExpanded)}
          hitSlop={6}
          style={styles.expandButton}
        >
          <AppText variant="captionMedium" style={styles.expandText}>
            {isExpanded ? 'Show less' : 'Read more'}
          </AppText>
        </Pressable>
      )}

      {/* Image Gallery */}
      {hasImages ? (
        <View style={styles.imageContainer}>
          {images.length === 1 ? (
            <Pressable onPress={onPress}>
              <Image
                source={{ uri: images[0].url }}
                style={[
                  styles.singleImage,
                  { aspectRatio: images[0].aspectRatio || 1.5 },
                ]}
                resizeMode="cover"
              />
            </Pressable>
          ) : (
            <View style={styles.multiImageGrid}>
              {images.slice(0, 2).map((img, idx) => (
                <Pressable
                  key={img.id || idx}
                  onPress={onPress}
                  style={styles.halfImageWrapper}
                >
                  <Image
                    source={{ uri: img.url }}
                    style={styles.gridImage}
                    resizeMode="cover"
                  />
                </Pressable>
              ))}
            </View>
          )}
        </View>
      ) : null}

      {/* Interactive Actions Footer */}
      <PostActions
        likesCount={post.likesCount}
        commentsCount={post.commentsCount}
        isLiked={post.isLiked}
        isSaved={post.isSaved}
        onLike={onLike}
        onComment={onPress}
        onSave={onSave}
        onShare={handleShare}
      />
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.radius.card,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  authorGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  authorTextCol: {
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bodyPressable: {
    marginVertical: 4,
  },
  contentText: {
    lineHeight: 21,
  },
  expandButton: {
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.xs,
    marginTop: 2,
  },
  expandText: {
    color: theme.colors.maroon,
  },
  imageContainer: {
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
  },
  singleImage: {
    width: '100%',
    maxHeight: 280,
  },
  multiImageGrid: {
    flexDirection: 'row',
    gap: 4,
    height: 180,
  },
  halfImageWrapper: {
    flex: 1,
    height: '100%',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
});
