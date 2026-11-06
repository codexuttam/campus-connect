import React, { useState } from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
  Pressable,
} from 'react-native';
import { theme } from '../../theme';
import { AppText } from './AppText';

export interface AppInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  helperText?: string;
  error?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  onTrailingIconPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

export const AppInput: React.FC<AppInputProps> = ({
  label,
  helperText,
  error,
  leadingIcon,
  trailingIcon,
  onTrailingIconPress,
  containerStyle,
  inputStyle,
  onFocus,
  onBlur,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const hasError = Boolean(error);

  const getBorderColor = () => {
    if (hasError) return theme.colors.error;
    if (isFocused) return theme.colors.maroon;
    return theme.colors.border;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <AppText variant="captionMedium" color="secondary" style={styles.label}>
          {label}
        </AppText>
      ) : null}

      <View
        style={[
          styles.inputContainer,
          { borderColor: getBorderColor() },
          isFocused && styles.inputFocused,
          hasError && styles.inputError,
        ]}
      >
        {leadingIcon ? <View style={styles.leadingIcon}>{leadingIcon}</View> : null}

        <TextInput
          style={[
            styles.textInput,
            inputStyle,
          ]}
          placeholderTextColor={theme.colors.textMuted}
          selectionColor={theme.colors.maroon}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />

        {trailingIcon ? (
          onTrailingIconPress ? (
            <Pressable
              onPress={onTrailingIconPress}
              hitSlop={8}
              style={styles.trailingIcon}
            >
              {trailingIcon}
            </Pressable>
          ) : (
            <View style={styles.trailingIcon}>{trailingIcon}</View>
          )
        ) : null}
      </View>

      {hasError ? (
        <AppText variant="caption" style={styles.errorText}>
          {error}
        </AppText>
      ) : helperText ? (
        <AppText variant="caption" color="muted" style={styles.helperText}>
          {helperText}
        </AppText>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    marginBottom: theme.spacing.xs + 2,
    textTransform: 'uppercase',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1.2,
    minHeight: 48,
    paddingHorizontal: theme.spacing.md,
  },
  inputFocused: {
    borderWidth: 1.5,
  },
  inputError: {
    backgroundColor: theme.colors.errorLight,
  },
  textInput: {
    flex: 1,
    fontFamily: theme.fontFamilies.sans.regular,
    fontSize: theme.fontSizes.body,
    color: theme.colors.textPrimary,
    paddingVertical: theme.spacing.sm,
  },
  leadingIcon: {
    marginRight: theme.spacing.sm,
  },
  trailingIcon: {
    marginLeft: theme.spacing.sm,
  },
  errorText: {
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
  helperText: {
    marginTop: theme.spacing.xs,
  },
});
