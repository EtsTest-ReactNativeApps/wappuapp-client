import theme from '../../style/theme';
import React from 'react';
import { StyleSheet, Text, View, Animated, Platform } from 'react-native';

import Button from './TabButton';
import LinearGradient from '../header/LinearGradient';

const IOS = Platform.OS === 'ios';

const DefaultTabBar = React.createClass({
  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array,
    backgroundColor: React.PropTypes.string,
    activeTextColor: React.PropTypes.string,
    inactiveTextColor: React.PropTypes.string,
    textStyle: Text.propTypes.style,
    tabStyle: View.propTypes.style,
    renderTab: React.PropTypes.func,
    underlineStyle: View.propTypes.style,
  },

  getDefaultProps() {
    return {
      activeTextColor: 'black',
      inactiveTextColor: 'grey',
      backgroundColor: null,
    };
  },

  renderTabOption(name, page) {},

  renderTab(name, page, isTabActive, onPressHandler) {
    const { activeTextColor, inactiveTextColor, textStyle } = this.props;
    const textColor = isTabActive ? activeTextColor : inactiveTextColor;

    return (
      <Button
        style={{ flex: 1 }}
        key={name}
        accessible={true}
        accessibilityLabel={name}
        accessibilityTraits="button"
        onPress={() => onPressHandler(page)}
      >
        <View style={[styles.tab, this.props.tabStyle]}>
          <Text style={[{ color: textColor, fontWeight: 'bold' }, textStyle]}>
            {IOS ? name : (name || '').toUpperCase()}
          </Text>
        </View>
      </Button>
    );
  },

  render() {
    const {
      containerWidth,
      tabs,
      scrollValue,
      style,
      backgroundColor,
      activeTab,
      goToPage,
      underlineStyle,
    } = this.props;

    const numberOfTabs = tabs.length;
    const tabUnderlineStyle = {
      position: 'absolute',
      width: containerWidth / numberOfTabs,
      height: 2,
      backgroundColor: theme.transparent,
      bottom: IOS ? 0 : -1,
    };

    const left = scrollValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, containerWidth / numberOfTabs],
    });

    return (
      <View style={[styles.tabs, { backgroundColor }, style]}>
        {tabs.map((name, page) => {
          const isTabActive = activeTab === page;
          const renderTab = this.props.renderTab || this.renderTab;
          return renderTab(name, page, isTabActive, goToPage);
        })}
        <Animated.View style={[tabUnderlineStyle, { left }, underlineStyle]}>
          <LinearGradient style={{ flex: 1 }} />
        </Animated.View>
      </View>
    );
  },
});

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  tabs: {
    elevation: 0,
    borderBottomWidth: IOS ? 0 : 1,
    borderBottomColor: '#eee',
    height: IOS ? 50 : 56,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

module.exports = DefaultTabBar;
