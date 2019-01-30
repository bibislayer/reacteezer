import React from 'react';
import { Text, View, Image, Button } from 'react-native';
import * as firebase from 'firebase';
import 'firebase/firestore';
import PropTypes from 'prop-types';
import Styles from '../utils/Styles';
import FlatList from '../components/FlatList';
const iconFile = require('../assets/icon.png');

class Home extends React.Component {
  state = { currentUser: firebase.auth() };

  navigationOptions = {
    drawerLabel: 'Home',
    drawerIcon: ({ tintColor }) => <Image source={iconFile} style={[Styles.icon, { tintColor }]} />
  };

  componentDidMount() {
    const db = firebase.firestore();
    const playlists = db.collection('playlists');
    const query = playlists
      .where('user', '==', '13LoI5cAotWHalxuIcyxLOXGBpt1')
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log('No matching documents.');
          return;
        }

        snapshot.forEach(doc => {
          console.log(doc.id, '=>', doc.data());
        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
  }

  render() {
    const { navigation } = this.props;
    const { currentUser } = this.state;

    if (currentUser) {
      return (
        <View style={Styles.container}>
          <FlatList navigation={navigation} />
          <Button onPress={() => navigation.navigate('Search')} title="Ajouter un titre" />
        </View>
      );
    }
    return null;
  }
}

Home.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired
};

export default Home;
