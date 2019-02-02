import React from 'react';
import { Modal, Text, View, Image, Alert, Button, ActivityIndicator } from 'react-native';
import { Input } from 'react-native-elements';
import ActionButton from 'react-native-action-button';
import * as firebase from 'firebase';
import 'firebase/firestore';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FlatList from './FlatList';
import Styles from '../utils/Styles';

class Playlists extends React.Component {
  state = {
    playlists: [],
    isModalVisible: false,
    text: null,
    loaded: true
  };

  onLongPress(uid) {
    Alert.alert(
      'Suppression de la playlist',
      'Confirmer la suppression de la playlist',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: () => {
            this.removePlaylist(uid);
          }
        }
      ],
      { cancelable: false }
    );
  }

  submitPlaylist = () => {
    this.setState({ loaded: false });
    const db = firebase.firestore();
    const { currentUser, text, playlists } = this.state;
    const arrPlaylists = playlists;
    db.collection('playlists')
      .add({
        title: text,
        user: currentUser.currentUser.uid
      })
      .then(doc => {
        const item = {
          uid: doc.id,
          title: text
        };
        arrPlaylists.push(item);
        this.setState({ playlists: arrPlaylists, loaded: true });
        this.toggleModal();
        console.log('Document successfully written!');
      })
      .catch(error => {
        console.error('Error writing document: ', error);
      });
  };

  toggleModal = () => {
    const { isModalVisible } = this.state;
    this.setState({ isModalVisible: !isModalVisible });
  };

  removePlaylist(uid) {
    const { playlists } = this.state;
    const db = firebase.firestore();
    db.collection('playlists')
      .doc(uid)
      .delete()
      .then(() => {
        this.setState({
          playlists: playlists.filter(playlist => {
            return playlist.uid !== uid;
          })
        });
        console.log('Document successfully deleted!');
      })
      .catch(error => {
        console.error('Error removing document: ', error);
      });
  }

  render() {
    const { isModalVisible, loaded } = this.state;
    const { playlists, navigation, currentUser } = this.props;

    if (!loaded) {
      return (
        <View style={Styles.container}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
    if (currentUser && playlists) {
      return (
        <View style={Styles.container}>
          <FlatList
            data={playlists}
            onPress={item => {
              navigation.navigate('Playlists', {
                uid: item.uid
              });
            }}
            onLongPress={uid => this.onLongPress(uid)}
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
              <Input
                style={{ height: 40, marginBottom: 20 }}
                placeholder="Nom de votre playlist"
                onChangeText={text => this.setState({ text })}
              />
              <Button title="ok" onPress={this.submitPlaylist} />
            </View>
            <ActionButton buttonColor="red" buttonText="-" onPress={this.toggleModal} />
          </Modal>
          <ActionButton buttonColor="green" onPress={this.toggleModal} />
        </View>
      );
    }
    return (
      <View style={{ marginTop: 22, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Aucune playlist trouvé !</Text>
        <Text>Ajouter une nouvelle playlist</Text>
        <Input
          style={{ height: 40 }}
          placeholder="Nom de votre playlist"
          onChangeText={text => this.setState({ text })}
        />
        <Button title="ok" onPress={this.submitPlaylist} />
      </View>
    );
  }
}

Playlists.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired,
  //  currentUser: PropTypes.objectOf(PropTypes.object()).isRequired
};

export default connect(state => ({
  currentUser: state.user,
  playlists: state.playlists
}))(Playlists);
