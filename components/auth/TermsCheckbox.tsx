import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { theme } from '../../theme';
import { AppText } from '../ui/AppText';

export interface TermsCheckboxProps {
  checked: boolean;
  onToggle: (checked: boolean) => void;
  label?: string;
  children?: React.ReactNode;
  hasError?: boolean;
}

export const TermsCheckbox: React.FC<TermsCheckboxProps> = ({
  checked,
  onToggle,
  label,
  children,
  hasError = false,
}) => {
  return (
    <Pressable
      onPress={() => onToggle(!checked)}
      style={styles.container}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      hitSlop={8}
    >
      <View
        style={[
          styles.checkbox,
          checked && styles.checkboxChecked,
          hasError && styles.checkboxError,
        ]}
      >
        {checked ? (
          <Check
            size={13}
            color={theme.colors.textInverse}
            strokeWidth={theme.icons.strokeWidth.bold}
          />
        ) : null}
      </View>
      <View style={styles.textContainer}>
        {children ? (
          children
        ) : (
          <AppText variant="caption" color="secondary" style={styles.label}>
            {label}
          </AppText>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: theme.spacing.md,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: theme.radius.xs,
    borderWidth: 1.5,
    borderColor: theme.colors.borderStrong,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    marginRight: theme.spacing.sm,
  },
  checkboxChecked: {
    backgroundColor: theme.colors.maroon,
    borderColor: theme.colors.maroon,
  },
  checkboxError: {
    borderColor: theme.colors.error,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    lineHeight: 18,
  },
});

