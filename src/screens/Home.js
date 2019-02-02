import React from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import Styles from '../utils/Styles';
import Playlists from '../components/Playlists';

class Home extends React.Component {
  render() {
    const { currentUser, playlists } = this.props;
    console.log(currentUser);
    if (currentUser) {
      return (
        <View style={Styles}>
          <Text>{`Hi ${currentUser.email}`}</Text>
          <Playlists />
        </View>
      );
    }
    return null;
  }
};

export default connect(state => ({ currentUser: state }))(Home);
