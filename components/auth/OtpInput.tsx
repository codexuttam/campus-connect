import React, { useRef, useState, useEffect, ComponentRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Platform,
  NativeSyntheticEvent,
} from 'react-native';
import { theme } from '../../theme';
import { AppText } from '../ui/AppText';

export interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (otp: string) => void;
  hasError?: boolean;
  disabled?: boolean;
}

type TextInputInstance = ComponentRef<typeof TextInput>;

export const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  value = '',
  onChange,
  hasError = false,
  disabled = false,
}) => {
  const inputRefs = useRef<Array<TextInputInstance | null>>([]);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const digits = value.split('').slice(0, length);
  while (digits.length < length) {
    digits.push('');
  }

  const handleChangeText = (text: string, index: number) => {
    if (disabled) return;

    // Filter to only digits
    const cleaned = text.replace(/[^0-9]/g, '');

    // If user pasted multi-digit string (e.g. 6 digits)
    if (cleaned.length > 1) {
      const pastedDigits = cleaned.slice(0, length);
      onChange(pastedDigits);
      const nextFocus = Math.min(pastedDigits.length, length - 1);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = cleaned;
    const combined = newDigits.join('');
    onChange(combined);

    // If digit was entered, advance focus to next input
    if (cleaned && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<{ key: string }>,
    index: number
  ) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // Move back and clear previous
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        onChange(newDigits.join(''));
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleBoxPress = (index: number) => {
    if (disabled) return;
    inputRefs.current[index]?.focus();
  };

  return (
    <View style={styles.container}>
      <View style={styles.boxesRow}>
        {digits.map((digit, index) => {
          const isFocused = focusedIndex === index;
          const isFilled = Boolean(digit);

          return (
            <Pressable
              key={index}
              onPress={() => handleBoxPress(index)}
              style={[
                styles.box,
                isFilled && styles.boxFilled,
                isFocused && styles.boxFocused,
                hasError && styles.boxError,
                disabled && styles.boxDisabled,
              ]}
              accessibilityRole="none"
            >
              <TextInput
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                value={digit}
                onChangeText={(text) => handleChangeText(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(-1)}
                keyboardType="number-pad"
                maxLength={length}
                editable={!disabled}
                selectTextOnFocus
                style={styles.hiddenInput}
                accessibilityLabel={`Verification digit ${index + 1}`}
              />
              <AppText
                variant="h2"
                style={[
                  styles.digitText,
                  hasError && styles.digitTextError,
                  isFocused && styles.digitTextFocused,
                ]}
              >
                {digit}
              </AppText>
              {isFocused && !digit ? <View style={styles.cursor} /> : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.lg,
    alignItems: 'center',
  },
  boxesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 340,
    gap: 8,
  },
  box: {
    flex: 1,
    height: 52,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#302B28',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  boxFilled: {
    borderColor: theme.colors.borderStrong,
    backgroundColor: theme.colors.card,
  },
  boxFocused: {
    borderColor: theme.colors.maroon,
    borderWidth: 1.5,
    backgroundColor: '#FFFDF9',
  },
  boxError: {
    borderColor: theme.colors.error,
    borderWidth: 1.5,
    backgroundColor: theme.colors.errorLight,
  },
  boxDisabled: {
    opacity: 0.5,
    backgroundColor: theme.colors.surface,
  },
  hiddenInput: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0,
    fontSize: 24,
    textAlign: 'center',
  },
  digitText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamilies.sans.bold,
  },
  digitTextFocused: {
    color: theme.colors.maroon,
  },
  digitTextError: {
    color: theme.colors.error,
  },
  cursor: {
    width: 2,
    height: 20,
    backgroundColor: theme.colors.maroon,
    position: 'absolute',
  },
});
