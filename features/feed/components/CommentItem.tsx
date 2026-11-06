import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { AppText } from '../../../components/ui/AppText';
import { AppAvatar } from '../../../components/ui/AppAvatar';
import { IconButton } from '../../../components/ui/IconButton';
import { Comment } from '../types';
import { theme } from '../../../theme';

export interface CommentItemProps {
  comment: Comment;
  onDelete?: () => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment, onDelete }) => {
  return (
    <View style={styles.container}>
      <AppAvatar
        name={comment.author.fullName}
        size="sm"
        style={{
          backgroundColor:
            comment.author.avatarPreset === 'olive'
              ? theme.colors.olive
              : theme.colors.maroon,
        }}
      />

      <View style={styles.bubble}>
        <View style={styles.bubbleHeader}>
          <View style={styles.authorRow}>
            <AppText variant="captionMedium" color="primary">
              {comment.author.fullName}
            </AppText>
            <AppText variant="caption" color="muted" style={styles.timeText}>
              · {comment.createdAt}
            </AppText>
          </View>

          {comment.isOwnComment && onDelete ? (
            <IconButton
              icon={<Trash2 size={13} color={theme.colors.error} />}
              variant="ghost"
              size="sm"
              onPress={onDelete}
              accessibilityLabel="Delete your comment"
            />
          ) : null}
        </View>

        <AppText variant="bodySmall" color="primary" style={styles.commentContent}>
          {comment.content}
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  bubble: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  bubbleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 10,
  },
  commentContent: {
    lineHeight: 18,
  },
});
