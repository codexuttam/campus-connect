import React from 'react';
import { View, StyleSheet, ColorValue } from 'react-native';
import {
  Home,
  Compass,
  Plus,
  MessageSquare,
  User,
  LucideIcon,
} from 'lucide-react-native';
import { theme } from '../../theme';

export type TabRouteName = 'index' | 'explore' | 'create' | 'chats' | 'profile';

export interface TabBarIconProps {
  name: TabRouteName;
  focused: boolean;
  color?: ColorValue | string;
  size?: number;
}

const routeIconMap: Record<TabRouteName, LucideIcon> = {
  index: Home,
  explore: Compass,
  create: Plus,
  chats: MessageSquare,
  profile: User,
};

export const TabBarIcon: React.FC<TabBarIconProps> = ({
  name,
  focused,
  color,
  size = theme.icons.sizes.tab,
}) => {
  const IconComponent = routeIconMap[name] || Home;
  const resolvedColor = color ?? (focused ? theme.colors.maroon : theme.colors.inactive);

  if (name === 'create') {
    return (
      <View
        style={[
          styles.createPill,
          focused ? styles.createPillFocused : styles.createPillDefault,
        ]}
      >
        <Plus
          size={18}
          color={focused ? '#FBF7EF' : theme.colors.maroon}
          strokeWidth={2.4}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, focused && styles.containerFocused]}>
      <IconComponent
        size={size - 1}
        color={resolvedColor as string}
        strokeWidth={focused ? theme.icons.strokeWidth.bold : theme.icons.strokeWidth.default}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
  },
  containerFocused: {
    backgroundColor: theme.colors.maroonLight,
  },
  createPill: {
    width: 38,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  createPillDefault: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  },
  createPillFocused: {
    backgroundColor: theme.colors.maroon,
    borderColor: theme.colors.maroon,
  },
});
