import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react-native';
import { AppText } from '../../../components/ui/AppText';
import { AppAvatar } from '../../../components/ui/AppAvatar';
import { AppBadge } from '../../../components/ui/AppBadge';
import { IconButton } from '../../../components/ui/IconButton';
import { Story } from '../types';
import { theme } from '../../../theme';

export interface StoryViewerProps {
  visible: boolean;
  stories: Story[];
  initialIndex?: number;
  onClose: () => void;
  onRecordView?: (storyId: string) => void;
}

const { width } = Dimensions.get('window');

export const StoryViewer: React.FC<StoryViewerProps> = ({
  visible,
  stories,
  initialIndex = 0,
  onClose,
  onRecordView,
}) => {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, visible]);

  const currentStory = stories[currentIndex];

  useEffect(() => {
    if (visible && currentStory) {
      onRecordView?.(currentStory.id);
    }
  }, [visible, currentIndex, currentStory, onRecordView]);

  if (!visible || !currentStory) return null;

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.container,
          {
            paddingTop: Platform.OS === 'ios' ? Math.max(insets.top, 20) : 20,
            paddingBottom: Math.max(insets.bottom, 20),
          },
        ]}
      >
        {/* Top Progress Bars */}
        <View style={styles.progressRow}>
          {stories.map((s, idx) => (
            <View key={s.id} style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width:
                      idx < currentIndex
                        ? '100%'
                        : idx === currentIndex
                        ? '100%'
                        : '0%',
                  },
                ]}
              />
            </View>
          ))}
        </View>

        {/* Top Author Bar */}
        <View style={styles.header}>
          <View style={styles.authorRow}>
            <AppAvatar
              name={currentStory.author.fullName}
              size="sm"
              style={{ backgroundColor: currentStory.bgColor || theme.colors.maroon }}
            />
            <View style={styles.authorInfo}>
              <View style={styles.nameBadgeRow}>
                <AppText variant="bodySmallMedium" style={styles.authorName}>
                  {currentStory.author.fullName}
                </AppText>
                <AppBadge
                  label={currentStory.type.toUpperCase()}
                  variant={currentStory.type === 'student' ? 'olive' : 'maroon'}
                  size="sm"
                />
              </View>
              <AppText variant="caption" style={styles.timestamp}>
                {currentStory.createdAt} · {currentStory.author.collegeName}
              </AppText>
            </View>
          </View>

          <IconButton
            icon={<X size={20} color={theme.colors.textInverse} />}
            variant="ghost"
            size="sm"
            onPress={onClose}
            accessibilityLabel="Close story"
          />
        </View>

        {/* Story Central Card */}
        <View style={styles.storyCard}>
          <View style={styles.emblemContainer}>
            <Sparkles size={20} color={theme.colors.maroon} />
          </View>

          {currentStory.title ? (
            <AppText variant="h2" serif color="primary" align="center" style={styles.storyTitle}>
              {currentStory.title}
            </AppText>
          ) : null}

          <AppText variant="bodyLarge" color="primary" align="center" style={styles.storyContent}>
            {currentStory.textSnippet}
          </AppText>
        </View>

        {/* Left & Right Invisible Tap Handlers */}
        <Pressable
          style={styles.leftTapArea}
          onPress={handlePrev}
          accessibilityLabel="Previous story"
        />
        <Pressable
          style={styles.rightTapArea}
          onPress={handleNext}
          accessibilityLabel="Next story"
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1A18EE',
    paddingHorizontal: theme.spacing.screenPadding,
    justifyContent: 'space-between',
  },
  progressRow: {
    flexDirection: 'row',
    gap: 4,
    width: '100%',
    height: 3,
    marginBottom: theme.spacing.sm,
  },
  progressBarBg: {
    flex: 1,
    height: 3,
    borderRadius: theme.radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.textInverse,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  authorInfo: {},
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authorName: {
    color: theme.colors.textInverse,
  },
  timestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
  },
  storyCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 280,
    zIndex: 5,
    marginVertical: 'auto',
  },
  emblemContainer: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.maroonLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  storyTitle: {
    marginBottom: theme.spacing.md,
    lineHeight: 28,
  },
  storyContent: {
    lineHeight: 24,
  },
  leftTapArea: {
    position: 'absolute',
    top: 100,
    bottom: 80,
    left: 0,
    width: width * 0.35,
    zIndex: 8,
  },
  rightTapArea: {
    position: 'absolute',
    top: 100,
    bottom: 80,
    right: 0,
    width: width * 0.65,
    zIndex: 8,
  },
});
