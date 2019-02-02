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
import { collection } from '../redux/actions/index';

const mapDispatchToProps = dispatch => ({
  dispatchPlaylists: playlist => dispatch(collection(playlist))
});
class Playlists extends React.Component {
  state = {
    isModalVisible: false,
    text: null,
    statePlaylists: []
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

  componentWillReceiveProps(nextProps) {
    console.log('update rendering');
    if (nextProps.playlists !== this.props.playlists) {
      this.setState({
        statePlaylists: nextProps.playlists
      });
    }
  }

  componentDidMount() {
    this.setState({
      statePlaylists: this.props.playlists
    });
  }

  componentDidUpdate(props) {
    //console.log(props.playlists);
    //console.log(this.props.playlists);
    console.log('update rendering');
    console.log(props.playlists);
    if (props.playlists !== this.props.playlists) {
      console.log('update rendering');
      this.setState({
        statePlaylists: props.playlists
      });
    }
  }

  submitPlaylist = () => {
    const db = firebase.firestore();
    const { dispatchPlaylists, currentUser, playlists } = this.props;
    const { text } = this.state;
    const arrPlaylists = playlists;
    db.collection('playlists')
      .add({
        title: text,
        user: currentUser.uid
      })
      .then(doc => {
        const item = {
          uid: doc.id,
          title: text
        };

        arrPlaylists.push(item);
        dispatchPlaylists(arrPlaylists);
        //this.toggleModal();
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
    const { playlists, dispatchPlaylists } = this.props;
    const db = firebase.firestore();
    db.collection('playlists')
      .doc(uid)
      .delete()
      .then(() => {
        dispatchPlaylists(
          playlists.filter(playlist => {
            return playlist.uid !== uid;
          })
        );
        console.log('Document successfully deleted!');
      })
      .catch(error => {
        console.error('Error removing document: ', error);
      });
  }

  render() {
    const { isModalVisible, statePlaylists } = this.state;
    const { navigation } = this.props;
    console.log(statePlaylists);
    console.log('render');
    if (statePlaylists) {
      return (
        <View style={Styles.container}>
          <FlatList
            data={statePlaylists}
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
  playlists: PropTypes.instanceOf(Array).isRequired
};

const mapStateToProps = state => ({
  currentUser: state.user,
  playlists: state.playlists
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Playlists);
