import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SearchX, AlertCircle, Compass } from 'lucide-react-native';
import { AppText } from '../../../components/ui/AppText';
import { AppButton } from '../../../components/ui/AppButton';
import { theme } from '../../../theme';

export interface EmptySearchStateProps {
  type?: 'no_results' | 'error' | 'initial';
  query?: string;
  onResetQuery?: () => void;
  onRetry?: () => void;
}

export const EmptySearchState: React.FC<EmptySearchStateProps> = ({
  type = 'no_results',
  query = '',
  onResetQuery,
  onRetry,
}) => {
  if (type === 'error') {
    return (
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <AlertCircle size={28} color={theme.colors.error} />
        </View>
        <AppText variant="h3" serif color="primary" align="center" style={styles.title}>
          Search Temporarily Unavailable
        </AppText>
        <AppText variant="bodySmall" color="secondary" align="center" style={styles.desc}>
          We couldn't connect to the campus discovery index. Please check connection and retry.
        </AppText>
        {onRetry ? (
          <AppButton
            title="Retry Search"
            variant="outline"
            size="sm"
            onPress={onRetry}
            style={styles.actionButton}
          />
        ) : null}
      </View>
    );
  }

  if (type === 'no_results') {
    return (
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <SearchX size={28} color={theme.colors.textMuted} />
        </View>
        <AppText variant="h3" serif color="primary" align="center" style={styles.title}>
          No Records Found
        </AppText>
        <AppText variant="bodySmall" color="secondary" align="center" style={styles.desc}>
          {query
            ? `No students, projects, or societies matched "${query}".`
            : 'Try refining your keywords or loosening your filters.'}
        </AppText>
        {onResetQuery ? (
          <AppButton
            title="Clear Search"
            variant="secondary"
            size="sm"
            onPress={onResetQuery}
            style={styles.actionButton}
          />
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Compass size={28} color={theme.colors.olive} />
      </View>
      <AppText variant="h3" serif color="primary" align="center" style={styles.title}>
        Search CampusConnect
      </AppText>
      <AppText variant="bodySmall" color="secondary" align="center" style={styles.desc}>
        Search verified students, collaborative research projects, official societies, and discussions.
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.massive,
    paddingHorizontal: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    marginBottom: 4,
  },
  desc: {
    maxWidth: 280,
    lineHeight: 18,
  },
  actionButton: {
    marginTop: theme.spacing.lg,
  },
});
