import React from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
} from 'react-native';
import { X, Users, Calendar, ShieldCheck, Check, Plus, Building2 } from 'lucide-react-native';
import { AppText } from '../../../components/ui/AppText';
import { AppBadge } from '../../../components/ui/AppBadge';
import { AppButton } from '../../../components/ui/AppButton';
import { Community } from '../types';
import { theme } from '../../../theme';

export interface CommunityDetailsModalProps {
  community: Community | null;
  visible: boolean;
  onClose: () => void;
  onToggleJoin: () => void;
}

export const CommunityDetailsModal: React.FC<CommunityDetailsModalProps> = ({
  community,
  visible,
  onClose,
  onToggleJoin,
}) => {
  if (!visible || !community) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.dismissOverlay} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.heroWrap}>
            <Image
              source={{ uri: community.coverImage }}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <Pressable
              onPress={onClose}
              style={styles.closeBtn}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Close community details"
            >
              <X size={18} color={theme.colors.textPrimary} />
            </Pressable>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <View style={styles.badgeRow}>
              <AppBadge label={community.category} variant="maroon" size="sm" />
              {community.isOfficialSociety && (
                <AppBadge label="Official Society" variant="olive" size="sm" dot />
              )}
            </View>

            <View style={styles.titleRow}>
              <AppText variant="h2" serif color="primary" style={styles.title}>
                {community.name}
              </AppText>
              {community.isOfficialSociety && (
                <ShieldCheck size={18} color={theme.colors.olive} />
              )}
            </View>

            <AppText variant="body" color="secondary" style={styles.description}>
              {community.description}
            </AppText>

            <View style={styles.metaCard}>
              <View style={styles.metaItem}>
                <Users size={15} color={theme.colors.maroon} />
                <AppText variant="bodySmallMedium" color="primary">
                  {community.memberCount} verified campus members
                </AppText>
              </View>

              <View style={styles.metaItem}>
                <Building2 size={15} color={theme.colors.olive} />
                <AppText variant="bodySmall" color="secondary">
                  {community.collegeAffiliation}
                </AppText>
              </View>

              {community.meetingSchedule && (
                <View style={styles.metaItem}>
                  <Calendar size={15} color={theme.colors.textSecondary} />
                  <AppText variant="bodySmall" color="secondary">
                    Meets: {community.meetingSchedule}
                  </AppText>
                </View>
              )}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <AppButton
              title={community.isJoined ? 'Joined Society' : 'Join Community'}
              variant={community.isJoined ? 'secondary' : 'primary'}
              fullWidth
              leadingIcon={
                community.isJoined ? (
                  <Check size={16} color={theme.colors.textPrimary} strokeWidth={2.4} />
                ) : (
                  <Plus size={16} color="#FBF7EF" strokeWidth={2.4} />
                )
              }
              onPress={onToggleJoin}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(48, 43, 40, 0.48)',
    justifyContent: 'flex-end',
  },
  dismissOverlay: {
    flex: 1,
  },
  sheet: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    overflow: 'hidden',
    maxHeight: '84%',
    paddingBottom: 28,
  },
  heroWrap: {
    position: 'relative',
    height: 170,
    backgroundColor: theme.colors.surface,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(251, 247, 239, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  body: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  title: {
    flex: 1,
  },
  description: {
    lineHeight: 21,
    marginBottom: theme.spacing.md,
  },
  metaCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 12,
    gap: 10,
    marginBottom: theme.spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footer: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.sm,
  },
});
