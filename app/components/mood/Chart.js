import React, { Component } from 'react';
import moment from 'moment';
import {
  View,
  Text,
  Dimensions,
  StyleSheet
} from 'react-native';

import theme from '../../style/theme';
import {
  VictoryChart,
  VictoryGroup,
  VictoryAxis,
  VictoryLine,
  VictoryBar,
  VictoryArea
} from 'victory-native';
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

class Chart extends Component {

  render() {

    let { data, limitLineData, height, lineColor, front } = this.props;
    data = data ? data.toJS() : null;
    limitLineData = limitLineData ? limitLineData.toJS() : null;

    const opacity = front ? 0.1 : 1;
    const color = lineColor || theme.white;
    const xAxisLabels = limitLineData.map(datum => datum.date);

    return (
    <View style={styles.container}>

      <VictoryChart
        padding={0}
        height={height}
        domainPadding={0}
        domain={{y: [0, 100]}}
      >

        <VictoryLine
          x="date"
          labels={['Thermal Whappu']}
          height={height}
          data={limitLineData}
          y={(datum) => datum.value}
          padding={0}
          style={{
            data: {
              stroke: theme.primary,
              strokeWidth: 2,
              strokeDasharray: '5, 5',
            },
            labels: { fontSize: 12 }
          }}
        />


        {data &&
        <VictoryLine
          data={data}
          height={height}
          x="date"
          y={(datum) => datum.avg}
          interpolation="natural"
          padding={0}
          style={{
            data: {
              // opacity,
              // fill: color,
              stroke: color,
              strokeWidth: 3
            },
            labels: { fontSize: 12 }
          }}
        />
        }

        <VictoryAxis
          orientation="left"
          offsetX={width}
          style={{
            axis: { strokeWidth: 0 },
            axisLabel: {fontSize: 16, padding: 20},
            // grid: {stroke: (t) => t === 10 ? "red" : "grey"},
            // ticks: {stroke: "grey"},
            tickLabels: {fontSize: 9, fill: 'rgba(0,0,0,.4)', opacity: 0.9 }
          }}
        />

        <VictoryAxis
          tickValues={xAxisLabels}
          tickFormat={(tick) => xAxisFormatter(xAxisLabels, tick)}
          orientation="bottom"
          offsetY={20}
          padding={0}
          dependentAxis={true}
          style={{
            axis: {stroke: 'rgba(0,0,0,0)'},
            axisLabel: {fontSize: 10, padding: 10},
            tickLabels: {fontSize: 9, padding: 0, fill: 'rgba(0,0,0,.4)',  }
          }}
        />

      </VictoryChart>
    </View>);
  }
};

const xAxisFormatter = (values, tick) => {
  const value = values[tick - 1];

  if (tick === 1 || tick > values.length - 1) {
    return ' ';
  }

  return moment(value, 'YYYY-MM-DD').format('DD');
}

function rgbaColor(color, percent) {
  var f=parseInt(color.slice(1),16),R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
  return `rgba(${R}, ${G}, ${B}, ${percent})`;
}

export default Chart;
