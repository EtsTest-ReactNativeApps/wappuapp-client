import { Alert } from 'react-native';

export default function errorAlert(onPress, header, message) {
  Alert.alert(header, message, [
    {
      text: 'OK',
      onPress,
    },
  ]);
}
