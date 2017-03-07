'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ScrollView
} from 'react-native';
import theme from '../../style/theme';
import Toolbar from './RegistrationToolbar';
import Button from '../../components/common/Button';
import Icon from 'react-native-vector-icons/Ionicons';

const IOS = Platform.OS === 'ios';

class IntroView extends Component {
  render() {
    return (
      <View style={[styles.container, styles.modalBackgroundStyle]}>
        <Toolbar icon='' iconClick={() => null} title='Introduction' />
          <ScrollView style={{flex:1, width: null, height: null}}>
            <View style={[styles.container, styles.contentContainer]}>
              <Text style={styles.header}>
                How to Whappu
              </Text>

              <View style={[styles.row, {paddingTop: 30}]}>
                <View style={styles.rowIconContainer}>
                  <Icon name={IOS ? 'ios-star': 'md-star'} style={[styles.rowIcon, {color: theme.light}]} />
                </View>

                <View style={styles.rowTextContainer}>
                  <Text style={styles.rowTitle}>
                    1. Earn points
                  </Text>
                  <Text style={styles.rowText}>
                    Guild with most Whappu points wins a juicy prize!
                  </Text>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.rowIconContainer}>
                  <Icon name={IOS ? 'ios-wine': 'md-wine'}  style={[styles.rowIcon, {color: theme.light}]} />
                </View>

                <View style={styles.rowTextContainer}>
                  <Text style={styles.rowTitle}>
                    2. Enjoy sima
                  </Text>
                  <Text style={styles.rowText}>
                    Because otherwise you might get thirsty.
                  </Text>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.rowIconContainer}>
                  <Icon name={IOS ? 'ios-trophy': 'md-trophy'}  style={[styles.rowIcon, {color: theme.light}]} />
                </View>

                <View style={styles.rowTextContainer}>
                  <Text style={styles.rowTitle}>
                    3. Winner takes it all
                  </Text>
                  <Text style={styles.rowText}>
                    Competition ends at 12:00AM on 1st of May.
                  </Text>

                  <Text style={[styles.rowText, styles.rowSecondaryText]}>
                    Winner will be
                    announced later on the day.
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

        <View style={styles.bottomButtons}>
          <Button
            onPress={this.props.onDismiss}
            style={styles.modalButton}
          >
            Got it
          </Button>
          <Button
            onPress={this.props.closeRegistrationView}
            style={[styles.modalButton, {backgroundColor: theme.secondary}]}
          >
            Skip, just looking around.
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 30
  },
  innerContainer: {
    flex: 1,
    paddingTop: IOS ? 15 : 15,
  },
  header: {
    fontWeight: 'bold',
    color: theme.secondary,
    marginTop: 30,
    marginLeft: IOS ? 25 : 15,
    fontSize: 28
  },
  row: {
    padding: 20,
    paddingLeft:15,
    paddingBottom: 25,
    flex: 1,
    flexDirection: 'row'
  },
  rowNumberContainer: {
    paddingLeft: 10,
    paddingTop:6,
    borderWidth:2,
    borderColor:theme.secondary,
    borderRadius:25,
    width:50,
    height:50,
    paddingRight: 10,
    top: 2
  },
  rowNumberText: {
    fontSize: 28,
    color: theme.secondary,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    fontWeight: 'bold'
  },
  rowIconContainer: {
    width: 50,
    height:50,
    backgroundColor:theme.secondary,
    borderRadius:25,
    marginRight:5,
    marginLeft:10,
    justifyContent:'center'
  },
  rowIcon: {
    textAlign:'center',
    color: theme.white,
    backgroundColor: 'rgba(0,0,0,0)',
    fontSize: 24
  },
  rowTextContainer: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20
  },
  rowTitle:{
    color: theme.secondary,
    fontWeight:'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  rowText: {
    color: IOS ? '#555' : '#888',
    fontSize: 14,
    fontWeight: 'normal'
  },
  rowSecondaryText: {
    marginTop: 8
  },
  bottomButtons:{
    flex:1,
    flexDirection:'column',
    margin:0,
    marginBottom:0,
    marginLeft:0,
    marginRight:0,
    height:100,
    alignItems:'stretch',
    position:'absolute',
    bottom:0,
    left:0,
    right:0,
  },
  modalButton: {
    borderRadius:0,
    flex:1,
    marginLeft:0,
  }
});

export default IntroView;
