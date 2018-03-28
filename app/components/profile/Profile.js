'use strict';

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableOpacity,
  Linking,
  Image,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import { find } from 'lodash';
import autobind from 'autobind-decorator';
import ScrollTabs from 'react-native-scrollable-tab-view';

import TabBarItem from '../tabs/Tabs';
import MyImages from './MyImages';
import ProfileHero from './ProfileHero';

import Icon from 'react-native-vector-icons/MaterialIcons';
import WebViewer from '../webview/WebViewer';
import PlatformTouchable from '../common/PlatformTouchable';
import theme from '../../style/theme';
import { fetchLinks } from '../../actions/profile';
import { getCurrentCityName } from '../../concepts/city';
import { openRegistrationView } from '../../concepts/registration';
import feedback from '../../services/feedback';

const IOS = Platform.OS === 'ios';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.stable,
  },
  scrollView: {
    flex: 1,
    backgroundColor: theme.stable,
    paddingVertical: 10,
    padding: 10,
  },
  listItem: {
    flex: 1,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: IOS ? theme.white : theme.transparent,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 0,
    },
  },
  listItem__hero: {
    paddingTop: 35,
    paddingBottom: 35,
  },
  listItemSeparator: {
    marginBottom: 15,
    borderBottomWidth: IOS ? 0 : 2,
    backgroundColor: theme.white,
    borderBottomColor: '#eee',
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 0,
    },
  },
  listItemButton: {
    backgroundColor: IOS ? theme.transparent : theme.white,
    flex: 1,
    padding: 0,
  },
  listItemIcon: {
    fontSize: 22,
    color: theme.primary,
    alignItems: 'center',
    width: 50,
  },
  listItemIcon__hero: {
    top: 0,
    left: 9,
    alignSelf: 'stretch',
    backgroundColor: 'transparent',
  },
  listItemSubtitle: {
    color: theme.subtlegrey,
    top: 1,
    fontSize: 13,
  },
  avatarColumn: {
    width: 50,
  },
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    left: -8,
    top: -1,
    width: 40,
    height: 40,
    backgroundColor: theme.stable,
    borderRadius: 20,
  },
  avatarInitialLetter: {
    backgroundColor: theme.primary,
  },
  avatarText: {
    color: theme.accentLight,
    fontSize: 18,
  },
  listItemIconRight: {
    position: 'absolute',
    right: 0,
    color: '#aaa',
    top: 45,
  },
  listItemText: {
    color: '#000',
    fontSize: 16,
  },
  listItemText__highlight: {
    color: theme.primary,
  },
  listItemText__downgrade: {
    color: '#aaa',
  },
  listItemText__small: {
    fontSize: 13,
    paddingTop: 1,
  },
  listItemTitles: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  listItemBottomLine: {
    position: 'absolute',
    right: 0,
    left: 70,
    bottom: 0,
    height: 1,
    backgroundColor: '#f4f4f4',
  },
  madeby: {
    padding: 7,
    backgroundColor: '#FFF',
    paddingTop: 20,
    paddingBottom: 25,
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
  },
  madebyIcon: {
    tintColor: theme.dark,
    width: 100,
    height: 20,
  },
  madebyText: {
    padding: 2,
    color: theme.primary,
    fontSize: 28,
    fontWeight: '300',
  },
});

class Profile extends Component {
  propTypes: {
    dispatch: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    links: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
    };
  }

  componentDidMount() {
    this.props.fetchLinks();
  }

  @autobind
  openRegistration() {
    this.props.openRegistrationView();
  }

  @autobind
  onLinkPress(item) {
    const url = item.link;
    const text = item.title;
    const openInWebview = item.showInWebview;

    if (!url) {
      return;
    }
    if (!openInWebview) {
      Linking.openURL(url);
    } else {
      this.props.navigator.push({
        component: WebViewer,
        showName: true,
        name: text,
        url,
        ...item,
      });
    }
  }

  renderLinkItem(item, index) {
    const linkItemStyles = [styles.listItemButton];

    if (item.separatorAfter || item.last) {
      linkItemStyles.push(styles.listItemSeparator);
    }

    return (
      <PlatformTouchable
        key={index}
        underlayColor={'#eee'}
        activeOpacity={0.6}
        delayPressIn={0}
        style={styles.listItemButton}
        onPress={() => (item.mailto ? feedback.sendEmail(item.mailto) : this.onLinkPress(item))}
      >
        <View style={linkItemStyles}>
          <View style={styles.listItem}>
            <Icon style={styles.listItemIcon} name={item.icon} />
            <Text style={styles.listItemText}>{item.title}</Text>
            {!item.separatorAfter && !item.last && <View style={styles.listItemBottomLine} />}
          </View>
        </View>
      </PlatformTouchable>
    );
  }

  renderComponentItem(item, index) {
    const linkItemStyles = [styles.listItemButton];
    const { navigator } = this.props;
    const { component, title } = item;

    if (item.separatorAfter || item.last) {
      linkItemStyles.push(styles.listItemSeparator);
    }

    return (
      <PlatformTouchable
        key={index}
        underlayColor={'#eee'}
        activeOpacity={0.6}
        delayPressIn={0}
        style={styles.listItemButton}
        onPress={() => navigator.push({ name: title, component, showName: true, ...item })}
      >
        <View style={linkItemStyles}>
          <View style={styles.listItem}>
            <Icon style={styles.listItemIcon} name={item.icon} />
            <View style={styles.listItemTitles}>
              <Text style={styles.listItemText}>{item.title}</Text>
              {item.subtitle && <Text style={styles.listItemSubtitle}>{item.subtitle}</Text>}
            </View>
            {!item.separatorAfter && !item.last && <View style={styles.listItemBottomLine} />}
          </View>
        </View>
      </PlatformTouchable>
    );
  }

  renderModalItem(item, index) {
    const currentTeam = find(this.props.teams.toJS(), ['id', this.props.selectedTeam]) || {
      name: '',
    };
    const hasName = !!item.title;
    const avatarInitialLetters = hasName
      ? item.title
          .split(' ')
          .slice(0, 2)
          .map(t => t.substring(0, 1))
          .join('')
      : null;

    return (
      <View key={index} style={{ flex: 1 }}>
        <PlatformTouchable delayPressIn={0} activeOpacity={0.8} onPress={this.openRegistration}>
          <View style={[styles.listItemButton, styles.listItemSeparator]}>
            <View style={[styles.listItem, styles.listItem__hero]}>
              <View style={styles.avatarColumn}>
                <View style={[styles.avatar, hasName ? styles.avatarInitialLetter : {}]}>
                  {hasName ? (
                    <Text style={styles.avatarText}>{avatarInitialLetters}</Text>
                  ) : (
                    <Icon
                      style={[styles.listItemIcon, styles.listItemIcon__hero]}
                      name={item.icon}
                    />
                  )}
                </View>
              </View>
              <View style={{ flexDirection: 'column', flex: 1 }}>
                {item.title ? (
                  <Text style={[styles.listItemText, styles.listItemText__highlight]}>
                    {item.title}
                  </Text>
                ) : (
                  <Text style={[styles.listItemText, styles.listItemText__downgrade]}>
                    Unnamed Whappu user
                  </Text>
                )}
                <Text style={[styles.listItemText, styles.listItemText__small]}>
                  {currentTeam.name}
                </Text>
              </View>
              <Icon style={[styles.listItemIcon, styles.listItemIconRight]} name={item.rightIcon} />
            </View>
          </View>
        </PlatformTouchable>
      </View>
    );
  }

  renderImageMadeByItem(index) {
    return (
      <View key={index} style={[styles.listItemButton, styles.listItemSeparator, styles.madeby]}>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.jayna.fi/')}>
          <Image
            resizeMode="contain"
            style={[styles.madebyIcon, { width: 50, height: 50 }]}
            source={require('../../../assets/madeby/jayna.png')}
          />
        </TouchableOpacity>
        <Text style={styles.madebyText}>×</Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://futurice.com/')}>
          <Image
            resizeMode="contain"
            style={[styles.madebyIcon, { top: 1, width: 88, height: 45 }]}
            source={require('../../../assets/madeby/futurice.png')}
          />
        </TouchableOpacity>
        <Text style={styles.madebyText}>×</Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://ttyy.fi/')}>
          <Image
            resizeMode="contain"
            style={[styles.madebyIcon, { top: 2, width: 54, height: 54 }]}
            source={require('../../../assets/madeby/ttyy-plain.png')}
          />
        </TouchableOpacity>
      </View>
    );
  }

  @autobind
  renderItem(item) {
    if (item.hidden) {
      return null;
    }

    const key = item.id || item.title;
    if (item.component) {
      return this.renderComponentItem(item, key);
    } else if (item.link || item.mailto) {
      return this.renderLinkItem(item, key);
    } else if (item.type === 'IMAGES') {
      return this.renderImageMadeByItem(key);
    }
    return this.renderModalItem(item, key);
  }

  @autobind
  renderContent() {
    const { links, terms, cityName } = this.props;

    const linksForCity = links.toJS().map(link => {
      const showCity = link.showCity;
      if (showCity && (cityName || '').toLowerCase() !== showCity) {
        link.hidden = true;
      }
      return link;
    });

    const listData = [].concat(linksForCity, [{ type: 'IMAGES', id: 'madeby' }], terms.toJS());

    return (
      <ScrollTabs
        initialPage={0}
        tabBarActiveTextColor={theme.secondary}
        tabBarBackgroundColor={theme.white}
        tabBarInactiveTextColor={theme.inactive}
        locked={IOS}
        prerenderingSiblingsNumber={0}
        renderTabBar={() => <TabBarItem />}
      >
        <MyImages tabLabel="Photos" />
        <View tabLabel="Links" style={styles.scrollView}>
          {listData.map(this.renderItem)}
        </View>
      </ScrollTabs>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <ProfileHero onEditPress={this.openRegistration} renderContent={this.renderContent} />
      </View>
    );
  }
}

const mapDispatchToProps = { fetchLinks, openRegistrationView };

const select = store => {
  return {
    selectedTeam: store.registration.get('selectedTeam'),
    teams: store.team.get('teams'),
    name: store.registration.get('name'),
    links: store.profile.get('links'),
    terms: store.profile.get('terms'),
    cityName: getCurrentCityName(store),
  };
};

export default connect(select, mapDispatchToProps)(Profile);
