import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText, AppButton, AppCard } from '../../components/ui';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { theme } from '../../theme';

export default function LoginPlaceholderScreen() {
  const router = useRouter();

  return (
    <ScreenContainer safeTop padded>
      <View style={styles.container}>
        <AppCard variant="default" padding="lg">
          <AppText variant="captionMedium" color="secondary" style={styles.kicker}>
            CAMPUS CONNECT
          </AppText>
          <AppText variant="h1" serif color="primary" style={styles.title}>
            Authentication Shell
          </AppText>
          <AppText variant="bodySmall" color="secondary" style={styles.description}>
            Authentication workflows and student directory verification will be configured in subsequent modules.
          </AppText>
          <AppButton
            title="Return to Campus"
            variant="primary"
            onPress={() => router.replace('/(tabs)')}
          />
        </AppCard>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  kicker: {
    letterSpacing: theme.letterSpacing.wider,
    marginBottom: 4,
  },
  title: {
    marginBottom: theme.spacing.sm,
  },
  description: {
    marginBottom: theme.spacing.lg,
    lineHeight: 18,
  },
});

