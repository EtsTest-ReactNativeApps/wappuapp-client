import React from 'react';
import { StyleSheet, Image, TouchableWithoutFeedback, Platform, Dimensions } from 'react-native';

import ModalBackgroundView from '../common/ModalBackgroundView';
import AnimateMe from '../AnimateMe';

const { width, height } = Dimensions.get('window');
const IOS = Platform.OS === 'ios';

export default (CommentZoomImage = ({ imageUrl, onClose }) => {
  if (!imageUrl) {
    return null;
  }

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <ModalBackgroundView style={styles.layer} blurType="light">
        <AnimateMe style={{ flex: 0 }} duration={200} animationType="comment-image">
          <Image
            style={{ width, height: height - 60 }}
            source={{ uri: imageUrl }}
            resizeMode={'contain'}
          />
        </AnimateMe>
      </ModalBackgroundView>
    </TouchableWithoutFeedback>
  );
});

const styles = StyleSheet.create({
  layer: {
    width,
    height: height - 60,
    paddingBottom: 60,
    backgroundColor: IOS ? 'transparent' : 'rgba(255,255,255,.85)',
    zIndex: 10,
    position: 'absolute',
    left: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
