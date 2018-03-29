import { Platform } from 'react-native';
import { fromJS } from 'immutable';
import { get } from 'lodash';

import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import permissions from '../services/android-permissions';

const IOS = Platform.OS === 'ios';
let watchID;

//
// Constants
//
const locationOpts = {
  enableHighAccuracy: false,
  timeout: 20000, // 20 secs
  maximumAge: 1000 * 60 * 1, // 1 min
};

//
// Selectors
//
export const getLocation = state => state.location.get('currentLocation');

//
// Action types
//
export const UPDATE_LOCATION = 'UPDATE_LOCATION';

//
// Action creators
//
export const updateLocation = location => {
  return { type: UPDATE_LOCATION, payload: location };
};

const coordinatesFromResponse = position => ({
  latitude: get(position, 'coords.latitude'),
  longitude: get(position, 'coords.longitude'),
});

const getCurrentPosition = () => dispatch => {
  var locationUpdatePromise = new Promise(function(resolve, reject) {
    navigator.geolocation.getCurrentPosition(
      position =>
        console.log('location updated', position) ||
        resolve(dispatch(updateLocation(coordinatesFromResponse(position)))),
      error => resolve(error.message),
      locationOpts
    );
  });

  return locationUpdatePromise;
};

export const fetchUserLocation = () => dispatch => {
  if (IOS) {
    return dispatch(getLocationFromDevice());
  } else {
    // Check that this works on Android
    return new Promise(function(resolve, reject) {
      permissions.requestLocationPermission(
        () => resolve(dispatch(getLocationFromDevice())),
        () => resolve()
      );
    });
  }
};

export const getLocationFromDevice = () => dispatch => {
  if (IOS) {
    return dispatch(getCurrentPosition());
  }

  return RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
    interval: 10000,
    fastInterval: 5000,
  })
    .then(data => {
      // The user has accepted to enable the location services
      // data can be :
      //  - "already-enabled" if the location services has been already enabled
      //  - "enabled" if user has clicked on OK button in the popup
      return dispatch(getCurrentPosition());
    })
    .catch(err => {
      console.log('Location off:', err);
      // The user has not accepted to enable the location services or something went wrong during the process
      // "err" : { "code" : "ERR00|ERR01|ERR02", "message" : "message"}
      // codes :
      //  - ERR00 : The user has clicked on Cancel button in the popup
      //  - ERR01 : If the Settings change are unavailable
      //  - ERR02 : If the popup has failed to open
      return dispatch(Promise.resolve());
    });
};

// # Location Watcher
export const initLocationWatcher = () => dispatch => {
  navigator.geolocation.getCurrentPosition(
    position => dispatch(updateLocation(coordinatesFromResponse(position))),
    error => console.log(error.message),
    locationOpts
  );

  watchID = navigator.geolocation.watchPosition(
    position => dispatch(updateLocation(coordinatesFromResponse(position))),
    error => console.log(error.message),
    locationOpts
  );
};

export const stopLocationWatcher = () => dispatch => {
  if (watchID) {
    navigator.geolocation.clearWatch(watchID);
  }
};

export const startLocationWatcher = () => dispatch => {
  if (IOS) {
    dispatch(initLocationWatcher());
  } else {
    // This does not work
    permissions.requestLocationPermission(() => dispatch(initLocationWatcher()));
  }
};

//
// Reducer
//
const initialState = fromJS({ currentLocation: null });

export default function location(state = initialState, action) {
  switch (action.type) {
    case UPDATE_LOCATION:
      return state.set('currentLocation', action.payload);
    default:
      return state;
  }
}
