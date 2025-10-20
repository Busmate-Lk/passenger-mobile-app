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