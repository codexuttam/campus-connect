import React from 'react';
import { View, StyleSheet, ColorValue } from 'react-native';
import {
  Home,
  Compass,
  PlusCircle,
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
  create: PlusCircle,
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

  return (
    <View style={styles.container}>
      <IconComponent
        size={size}
        color={resolvedColor as string}
        strokeWidth={focused ? theme.icons.strokeWidth.bold : theme.icons.strokeWidth.default}
      />
      {focused && name === 'create' ? (
        <View style={styles.createActiveDot} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  createActiveDot: {
    position: 'absolute',
    bottom: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.maroon,
  },
});
