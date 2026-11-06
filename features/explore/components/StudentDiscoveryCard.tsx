import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { UserPlus, UserCheck, ShieldCheck, Heart, User } from 'lucide-react-native';
import { AppText } from '../../../components/ui/AppText';
import { AppCard } from '../../../components/ui/AppCard';
import { AppAvatar } from '../../../components/ui/AppAvatar';
import { AppBadge } from '../../../components/ui/AppBadge';
import { AppButton } from '../../../components/ui/AppButton';
import { IconButton } from '../../../components/ui/IconButton';
import { StudentProfile } from '../types';
import { theme } from '../../../theme';

export interface StudentDiscoveryCardProps {
  student: StudentProfile;
  onPress: () => void;
  onToggleConnect: () => void;
  onToggleFollow?: () => void;
  compact?: boolean;
}

export const StudentDiscoveryCard: React.FC<StudentDiscoveryCardProps> = ({
  student,
  onPress,
  onToggleConnect,
  onToggleFollow,
  compact = false,
}) => {
  const isConnected = student.connectionStatus === 'connected';
  const isPending = student.connectionStatus === 'pending';

  return (
    <AppCard variant="default" padding="md" style={[styles.card, compact && styles.compactCard]}>
      {/* Top Row: Avatar & Author Info */}
      <View style={styles.topRow}>
        <Pressable onPress={onPress} style={styles.avatarGroup}>
          <AppAvatar
            name={student.user.fullName}
            size="md"
            style={{
              backgroundColor:
                student.user.avatarPreset === 'olive'
                  ? theme.colors.olive
                  : theme.colors.maroon,
            }}
          />
          <View style={styles.textGroup}>
            <View style={styles.nameRow}>
              <AppText variant="bodySmallMedium" color="primary" numberOfLines={1}>
                {student.user.fullName}
              </AppText>
              {student.user.isVerified ? (
                <ShieldCheck size={13} color={theme.colors.olive} />
              ) : null}
            </View>
            <AppText variant="caption" color="secondary" numberOfLines={1}>
              {student.user.courseOrBranch}
            </AppText>
            <AppText variant="caption" color="muted" style={styles.metaSub}>
              {student.user.collegeName}
              {student.user.graduationYear ? ` · '${student.user.graduationYear.slice(-2)}` : ''}
            </AppText>
          </View>
        </Pressable>

        {onToggleFollow && (
          <IconButton
            icon={
              <Heart
                size={16}
                color={student.isFollowing ? theme.colors.maroon : theme.colors.textMuted}
                fill={student.isFollowing ? theme.colors.maroon : 'transparent'}
              />
            }
            variant="ghost"
            size="sm"
            onPress={onToggleFollow}
            accessibilityLabel={student.isFollowing ? 'Unfollow scholar' : 'Follow scholar'}
          />
        )}
      </View>

      {/* Bio Snippet if available and not compact */}
      {!compact && student.bio ? (
        <Pressable onPress={onPress}>
          <AppText variant="bodySmall" color="secondary" numberOfLines={2} style={styles.bio}>
            {student.bio}
          </AppText>
        </Pressable>
      ) : null}

      {/* Up to Three Skill Tags */}
      <View style={styles.skillsRow}>
        {student.skills.slice(0, 3).map((skill, idx) => (
          <AppBadge
            key={idx}
            label={skill}
            variant="neutral"
            size="sm"
          />
        ))}
      </View>

      {/* Bottom Footer: Mutuals & Connect CTA */}
      <View style={styles.footerRow}>
        <AppText variant="caption" color="muted" style={styles.mutualText}>
          {student.mutualConnections > 0
            ? `${student.mutualConnections} mutual connections`
            : 'Same college cohort'}
        </AppText>

        <AppButton
          title={
            isConnected
              ? 'Connected'
              : isPending
              ? 'Pending'
              : 'Connect'
          }
          variant={isConnected ? 'secondary' : isPending ? 'outline' : 'primary'}
          size="sm"
          leadingIcon={
            isConnected ? (
              <UserCheck size={12} color={theme.colors.textPrimary} />
            ) : (
              <UserPlus
                size={12}
                color={isPending ? theme.colors.maroon : theme.colors.textInverse}
              />
            )
          }
          onPress={onToggleConnect}
          style={styles.connectButton}
        />
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.radius.card,
  },
  compactCard: {
    width: 250,
    marginRight: 10,
    marginBottom: 0,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  avatarGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textGroup: {
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaSub: {
    fontSize: 11,
    marginTop: 1,
  },
  bio: {
    lineHeight: 18,
    marginBottom: theme.spacing.sm,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: theme.spacing.md,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderSubtle,
    paddingTop: theme.spacing.xs,
  },
  mutualText: {
    fontSize: 11,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  connectButton: {
    minWidth: 92,
    height: 32,
  },
});
