import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import { AppText } from '../ui/AppText';

export interface PasswordStrengthMeterProps {
  password?: string;
}

export type StrengthLevel = 0 | 1 | 2 | 3 | 4;

export function evaluatePasswordStrength(password: string): {
  score: StrengthLevel;
  label: string;
  color: string;
} {
  if (!password) {
    return { score: 0, label: '', color: theme.colors.border };
  }

  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;

  if (score === 1) {
    return { score: 1, label: 'Weak', color: theme.colors.error };
  }
  if (score === 2) {
    return { score: 2, label: 'Fair', color: theme.colors.warning };
  }
  if (score === 3) {
    return { score: 3, label: 'Good', color: theme.colors.olive };
  }
  if (score >= 4) {
    return { score: 4, label: 'Strong', color: theme.colors.success };
  }

  return { score: 1, label: 'Too short', color: theme.colors.error };
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password = '',
}) => {
  if (!password) return null;

  const { score, label, color } = evaluatePasswordStrength(password);

  return (
    <View style={styles.container}>
      <View style={styles.barsRow}>
        {[1, 2, 3, 4].map((index) => {
          const isActive = index <= score;
          return (
            <View
              key={index}
              style={[
                styles.bar,
                {
                  backgroundColor: isActive ? color : theme.colors.borderSubtle,
                },
              ]}
            />
          );
        })}
      </View>
      <View style={styles.labelRow}>
        <AppText variant="caption" color="secondary" style={styles.hint}>
          Password strength
        </AppText>
        <AppText
          variant="captionMedium"
          style={[styles.strengthLabel, { color }]}
        >
          {label}
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  barsRow: {
    flexDirection: 'row',
    gap: 4,
    height: 4,
    width: '100%',
    marginBottom: 4,
  },
  bar: {
    flex: 1,
    height: 3,
    borderRadius: theme.radius.xs,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hint: {
    fontSize: 11,
  },
  strengthLabel: {
    fontSize: 11,
    textTransform: 'capitalize',
  },
});

