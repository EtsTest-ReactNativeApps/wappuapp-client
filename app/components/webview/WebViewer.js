'use strict';

import React, { Component, PropTypes } from 'react';
import { StyleSheet, View, Platform, WebView } from 'react-native';
import theme from '../../style/theme';
import Header from '../common/ScrollHeader';
const IOS = Platform.OS === 'ios';

class WebViewer extends Component {
  render() {
    let { url, name } = this.props.route;

    if (IOS && url.indexOf('https') < 0) {
      url = 'https://crossorigin.me/' + url;
    }

    return (
      <View style={styles.container}>
        {!IOS && (
          <Header title={name} icon="arrow-back" onIconClick={() => this.props.navigator.pop()} />
        )}

        {url && <WebView source={{ uri: url }} scalesPageToFit={false} style={{ flex: 1 }} />}
      </View>
    );
  }
}

WebViewer.propTypes = {
  url: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: IOS ? 10 : 0,
  },
});

export default WebViewer;
