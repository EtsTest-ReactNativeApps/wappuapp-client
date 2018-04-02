'use strict';

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Platform,
  Text,
} from 'react-native';
import { connect } from 'react-redux';

import {
  getUserImages,
  getUserName,
  getUserTeam,
  getTotalSimas,
  getTotalVotesForUser,
  getUserImage,
  fetchUserImages,
  isLoadingUserImages,
} from '../../concepts/user';
import { openLightBox } from '../../concepts/lightbox';
import { getCurrentTab } from '../../reducers/navigation';

import ParallaxView from 'react-native-parallax-view';
import Icon from 'react-native-vector-icons/MaterialIcons';

import theme from '../../style/theme';
import AnimateMe from '../AnimateMe';
import Header from '../common/Header';
import Loader from '../common/Loader';
import LinearGradient from '../header/LinearGradient';
import { height, width, IOS } from '../../services/device-info';
import { getInitialLetters } from '../../services/user';

const headerImage = require('../../../assets/frontpage_header-bg.jpg');

class UserView extends Component {
  render() {
    const {
      images,
      isLoading,
      totalVotes,
      totalSimas,
      userTeam,
      userName,
      userImage,
      navigator,
    } = this.props;

    const imagesCount = images.size;
    const avatarInitialLetters = getInitialLetters(userName);

    return (
      <View style={{ flex: 1 }}>
        <ParallaxView
          backgroundSource={headerImage}
          windowHeight={270}
          style={{ backgroundColor: theme.white, shadowOpacity: 0 }}
          scrollableViewStyle={{ shadowColor: theme.transparent }}
          header={
            <View style={styles.header}>
              <LinearGradient
                colors={[theme.secondary, theme.secondaryLight, theme.secondaryTint]}
                start={{ x: 0.4, y: 0.5 }}
                end={{ x: 0.57, y: 1 }}
                locations={[0.2, 0.6, 1]}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: -250,
                  bottom: 0,
                  opacity: 0.75,
                }}
              />
              {!IOS && (
                <View style={styles.backLink}>
                  <TouchableHighlight
                    onPress={() => navigator.pop()}
                    style={styles.backLinkText}
                    underlayColor={'rgba(255, 255, 255, .1)'}
                  >
                    <Icon name="arrow-back" size={28} style={styles.backLinkIcon} />
                  </TouchableHighlight>
                </View>
              )}
              <AnimateMe style={{ flex: 0 }} delay={300} animationType="fade-from-bottom">
                <View style={styles.avatar}>
                  {userImage ? (
                    <Image style={styles.profilePic} source={{ uri: userImage }} />
                  ) : !avatarInitialLetters ? (
                    <Icon style={styles.avatarText} name="person-outline" />
                  ) : (
                    <Text style={styles.avatarInitials}>{avatarInitialLetters}</Text>
                  )}
                </View>
              </AnimateMe>

              <AnimateMe style={{ flex: 0 }} delay={500} animationType="fade-from-bottom">
                <Text style={styles.headerTitle}>{userName}</Text>
              </AnimateMe>
              <AnimateMe style={{ flex: 0 }} delay={700} animationType="fade-from-bottom">
                <Text style={styles.headerSubTitle}>{userTeam}</Text>
              </AnimateMe>

              <AnimateMe style={styles.headerKpis} delay={900} animationType="fade-in">
                <View style={styles.headerKpi}>
                  <Text style={styles.headerKpiValue}>{!isLoading ? imagesCount : '-'}</Text>
                  <Text style={styles.headerKpiTitle}>photos</Text>
                </View>
                <View style={styles.headerKpi}>
                  <Text style={styles.headerKpiValue}>{!isLoading ? totalVotes : '-'}</Text>
                  <Text style={styles.headerKpiTitle}>votes for photos</Text>
                </View>
                <View style={styles.headerKpi}>
                  <Text style={styles.headerKpiValue}>{!isLoading ? totalSimas || '-' : '-'}</Text>
                  <Text style={styles.headerKpiTitle}>simas</Text>
                </View>
              </AnimateMe>
            </View>
          }
        >
          <View style={styles.container}>
            {isLoading && (
              <View style={styles.loader}>
                <Loader size="large" />
              </View>
            )}
            {images.size > 0 && (
              <AnimateMe style={{ flex: 1 }} delay={1000} animationType="fade-in">
                <View style={styles.imageContainer}>
                  {images.map(image => (
                    <View key={image.get('id')}>
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => this.props.openLightBox(image.get('id'))}
                      >
                        <Image
                          key={image.get('id')}
                          style={{
                            height: width / 3 - 14,
                            width: width / 3 - 14,
                            margin: 5,
                            backgroundColor: theme.stable,
                          }}
                          source={{ uri: image.get('url') }}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </AnimateMe>
            )}
            {!isLoading &&
              !images.size && (
                <View style={styles.imageTitleWrap}>
                  <Text style={styles.imageTitle}>No photos</Text>
                </View>
              )}
          </View>
        </ParallaxView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white,
    minHeight: height / 2,
  },
  header: {
    flex: 1,
    elevation: 3,
    paddingTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backLink: {
    position: 'absolute',
    left: 7,
    top: 7,
    zIndex: 2,
  },
  backLinkText: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.transparent,
  },
  backLinkIcon: {
    color: theme.white,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: theme.light,
    marginBottom: 3,
  },
  headerSubTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'rgba(0,0,0,.6)',
    opacity: 0.9,
  },
  avatar: {
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 88,
    height: 88,
    backgroundColor: theme.stable,
    borderRadius: 44,
    borderWidth: 2,
    borderColor: theme.white,
  },
  profilePic: {
    width: 84,
    height: 84,
    borderRadius: 42,
  },
  avatarText: {
    backgroundColor: theme.transparent,
    color: theme.secondary,
    fontSize: 60,
  },
  avatarInitials: {
    fontSize: 25,
    fontWeight: 'bold',
    paddingTop: 3,
    backgroundColor: theme.transparent,
    color: theme.secondary,
  },
  headerKpis: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerKpi: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 25,
  },
  headerKpiTitle: {
    color: theme.transparentLight,
    fontWeight: '500',
    fontSize: 11,
  },
  headerKpiValue: {
    fontSize: 26,
    color: theme.transparentLight,
    fontWeight: '400',
  },
  loader: {
    marginTop: 50,
  },
  imageContainer: {
    padding: 5,
    margin: 1,
    marginTop: 2,
    marginBottom: 30,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 50,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  imageTitle: {
    textAlign: 'center',
    color: theme.grey,
    margin: 20,
    marginTop: 40,
    fontSize: 15,
    fontWeight: '600',
  },
  imageTitleWrap: {
    flex: 1,
    marginTop: 0,
  },
});

const mapDispatchToProps = { openLightBox, fetchUserImages };

const mapStateToProps = state => ({
  images: getUserImages(state),
  isLoading: isLoadingUserImages(state),
  totalSimas: getTotalSimas(state),
  totalVotes: getTotalVotesForUser(state),
  userName: getUserName(state),
  userTeam: getUserTeam(state),
  userImage: getUserImage(state),
  tab: getCurrentTab(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserView);
