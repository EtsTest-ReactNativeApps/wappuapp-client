'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Platform } from 'react-native';

import theme from '../style/theme';
import analytics from '../services/analytics';

import TabBarItem from '../components/tabs/Tabs';
import CalendarView from '../components/calendar/TimelineList';
import MapView from '../components/map/EventMap';

const ScrollTabs = require('react-native-scrollable-tab-view');

const IOS = Platform.OS === 'ios';
const VIEW_NAME = 'EventsView';

class EventsView extends Component {
  componentDidMount() {
    analytics.viewOpened(VIEW_NAME);
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollTabs
          initialPage={0}
          tabBarActiveTextColor={theme.secondary}
          tabBarUnderlineColor={theme.secondary}
          tabBarBackgroundColor={theme.white}
          tabBarInactiveTextColor={theme.inactive}
          locked={IOS}
          prerenderingSiblingsNumber={0}
          renderTabBar={() => <TabBarItem />}
        >
          <CalendarView
            tabLabel="Calendar"
            navigator={this.props.navigator}
            barColor={theme.accent}
            ref="calendar"
          />
          <MapView
            tabLabel="Map"
            navigator={this.props.navigator}
            barColor={theme.positive}
            ref="map"
          />
        </ScrollTabs>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});

export default EventsView;
