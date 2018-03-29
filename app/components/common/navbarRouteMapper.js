/*eslint-disable react/display-name*/
/*react-eslint misfires for jsx-returning functions*/

/**
 * Navigation Bar for IOS
 * Used with Navigator
 * https://github.com/facebook/react-native/blob/master/Examples/UIExplorer/Navigator/NavigationBarSample.js
 */

'use strict';

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActionSheetIOS,
  Platform,
  Image,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';

import theme from '../../style/theme';
import CityToggle from '../header/CityToggle';
import SortSelector from '../header/SortSelector';
import LinearGradient from '../header/LinearGradient';
import MoodInfo from '../mood/MoodInfo';
import Icon from 'react-native-vector-icons/Ionicons';
import Tabs from '../../constants/Tabs';
import { width, isIphoneX } from '../../services/device-info';

let showShareActionSheet = function(url) {
  if (Platform.OS === 'ios') {
    ActionSheetIOS.showShareActionSheetWithOptions(
      {
        url: url,
      },
      error => {
        /* */
      },
      (success, method) => {
        /* */
      }
    );
  }
};

let NavigationBarRouteMapper = props => ({
  LeftButton: function(route, navigator, index, navState) {
    if (index > 0) {
      return (
        <TouchableHighlight
          underlayColor={'transparent'}
          onPress={() => {
            navigator.pop();
          }}
        >
          <Icon name="ios-arrow-back" style={styles.navBarIcon} />
        </TouchableHighlight>
      );
    }

    return <CityToggle />;
  },

  RightButton: function(route, navigator, index, navState) {
    if (props.currentTab === Tabs.FEED && index === 0) {
      return <SortSelector />;
    }

    if (props.currentTab === Tabs.SETTINGS && index === 0) {
      return (
        <TouchableOpacity onPress={() => props.openRegistrationView()}>
          <Icon name="md-create" style={[styles.navBarIcon, { paddingRight: 12, paddingTop: 8 }]} />
        </TouchableOpacity>
      );
    }

    if (props.currentTab === Tabs.MOOD && !route.hideNavButton) {
      return (
        <TouchableOpacity
          onPress={() => {
            navigator.push({
              component: MoodInfo,
              name: 'Whappu Vibe',
              showName: true,
              hideNavButton: true,
            });
          }}
        >
          <Icon
            name="md-information-circle"
            style={[styles.navBarIcon, { paddingRight: 12, paddingTop: 8 }]}
          />
        </TouchableOpacity>
      );
    }

    if (route.actions) {
      return (
        <TouchableHighlight
          onPress={() => {
            showShareActionSheet(route.post.link);
          }}
        >
          <Icon name="ios-upload-outline" style={styles.navBarIcon} />
        </TouchableHighlight>
      );
    }
    return null;
  },

  Title: function(route, navigator, index, navState) {
    let content = (
      <Image
        resizeMode={'contain'}
        source={require('../../../assets/whappu-logo-2017.png')}
        style={styles.navBarLogo}
      />
    );

    if (route.showName) {
      content = <Text style={styles.navBarTitle}>{route.name}</Text>;
    }

    const singleColorHeader =
      route.singleColorHeader ||
      (props.currentTab === Tabs.MOOD && index === 0) ||
      (props.currentTab === Tabs.SETTINGS && index === 0);

    return (
      <View style={styles.navBarLogoWrap}>
        <LinearGradient
          singleColor={singleColorHeader}
          style={{
            position: 'absolute',
            left: -width / 2,
            right: -width / 2,
            top: isIphoneX ? -40 : -20,
            bottom: 0,
          }}
        />

        {content}
      </View>
    );
  },
});

var styles = StyleSheet.create({
  navBarLogoWrap: {
    flex: 1,
    alignItems: 'center',
  },
  navBarButton: {
    color: theme.white,
    padding: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  navBarIcon: {
    color: theme.white,
    padding: 6,
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 24,
    textAlign: 'center',
  },
  navBarLogo: {
    top: 3,
    width: 60,
    height: 35,
    tintColor: theme.accentLight,
  },
  navBarTitle: {
    padding: 10,
    fontSize: 16,
    color: theme.white,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default NavigationBarRouteMapper;
