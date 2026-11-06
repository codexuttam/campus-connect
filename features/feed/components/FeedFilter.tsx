import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { AppText } from '../../../components/ui/AppText';
import { PostCategory } from '../types';
import { theme } from '../../../theme';

export interface FeedFilterProps {
  activeTab: 'for-you' | 'following';
  onTabChange: (tab: 'for-you' | 'following') => void;
  activeCategory: PostCategory;
  onCategoryChange: (category: PostCategory) => void;
}

const CATEGORIES: { id: PostCategory; label: string }[] = [
  { id: 'all', label: 'All Circles' },
  { id: 'academic', label: 'Academic' },
  { id: 'campus-life', label: 'Campus Life' },
  { id: 'research', label: 'Research' },
  { id: 'events', label: 'Events' },
  { id: 'clubs', label: 'Clubs & Societies' },
];

export const FeedFilter: React.FC<FeedFilterProps> = ({
  activeTab,
  onTabChange,
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <View style={styles.container}>
      {/* Top Segmented Tabs: For You vs Following */}
      <View style={styles.tabBar}>
        <Pressable
          onPress={() => onTabChange('for-you')}
          style={[styles.tabButton, activeTab === 'for-you' && styles.tabButtonActive]}
          hitSlop={6}
        >
          <AppText
            variant="bodySmallMedium"
            style={[
              styles.tabText,
              activeTab === 'for-you' && styles.tabTextActive,
            ]}
          >
            For You
          </AppText>
          {activeTab === 'for-you' ? <View style={styles.activeIndicator} /> : null}
        </Pressable>

        <Pressable
          onPress={() => onTabChange('following')}
          style={[styles.tabButton, activeTab === 'following' && styles.tabButtonActive]}
          hitSlop={6}
        >
          <AppText
            variant="bodySmallMedium"
            style={[
              styles.tabText,
              activeTab === 'following' && styles.tabTextActive,
            ]}
          >
            Following
          </AppText>
          {activeTab === 'following' ? <View style={styles.activeIndicator} /> : null}
        </Pressable>
      </View>

      {/* Category Pills Horizontal Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesScroll}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = activeCategory === cat.id;
          return (
            <Pressable
              key={cat.id}
              onPress={() => onCategoryChange(cat.id)}
              style={[
                styles.categoryChip,
                isSelected && styles.categoryChipSelected,
              ]}
              hitSlop={4}
            >
              <AppText
                variant="caption"
                style={[
                  styles.categoryText,
                  isSelected && styles.categoryTextSelected,
                ]}
              >
                {cat.label}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderSubtle,
    paddingTop: 4,
    paddingBottom: theme.spacing.sm,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.screenPadding,
    gap: theme.spacing.xl,
    marginBottom: theme.spacing.sm,
  },
  tabButton: {
    paddingVertical: 6,
    position: 'relative',
    alignItems: 'center',
  },
  tabButtonActive: {},
  tabText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  tabTextActive: {
    color: theme.colors.maroon,
    fontFamily: theme.fontFamilies.sans.bold,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 20,
    height: 2.5,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.maroon,
  },
  categoriesScroll: {
    paddingHorizontal: theme.spacing.screenPadding,
    gap: 8,
    alignItems: 'center',
  },
  categoryChip: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  categoryChipSelected: {
    backgroundColor: theme.colors.maroon,
    borderColor: theme.colors.maroon,
  },
  categoryText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  categoryTextSelected: {
    color: theme.colors.textInverse,
    fontFamily: theme.fontFamilies.sans.semiBold,
  },
});
