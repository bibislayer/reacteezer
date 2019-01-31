import React from 'react';
import { Text, View, Image, Button } from 'react-native';
import { SearchBar } from 'react-native-elements';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import Styles from '../utils/Styles';
import FlatList from '../components/FlatList';

class Search extends React.Component {
  state = {
    currentUser: firebase.auth(),
    search: '',
    resultSearch: []
  };

  updateSearch = search => {
    this.setState({ search });
    fetch(`http://api.deezer.com/search?q=track:"${search}"`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.data.length > 0) {
          this.setState({ resultSearch: res.data });
        }
      });
  };

  addTrack = item => {
    const db = firebase.firestore();
    const { navigation } = this.props;
    const playlistUid = navigation.getParam('uid');
    db.collection(`playlists/${playlistUid}/tracks`)
      .add({
        title: item.title,
        album: item.album,
        artist: item.artist
      })
      .then(() => {
        navigation.navigate('Playlists', {
          uid: playlistUid
        });
      })
      .catch(error => {
        console.error('Error writing document: ', error);
      });
  };

  render() {
    const { currentUser, search, resultSearch } = this.state;
    return (
      <View style={Styles.container}>
        <SearchBar placeholder="Type Here..." onChangeText={this.updateSearch} value={search} />
        <FlatList
          data={resultSearch}
          onLongPress={() => {}}
          onPress={item => this.addTrack(item)}
        />
      </View>
    );
  }
}

Search.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired
};

export default Search;
