import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { UserPlus, UserCheck, Sparkles } from 'lucide-react-native';
import { AppText } from '../../../components/ui/AppText';
import { AppCard } from '../../../components/ui/AppCard';
import { AppAvatar } from '../../../components/ui/AppAvatar';
import { AppButton } from '../../../components/ui/AppButton';
import { ConnectionSuggestion } from '../types';
import { theme } from '../../../theme';

export interface SuggestedUserSectionProps {
  suggestions: ConnectionSuggestion[];
  onToggleConnect: (id: string) => void;
}

export const SuggestedUserSection: React.FC<SuggestedUserSectionProps> = ({
  suggestions,
  onToggleConnect,
}) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <Sparkles size={13} color={theme.colors.olive} />
          <AppText variant="captionMedium" color="secondary" style={styles.sectionKicker}>
            SUGGESTED SCHOLARS
          </AppText>
        </View>
        <AppText variant="caption" color="muted" style={styles.subHeader}>
          Same cohort & circles
        </AppText>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {suggestions.map((item) => (
          <AppCard key={item.id} variant="default" padding="sm" style={styles.card}>
            <View style={styles.cardContent}>
              <AppAvatar
                name={item.user.fullName}
                size="md"
                style={{
                  backgroundColor:
                    item.user.avatarPreset === 'olive'
                      ? theme.colors.olive
                      : theme.colors.maroon,
                }}
              />
              <AppText variant="bodySmallMedium" color="primary" numberOfLines={1} align="center" style={styles.name}>
                {item.user.fullName}
              </AppText>
              <AppText variant="caption" color="secondary" numberOfLines={1} align="center" style={styles.branch}>
                {item.user.courseOrBranch}
              </AppText>
              <AppText variant="caption" color="muted" align="center" style={styles.mutual}>
                {item.mutualCount} mutual peers
              </AppText>

              <AppButton
                title={item.isConnected ? 'Connected' : 'Connect'}
                variant={item.isConnected ? 'secondary' : 'primary'}
                size="sm"
                fullWidth
                leadingIcon={
                  item.isConnected ? (
                    <UserCheck size={12} color={theme.colors.textPrimary} />
                  ) : (
                    <UserPlus size={12} color={theme.colors.textInverse} />
                  )
                }
                onPress={() => onToggleConnect(item.id)}
                style={styles.connectButton}
              />
            </View>
          </AppCard>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sectionKicker: {
    fontSize: 10,
    letterSpacing: theme.letterSpacing.wider,
  },
  subHeader: {
    fontSize: 11,
  },
  scrollList: {
    gap: 10,
  },
  card: {
    width: 140,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  name: {
    marginTop: 6,
    width: '100%',
  },
  branch: {
    fontSize: 11,
    marginTop: 2,
    width: '100%',
  },
  mutual: {
    fontSize: 10,
    marginTop: 2,
    marginBottom: 8,
  },
  connectButton: {
    height: 32,
    paddingHorizontal: 8,
  },
});
