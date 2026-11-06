import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Bookmark, Users, Sparkles, FolderGit2, Check, ArrowRight } from 'lucide-react-native';
import { AppText } from '../../../components/ui/AppText';
import { AppBadge } from '../../../components/ui/AppBadge';
import { AppButton } from '../../../components/ui/AppButton';
import { AppAvatar } from '../../../components/ui/AppAvatar';
import { IconButton } from '../../../components/ui/IconButton';
import { Project } from '../types';
import { theme } from '../../../theme';

export interface ProjectDetailsModalProps {
  project: Project | null;
  visible: boolean;
  onClose: () => void;
  onBookmark: () => void;
}

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  project,
  visible,
  onClose,
  onBookmark,
}) => {
  const insets = useSafeAreaInsets();

  if (!visible || !project) return null;

  const handleApply = () => {
    Alert.alert(
      'Collaboration Request Sent',
      `Your profile has been forwarded to ${project.creator.fullName} for review on the Collaboration Hub.`,
      [{ text: 'Understood' }]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.container,
          {
            paddingTop: Platform.OS === 'ios' ? Math.max(insets.top, 16) : 16,
            paddingBottom: insets.bottom + 12,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <AppText variant="captionMedium" color="secondary" style={styles.kicker}>
            RESEARCH & VENTURE
          </AppText>
          <IconButton
            icon={<X size={20} color={theme.colors.textPrimary} />}
            variant="surface"
            size="sm"
            onPress={onClose}
            accessibilityLabel="Close project details"
          />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Project Image Banner */}
          <View style={styles.imageBox}>
            <Image
              source={{ uri: project.thumbnail }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
            <View style={styles.categoryBadge}>
              <AppBadge label={project.category} variant="maroon" size="sm" />
            </View>
            {project.isSeekingTeammates && (
              <View style={styles.seekingBadge}>
                <AppBadge label="Open Roles" variant="olive" size="sm" dot />
              </View>
            )}
          </View>

          {/* Title & Tagline */}
          <View style={styles.titleSection}>
            <View style={styles.titleRow}>
              <AppText variant="h1" serif color="primary" style={styles.title}>
                {project.title}
              </AppText>
              <IconButton
                icon={
                  <Bookmark
                    size={20}
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
            <AppText variant="bodyLarge" color="secondary" style={styles.tagline}>
              {project.tagline}
            </AppText>
          </View>

          {/* Project Creator Bar */}
          <View style={styles.creatorBar}>
            <AppAvatar
              name={project.creator.fullName}
              size="md"
              style={{ backgroundColor: theme.colors.maroon }}
            />
            <View style={styles.creatorMeta}>
              <AppText variant="captionMedium" color="secondary" style={styles.creatorKicker}>
                PROJECT INITIATOR
              </AppText>
              <AppText variant="bodyMedium" color="primary">
                {project.creator.fullName}
              </AppText>
              <AppText variant="caption" color="secondary">
                {project.creator.courseOrBranch} · {project.creator.collegeName}
              </AppText>
            </View>
          </View>

          {/* Full Description */}
          <View style={styles.section}>
            <AppText variant="captionMedium" color="secondary" style={styles.sectionTitle}>
              PROJECT OVERVIEW
            </AppText>
            <AppText variant="body" color="primary" style={styles.descText}>
              {project.description}
            </AppText>
          </View>

          {/* Tech Stack */}
          <View style={styles.section}>
            <AppText variant="captionMedium" color="secondary" style={styles.sectionTitle}>
              TECHNOLOGIES & STACK
            </AppText>
            <View style={styles.chipsRow}>
              {project.technologies.map((tech, idx) => (
                <AppBadge key={idx} label={tech} variant="neutral" size="sm" />
              ))}
            </View>
          </View>

          {/* Team Status & Seeking Roles */}
          {project.seekingRoles && project.seekingRoles.length > 0 && (
            <View style={styles.section}>
              <AppText variant="captionMedium" color="secondary" style={styles.sectionTitle}>
                OPEN RECRUITMENT ROLES
              </AppText>
              <View style={styles.rolesList}>
                {project.seekingRoles.map((role, idx) => (
                  <View key={idx} style={styles.roleItem}>
                    <Sparkles size={14} color={theme.colors.olive} />
                    <AppText variant="bodySmallMedium" color="primary">
                      {role}
                    </AppText>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer Action */}
        <View style={styles.footer}>
          <AppButton
            title={project.isSeekingTeammates ? 'Apply for Collaboration' : 'Contact Creator'}
            variant="primary"
            size="lg"
            fullWidth
            trailingIcon={<ArrowRight size={16} color={theme.colors.textInverse} />}
            onPress={handleApply}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.screenPadding,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderSubtle,
  },
  kicker: {
    fontSize: 10,
    letterSpacing: theme.letterSpacing.wider,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xxxl,
  },
  imageBox: {
    position: 'relative',
    width: '100%',
    height: 180,
    borderRadius: theme.radius.card,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.lg,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  seekingBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
  titleSection: {
    marginBottom: theme.spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  title: {
    flex: 1,
    lineHeight: 28,
  },
  tagline: {
    lineHeight: 22,
    marginTop: 4,
  },
  creatorBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.xl,
  },
  creatorMeta: {
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  creatorKicker: {
    fontSize: 9,
    letterSpacing: theme.letterSpacing.wider,
    marginBottom: 1,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 10,
    letterSpacing: theme.letterSpacing.wider,
    marginBottom: theme.spacing.sm,
  },
  descText: {
    lineHeight: 22,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  rolesList: {
    gap: 8,
  },
  roleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.card,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  footer: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderSubtle,
  },
});
