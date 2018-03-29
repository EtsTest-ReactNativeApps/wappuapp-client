'use strict';

import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { cloneDeep } from 'lodash';
import autobind from 'autobind-decorator';
import ImagePickerManager from 'react-native-image-picker';
import ParallaxView from 'react-native-parallax-view';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  getMyImages,
  getMyTeam,
  getMyTotalSimas,
  getMyTotalVotes,
  fetchMyImages,
  isLoadingUserImages,
} from '../../concepts/user';
import {
  getUserName,
  getUserId,
  postProfilePicture,
  getUserImage,
} from '../../concepts/registration';
import { openLightBox } from '../../actions/feed';
import { getCurrentTab } from '../../reducers/navigation';

import ImageCaptureOptions from '../../constants/ImageCaptureOptions';
import permissions from '../../services/android-permissions';
import { width, IOS } from '../../services/device-info';
import theme from '../../style/theme';
import AnimateMe from '../AnimateMe';
import LinearGradient from '../header/LinearGradient';

const headerImage = require('../../../assets/frontpage_header-bg.jpg');

class UserView extends Component {
  componentDidMount() {
    const { userId } = this.props;

    this.props.fetchMyImages(userId);
  }

  @autobind
  chooseImage() {
    // cancel action if already loading image
    if (this.props.isLoadingPicture) {
      return;
    }

    if (IOS) {
      this.openImagePicker();
    } else {
      permissions.requestCameraPermission(() => {
        setTimeout(() => {
          this.openImagePicker();
        });
      });
    }
  }

  @autobind
  openImagePicker() {
    // Create selfie image capture options
    const selfieCaptureOptions = Object.assign({}, ImageCaptureOptions, {
      title: 'Change Avatar',
      cameraType: 'front',
      takePhotoButtonTitle: 'Take a selfie',
    });

    ImagePickerManager.showImagePicker(selfieCaptureOptions, response => {
      if (!response.didCancel && !response.error) {
        const image = 'data:image/jpeg;base64,' + response.data;
        this.props.postProfilePicture(image);
      }
    });
  }

  render() {
    const {
      images,
      isLoading,
      totalVotes,
      totalSimas,
      userTeam,
      userName,
      userImage,
      renderContent,
    } = this.props;

    let { user } = this.props.route ? this.props.route : { user: null };

    // Show Current user if not user selected
    if (!user) {
      user = { name: userName };
    }

    const imagesCount = images.size;

    const avatarInitialLetters = !!user.name
      ? user.name
          .split(' ')
          .slice(0, 2)
          .map(t => t.substring(0, 1))
          .join('')
      : null;

    return (
      <View style={{ flex: 1 }}>
        <ParallaxView
          backgroundSource={headerImage}
          windowHeight={250}
          style={{ backgroundColor: theme.stable, shadowOpacity: 0 }}
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

              <View style={styles.avatar} onPress={this.openImagePicker}>
                <View>
                  {userImage ? (
                    <Image style={styles.profilePic} source={{ uri: userImage }} />
                  ) : !avatarInitialLetters ? (
                    <Icon style={styles.avatarText} name="person-outline" />
                  ) : (
                    <Text style={styles.avatarInitials}>{avatarInitialLetters}</Text>
                  )}
                </View>
              </View>

              {!!user.name && (
                <TouchableOpacity
                  onPress={this.openImagePicker}
                  style={styles.avatarChangeIconWrap}
                >
                  <View>
                    <Icon style={styles.avatarChangeIcon} name="camera-alt" />
                  </View>
                </TouchableOpacity>
              )}

              <AnimateMe delay={100} animationType="fade-from-bottom">
                <Text style={styles.headerTitle}>{user.name}</Text>
              </AnimateMe>
              <AnimateMe delay={300} animationType="fade-from-bottom">
                <Text style={styles.headerSubTitle}>{userTeam || user.team}</Text>
              </AnimateMe>
              <View style={styles.headerKpis}>
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
              </View>
            </View>
          }
        >
          <View style={styles.container}>{renderContent()}</View>
        </ParallaxView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.stable,
  },
  header: {
    flex: 1,
    elevation: 3,
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: theme.light,
    marginBottom: 3,
    backgroundColor: 'transparent',
  },
  headerSubTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'rgba(0,0,0,.6)',
    opacity: 0.9,
    backgroundColor: 'transparent',
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
  avatarChangeIconWrap: {
    position: 'absolute',
    left: width / 2 - 62,
    top: 18,
    backgroundColor: '#FFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  avatarTextChangeIconWrap: {},
  avatarChangeIcon: {
    color: theme.primary,
    fontSize: 18,
    backgroundColor: 'transparent',
  },
  editButton: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  editIcon: {
    color: theme.white,
    opacity: 0.9,
    fontSize: 25,
  },
  headerKpis: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerKpi: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: IOS ? 10 : 20,
    marginTop: IOS ? 25 : 15,
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

const mapDispatchToProps = { openLightBox, fetchMyImages, postProfilePicture };

const mapStateToProps = createStructuredSelector({
  images: getMyImages,
  isLoading: isLoadingUserImages,
  totalSimas: getMyTotalSimas,
  totalVotes: getMyTotalVotes,
  userId: getUserId,
  userName: getUserName,
  userTeam: getMyTeam,
  userImage: getUserImage,
  tab: getCurrentTab,
});

export default connect(mapStateToProps, mapDispatchToProps)(UserView);
