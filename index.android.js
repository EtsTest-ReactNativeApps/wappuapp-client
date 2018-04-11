'use strict';
import React from 'react';
import { AppRegistry, UIManager, StyleSheet, Text } from 'react-native';
import RootView from './app/containers/RootView';
UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);
AppRegistry.registerComponent('wappuapp', () => RootView);

// HOTFIX
// Text will be cut on some devices
// https://github.com/facebook/react-native/issues/15114
const styles = StyleSheet.create({
  defaultFontFamily: {
    fontFamily: 'Roboto',
  },
});

const oldRender = Text.prototype.render;
Text.prototype.render = function(...args) {
  const origin = oldRender.call(this, ...args);
  return React.cloneElement(origin, {
    style: [styles.defaultFontFamily, origin.props.style],
  });
};
