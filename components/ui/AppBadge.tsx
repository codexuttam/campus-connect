import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { theme } from '../../theme';
import { AppText } from './AppText';
import { BadgeVariant, BadgeSize } from '../../types/theme';

export interface AppBadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  dot?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const AppBadge: React.FC<AppBadgeProps> = ({
  label,
  variant = 'maroon',
  size = 'md',
  icon,
  dot = false,
  style,
}) => {
  const variantConfig = getVariantConfig(variant);
  const sizeConfig = sizeConfigs[size];

  return (
    <View
      style={[
        styles.container,
        variantConfig.container,
        sizeConfig.container,
        style,
      ]}
    >
      {dot ? (
        <View
          style={[
            styles.dot,
            { backgroundColor: variantConfig.textColor },
          ]}
        />
      ) : icon ? (
        <View style={styles.icon}>{icon}</View>
      ) : null}

      <AppText
        variant="badge"
        style={[
          styles.text,
          { color: variantConfig.textColor, fontSize: sizeConfig.fontSize },
        ]}
      >
        {label}
      </AppText>
    </View>
  );
};

const getVariantConfig = (variant: BadgeVariant) => {
  switch (variant) {
    case 'olive':
      return {
        container: {
          backgroundColor: theme.colors.oliveLight,
          borderColor: theme.colors.olive,
          borderWidth: 1,
        },
        textColor: theme.colors.oliveDark,
      };
    case 'neutral':
      return {
        container: {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderWidth: 1,
        },
        textColor: theme.colors.textSecondary,
      };
    case 'outline':
      return {
        container: {
          backgroundColor: 'transparent',
          borderColor: theme.colors.borderStrong,
          borderWidth: 1,
        },
        textColor: theme.colors.textPrimary,
      };
    case 'maroon':
    default:
      return {
        container: {
          backgroundColor: theme.colors.maroonLight,
          borderColor: theme.colors.maroon,
          borderWidth: 1,
        },
        textColor: theme.colors.maroon,
      };
  }
};

const sizeConfigs = {
  sm: {
    container: {
      paddingVertical: 3,
      paddingHorizontal: 8,
      borderRadius: theme.radius.full,
    },
    fontSize: theme.fontSizes.tiny,
  },
  md: {
    container: {
      paddingVertical: 5,
      paddingHorizontal: 11,
      borderRadius: theme.radius.full,
    },
    fontSize: theme.fontSizes.caption,
  },
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: theme.spacing.xs + 2,
  },
  icon: {
    marginRight: theme.spacing.xs,
  },
  text: {
    fontFamily: theme.fontFamilies.sans.semiBold,
    letterSpacing: theme.letterSpacing.wide,
  },
});
