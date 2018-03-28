/*
* Typography for Whappu
*/
import { Platform } from 'react-native';
import theme from './theme';

const IOS = Platform.OS === 'ios';

const h1 = {
  backgroundColor: 'transparent',
  fontSize: 18,
  lineHeight: 25,
  fontWeight: 'bold',
  marginBottom: 5,
  color: theme.secondary,
};

const h2 = {
  fontSize: 14,
  lineHeight: 20,
  marginBottom: 25,
  fontWeight: 'normal',
  color: theme.dark,
};

const paragraph = {
  color: theme.dark,
  fontSize: 14,
  lineHeight: 20,
};

const extendStyle = style => extension => Object.assign({}, style, extension);

module.exports = {
  h1: extendStyle(h1),
  h2: extendStyle(h2),
  paragraph: extendStyle(paragraph),
};
