import React from 'react';
import { View, StyleSheet, Pressable, Image } from 'react-native';
import { Bookmark, Users, Sparkles, FolderGit2 } from 'lucide-react-native';
import { AppText } from '../../../components/ui/AppText';
import { AppCard } from '../../../components/ui/AppCard';
import { AppBadge } from '../../../components/ui/AppBadge';
import { IconButton } from '../../../components/ui/IconButton';
import { Project } from '../types';
import { theme } from '../../../theme';

export interface ProjectCardProps {
  project: Project;
  onPress: () => void;
  onBookmark: () => void;
  compact?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onPress,
  onBookmark,
  compact = false,
}) => {
  return (
    <AppCard variant="default" padding="none" style={[styles.card, compact && styles.compactCard]}>
      {/* Project Thumbnail Image */}
      <Pressable onPress={onPress} style={styles.imageContainer}>
        <Image
          source={{ uri: project.thumbnail }}
          style={[styles.thumbnail, compact && styles.compactThumbnail]}
          resizeMode="cover"
        />
        <View style={styles.categoryBadge}>
          <AppBadge label={project.category} variant="maroon" size="sm" />
        </View>

        {project.isSeekingTeammates && (
          <View style={styles.seekingBadge}>
            <AppBadge label="Seeking Teammates" variant="olive" size="sm" dot />
          </View>
        )}
      </Pressable>

      {/* Card Content Details */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Pressable onPress={onPress} style={styles.titleCol}>
            <AppText variant="bodyLarge" serif color="primary" numberOfLines={1}>
              {project.title}
            </AppText>
            <AppText variant="caption" color="secondary" numberOfLines={1} style={styles.creatorText}>
              By {project.creator.fullName} · {project.creator.collegeName}
            </AppText>
          </Pressable>

          <IconButton
            icon={
              <Bookmark
                size={18}
                color={project.isBookmarked ? theme.colors.maroon : theme.colors.textMuted}
                fill={project.isBookmarked ? theme.colors.maroon : 'transparent'}
              />
            }
            variant="ghost"
            size="sm"
            onPress={onBookmark}
            accessibilityLabel={project.isBookmarked ? 'Remove bookmark' : 'Bookmark project'}
          />
        </View>

        {/* Short Description (Max 2 lines) */}
        <Pressable onPress={onPress}>
          <AppText variant="bodySmall" color="secondary" numberOfLines={2} style={styles.desc}>
            {project.description}
          </AppText>
        </Pressable>

        {/* Technologies Badges */}
        <View style={styles.techRow}>
          {project.technologies.slice(0, 3).map((tech, idx) => (
            <AppBadge key={idx} label={tech} variant="neutral" size="sm" />
          ))}
          {project.technologies.length > 3 ? (
            <AppText variant="caption" color="muted" style={styles.moreTechText}>
              +{project.technologies.length - 3}
            </AppText>
          ) : null}
        </View>

        {/* Footer: Team Size & View Details */}
        <View style={styles.footerRow}>
          <View style={styles.teamSizeRow}>
            <Users size={13} color={theme.colors.textSecondary} />
            <AppText variant="caption" color="secondary">
              Team: {project.teamSize}/{project.maxTeamSize} scholars
            </AppText>
          </View>

          <Pressable onPress={onPress} hitSlop={6}>
            <AppText variant="captionMedium" style={styles.viewLink}>
              View Details
            </AppText>
          </Pressable>
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
    width: 260,
    marginRight: 12,
    marginBottom: 0,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    backgroundColor: theme.colors.surface,
  },
  thumbnail: {
    width: '100%',
    height: 140,
  },
  compactThumbnail: {
    height: 120,
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  seekingBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
  },
  content: {
    padding: theme.spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  titleCol: {
    flex: 1,
    marginRight: theme.spacing.xs,
  },
  creatorText: {
    fontSize: 11,
    marginTop: 1,
  },
  desc: {
    lineHeight: 18,
    marginBottom: theme.spacing.sm,
  },
  techRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: theme.spacing.sm,
  },
  moreTechText: {
    fontSize: 11,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderSubtle,
    paddingTop: theme.spacing.xs,
  },
  teamSizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  viewLink: {
    color: theme.colors.maroon,
    textDecorationLine: 'underline',
  },
});
