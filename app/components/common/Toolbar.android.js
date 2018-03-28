'use strict';

import React, { Component } from 'react';
import { ToolbarAndroid, StyleSheet, PropTypes } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../../style/theme';
import ScrollHeader from './ScrollHeader';

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: theme.secondary,
    height: 56,
    elevation: 2,
  },
});

class ToolBar extends Component {
  propTypes: {
    title: PropTypes.string.isRequired,
    leftIcon: PropTypes.string,
    leftIconClick: PropTypes.func,
  };

  render() {
    return (
      <ScrollHeader
        onIconClick={this.props.leftIconClick}
        icon={this.props.leftIcon}
        titleColor={theme.light}
        iconColor={theme.light}
        style={styles.toolbar}
        title={this.props.title}
      />
    );
  }
}

module.exports = ToolBar;
