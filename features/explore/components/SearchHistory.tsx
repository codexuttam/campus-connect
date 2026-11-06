import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Clock, X, Sparkles, ArrowUpRight } from 'lucide-react-native';
import { AppText } from '../../../components/ui/AppText';
import { AppBadge } from '../../../components/ui/AppBadge';
import { theme } from '../../../theme';

export interface SearchHistoryProps {
  history: string[];
  onSelectTerm: (term: string) => void;
  onRemoveTerm: (term: string) => void;
  onClearHistory: () => void;
  suggestedSearches?: string[];
}

const DEFAULT_SUGGESTIONS = [
  'Formal Verification',
  'Autonomous Drones',
  'Bodleian Library',
  'Saïd Founders',
  'Legal AI Copyright',
  'HackOxford Teams',
];

export const SearchHistory: React.FC<SearchHistoryProps> = ({
  history,
  onSelectTerm,
  onRemoveTerm,
  onClearHistory,
  suggestedSearches = DEFAULT_SUGGESTIONS,
}) => {
  return (
    <View style={styles.container}>
      {/* Search History Section */}
      {history.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AppText variant="captionMedium" color="secondary" style={styles.kicker}>
              RECENT SEARCHES
            </AppText>
            <Pressable onPress={onClearHistory} hitSlop={6}>
              <AppText variant="caption" style={styles.clearText}>
                Clear All
              </AppText>
            </Pressable>
          </View>

          <View style={styles.historyList}>
            {history.map((term, idx) => (
              <View key={term + idx} style={styles.historyRow}>
                <Pressable
                  onPress={() => onSelectTerm(term)}
                  style={styles.termPressable}
                >
                  <Clock size={14} color={theme.colors.textMuted} />
                  <AppText variant="bodySmall" color="primary" numberOfLines={1} style={styles.termText}>
                    {term}
                  </AppText>
                </Pressable>

                <Pressable
                  onPress={() => onRemoveTerm(term)}
                  hitSlop={8}
                  style={styles.removeButton}
                  accessibilityLabel={`Remove ${term} from history`}
                >
                  <X size={14} color={theme.colors.textMuted} />
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Suggested Searches Section */}
      <View style={styles.section}>
        <View style={styles.suggestedHeader}>
          <Sparkles size={13} color={theme.colors.olive} />
          <AppText variant="captionMedium" color="secondary" style={styles.kicker}>
            SUGGESTED CAMPUS TOPICS
          </AppText>
        </View>

        <View style={styles.chipsWrap}>
          {suggestedSearches.map((tag) => (
            <Pressable
              key={tag}
              onPress={() => onSelectTerm(tag)}
              style={styles.suggestedChip}
            >
              <AppText variant="caption" color="primary" style={styles.suggestedText}>
                {tag}
              </AppText>
              <ArrowUpRight size={12} color={theme.colors.maroon} />
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.sm,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  kicker: {
    fontSize: 10,
    letterSpacing: theme.letterSpacing.wider,
  },
  clearText: {
    color: theme.colors.maroon,
    fontSize: 11,
  },
  historyList: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 4,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderSubtle,
  },
  termPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  termText: {
    flex: 1,
  },
  removeButton: {
    padding: 2,
  },
  suggestedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: theme.spacing.sm,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  suggestedText: {
    fontSize: 12,
  },
});
