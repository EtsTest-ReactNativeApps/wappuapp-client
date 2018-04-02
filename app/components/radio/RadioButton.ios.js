import React from 'react';
import { Text, TouchableHighlight } from 'react-native';
import theme from '../../style/theme';

const RadioButton = ({ onPress, icon, buttonStyle, buttonTextStyle }) => (
  <TouchableHighlight underlayColor={theme.stable} onPress={this.onPress} style={buttonStyle}>
    <Text style={buttonTextStyle}>{icon}</Text>
  </TouchableHighlight>
);

export default RadioButton;
