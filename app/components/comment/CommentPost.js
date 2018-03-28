import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
  Linking,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import ParsedText from 'react-native-parsed-text';
import time from '../../utils/time';
import theme from '../../style/theme';
import AnimateMe from '../AnimateMe';

const { width } = Dimensions.get('window');
const IOS = Platform.OS === 'ios';

const CommentAvatar = ({ onAuthorPress, name, id, avatar }) => (
  <View style={styles.commentAvatar}>
    <TouchableOpacity onPress={() => onAuthorPress({ name, id })}>
      {avatar ? (
        <Image source={{ uri: avatar }} style={styles.commentAvatarImage} />
      ) : (
        <Icon name="person" style={styles.commentAvatarIcon} />
      )}
    </TouchableOpacity>
  </View>
);

const CommentAuthor = ({ name, ago, avatar, id, onAuthorPress }) => (
  <View style={styles.authorField}>
    <TouchableOpacity onPress={() => onAuthorPress({ name, id })}>
      <Text style={styles.commentAuthor}>{name}</Text>
    </TouchableOpacity>
    <Text style={styles.itemTimestamp}>• {ago}</Text>
  </View>
);

const CommentText = ({ text, style }) => (
  <ParsedText
    style={style}
    parse={[
      {
        type: 'url',
        style: { textDecorationLine: 'underline' },
        onPress: url => Linking.openURL(url),
      },
    ]}
  >
    {text}
  </ParsedText>
);

const Comment = ({ item, openUserView, onImagePress }) => {
  const ago = time.getTimeAgo(item.get('createdAt'));
  const profilePicture = item.get('profilePicture');

  const hasImage = !!item.get('imagePath');

  const authorProps = {
    avatar: profilePicture,
    onAuthorPress: openUserView,
    id: item.get('userId'),
    name: item.get('userName'),
    ago: ago,
  };

  return (
    <AnimateMe delay={140} duration={200} animationType="fade-from-bottom" style={{ flex: 1 }}>
      <View style={styles.comment}>
        <View style={styles.commentContent}>
          <View style={styles.commentAvatarCol}>
            <CommentAvatar {...authorProps} />
          </View>

          <View style={styles.commentTextContent}>
            {hasImage ? (
              <View>
                <CommentAuthor {...authorProps} />
                <TouchableOpacity onPress={() => onImagePress(item.get('imagePath'))}>
                  <Image style={styles.commentImage} source={{ uri: item.get('imagePath') }} />
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <CommentAuthor {...authorProps} />
                <CommentText style={styles.commentText} text={item.get('text')} />
              </View>
            )}
          </View>
        </View>
      </View>
    </AnimateMe>
  );
};

const CommentPost = ({ item, openUserView, onImagePress }) => {
  if (!item) {
    return null;
  }

  const ago = time.getTimeAgo(item.get('createdAt'));
  const profilePicture = item.getIn(['author', 'profilePicture']);
  const userName = item.getIn(['author', 'name']);
  const userId = item.getIn(['author', 'id']);
  const hasImage = item.get('type') === 'IMAGE';
  const hasText = !!item.get('text');

  const authorProps = {
    avatar: profilePicture,
    onAuthorPress: openUserView,
    id: userId,
    name: userName,
    ago: ago,
  };

  return (
    <AnimateMe delay={0} duration={200} animationType="fade-from-bottom" style={{ flex: 1 }}>
      <View style={styles.comment}>
        <View style={styles.commentContent}>
          <View style={styles.commentAvatarCol}>
            <CommentAvatar {...authorProps} />
          </View>

          <View style={styles.commentTextContent}>
            {hasImage && (
              <View>
                <CommentAuthor {...authorProps} />
                <TouchableOpacity onPress={() => onImagePress(item.get('url'))}>
                  <Image style={styles.commentImage} source={{ uri: item.get('url') }} />
                </TouchableOpacity>
              </View>
            )}
            {hasText && (
              <View style={{ marginTop: hasImage ? 10 : 0 }}>
                {!hasImage && <CommentAuthor {...authorProps} />}
                <CommentText style={styles.commentText} text={item.get('text')} />
              </View>
            )}
          </View>
        </View>
      </View>
    </AnimateMe>
  );
};

const styles = StyleSheet.create({
  comment: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 15,
    paddingBottom: 5,
    paddingTop: 15,
  },
  commentContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingBottom: 5,
  },
  commentAvatarCol: {
    paddingRight: 18,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentAvatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  commentAvatarIcon: {
    top: 0,
    left: 0,
    textAlign: 'center',
    width: 32,
    height: 32,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 16,
    color: theme.white,
    fontSize: 32,
    lineHeight: 38,
    backgroundColor: theme.transparent,
  },
  commentImage: {
    width: 120,
    height: 120,
    borderRadius: 5,
  },
  commentText: {
    textAlign: 'left',
    color: theme.dark,
  },
  commentListItemImg: {
    width: width,
    height: width,
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  commentTextContent: {
    flex: 1,
  },
  authorField: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 7,
  },
  commentAuthor: {
    color: theme.dark,
    fontWeight: IOS ? 'normal' : 'normal',
    opacity: 0.8,
    fontSize: 11,
  },
  itemTimestamp: {
    marginLeft: 5,
    flex: 1,
    color: theme.dark,
    opacity: 0.8,
    fontSize: 11,
    fontWeight: 'normal',
  },
});

export { Comment, CommentPost };
