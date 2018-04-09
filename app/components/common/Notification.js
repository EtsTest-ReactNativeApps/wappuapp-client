import React, { Component, PropTypes } from 'react';
import { Text, Easing, Animated, Dimensions, View, StyleSheet } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../../style/theme';

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -100,
    left: 15,
    right: 15,
    borderRadius: 5,
    backgroundColor: theme.white,
    alignItems: 'center',
    paddingTop: 18,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 18,
    shadowColor: '#000000',
    shadowOpacity: 0,
    shadowRadius: 7,
    shadowOffset: {
      height: 5,
      width: 0,
    },
  },
  message: {
    color: theme.primary,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0)',
    width: width,
    height: 400,
  },
});

class Notification extends Component {
  static propTypes = {
    children: PropTypes.node,
    visible: PropTypes.bool,
  };

  static defaultProps = {
    visible: true,
  };

  constructor(props) {
    super(props);

    this.state = {
      // translate: new Animated.Value(0),
      translate: new Animated.ValueXY(),
      height: 0,
    };
  }

  componentDidMount() {
    if (this.props.visible) {
      this.fadeIn(this.props.topOffset);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && !this.props.visible) {
      this.fadeIn(nextProps.topOffset);
    } else {
      if (!nextProps.visible && this.props.visible) {
        this.fadeOut();
      }
    }
  }

  shouldComponentUpdate(nextProps) {
    // TODO: Compare the messages with each other
    if (this.props.visible !== nextProps.visible) {
      return true;
    }

    return false;
  }

  fadeIn(topOffset) {
    Animated.timing(this.state.translate, {
      duration: 300,
      easing: Easing.ease,
      // toValue: 1,
      toValue: { x: 0, y: topOffset },
    }).start();
  }

  fadeOut() {
    Animated.timing(this.state.translate, {
      duration: 200,
      easing: Easing.ease,
      // toValue: 0,
      toValue: { x: 0, y: -this.state.height },
    }).start();
  }

  getViewSize(e) {
    if (this.state.height == 0) {
      this.state.translate.setValue({ x: 0, y: -e.nativeEvent.layout.height });
      // this.state.translate.setValue(0);
    }

    /*eslint-disable */
    this.state.height = e.nativeEvent.layout.height;
    /*eslint-enable */
  }

  render() {
    const message = this.props.children;
    const { height, translate } = this.state;
    const { topOffset } = this.props;
    const offset = topOffset || 20;

    const animatedViewStyles = [
      styles.container,
      {
        /* backgroundColor: this.props.success ? theme.green : theme.red */
        shadowOpacity: this.props.visible ? 0.2 : 0,
        elevation: this.props.visible ? 2 : 0,
      },
      { top: this.state.height === 0 ? -100 : 0 },
      { transform: this.state.translate.getTranslateTransform() },
      /*
      {
        transform: [
          {
            translateY: translate.interpolate({
              inputRange: [0, 1],
              outputRange: [-height, offset],
            }),
          },
          { scale: translate.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }) },
        ],
      },
      */
    ];

    return (
      <View style={styles.wrapper} pointerEvents={'box-none'}>
        <Animated.View onLayout={this.getViewSize.bind(this)} style={animatedViewStyles}>
          {this.props.success && (
            <Icon
              name="done"
              style={{
                fontSize: 20,
                color: theme.primary,
                position: 'absolute',
                left: 15,
                top: 17,
              }}
            />
          )}
          <Text style={styles.message}>{message}</Text>
        </Animated.View>
      </View>
    );
  }
}

export default Notification;
