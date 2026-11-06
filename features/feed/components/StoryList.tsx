import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Plus } from 'lucide-react-native';
import { AppText } from '../../../components/ui/AppText';
import { AppAvatar } from '../../../components/ui/AppAvatar';
import { StoryItem } from './StoryItem';
import { Story } from '../types';
import { theme } from '../../../theme';

export interface StoryListProps {
  stories: Story[];
  onSelectStory: (index: number) => void;
  onAddStoryPress?: () => void;
  currentUserName?: string;
}

export const StoryList: React.FC<StoryListProps> = ({
  stories,
  onSelectStory,
  onAddStoryPress,
  currentUserName = 'You',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <AppText variant="captionMedium" color="secondary" style={styles.sectionKicker}>
          CAMPUS UPDATES
        </AppText>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Quick Add Update Trigger */}
        <Pressable
          onPress={onAddStoryPress}
          style={({ pressed }) => [styles.addStoryItem, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Post a campus update"
        >
          <View style={styles.addAvatarContainer}>
            <AppAvatar name={currentUserName} size="md" />
            <View style={styles.plusBadge}>
              <Plus size={10} color={theme.colors.textInverse} strokeWidth={3} />
            </View>
          </View>
          <AppText variant="caption" color="primary" numberOfLines={1} style={styles.addLabel}>
            Add Update
          </AppText>
        </Pressable>

        {/* Stories List */}
        {stories.map((story, index) => (
          <StoryItem
            key={story.id}
            story={story}
            onPress={() => onSelectStory(index)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderSubtle,
  },
  headerRow: {
    paddingHorizontal: theme.spacing.screenPadding,
    marginBottom: 6,
  },
  sectionKicker: {
    fontSize: 10,
    letterSpacing: theme.letterSpacing.wider,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.screenPadding,
    gap: 12,
    alignItems: 'center',
  },
  addStoryItem: {
    alignItems: 'center',
    width: 66,
  },
  pressed: {
    opacity: 0.8,
  },
  addAvatarContainer: {
    position: 'relative',
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 17,
    height: 17,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.maroon,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: theme.colors.background,
  },
  addLabel: {
    marginTop: 4,
    fontSize: 10,
    fontFamily: theme.fontFamilies.sans.medium,
  },
});
