export type RootTabParamList = {
  index: undefined;
  explore: undefined;
  create: undefined;
  chats: undefined;
  profile: undefined;
};

export type AppRoutes =
  | '/(tabs)'
  | '/(tabs)/explore'
  | '/(tabs)/create'
  | '/(tabs)/chats'
  | '/(tabs)/profile'
  | '/showcase'
  | '/(auth)/login';

