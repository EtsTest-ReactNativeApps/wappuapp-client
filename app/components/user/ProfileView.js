import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  getUserImages,
  getUserTeam,
  getTotalSimas,
  getTotalVotesForUser,
  fetchUserImages,
  isLoadingUserImages,
} from '../../concepts/user';
import { getUserName, getUserId } from '../../concepts/registration';
import { openLightBox } from '../../actions/feed';

import UserComponent from './UserComponent';

class UserView extends Component {
  componentDidMount() {
    const { userId } = this.props;

    if (userId) {
      this.props.fetchUserImages(userId);
    }
  }

  render() {
    let user = { name: userName };

    return <UserComponent {...this.props} {...user} />;
  }
}

const mapDispatchToProps = { openLightBox, fetchUserImages };

const mapStateToProps = state => ({
  images: getUserImages(state),
  isLoading: isLoadingUserImages(state),
  totalSimas: getTotalSimas(state),
  totalVotes: getTotalVotesForUser(state),
  userId: getUserId(state),
  userName: getUserName(state),
  userTeam: getUserTeam(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserView);
