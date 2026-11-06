import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const layout = {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  isMediumDevice: width >= 375 && width < 420,
  isLargeDevice: width >= 420,
  tabBarHeight: 62,
  headerHeight: 56,
  maxContentWidth: 640,
} as const;

