import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';

import PlatformTouchable from '../common/PlatformTouchable';

const RadioButton = ({ onPress, icon, buttonStyle, buttonTextStyle }) => (
  <View style={buttonStyle}>
    <PlatformTouchable
      onPress={onPress}
      background={PlatformTouchable.SelectableBackgroundBorderless()}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={buttonTextStyle}>{icon}</Text>
      </View>
    </PlatformTouchable>
  </View>
);

export default RadioButton;
