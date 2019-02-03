import React from 'react';
import { connect } from 'react-redux';
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

const mapStateToProps = state => {
  console.log('mapStateHome');
  return {
    currentUser: state.user,
    playlists: state.playlists
  };
};

export default connect(mapStateToProps)(Home);
