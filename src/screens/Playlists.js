import React from 'react';
import { Text, View, Image, Button } from 'react-native';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';
import 'firebase/firestore';
import Styles from '../utils/Styles';
import FlatList from '../components/FlatList';

class Playlists extends React.Component {
  state = {
    currentUser: firebase.auth(),
    tracks: []
  };

  componentDidMount() {
    const { navigation } = this.props;
    const uid = navigation.getParam('uid');
    const arrTracks = [];
    const db = firebase.firestore();
    const tracks = db.collection(`playlists/${uid}/tracks`);
    const query = tracks
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          return;
        }

        snapshot.forEach(doc => {
          const item = {
            title: doc.data().title,
            artist: {
              name: doc.data().artist
            }
          };
          arrTracks.push(item);
        });
        this.setState({ tracks: arrTracks });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
  }

  render() {
    const { currentUser, search, tracks } = this.state;

    if (currentUser) {
      return (
        <View style={Styles.container}>
          <FlatList data={tracks} onPress={() => {}} />
        </View>
      );
    }
    return null;
  }
}

Playlists.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired
};

export default Playlists;
