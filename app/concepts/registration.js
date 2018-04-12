import { AsyncStorage } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import api from '../services/api';
import namegen from '../services/namegen';
import _ from 'lodash';
import { fromJS } from 'immutable';
import { createSelector } from 'reselect';

import { createRequestActionTypes } from '../actions';
import { NO_SELECTED_CITY_FOUND } from './city';
import { getTeams } from '../reducers/team';

import config from '../config';
const termsAcceptedKey = `${config.APP_STORAGE_KEY}:terms`;
const ACCEPTED_TERMS = 'accepted';
const NOT_ACCEPTED_TERMS = 'not-accepted';

// # Action types
const { CREATE_USER_REQUEST, CREATE_USER_SUCCESS, CREATE_USER_FAILURE } = createRequestActionTypes(
  'CREATE_USER'
);

const { GET_USER_REQUEST, GET_USER_SUCCESS, GET_USER_FAILURE } = createRequestActionTypes(
  'GET_USER'
);

const {
  POST_PROFILE_PICTURE_REQUEST,
  POST_PROFILE_PICTURE_SUCCESS,
  POST_PROFILE_PICTURE_FAILURE,
} = createRequestActionTypes('POST_PROFILE_PICTURE');

export const OPEN_REGISTRATION_VIEW = 'registration/OPEN_REGISTRATION_VIEW';
export const CLOSE_REGISTRATION_VIEW = 'registration/CLOSE_REGISTRATION_VIEW';
export const UPDATE_NAME = 'registration/UPDATE_NAME';
export const RESET = 'registration/RESET';
export const SELECT_TEAM = 'registration/SELECT_TEAM';
export const CLOSE_TEAM_SELECTOR = 'registration/CLOSE_TEAM_SELECTOR';
export const DISMISS_INTRODUCTION = 'registration/DISMISS_INTRODUCTION';
export const CHANGE_TERMS_ACCEPTED = 'registration/CHANGE_TERMS_ACCEPTED';

// # Selectors
export const getUserId = state => state.registration.get('userId');
export const getUserName = state => state.registration.get('name');
export const getUserTeamId = state => state.registration.get('selectedTeam', 0);
export const getUserImage = state => state.registration.get('profilePicture');
export const getUserTeam = createSelector(getUserTeamId, getTeams, (teamId, teams) =>
  teams.find(item => item.get('id') === teamId)
);
export const isUserAcceptedTerms = state => state.registration.get('termsAccepted');

// # Actions
export const openRegistrationView = () => {
  return { type: OPEN_REGISTRATION_VIEW };
};

export const closeRegistrationView = () => {
  return { type: CLOSE_REGISTRATION_VIEW };
};

export const dismissIntroduction = () => {
  return { type: DISMISS_INTRODUCTION };
};

export const putUser = () => {
  return (dispatch, getStore) => {
    dispatch({ type: CREATE_USER_REQUEST });
    const uuid = DeviceInfo.getUniqueID();
    const name = getStore().registration.get('name');
    const team = getStore().registration.get('selectedTeam');
    return api
      .putUser({ uuid, name, team })
      .then(response => {
        dispatch({ type: CREATE_USER_SUCCESS });
        dispatch({ type: CLOSE_REGISTRATION_VIEW });
      })
      .catch(error => dispatch({ type: CREATE_USER_FAILURE, error: error }));
  };
};
export const selectTeam = team => {
  return (dispatch, getStore) => {
    const teams = getStore()
      .team.get('teams')
      .toJS();
    const currentName = getStore().registration.get('name');
    const currentTeam = _.find(teams, ['id', team]);

    dispatch({ type: CLOSE_TEAM_SELECTOR });
    dispatch({ type: SELECT_TEAM, payload: team });
    // Generate new name if not given name
    if (!currentName) {
      dispatch({ type: UPDATE_NAME, payload: namegen.generateName(currentTeam.name) });
    }
  };
};
export const updateName = name => {
  return { type: UPDATE_NAME, payload: name };
};

export const reset = () => {
  return { type: RESET };
};

export const generateName = () => {
  return (dispatch, getStore) => {
    const currentTeamId = getStore().registration.get('selectedTeam');

    if (currentTeamId) {
      const teams = getStore()
        .team.get('teams')
        .toJS();
      const selectedTeam = _.find(teams, ['id', currentTeamId]);
      if (selectedTeam) {
        dispatch({ type: UPDATE_NAME, payload: namegen.generateName(selectedTeam.name) });
      }
    }
  };
};

export const getUser = () => {
  return dispatch => {
    dispatch({ type: GET_USER_REQUEST });
    const uuid = DeviceInfo.getUniqueID();
    return api
      .getUser(uuid)
      .then(user => {
        dispatch({ type: GET_USER_SUCCESS, payload: user });
      })
      .catch(error => {
        dispatch({ type: GET_USER_FAILURE, error: error });
      });
  };
};

export const postProfilePicture = imageData => (dispatch, getState) => {
  if (!imageData) {
    return;
  }

  dispatch({ type: POST_PROFILE_PICTURE_REQUEST });

  const name = getUserName(getState());
  const team = getUserTeamId(getState());
  const uuid = DeviceInfo.getUniqueID();

  return api
    .putUser({ uuid, name, team, imageData })
    .then(response => {
      Promise.resolve(dispatch(getUser())).then(() => {
        dispatch({ type: POST_PROFILE_PICTURE_SUCCESS });
      });
    })
    .catch(error => dispatch({ type: POST_PROFILE_PICTURE_FAILURE, error: error }));
};

export const changeTermsAccepted = accepted => dispatch => {
  // set to state
  dispatch({ type: CHANGE_TERMS_ACCEPTED, payload: accepted });

  // set to local storage
  const acceptedStorageValue = accepted ? ACCEPTED_TERMS : NOT_ACCEPTED_TERMS;
  AsyncStorage.setItem(termsAcceptedKey, acceptedStorageValue);
};

export const initializeTermsAccepted = () => dispatch =>
  AsyncStorage.getItem(termsAcceptedKey)
    .then(accepted => {
      const termsAccepted = accepted === ACCEPTED_TERMS;
      return dispatch(changeTermsAccepted(termsAccepted));
    })
    .catch(error => {
      console.log('error when setting terms accepted');
    });

// # Reducer
const initialState = fromJS({
  isRegistrationViewOpen: false,
  name: '',
  userId: null,
  profilePicture: null,
  selectedTeam: 0,
  isLoading: false,
  isError: false,
  isIntroductionDismissed: false,
  termsAccepted: false,
});

export default function registration(state = initialState, action) {
  switch (action.type) {
    case OPEN_REGISTRATION_VIEW:
      return state.set('isRegistrationViewOpen', true);
    case CLOSE_REGISTRATION_VIEW:
      return state.merge({
        isIntroductionDismissed: false,
        isRegistrationViewOpen: false,
      });
    case DISMISS_INTRODUCTION:
      return state.set('isIntroductionDismissed', true);
    case UPDATE_NAME:
      return state.set('name', action.payload);
    case SELECT_TEAM:
      return state.set('selectedTeam', action.payload);
    case RESET:
      return state.merge({
        name: '',
        selectedTeam: 0,
      });
    case CREATE_USER_REQUEST:
      return state.merge({
        isLoading: true,
        isError: false,
      });
    case GET_USER_REQUEST:
      return state.set('isLoading', true);
    case CREATE_USER_SUCCESS:
      return state.merge({
        isLoading: false,
        isError: false,
      });
    case CREATE_USER_FAILURE:
    case GET_USER_FAILURE:
      return state.merge({
        isLoading: false,
        isError: true,
      });
    case NO_SELECTED_CITY_FOUND:
      return state.merge({
        isRegistrationViewOpen: action.payload,
      });
    case GET_USER_SUCCESS:
      return state.merge({
        userId: action.payload.id,
        name: action.payload.name,
        selectedTeam: action.payload.team,
        profilePicture: action.payload.profilePicture,
        uuid: action.payload.uuid,
        isLoading: false,
      });

    case CHANGE_TERMS_ACCEPTED: {
      return state.set('termsAccepted', action.payload);
    }
    default:
      return state;
  }
}
