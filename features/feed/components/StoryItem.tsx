import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { AppText } from '../../../components/ui/AppText';
import { AppAvatar } from '../../../components/ui/AppAvatar';
import { Story } from '../types';
import { theme } from '../../../theme';

export interface StoryItemProps {
  story: Story;
  onPress: () => void;
}

export const StoryItem: React.FC<StoryItemProps> = ({ story, onPress }) => {
  const isViewed = story.isViewed;
  const isClub = story.type === 'club' || story.type === 'society';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`View story from ${story.author.fullName}`}
    >
      <View
        style={[
          styles.avatarRing,
          isViewed ? styles.avatarRingViewed : styles.avatarRingUnviewed,
        ]}
      >
        <AppAvatar
          name={story.author.fullName}
          size="md"
          style={{ backgroundColor: story.bgColor || theme.colors.maroon }}
        />
      </View>
      <AppText
        variant="caption"
        color={isViewed ? 'muted' : 'primary'}
        numberOfLines={1}
        align="center"
        style={styles.authorName}
      >
        {isClub ? story.author.fullName.split(' ')[0] : story.author.fullName.split(' ')[0]}
      </AppText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 66,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  avatarRing: {
    width: 52,
    height: 52,
    borderRadius: theme.radius.full,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  avatarRingUnviewed: {
    borderWidth: 2,
    borderColor: theme.colors.maroon,
  },
  avatarRingViewed: {
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    opacity: 0.8,
  },
  authorName: {
    marginTop: 4,
    width: '100%',
    fontSize: 10,
    fontFamily: theme.fontFamilies.sans.medium,
  },
});
