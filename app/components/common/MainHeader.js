'use strict';

import React, { PropTypes } from 'react';
import { StyleSheet, View, Image } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../../style/theme';
import Tabs from '../../constants/Tabs';
import SortTypes from '../../constants/SortTypes';
import MoodInfo from '../mood/MoodInfo';
import ScrollHeader from '../common/ScrollHeader';
import PlatformTouchable from '../common/PlatformTouchable';
import SortSelector from '../header/SortSelector';

const cityIcons = {
  helsinki: require('../../../assets/cities/icon-ota-amfi-accent.png'),
  tampere: require('../../../assets/cities/icon-tampere-accent-sm.png'),
};

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: theme.primary,
    elevation: 2,
    height: 56,
  },
  iconWrap: {
    borderRadius: 28,
    width: 56,
    height: 56,
    marginRight: 0,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  iconImage: {
    width: 36,
    height: 36,
  },
  rightContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 56,
  },
});

const getElevation = tab => {
  switch (tab) {
    case Tabs.FEED:
    case Tabs.MOOD:
    case Tabs.CALENDAR:
    case Tabs.SETTINGS: {
      return 0;
    }
    default: {
      return 2;
    }
  }
};

var EventDetailToolbar = React.createClass({
  propTypes: {
    title: PropTypes.string,
    navigator: PropTypes.object.isRequired,
  },

  getCityIcon(cityName) {
    return (cityName || '').toLowerCase() === 'tampere' ? cityIcons.tampere : cityIcons.helsinki;
  },

  renderCityToggle() {
    const { currentCityName, toggleCityPanel } = this.props;
    return (
      <View style={styles.iconWrap}>
        <PlatformTouchable
          delayPressIn={0}
          onPress={() => toggleCityPanel()}
          background={PlatformTouchable.SelectableBackgroundBorderless()}
        >
          <View style={styles.icon}>
            <Image source={this.getCityIcon(currentCityName)} style={styles.iconImage} />
          </View>
        </PlatformTouchable>
      </View>
    );
  },

  getHeaderProps() {
    const {
      selectedSortType,
      setFeedSortType,
      currentCityName,
      toggleCityPanel,
      currentTab,
      navigator,
      openRegistrationView,
    } = this.props;

    let headerProps;
    switch (currentTab) {
      case Tabs.FEED: {
        headerProps = {
          renderRightContent: () => (
            <View style={styles.rightContent}>
              {this.renderCityToggle()}
              <SortSelector />
            </View>
          ),
        };
        break;
      }
      case Tabs.MOOD: {
        headerProps = {
          renderRightContent: () => (
            <View style={styles.rightContent}>{this.renderCityToggle()}</View>
          ),
          rightIcon: 'info-outline',
          onRightIconClick: () => navigator.push({ component: MoodInfo }),
          singleColor: true,
        };
        break;
      }
      case Tabs.CALENDAR:
      case Tabs.ACTION: {
        headerProps = {
          renderRightContent: () => (
            <View style={styles.rightContent}>{this.renderCityToggle()}</View>
          ),
        };
        break;
      }

      case Tabs.SETTINGS: {
        headerProps = {
          rightIcon: 'create',
          onRightIconClick: () => openRegistrationView(),
          singleColor: true,
        };
        break;
      }

      default: {
        headerProps = {};
      }
    }

    return headerProps;
  },

  render() {
    const { backgroundColor, titleColor, currentTab } = this.props;
    const toolbarStyles = [styles.toolbar];
    const elevation = getElevation(currentTab);

    if (backgroundColor) {
      toolbarStyles.push({ backgroundColor, elevation });
    }
    const headerProps = this.getHeaderProps();

    return (
      <ScrollHeader
        logo={require('../../../assets/header/4.png')}
        {...headerProps}
        elevation={elevation}
      />
    );
  },
});

export default EventDetailToolbar;
