'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, PropTypes } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../../style/theme';
import LinearGradient from '../header/LinearGradient';
import { isIphoneX } from '../../services/device-info';

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: theme.secondary,
    height: isIphoneX ? 70 : 60,
    flexDirection: 'row',
    paddingTop: isIphoneX ? 30 : 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    fontSize: 20,
    paddingLeft: 10,
    paddingRight: 10,
    color: theme.light,
    backgroundColor: 'transparent',
  },
  title: {
    color: theme.light,
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

class EventDetailToolbar extends Component {
  propTypes: {
    title: PropTypes.string.isRequired,
    icon: PropTypes.string,
    iconClick: PropTypes.func,
  };

  render() {
    const touchableProps = {};
    if (this.props.iconClick) {
      touchableProps.onPress = this.props.iconClick;
    }

    return (
      <LinearGradient style={styles.toolbar}>
        <TouchableOpacity {...touchableProps}>
          {this.props.icon ? <Icon style={styles.icon} name={this.props.icon} /> : <View />}
        </TouchableOpacity>
        <Text style={styles.title}>{this.props.title}</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>
    );
  }
}

module.exports = EventDetailToolbar;
