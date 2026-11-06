import React from 'react';
import { View, StyleSheet, Pressable, Image } from 'react-native';
import { Users, Check, Plus, ShieldCheck, Compass } from 'lucide-react-native';
import { AppText } from '../../../components/ui/AppText';
import { AppCard } from '../../../components/ui/AppCard';
import { AppBadge } from '../../../components/ui/AppBadge';
import { AppButton } from '../../../components/ui/AppButton';
import { Community } from '../types';
import { theme } from '../../../theme';

export interface CommunityCardProps {
  community: Community;
  onPress: () => void;
  onToggleJoin: () => void;
  compact?: boolean;
}

export const CommunityCard: React.FC<CommunityCardProps> = ({
  community,
  onPress,
  onToggleJoin,
  compact = false,
}) => {
  return (
    <AppCard variant="default" padding="none" style={[styles.card, compact && styles.compactCard]}>
      {/* Cover Image */}
      <Pressable onPress={onPress} style={styles.imageBox}>
        <Image source={{ uri: community.coverImage }} style={styles.coverImage} resizeMode="cover" />
        <View style={styles.categoryBadge}>
          <AppBadge label={community.category} variant="neutral" size="sm" />
        </View>
        {community.isOfficialSociety && (
          <View style={styles.officialBadge}>
            <AppBadge label="Official Society" variant="olive" size="sm" dot />
          </View>
        )}
      </Pressable>

      {/* Community Details */}
      <View style={styles.content}>
        <Pressable onPress={onPress}>
          <View style={styles.nameRow}>
            <AppText variant="bodyLarge" serif color="primary" numberOfLines={1} style={styles.name}>
              {community.name}
            </AppText>
            {community.isOfficialSociety ? (
              <ShieldCheck size={14} color={theme.colors.olive} />
            ) : null}
          </View>

          <AppText variant="caption" color="secondary" numberOfLines={compact ? 1 : 2} style={styles.desc}>
            {community.description}
          </AppText>
        </Pressable>

        {/* Member Count & Meeting Schedule */}
        <View style={styles.metaRow}>
          <View style={styles.memberBox}>
            <Users size={12} color={theme.colors.textMuted} />
            <AppText variant="caption" color="secondary" style={styles.memberCount}>
              {community.memberCount} members
            </AppText>
          </View>
          {community.meetingSchedule ? (
            <AppText variant="caption" color="muted" numberOfLines={1} style={styles.scheduleText}>
              · {community.meetingSchedule}
            </AppText>
          ) : null}
        </View>

        {/* Action Button: Join / Joined */}
        <View style={styles.buttonWrapper}>
          <AppButton
            title={community.isJoined ? 'Joined' : 'Join Community'}
            variant={community.isJoined ? 'secondary' : 'primary'}
            size="sm"
            fullWidth
            leadingIcon={
              community.isJoined ? (
                <Check size={13} color={theme.colors.textPrimary} strokeWidth={2.5} />
              ) : (
                <Plus size={13} color={theme.colors.textInverse} strokeWidth={2.5} />
              )
            }
            onPress={onToggleJoin}
            style={styles.joinButton}
          />
        </View>
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.radius.card,
    overflow: 'hidden',
  },
  compactCard: {
    width: 240,
    marginRight: 12,
    marginBottom: 0,
  },
  imageBox: {
    position: 'relative',
    width: '100%',
    height: 110,
    backgroundColor: theme.colors.surface,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  officialBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
  },
  content: {
    padding: theme.spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  name: {
    flex: 1,
  },
  desc: {
    lineHeight: 18,
    marginBottom: theme.spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  memberBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  memberCount: {
    fontSize: 11,
  },
  scheduleText: {
    fontSize: 11,
    flex: 1,
    marginLeft: 4,
  },
  buttonWrapper: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderSubtle,
    paddingTop: theme.spacing.xs,
  },
  joinButton: {
    height: 34,
  },
});
