'use strict';

import React, {
  Alert,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

import { connect } from 'react-redux';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/Ionicons';

import { removeFeedItem } from '../../actions/feed';
import abuse from '../../services/abuse';
import time from '../../utils/time';
import theme from '../../style/theme';

const styles = StyleSheet.create({
  itemWrapper: {
    width: Dimensions.get('window').width,
    backgroundColor: '#f9f9f9',
    paddingBottom: 15
  },
  itemContent:{
    flex: 1,
    elevation: 2,
    backgroundColor: '#fff'
  },

  itemImageWrapper: {
    height: 400,
    width: Dimensions.get('window').width,
  },

  itemTextWrapper: {
    paddingLeft: 36,
    paddingRight: 30,
    paddingTop: 0,
    paddingBottom: 10,
    top: -10
  },
  feedItemListText: {
    fontSize: 13,
    color: theme.dark
  },
  feedItemListItemImg: {
    width: Dimensions.get('window').width,
    height: 400,
    backgroundColor: '#ddd'
  },
  feedItemListItemInfo: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  feedItemListItemAuthor:{
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemAuthorName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: theme.secondary,
    paddingRight: 10
  },
  itemAuthorTeam:{
    fontSize:11,
    color: '#aaa'
  },
  feedItemListItemAuthorIcon:{
    color: '#bbb',
    fontSize: 15,
    marginTop: 1,
    paddingRight: 10
  },
  listItemRemoveButton:{
    backgroundColor: 'transparent',
    color: '#f00',
    fontSize: 20,
    padding: 10,
    position: 'absolute',
    right: 6,
    bottom: 10
  },
  itemTimestamp: {
    color: '#aaa',
    fontSize: 13
  }
});

const FeedListItem = React.createClass({
  itemIsCreatedByMe(item) {
    return item.author.type === 'ME';
  },

  showRemoveDialog(item) {
    if (this.itemIsCreatedByMe(item)) {
      Alert.alert(
        'Delete Content',
        'Do you want to remove this item?',
        [
          { text: 'No, I\'m having second thoughts', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
          { text: 'Yes, nuke it from the orbit', onPress: () => this.removeThisItem(), style: 'destructive' }
        ]
      );
    } else {
      Alert.alert(
        'Flag Content',
        'Do you want to report this item?',
        [
          { text: 'No, I missclicked', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
          { text: 'Yes, let\'s erase this abonomination', onPress: () => abuse.reportFeedItem(item), style: 'destructive' }
        ]
      );
    }
  },

  removeThisItem() {
    this.props.dispatch(removeFeedItem(this.props.item));
  },

  // Render "remove" button, which is remove OR flag button,
  // depending is the user the creator of this feed item or not
  renderRemoveButton(item) {
    if (item.author.type === 'SYSTEM') {
      return <View></View>; // currently it is not possible to return null in RN as a view
    }

    const iconName = this.itemIsCreatedByMe(item) ? 'trash-a' : 'flag';
    return (
      <TouchableHighlight onPress={() => this.showRemoveDialog(this.props.item)}>
        <Icon name={iconName} style={styles.listItemRemoveButton} />
      </TouchableHighlight>
    );
  },

  render() {
    const item = this.props.item;
    const ago = time.getTimeAgo(item.createdAt);

    return (
      <View style={styles.itemWrapper}>
        <View style={styles.itemContent}>

          <View style={styles.feedItemListItemInfo}>
            <Icon name='android-contact' style={styles.feedItemListItemAuthorIcon} />
            <View style={styles.feedItemListItemAuthor}>
              <Text style={styles.itemAuthorName}>{item.author.name}</Text>
              <Text style={styles.itemAuthorTeam}>{item.author.team}</Text>
            </View>
            <Text style={styles.itemTimestamp}>{ago}</Text>
          </View>

          {item.type==='IMAGE' ?
            <View style={styles.itemImageWrapper}>
              <Image
                source={{ uri: item.url }}
                style={styles.feedItemListItemImg} />
            </View>
          :
            <View style={styles.itemTextWrapper}>
              <Text style={styles.feedItemListText}>{item.text}</Text>
            </View>
          }

          {this.renderRemoveButton(item)}

        </View>
      </View>
    );
  }
});

const select = store => {
    return {
      user: store.registration.toJS()
    }
};

export default connect(select)(FeedListItem);
