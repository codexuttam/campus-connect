import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Users, FolderGit2, Compass, Layers } from 'lucide-react-native';
import { AppText } from '../../../components/ui/AppText';
import { ExploreCategory } from '../types';
import { theme } from '../../../theme';

export interface CategoryFilterProps {
  selectedCategory: ExploreCategory;
  onSelectCategory: (category: ExploreCategory) => void;
}

const CATEGORIES: { id: ExploreCategory; label: string; icon: any }[] = [
  { id: 'all', label: 'All Discovery', icon: Layers },
  { id: 'people', label: 'People', icon: Users },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'communities', label: 'Communities', icon: Compass },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const Icon = cat.icon;

          return (
            <Pressable
              key={cat.id}
              onPress={() => onSelectCategory(cat.id)}
              style={[
                styles.chip,
                isSelected && styles.chipSelected,
              ]}
              hitSlop={4}
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected }}
            >
              <Icon
                size={14}
                color={isSelected ? theme.colors.textInverse : theme.colors.textSecondary}
                strokeWidth={theme.icons.strokeWidth.default}
              />
              <AppText
                variant="caption"
                style={[
                  styles.chipText,
                  isSelected && styles.chipTextSelected,
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
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.screenPadding,
    gap: 8,
    alignItems: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipSelected: {
    backgroundColor: theme.colors.maroon,
    borderColor: theme.colors.maroon,
  },
  chipText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  chipTextSelected: {
    color: theme.colors.textInverse,
    fontFamily: theme.fontFamilies.sans.semiBold,
  },
});
