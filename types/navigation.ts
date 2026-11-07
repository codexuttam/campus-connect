export type RootTabParamList = {
  index: undefined;
  explore: undefined;
  create: undefined;
  chats: undefined;
  profile: undefined;
};

export type AppRoutes =
  | '/'
  | '/(tabs)'
  | '/(tabs)/explore'
  | '/(tabs)/create'
  | '/(tabs)/chats'
  | '/(tabs)/profile'
  | '/showcase'
  | '/create-post'
  | '/search'
  | '/notifications'
  | '/post/[id]'
  | '/(auth)/welcome'
  | '/(auth)/login'
  | '/(auth)/register'
  | '/(auth)/onboarding'
  | '/(auth)/verify-email'
  | '/(auth)/college-status'
  | '/(auth)/forgot-password'
  | '/marketplace'
  | '/marketplace/[id]'
  | '/marketplace/create'
  | '/marketplace/saved'
  | '/marketplace/my-listings'
  | '/marketplace/edit/[id]';
