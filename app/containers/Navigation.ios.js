import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';
import ScrollableTabs from 'react-native-scrollable-tab-view';

import CalendarView from './CalendarView';
import MoodView from './MoodView';
import CompetitionView from './CompetitionNavigator';
import FeedView from './FeedView';
import SettingsView from './ProfileView';
import Tabs from '../constants/Tabs';
import { changeTab } from '../actions/navigation';
import LightBox from '../components/lightbox/Lightbox';

import MDIcon from 'react-native-vector-icons/MaterialIcons';
import IconTabBar from '../components/common/MdIconTabBar';

const theme = require('../style/theme');

const initialTabIndex = 0;
const initialTab = Tabs.FEED;

// # Tab navigation
class Navigation extends Component {
  componentDidMount() {
    this.props.changeTab(initialTab);
  }

  @autobind
  onChangeTab({ ref }) {
    this.props.changeTab(ref.props.id);
  }

  render() {
    const { navigator, currentTab } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <ScrollableTabs
          onChangeTab={this.onChangeTab}
          initialPage={initialTabIndex}
          tabBarPosition={'bottom'}
          tabBarBackgroundColor={theme.white}
          tabBarActiveTextColor={theme.secondary}
          tabBarInactiveTextColor={theme.inactive}
          locked={true}
          scrollWithoutAnimation={true}
          prerenderingSiblingsNumber={0}
          renderTabBar={() => <IconTabBar />}
        >
          <FeedView
            navigator={navigator}
            id={Tabs.FEED}
            tabLabel={{ title: 'Buzz', icon: 'whatshot' }}
          />
          <CalendarView
            id={Tabs.CALENDAR}
            navigator={navigator}
            tabLabel={{ title: 'Events', icon: 'event' }}
          />
          <MoodView
            navigator={navigator}
            id={Tabs.MOOD}
            tabLabel={{ title: 'Vibes', icon: 'trending-up' }}
          />
          <SettingsView
            navigator={navigator}
            id={Tabs.SETTINGS}
            tabLabel={{ title: 'Profile', icon: 'account-circle' }}
          />
        </ScrollableTabs>
        <LightBox navigator={navigator} />
      </View>
    );
  }
}

const mapDispatchToProps = { changeTab };

const select = state => {
  return {
    currentTab: state.navigation.get('currentTab'),
  };
};

export default connect(select, mapDispatchToProps)(Navigation);
