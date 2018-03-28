'use strict';

import React, { Component } from 'react';
import { StyleSheet, Platform, Dimensions } from 'react-native';
import theme from '../../style/theme';
import Chart from './Chart';

import LinearGradient from '../header/LinearGradient';

const { height } = Dimensions.get('window');
const IOS = Platform.OS === 'ios';

class MoodChart extends Component {
  render() {
    const { cityData, ownData, teamData, limitLineData } = this.props;

    return (
      <LinearGradient
        style={styles.container}
        colors={[theme.secondary, theme.secondaryLight, theme.secondaryTint]}
        start={{ x: 0.45, y: 0.5 }}
        end={{ x: 0.55, y: 1 }}
        locations={[0, 0.3, 0.8]}
      >
        <Chart
          limitLineData={limitLineData}
          cityData={cityData}
          ownData={ownData}
          teamData={teamData}
          height={height / (IOS ? 2.5 : 2.75) - 50}
        />
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: height / (IOS ? 2.5 : 2.75) + 50,
    paddingTop: 60,
    top: -50,
    paddingBottom: 50,
  },
});

export default MoodChart;
