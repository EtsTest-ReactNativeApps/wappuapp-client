'use strict';
import Immutable from 'immutable';

import {
  FEED_SET,
  FEED_APPEND,
  FEED_LIST_LOADING,
  FEED_LIST_LOADED,
  FEED_LIST_FAILED,
  FEED_LIST_REFRESHING,
  FEED_LIST_REFRESHED,
  FEED_ITEM_DELETE
} from '../actions/feed';
import LoadingStates from '../constants/LoadingStates';

const initialState = Immutable.fromJS({
  list: [],
  listState: LoadingStates.NONE,
  isRefreshing: false,
});

export default function feed(state = initialState, action) {
  switch (action.type) {
    case FEED_SET:
      return state.set('list', Immutable.fromJS(action.feed));
    case FEED_APPEND:
      return (action.feed && action.feed.length) ?
        state.set('list', state.get('list').concat(action.feed)) :
        state;
    case FEED_LIST_LOADING:
      return state.set('listState', LoadingStates.LOADING);
    case FEED_LIST_LOADED:
      return state.set('listState', LoadingStates.READY);
    case FEED_LIST_FAILED:
      return state.set('listState', LoadingStates.FAILED);
    case FEED_LIST_REFRESHING:
      return state.set('isRefreshing', true);
    case FEED_LIST_REFRESHED:
      return state.set('isRefreshing', false);
    case FEED_ITEM_DELETE:
      const originalList = state.get('list');
      const itemIndex = originalList.findIndex((item) => item.get('id') === action.item.id);

      if (itemIndex < 0) {
        console.log('Tried to delete item, but it was not found from state:', itemIndex);
        return state;
      } else {
        return state.set('list', originalList.delete(itemIndex));
      }

    default:
      return state;
  }
}
