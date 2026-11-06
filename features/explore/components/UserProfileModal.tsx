import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, ShieldCheck, UserPlus, UserCheck, Heart, Sparkles, BookOpen } from 'lucide-react-native';
import { AppText } from '../../../components/ui/AppText';
import { AppBadge } from '../../../components/ui/AppBadge';
import { AppButton } from '../../../components/ui/AppButton';
import { AppAvatar } from '../../../components/ui/AppAvatar';
import { AppCard } from '../../../components/ui/AppCard';
import { IconButton } from '../../../components/ui/IconButton';
import { StudentProfile } from '../types';
import { theme } from '../../../theme';

export interface UserProfileModalProps {
  student: StudentProfile | null;
  visible: boolean;
  onClose: () => void;
  onToggleConnect: () => void;
  onToggleFollow?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  student,
  visible,
  onClose,
  onToggleConnect,
  onToggleFollow,
}) => {
  const insets = useSafeAreaInsets();

  if (!visible || !student) return null;

  const isConnected = student.connectionStatus === 'connected';
  const isPending = student.connectionStatus === 'pending';

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
            VERIFIED SCHOLAR PROFILE
          </AppText>
          <IconButton
            icon={<X size={20} color={theme.colors.textPrimary} />}
            variant="surface"
            size="sm"
            onPress={onClose}
            accessibilityLabel="Close scholar profile"
          />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Identity Header Card */}
          <AppCard variant="default" padding="lg" style={styles.identityCard}>
            <View style={styles.avatarRow}>
              <AppAvatar
                name={student.user.fullName}
                size="lg"
                style={{
                  backgroundColor:
                    student.user.avatarPreset === 'olive'
                      ? theme.colors.olive
                      : theme.colors.maroon,
                }}
              />
              <View style={styles.identityDetails}>
                <View style={styles.nameRow}>
                  <AppText variant="h2" serif color="primary">
                    {student.user.fullName}
                  </AppText>
                  {student.user.isVerified ? (
                    <ShieldCheck size={16} color={theme.colors.olive} />
                  ) : null}
                </View>
                <AppText variant="bodySmall" color="secondary">
                  {student.user.courseOrBranch}
                </AppText>
                <AppText variant="caption" color="muted">
                  {student.user.collegeName}
                  {student.user.graduationYear ? ` · Class of '${student.user.graduationYear.slice(-2)}` : ''}
                </AppText>
              </View>
            </View>

            {/* Quick stats row */}
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <AppText variant="captionMedium" color="secondary">
                  PROJECTS
                </AppText>
                <AppText variant="h3" color="primary">
                  {student.projectsCount ?? 2}
                </AppText>
              </View>
              <View style={styles.statBox}>
                <AppText variant="captionMedium" color="secondary">
                  CIRCLES
                </AppText>
                <AppText variant="h3" color="primary">
                  {student.communitiesCount ?? 4}
                </AppText>
              </View>
              <View style={styles.statBox}>
                <AppText variant="captionMedium" color="secondary">
                  MUTUALS
                </AppText>
                <AppText variant="h3" color="primary">
                  {student.mutualConnections}
                </AppText>
              </View>
            </View>
          </AppCard>

          {/* Bio */}
          {student.bio ? (
            <View style={styles.section}>
              <AppText variant="captionMedium" color="secondary" style={styles.sectionTitle}>
                ACADEMIC BIOGRAPHY
              </AppText>
              <AppText variant="body" color="primary" style={styles.bioText}>
                {student.bio}
              </AppText>
            </View>
          ) : null}

          {/* Skills */}
          <View style={styles.section}>
            <AppText variant="captionMedium" color="secondary" style={styles.sectionTitle}>
              SKILLS & EXPERTISE
            </AppText>
            <View style={styles.chipsWrap}>
              {student.skills.map((skill, idx) => (
                <AppBadge key={idx} label={skill} variant="neutral" size="sm" />
              ))}
            </View>
          </View>

          {/* Academic Interests */}
          {student.interests && student.interests.length > 0 && (
            <View style={styles.section}>
              <AppText variant="captionMedium" color="secondary" style={styles.sectionTitle}>
                RESEARCH & INQUIRY INTERESTS
              </AppText>
              <View style={styles.chipsWrap}>
                {student.interests.map((interest, idx) => (
                  <AppBadge key={idx} label={interest} variant="outline" size="sm" />
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer Actions */}
        <View style={styles.footer}>
          {onToggleFollow && (
            <AppButton
              title={student.isFollowing ? 'Following' : 'Follow'}
              variant="secondary"
              size="md"
              leadingIcon={
                <Heart
                  size={14}
                  color={student.isFollowing ? theme.colors.maroon : theme.colors.textPrimary}
                  fill={student.isFollowing ? theme.colors.maroon : 'transparent'}
                />
              }
              onPress={onToggleFollow}
              style={styles.followButton}
            />
          )}

          <AppButton
            title={
              isConnected
                ? 'Connected'
                : isPending
                ? 'Connection Pending'
                : 'Connect with Scholar'
            }
            variant={isConnected ? 'secondary' : isPending ? 'outline' : 'primary'}
            size="md"
            leadingIcon={
              isConnected ? (
                <UserCheck size={14} color={theme.colors.textPrimary} />
              ) : (
                <UserPlus
                  size={14}
                  color={isPending ? theme.colors.maroon : theme.colors.textInverse}
                />
              )
            }
            onPress={onToggleConnect}
            style={styles.connectButton}
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
  identityCard: {
    marginBottom: theme.spacing.lg,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  identityDetails: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderSubtle,
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
  statBox: {
    alignItems: 'center',
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 10,
    letterSpacing: theme.letterSpacing.wider,
    marginBottom: theme.spacing.sm,
  },
  bioText: {
    lineHeight: 22,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderSubtle,
  },
  followButton: {
    flex: 1,
  },
  connectButton: {
    flex: 2,
  },
});
