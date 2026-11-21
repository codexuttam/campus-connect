import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Heart, MessageCircle, Bookmark, Share2 } from 'lucide-react-native';
import { AppText } from '../../../components/ui/AppText';
import { theme } from '../../../theme';

export interface PostActionsProps {
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isSaved: boolean;
  onLike: () => void;
  onComment: () => void;
  onSave: () => void;
  onShare: () => void;
}

export const PostActions: React.FC<PostActionsProps> = ({
  likesCount,
  commentsCount,
  isLiked,
  isSaved,
  onLike,
  onComment,
  onSave,
  onShare,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftGroup}>
        {/* Like Pill Button */}
        <Pressable
          onPress={onLike}
          style={({ pressed }) => [
            styles.actionPill,
            isLiked && styles.actionPillActive,
            pressed && styles.pressed,
          ]}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel={isLiked ? 'Unlike post' : 'Like post'}
        >
          <Heart
            size={16}
            color={isLiked ? theme.colors.maroon : theme.colors.textSecondary}
            fill={isLiked ? theme.colors.maroon : 'transparent'}
            strokeWidth={theme.icons.strokeWidth.default}
          />
          <AppText
            variant="caption"
            color={isLiked ? 'maroon' : 'secondary'}
            style={styles.actionCount}
          >
            {likesCount}
          </AppText>
        </Pressable>

        {/* Comment Pill Button */}
        <Pressable
          onPress={onComment}
          style={({ pressed }) => [styles.actionPill, pressed && styles.pressed]}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel="Comments"
        >
          <MessageCircle
            size={16}
            color={theme.colors.textSecondary}
            strokeWidth={theme.icons.strokeWidth.default}
          />
          <AppText variant="caption" color="secondary" style={styles.actionCount}>
            {commentsCount}
          </AppText>
        </Pressable>
      </View>

      <View style={styles.rightGroup}>
        {/* Bookmark / Save Button */}
        <Pressable
          onPress={onSave}
          style={({ pressed }) => [
            styles.iconCircle,
            isSaved && styles.actionPillActive,
            pressed && styles.pressed,
          ]}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel={isSaved ? 'Remove from saved' : 'Save post'}
        >
          <Bookmark
            size={16}
            color={isSaved ? theme.colors.maroon : theme.colors.textSecondary}
            fill={isSaved ? theme.colors.maroon : 'transparent'}
            strokeWidth={theme.icons.strokeWidth.default}
          />
        </Pressable>

        {/* Share Button */}
        <Pressable
          onPress={onShare}
          style={({ pressed }) => [styles.iconCircle, pressed && styles.pressed]}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel="Share post"
        >
          <Share2
            size={16}
            color={theme.colors.textSecondary}
            strokeWidth={theme.icons.strokeWidth.default}
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderSubtle,
    marginTop: theme.spacing.xs,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  actionPillActive: {
    backgroundColor: theme.colors.maroonLight,
    borderColor: theme.colors.maroon,
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  pressed: {
    opacity: 0.7,
  },
  actionCount: {
    fontFamily: theme.fontFamilies.sans.medium,
    fontSize: 12,
  },
});

