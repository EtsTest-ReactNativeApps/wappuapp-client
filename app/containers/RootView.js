'use strict';

import React, { Component } from 'react';
import { Platform, StatusBar } from 'react-native';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import createLoggerMiddleware from 'redux-logger';
import loggerConfig from '../utils/loggerConfig';
import * as reducers from '../reducers';
import MainView from './MainView';
import * as CompetitionActions from '../actions/competition';
import { startLocationWatcher, stopLocationWatcher } from '../concepts/location';
import { getUser } from '../concepts/registration';
import { initializeUsersCity, fetchCities } from '../concepts/city';
import { initializeUsersRadio, fetchRadioStations } from '../concepts/radio';
import permissions from '../services/android-permissions';

const IOS = Platform.OS === 'ios';

const middlewares = [thunk];
if (__DEV__) {
  // Disabling logging might help performance as XCode prints the whole objects
  // without respecing the collapsed parameter
  const logger = createLoggerMiddleware(loggerConfig);
  middlewares.push(logger);
  console.disableYellowBox = true;
}

const createStoreWithMiddleware = applyMiddleware.apply(this, middlewares)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

// Fetch actions, check user existance
store.dispatch(CompetitionActions.fetchActionTypes());
store.dispatch(getUser());

// Fetch all cities
store
  .dispatch(fetchCities())
  // And load selected city from local storage
  .then(() => store.dispatch(initializeUsersCity()));

// Load radio settings from local storage
store
  .dispatch(initializeUsersRadio())
  // And fetch radio stations
  .then(() => store.dispatch(fetchRadioStations()));

class RootView extends Component {
  componentDidMount() {
    // Initialize location watcher
    store.dispatch(startLocationWatcher());

    // Statusbar style
    if (IOS) {
      StatusBar.setHidden(false);
      StatusBar.setBarStyle('light-content');
    }
  }

  componentWillUnmount() {
    // Shut down location watcher
    store.dispatch(stopLocationWatcher());
  }

  render() {
    return (
      <Provider store={store}>
        <MainView />
      </Provider>
    );
  }
}

export default RootView;
