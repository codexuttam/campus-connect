import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Sparkles, Building2, BookOpen, Users } from 'lucide-react-native';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { AppHeader } from '../components/ui/AppHeader';
import { AppText } from '../components/ui/AppText';
import { AppInput } from '../components/ui/AppInput';
import { AppCard } from '../components/ui/AppCard';
import { AppBadge } from '../components/ui/AppBadge';
import { theme } from '../theme';

const RECENT_SEARCHES = [
  'Epistemic Limits in Reasoning',
  'Radcliffe Camera collection hours',
  'Undergraduate Philosophy Paper Prize',
  'HackOxford team formation',
];

export default function SearchPlaceholderScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  return (
    <ScreenContainer scrollable safeTop padded={false} style={styles.container}>
      <AppHeader
        title="Campus Search"
        serifTitle
        showBack
        onBack={() => router.back()}
        borderBottom={false}
      />

      <View style={styles.content}>
        <AppInput
          placeholder="Search scholars, discussions, or campus circles..."
          value={query}
          onChangeText={setQuery}
          autoFocus
          leadingIcon={<Search size={18} color={theme.colors.textMuted} />}
          containerStyle={styles.searchBar}
        />

        <View style={styles.section}>
          <AppText variant="captionMedium" color="secondary" style={styles.sectionKicker}>
            RECENT CAMPUS INQUIRIES
          </AppText>

          <View style={styles.recentList}>
            {RECENT_SEARCHES.map((item, idx) => (
              <Pressable
                key={idx}
                onPress={() => setQuery(item)}
                style={styles.recentItem}
              >
                <Search size={14} color={theme.colors.textMuted} />
                <AppText variant="bodySmall" color="primary" numberOfLines={1} style={styles.recentText}>
                  {item}
                </AppText>
              </Pressable>
            ))}
          </View>
        </View>

        <AppCard variant="surface" padding="lg" style={styles.infoCard}>
          <Sparkles size={24} color={theme.colors.maroon} />
          <AppText variant="h3" serif color="primary" style={styles.cardTitle}>
            Expanded Search Engine
          </AppText>
          <AppText variant="bodySmall" color="secondary" align="center" style={styles.cardDesc}>
            Full cross-circle discovery, course syllabus indexing, and verified scholar search will launch in Section 04.
          </AppText>
        </AppCard>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.xs,
  },
  searchBar: {
    marginBottom: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionKicker: {
    fontSize: 10,
    letterSpacing: theme.letterSpacing.wider,
    marginBottom: theme.spacing.sm,
  },
  recentList: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 4,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderSubtle,
  },
  recentText: {
    flex: 1,
  },
  infoCard: {
    alignItems: 'center',
  },
  cardTitle: {
    marginTop: theme.spacing.sm,
    marginBottom: 4,
  },
  cardDesc: {
    lineHeight: 18,
    maxWidth: 280,
  },
});
