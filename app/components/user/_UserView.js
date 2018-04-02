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
import { openLightBox } from '../../concepts/lightbox';

import UserComponent from './UserComponent';

class UserView extends Component {
  componentDidMount() {
    const { user } = this.props.route;

    if (user && user.id) {
      this.props.fetchUserImages(user.id);
    }
  }

  render() {
    let { user } = this.props.route;

    // Show Current user if not user selected
    if (!user) {
      user = { name: userName };
    }

    return <UserComponent {...this.props} {...user} />;
  }
}

const mapDispatchToProps = { openLightBox, fetchUserImages };

const mapStateToProps = state => ({
  images: getUserImages(state),
  isLoading: isLoadingUserImages(state),
  totalSimas: getTotalSimas(state),
  totalVotes: getTotalVotesForUser(state),
  userTeam: getUserTeam(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserView);
