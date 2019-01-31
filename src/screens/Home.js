import React from 'react';
import { Modal, Text, View, Image, Alert, TextInput, Button } from 'react-native';
import ActionButton from 'react-native-action-button';
import * as firebase from 'firebase';
import 'firebase/firestore';
import PropTypes from 'prop-types';
import Styles from '../utils/Styles';
import FlatList from '../components/FlatList';

const iconFile = require('../assets/icon.png');

class Home extends React.Component {
  state = {
    currentUser: firebase.auth(),
    playlists: [],
    isModalVisible: false,
    text: null
  };

  navigationOptions = {
    drawerLabel: 'Home',
    drawerIcon: ({ tintColor }) => <Image source={iconFile} style={[Styles.icon, { tintColor }]} />
  };

  componentDidMount() {
    const arrPlaylists = [];
    const db = firebase.firestore();
    const playlists = db.collection('playlists');
    const { currentUser } = this.state;
    if (currentUser.currentUser) {
      const query = playlists
        .where('user', '==', currentUser.currentUser.uid)
        .get()
        .then(snapshot => {
          if (snapshot.empty) {
            return;
          }
          snapshot.forEach(doc => {
            const item = {
              uid: doc.id,
              title: doc.data().title
            };
            arrPlaylists.push(item);
          });
          this.setState({ playlists: arrPlaylists });
        })
        .catch(err => {
          console.log('Error getting documents', err);
        });
    }
  }

  submitPlaylist = () => {
    const db = firebase.database();
    const playlists = db.ref('playlists/');
    const { currentUser, text } = this.state;
    playlists
      .push({
        title: text,
        user: currentUser.currentUser.uid
      })
      .then(data => {
        //success callback
        console.log('data ', data);
      })
      .catch(error => {
        //error callback
        console.log('error ', error);
      });
  };

  toggleModal = () => {
    const { isModalVisible } = this.state;
    this.setState({ isModalVisible: !isModalVisible });
  };

  render() {
    const { currentUser, playlists, isModalVisible } = this.state;
    const { navigation } = this.props;
    if (currentUser) {
      return (
        <View style={Styles.container}>
          <FlatList
            data={playlists}
            onPress={uid => {
              navigation.navigate('Playlists', {
                uid
              });
            }}
          />
          <Modal
            animationType="slide"
            transparent={false}
            visible={isModalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}
          >
            <View style={{ marginTop: 22, justifyContent: 'center', alignItems: 'center' }}>
              <Text>Ajouter une nouvelle playlist</Text>
              <TextInput
                style={{ height: 40 }}
                placeholder="Nom de votre playlist"
                onChangeText={text => this.setState({ text })}
              />
              <Button title="Login" onPress={this.submitPlaylist} />
            </View>
            <ActionButton
              buttonColor="rgba(231,76,60,1)"
              buttonText="-"
              onPress={this.toggleModal}
            />
          </Modal>
          <ActionButton buttonColor="rgba(231,76,60,1)" onPress={this.toggleModal} />
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
