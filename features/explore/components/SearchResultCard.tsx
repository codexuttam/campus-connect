import React from 'react';
import { View, StyleSheet, Pressable, Image } from 'react-native';
import {
  Users,
  FolderGit2,
  Compass,
  FileText,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react-native';
import { AppText } from '../../../components/ui/AppText';
import { AppCard } from '../../../components/ui/AppCard';
import { AppAvatar } from '../../../components/ui/AppAvatar';
import { AppBadge } from '../../../components/ui/AppBadge';
import { StudentProfile, Project, Community } from '../types';
import { Post } from '../../feed/types';
import { theme } from '../../../theme';

export interface SearchResultCardProps {
  type: 'student' | 'project' | 'community' | 'post';
  data: StudentProfile | Project | Community | Post;
  onPress: () => void;
}

export const SearchResultCard: React.FC<SearchResultCardProps> = ({
  type,
  data,
  onPress,
}) => {
  if (type === 'student') {
    const student = data as StudentProfile;
    return (
      <Pressable onPress={onPress}>
        <AppCard variant="default" padding="sm" style={styles.card}>
          <View style={styles.contentRow}>
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
            <View style={styles.infoCol}>
              <View style={styles.titleRow}>
                <AppText variant="bodySmallMedium" color="primary" numberOfLines={1}>
                  {student.user.fullName}
                </AppText>
                {student.user.isVerified ? (
                  <ShieldCheck size={13} color={theme.colors.olive} />
                ) : null}
              </View>
              <AppText variant="caption" color="secondary" numberOfLines={1}>
                {student.user.courseOrBranch} · {student.user.collegeName}
              </AppText>
              <View style={styles.badgeRow}>
                {student.skills.slice(0, 2).map((sk, idx) => (
                  <AppBadge key={idx} label={sk} variant="neutral" size="sm" />
                ))}
              </View>
            </View>
            <ChevronRight size={16} color={theme.colors.textMuted} />
          </View>
        </AppCard>
      </Pressable>
    );
  }

  if (type === 'project') {
    const project = data as Project;
    return (
      <Pressable onPress={onPress}>
        <AppCard variant="default" padding="sm" style={styles.card}>
          <View style={styles.contentRow}>
            <Image source={{ uri: project.thumbnail }} style={styles.thumbImage} />
            <View style={styles.infoCol}>
              <View style={styles.titleRow}>
                <AppText variant="bodySmallMedium" color="primary" numberOfLines={1}>
                  {project.title}
                </AppText>
              </View>
              <AppText variant="caption" color="secondary" numberOfLines={1}>
                By {project.creator.fullName} · {project.category}
              </AppText>
              <AppText variant="caption" color="muted" numberOfLines={1} style={styles.subDetail}>
                Team: {project.teamSize}/{project.maxTeamSize} scholars
              </AppText>
            </View>
            <ChevronRight size={16} color={theme.colors.textMuted} />
          </View>
        </AppCard>
      </Pressable>
    );
  }

  if (type === 'community') {
    const community = data as Community;
    return (
      <Pressable onPress={onPress}>
        <AppCard variant="default" padding="sm" style={styles.card}>
          <View style={styles.contentRow}>
            <Image source={{ uri: community.coverImage }} style={styles.thumbImage} />
            <View style={styles.infoCol}>
              <View style={styles.titleRow}>
                <AppText variant="bodySmallMedium" color="primary" numberOfLines={1}>
                  {community.name}
                </AppText>
              </View>
              <AppText variant="caption" color="secondary" numberOfLines={1}>
                {community.category} · {community.memberCount} members
              </AppText>
            </View>
            <ChevronRight size={16} color={theme.colors.textMuted} />
          </View>
        </AppCard>
      </Pressable>
    );
  }

  const post = data as Post;
  return (
    <Pressable onPress={onPress}>
      <AppCard variant="default" padding="sm" style={styles.card}>
        <View style={styles.contentRow}>
          <View style={styles.postIconBox}>
            <FileText size={18} color={theme.colors.maroon} />
          </View>
          <View style={styles.infoCol}>
            <AppText variant="captionMedium" color="primary" numberOfLines={1}>
              {post.author.fullName}
            </AppText>
            <AppText variant="caption" color="secondary" numberOfLines={2}>
              {post.content}
            </AppText>
          </View>
          <ChevronRight size={16} color={theme.colors.textMuted} />
        </View>
      </AppCard>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.sm,
    borderRadius: theme.radius.md,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  thumbImage: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface,
  },
  postIconBox: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.maroonLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  subDetail: {
    fontSize: 11,
    marginTop: 2,
  },
});
