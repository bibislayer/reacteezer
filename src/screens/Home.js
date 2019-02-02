import React from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import Styles from '../utils/Styles';
import Playlists from '../components/Playlists';

class Home extends React.Component {
  render() {
    const { currentUser, playlists, navigation } = this.props;
    if (currentUser && playlists) {
      return <Playlists navigation={navigation} />;
    }
    return null;
  }
}

export default connect(state => ({ currentUser: state.user, playlists: state.playlists }))(Home);
