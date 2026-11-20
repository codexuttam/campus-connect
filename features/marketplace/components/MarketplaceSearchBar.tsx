import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Pressable, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Search, X, SlidersHorizontal, Clock } from 'lucide-react-native';
import { AppText } from '../../../components/ui/AppText';
import { theme } from '../../../theme';

const RECENT_SEARCHES_KEY = 'campusconnect.marketplace.recentSearches.v1';
const DEFAULT_RECENT = ['Campbell Biology', 'iPad Pencil', 'Study Lamp'];

export interface MarketplaceSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  onFilterPress?: () => void;
  hasActiveFilters?: boolean;
  placeholder?: string;
}

export const MarketplaceSearchBar: React.FC<MarketplaceSearchBarProps> = ({
  value,
  onChangeText,
  onClear,
  onFilterPress,
  hasActiveFilters = false,
  placeholder = 'Search textbooks, electronics, dorm items...',
}) => {
  const [recentSearches, setRecentSearches] = useState<string[]>(DEFAULT_RECENT);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(RECENT_SEARCHES_KEY)
      .then((raw) => {
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) setRecentSearches(parsed);
        }
      })
      .catch(() => {});
  }, []);

  const persistRecent = (next: string[]) => {
    setRecentSearches(next);
    AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next)).catch(() => {});
  };

  const recordSearch = (term: string) => {
    const trimmed = term.trim();
    if (trimmed.length < 2) return;
    const next = [
      trimmed,
      ...recentSearches.filter((item) => item.toLowerCase() !== trimmed.toLowerCase()),
    ].slice(0, 6);
    persistRecent(next);
  };

  const removeRecent = (term: string) => {
    persistRecent(recentSearches.filter((item) => item !== term));
  };

  const showRecentRow = (isFocused || value.trim().length > 0) && recentSearches.length > 0;

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Search
            size={18}
            color={theme.colors.textMuted}
            strokeWidth={theme.icons.strokeWidth.default}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              recordSearch(value);
            }}
            onSubmitEditing={() => recordSearch(value)}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.textMuted}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="never"
          />
          {value.length > 0 && onClear && (
            <Pressable
              onPress={onClear}
              hitSlop={8}
              style={styles.clearButton}
              accessibilityRole="button"
              accessibilityLabel="Clear search text"
            >
              <X size={16} color={theme.colors.textSecondary} strokeWidth={2} />
            </Pressable>
          )}
        </View>

        {onFilterPress && (
          <Pressable
            onPress={onFilterPress}
            style={({ pressed }) => [
              styles.filterButton,
              hasActiveFilters && styles.filterButtonActive,
              pressed && styles.filterButtonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Open filters"
          >
            <SlidersHorizontal
              size={18}
              color={hasActiveFilters ? '#FBF7EF' : theme.colors.textPrimary}
              strokeWidth={1.8}
            />
            {hasActiveFilters && <View style={styles.activeDot} />}
          </Pressable>
        )}
      </View>

      {showRecentRow && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.recentRow}
        >
          {recentSearches.map((term) => (
            <View key={term} style={styles.recentChip}>
              <Pressable
                onPress={() => {
                  onChangeText(term);
                  recordSearch(term);
                }}
                style={styles.recentChipMain}
              >
                <Clock size={11} color={theme.colors.textMuted} />
                <AppText variant="caption" color="secondary" style={styles.recentChipText}>
                  {term}
                </AppText>
              </Pressable>
              <Pressable
                onPress={() => removeRecent(term)}
                hitSlop={6}
                accessibilityRole="button"
                accessibilityLabel={`Remove ${term} from recent searches`}
              >
                <X size={11} color={theme.colors.textMuted} />
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingBottom: 2,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.xs,
    gap: 8,
  },
  recentRow: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingBottom: 6,
    gap: 6,
  },
  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.full,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  recentChipMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recentChipText: {
    fontSize: 11,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
    height: 42,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: theme.fontFamilies.sans.regular,
    color: theme.colors.textPrimary,
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
  filterButton: {
    width: 42,
    height: 42,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  filterButtonActive: {
    backgroundColor: theme.colors.maroon,
    borderColor: theme.colors.maroon,
  },
  filterButtonPressed: {
    opacity: 0.85,
  },
  activeDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#FBF7EF',
  },
});
