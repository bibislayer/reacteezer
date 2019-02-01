import React from 'react';
import { View, Alert, ActivityIndicator, Text } from 'react-native';
import ActionButton from 'react-native-action-button';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';
import 'firebase/firestore';
import Styles from '../utils/Styles';
import FlatList from '../components/FlatList';

class Playlists extends React.Component {
  state = {
    tracks: [],
    loaded: false
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate() {
    this.fetchData();
  }

  onLongPress(uid) {
    Alert.alert(
      'Suppression de la track',
      'Confirmer la suppression de la track',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: () => {
            this.removeTrack(uid);
          }
        }
      ],
      { cancelable: false }
    );
  }

  fetchData() {
    const { navigation } = this.props;
    const uid = navigation.getParam('uid');
    const arrTracks = [];
    const db = firebase.firestore();
    const tracks = db.collection(`playlists/${uid}/tracks`);
    const query = tracks
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          this.setState({ loaded: true });
          return;
        }

        snapshot.forEach(doc => {
          const item = {
            uid: doc.id,
            title: doc.data().title,
            album: doc.data().album,
            artist: {
              name: doc.data().artist.name
            }
          };
          arrTracks.push(item);
        });
        this.setState({ tracks: arrTracks, loaded: true });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
  }

  removeTrack(uid) {
    const { tracks } = this.state;
    const { navigation } = this.props;
    const playlistUid = navigation.getParam('uid');
    const db = firebase.firestore();
    db.collection(`playlists/${playlistUid}/tracks/`)
      .doc(uid)
      .delete()
      .then(() => {
        this.setState({
          tracks: tracks.filter(track => {
            return track.uid !== uid;
          })
        });
        console.log('Document successfully deleted!');
      })
      .catch(error => {
        console.error('Error removing document: ', error);
      });
  }

  render() {
    const { loaded, tracks } = this.state;
    const { navigation } = this.props;
    const playlistUid = navigation.getParam('uid');
    if (!loaded) {
      return (
        <View style={Styles.container}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
    if (tracks.length > 0) {
      return (
        <View style={Styles.container}>
          <FlatList data={tracks} onPress={() => {}} onLongPress={uid => this.onLongPress(uid)} />
          <ActionButton
            buttonColor="rgba(231,76,60,1)"
            onPress={() => {
              navigation.navigate('Search', {
                uid: playlistUid
              });
            }}
          />
        </View>
      );
    }
    return (
      <View style={Styles.container}>
        <Text style={{ marginTop: 22, alignItems: 'center' }}>Aucun morceau trouvé !</Text>
        <ActionButton
          buttonColor="rgba(231,76,60,1)"
          onPress={() => {
            navigation.navigate('Search', {
              uid: playlistUid
            });
          }}
        />
      </View>
    );
  }
}

Playlists.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired
};

export default Playlists;
