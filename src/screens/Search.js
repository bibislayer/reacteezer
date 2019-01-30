import React from 'react';
import { Text, View, Image, Button } from 'react-native';
import { SearchBar } from 'react-native-elements';
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

  render() {
    const { currentUser, search, resultSearch } = this.state;

    if (currentUser) {
      return (
        <View style={Styles.container}>
          <SearchBar placeholder="Type Here..." onChangeText={this.updateSearch} value={search} />
          <FlatList data={resultSearch} />
        </View>
      );
    }
    return null;
  }
}

export default Search;
