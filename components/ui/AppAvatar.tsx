import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  ViewStyle,
  StyleProp,
  ImageSourcePropType,
} from 'react-native';
import { theme } from '../../theme';
import { AppText } from './AppText';
import { AvatarSize } from '../../types/theme';

export interface AppAvatarProps {
  source?: ImageSourcePropType | { uri: string };
  name?: string;
  size?: AvatarSize;
  bordered?: boolean;
  borderColor?: string;
  style?: StyleProp<ViewStyle>;
}

export const AppAvatar: React.FC<AppAvatarProps> = ({
  source,
  name,
  size = 'md',
  bordered = true,
  borderColor,
  style,
}) => {
  const sizeConfig = avatarSizes[size];

  const getInitials = (text?: string): string => {
    if (!text) return 'CC';
    const parts = text.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const resolvedBorderColor = borderColor || theme.colors.border;

  return (
    <View
      style={[
        styles.container,
        {
          width: sizeConfig.dimension,
          height: sizeConfig.dimension,
          borderRadius: sizeConfig.dimension / 2,
          borderWidth: bordered ? 1.5 : 0,
          borderColor: resolvedBorderColor,
          backgroundColor: theme.colors.surface,
        },
        style,
      ]}
    >
      {source ? (
        <Image
          source={source}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: sizeConfig.dimension / 2,
          }}
          resizeMode="cover"
        />
      ) : (
        <AppText
          variant={sizeConfig.textVariant}
          color="maroon"
          style={styles.initials}
        >
          {getInitials(name)}
        </AppText>
      )}
    </View>
  );
};

const avatarSizes: Record<
  AvatarSize,
  { dimension: number; textVariant: 'caption' | 'captionMedium' | 'bodySmallMedium' | 'h3' | 'h2' }
> = {
  xs: { dimension: 26, textVariant: 'caption' },
  sm: { dimension: 34, textVariant: 'captionMedium' },
  md: { dimension: 42, textVariant: 'bodySmallMedium' },
  lg: { dimension: 52, textVariant: 'h3' },
  xl: { dimension: 68, textVariant: 'h2' },
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  initials: {
    fontFamily: theme.fontFamilies.sans.bold,
  },
});
