import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { TrendingUp } from 'lucide-react-native';
import { AppText } from '../../../components/ui/AppText';
import { AppCard } from '../../../components/ui/AppCard';
import { AppBadge } from '../../../components/ui/AppBadge';
import { TrendingTopic } from '../types';
import { theme } from '../../../theme';

export interface TrendingSectionProps {
  topics: TrendingTopic[];
  onSelectTopic?: (topic: TrendingTopic) => void;
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({
  topics,
  onSelectTopic,
}) => {
  if (!topics || topics.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <TrendingUp size={13} color={theme.colors.maroon} />
          <AppText variant="captionMedium" color="secondary" style={styles.sectionKicker}>
            TRENDING ON CAMPUS
          </AppText>
        </View>
        <AppText variant="caption" color="muted" style={styles.subHeader}>
          Active debates & notices
        </AppText>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {topics.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => onSelectTopic?.(item)}
            style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
          >
            <AppCard variant="surface" padding="sm" style={styles.card}>
              <View style={styles.badgeRow}>
                <AppBadge label={item.category} variant="neutral" size="sm" />
                <AppText variant="caption" color="secondary" style={styles.postCount}>
                  {item.postCount} posts
                </AppText>
              </View>
              <AppText variant="bodySmallMedium" color="primary" numberOfLines={1} style={styles.title}>
                {item.title}
              </AppText>
              <AppText variant="caption" color="maroon" numberOfLines={1} style={styles.tag}>
                {item.tag}
              </AppText>
            </AppCard>
          </Pressable>
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
    paddingHorizontal: theme.spacing.screenPadding,
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
    paddingHorizontal: theme.spacing.screenPadding,
    gap: 10,
  },
  pressable: {
    borderRadius: theme.radius.md,
  },
  pressed: {
    opacity: 0.8,
  },
  card: {
    width: 175,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  postCount: {
    fontSize: 10,
  },
  title: {
    fontSize: 13,
    marginBottom: 2,
  },
  tag: {
    fontSize: 11,
    fontFamily: theme.fontFamilies.sans.medium,
  },
});
