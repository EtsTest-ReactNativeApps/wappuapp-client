'use strict';

import React, { Component } from 'react';
import { View, Navigator, StyleSheet } from 'react-native';
import { get } from 'lodash';
import { connect } from 'react-redux';

import sceneConfig from '../utils/sceneConfig';
import NavRouteMapper from '../components/common/navbarRouteMapper';
import errorAlert from '../utils/error-alert';
import { resetError } from '../actions/errors';

import { getCityPanelShowState } from '../concepts/city';
import { openRegistrationView } from '../concepts/registration';
import IOSTabNavigation from './Navigation';
import RegistrationView from '../components/registration/RegistrationView';
import CheckInActionView from '../components/actions/CheckInActionView';
import TextActionView from '../components/actions/TextActionView';
import CitySelector from '../components/header/CitySelector';
import { isIphoneX } from '../services/device-info';

const theme = require('../style/theme');

class MainView extends Component {
  renderScene(route, navigator) {
    if (route.component) {
      const RouteComponent = route.component;
      return <RouteComponent navigator={navigator} route={route} {...this.props} />;
    }
  }

  render() {
    const { showCitySelection, errors, dispatch } = this.props;
    const immutableError = errors.get('error');
    if (immutableError) {
      const error = immutableError.toJS();
      errorAlert(resetError, get(error, 'header'), get(error, 'message'));
    }

    return (
      <View style={{ flex: 1 }}>
        <Navigator
          style={styles.navigator}
          navigationBar={
            <Navigator.NavigationBar
              style={styles.navbar}
              routeMapper={NavRouteMapper(this.props)}
            />
          }
          initialRoute={{
            component: IOSTabNavigation,
            name: 'Whappu',
          }}
          renderScene={this.renderScene}
          configureScene={() => sceneConfig}
        />
        {showCitySelection && <CitySelector />}
        <RegistrationView />
        <CheckInActionView />
        <TextActionView />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  navigator: {
    paddingTop: isIphoneX ? 57 : 42,
    paddingBottom: 0,
  },
  navbar: {
    backgroundColor: theme.dark,
    height: 62,
    top: isIphoneX ? 15 : 0,
    paddingBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const select = state => {
  return {
    showCitySelection: getCityPanelShowState(state),
    errors: state.errors,
    currentTab: state.navigation.get('currentTab'),
  };
};

const mapDispatchToProps = {
  openRegistrationView,
  resetError,
};

export default connect(select, mapDispatchToProps)(MainView);
