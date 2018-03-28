import { Dimensions, Platform } from 'react-native';

// https://github.com/ptelad/react-native-iphone-x-helper
export function _isIphoneX() {
  const dimen = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 812 || dimen.width === 812)
  );
}

export const { height, width } = Dimensions.get('window');

// IOS or Anrdoid
export const IOS = Platform.OS === 'ios';

// Ipad
const aspectRatio = height / width;
export const isIpad = aspectRatio <= 1.6;

// Iphone X
export const isIphoneX = _isIphoneX();
