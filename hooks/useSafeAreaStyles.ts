import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

export const useSafeAreaStyles = () => {
  const insets = useSafeAreaInsets();

  return {
    paddingTop: Platform.OS === 'android' ? insets.top : 0,
    paddingBottom: insets.bottom,
    paddingLeft: insets.left,
    paddingRight: insets.right,
  };
};

export const useStatusBarHeight = () => {
  const insets = useSafeAreaInsets();
  return Platform.OS === 'android' ? insets.top : 0;
};

// Safe area container with primary blue background for top area
export const useSafeAreaContainerStyles = () => {
  const insets = useSafeAreaInsets();

  return {
    flex: 1,
    backgroundColor: '#004CFF', // Primary blue background for top safe area
    paddingTop: Platform.OS === 'android' ? insets.top : 0,
  };
};

// Content container styles (white background for main content)
export const useContentContainerStyles = () => {
  return {
    flex: 1,
    backgroundColor: '#F3F4F9', // Default light background for content
  };
};