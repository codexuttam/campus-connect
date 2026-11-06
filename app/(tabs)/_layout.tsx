import React from 'react';
import { Tabs, Redirect } from 'expo-router';
import { Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabBarIcon, TabRouteName } from '../../components/navigation/TabBarIcon';
import { theme } from '../../theme';
import { useAuth } from '../../hooks/useAuth';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { status, isInitialized } = useAuth();

  // Guard protected tabs routes against unauthenticated or incomplete states
  if (isInitialized && status !== 'fully_onboarded') {
    if (status === 'unauthenticated') {
      return <Redirect href="/(auth)/welcome" />;
    }
    if (status === 'registration_incomplete') {
      return <Redirect href="/(auth)/onboarding" />;
    }
    if (status === 'email_verification_pending') {
      return <Redirect href="/(auth)/verify-email" />;
    }
    if (status === 'college_verification_pending') {
      return <Redirect href="/(auth)/college-status" />;
    }
  }

  // Ensure adequate height considering safe area insets
  const tabHeight = 56 + Math.max(insets.bottom, 12);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.maroon,
        tabBarInactiveTintColor: theme.colors.inactive,
        tabBarStyle: [
          styles.tabBar,
          {
            height: tabHeight,
            paddingBottom: Math.max(insets.bottom, 8),
            paddingTop: 8,
          },
        ],
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="index" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="explore" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarLabel: 'Create',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="create" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Chats',
          tabBarLabel: 'Chats',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="chats" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="profile" focused={focused} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.card,
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    elevation: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#302B28',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
      default: {},
    }),
  },
  tabLabel: {
    fontFamily: theme.fontFamilies.sans.medium,
    fontSize: 11,
    marginTop: -2,
  },
});
