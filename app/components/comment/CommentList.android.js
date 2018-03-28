import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator, NativeModules } from 'react-native';
import autobind from 'autobind-decorator';

import { height } from '../../services/device-info';
import theme from '../../style/theme';
import { Comment, CommentPost } from './CommentPost';
import CommentImageZoom from './CommentImageZoom';
import CommentForm from './CommentForm';
import SimpleEmojiPicker from './SimpleEmojiPicker';

const ScrollViewManager = NativeModules.ScrollViewManager;

const insertText = (str, index, indexEnd, value) =>
  str.substr(0, index) + value + str.substr(index + (indexEnd - index));

class CommentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zoomedImage: null,
    };
  }

  @autobind
  scrollBottom(animated = false) {
    if (this.commentScrollView) {
      const containerHeight = height - 130;
      // this.commentScrollView.scrollToEnd({ animated });
      if (ScrollViewManager && ScrollViewManager.getContentSize) {
        ScrollViewManager.getContentSize(
          ReactNative.findNodeHandle(this.commentScrollView),
          contentSize => {
            const scrollYPos = contentSize.height - containerHeight;
            this.commentScrollView.scrollTo({
              x: 0,
              y: Math.max(0, scrollYPos),
              animated,
            });
          }
        );
      }
    }
  }

  @autobind
  postComment(comment) {
    this.scrollBottom(true);
    return this.props.postComment(comment);
  }

  @autobind
  zoomImage(zoomedImage) {
    this.setState({ zoomedImage });
  }

  @autobind
  resetZoomImage() {
    this.setState({ zoomedImage: null });
  }

  renderLoader() {
    return <ActivityIndicator size="large" color={theme.blue1} />;
  }

  render() {
    const {
      postItem,
      comments,
      postComment,
      editComment,
      editCommentText,
      loadingComments,
      loadingCommentPost,
      openUserView,
    } = this.props;

    return (
      <View style={styles.commentList}>
        <View style={styles.commentView}>
          <View style={styles.commentScroll}>
            {loadingComments ? (
              this.renderLoader()
            ) : (
              <ScrollView
                keyboardShouldPersistTaps={'handled'}
                ref={ref => (this.commentScrollView = ref)}
                onContentSizeChange={(contentWidth, contentHeight) => {
                  this.scrollBottom(false);
                }}
              >
                <CommentPost
                  item={postItem}
                  openUserView={openUserView}
                  onImagePress={this.zoomImage}
                />
                {comments.map((comment, index) => (
                  <Comment
                    key={index}
                    item={comment}
                    openUserView={openUserView}
                    onImagePress={this.zoomImage}
                  />
                ))}
              </ScrollView>
            )}
          </View>

          <View style={styles.commentForm}>
            <CommentForm
              postComment={this.postComment}
              editComment={editComment}
              text={editCommentText}
              postCommentCallback={this.scrollBottom}
              loadingCommentPost={loadingCommentPost}
              onInputFocus={this.scrollBottom}
            />
          </View>
        </View>
        <CommentImageZoom imageUrl={this.state.zoomedImage} onClose={this.resetZoomImage} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // # <CommentList />
  commentList: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: theme.white,
  },
  commentView: {
    paddingBottom: 28,
    flexDirection: 'column',
    backgroundColor: theme.white,
    flexGrow: 1,
    flex: 1,
  },
  commentScroll: {
    alignItems: 'stretch',
    justifyContent: 'center',
    flexGrow: 1,
    backgroundColor: theme.white,
    paddingBottom: 20,
  },
  commentForm: {
    height: 52,
    position: 'absolute',
    zIndex: 99,
    left: 0,
    right: 0,
    bottom: 0,
  },
  emojiPicker: {
    zIndex: 20,
    position: 'absolute',
    left: 0,
    bottom: 50,
    width: 54,
    minHeight: 260,
    flex: 0,
  },
});

export default CommentList;
