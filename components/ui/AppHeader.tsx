import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { theme } from '../../theme';
import { AppText } from './AppText';
import { IconButton } from './IconButton';

export interface AppHeaderProps {
  title: string;
  subtitle?: string;
  serifTitle?: boolean;
  onBack?: () => void;
  showBack?: boolean;
  rightAction?: React.ReactNode;
  borderBottom?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  serifTitle = false,
  onBack,
  showBack = false,
  rightAction,
  borderBottom = true,
  style,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, 12),
          borderBottomWidth: borderBottom ? 1 : 0,
        },
        style,
      ]}
    >
      <View style={styles.content}>
        <View style={styles.left}>
          {showBack && onBack ? (
            <IconButton
              icon={
                <ChevronLeft
                  size={theme.icons.sizes.header}
                  color={theme.colors.textPrimary}
                  strokeWidth={theme.icons.strokeWidth.default}
                />
              }
              variant="ghost"
              size="sm"
              onPress={onBack}
              accessibilityLabel="Go back"
            />
          ) : null}
        </View>

        <View style={styles.center}>
          <AppText
            variant={serifTitle ? 'editorial' : 'h3'}
            serif={serifTitle}
            color="primary"
            align="center"
            numberOfLines={1}
          >
            {title}
          </AppText>
          {subtitle ? (
            <AppText
              variant="caption"
              color="secondary"
              align="center"
              numberOfLines={1}
              style={styles.subtitle}
            >
              {subtitle}
            </AppText>
          ) : null}
        </View>

        <View style={styles.right}>
          {rightAction || null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    borderBottomColor: theme.colors.border,
  },
  content: {
    height: theme.spacing.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.screenPadding,
  },
  left: {
    width: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xs,
  },
  right: {
    minWidth: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  subtitle: {
    marginTop: 2,
  },
});
