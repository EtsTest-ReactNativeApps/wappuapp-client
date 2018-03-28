import React, { Component } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import { toArray } from 'lodash';
import { connect } from 'react-redux';

import { getFeedSortType, setFeedSortType } from '../../concepts/sortType';

import theme from '../../style/theme';
import SortTypes from '../../constants/SortTypes';
import { IOS } from '../../services/device-info';

const sortTypeTitles = IOS
  ? {
      [SortTypes.SORT_NEW]: 'Fresh',
      [SortTypes.SORT_HOT]: 'Trending',
    }
  : {
      [SortTypes.SORT_NEW]: 'NEW',
      [SortTypes.SORT_HOT]: 'HOT',
    };

class SortSelector extends Component {
  constructor(props) {
    super(props);

    this.state = { indicatorAnimation: new Animated.Value(0) };
  }

  componentWillReceiveProps({ selectedSortType }) {
    if (selectedSortType !== this.props.selectedSortType) {
      const sortTypeOptions = toArray(SortTypes);
      const selectedSortTypeIndex = sortTypeOptions.indexOf(selectedSortType);
      this.animateIndicator(selectedSortTypeIndex);
    }
  }

  // 'toValue' can be 0 | 1
  animateIndicator(toValue) {
    const { indicatorAnimation } = this.state;

    Animated.timing(indicatorAnimation, {
      toValue,
      duration: 512,
      easing: Easing.elastic(1),
    }).start();
  }

  render() {
    const { selectedSortType } = this.props;
    const { indicatorAnimation, indicatorAnimationPartTwo } = this.state;

    const sortTypeOptions = toArray(SortTypes);
    const selectedSortTypeIndex = sortTypeOptions.indexOf(selectedSortType);
    const nextSortTypeItem =
      selectedSortTypeIndex >= sortTypeOptions.length - 1
        ? sortTypeOptions[0]
        : sortTypeOptions[selectedSortTypeIndex + 1];

    const animatedIndicatorStyles = {
      top: indicatorAnimation.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, 8] }),
      height: indicatorAnimation.interpolate({ inputRange: [0, 0.5, 1], outputRange: [6, 14, 6] }),
    };

    const onSortSelectorPress = () => this.props.setFeedSortType(nextSortTypeItem);

    return (
      <TouchableHighlight underlayColor="transparent" onPress={onSortSelectorPress}>
        <View style={styles.sortSelector}>
          <TouchableOpacity onPress={onSortSelectorPress} activeOpacity={IOS ? 0.7 : 1}>
            <Text style={styles.filterText}>{sortTypeTitles[selectedSortType]}</Text>
          </TouchableOpacity>
          <View style={styles.indicators}>
            {sortTypeOptions.map((type, index) => <View key={type} style={styles.indicator} />)}

            <Animated.View
              style={[styles.indicator, styles.activeIndicator, animatedIndicatorStyles]}
            />
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

var styles = StyleSheet.create({
  sortSelector: {
    top: 1,
    paddingTop: 15,
    paddingBottom: 8,
    paddingRight: 25,
    paddingLeft: IOS ? 15 : 5,
  },
  filterText: {
    color: theme.white,
    fontSize: 14,
    fontWeight: IOS ? 'normal' : 'bold',
    minWidth: IOS ? null : 30,
    textAlign: 'right',
    top: IOS ? -2 : -4,
  },
  indicators: {
    position: 'absolute',
    right: 10,
    top: IOS ? 13 : 12,
    width: 8,
    alignItems: 'flex-start',
    height: 20,
    backgroundColor: 'transparent',
  },
  indicator: {
    marginTop: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.4,
    backgroundColor: theme.white,
  },
  activeIndicator: {
    opacity: 1,
    backgroundColor: theme.accentLight,
    position: 'absolute',
    zIndex: 1,
  },
});

const mapDispatchToProps = { setFeedSortType };

const select = state => {
  return {
    selectedSortType: getFeedSortType(state),
  };
};

export default connect(select, mapDispatchToProps)(SortSelector);
