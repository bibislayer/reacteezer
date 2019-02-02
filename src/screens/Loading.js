import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import Styles from '../utils/Styles';
import { logIn, collection } from '../redux/actions/index';

const mapDispatchToProps = dispatch => ({
  dispatchLogin: user => dispatch(logIn(user)),
  dispatchPlaylists: playlists => dispatch(collection(playlists))
});

class Loading extends React.Component {
  componentDidMount() {
    const { navigation } = this.props;
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        navigation.navigate('Login');
      }
      const { dispatchLogin } = this.props;
      const myuser = {
        email: user.email,
        uid: user.uid
      };
      dispatchLogin(myuser);
      this.getPlaylists(myuser);
    });
  }

  getPlaylists = currentUser => {
    const { dispatchPlaylists, navigation } = this.props;
    const arrPlaylists = [];
    const arrItems = [];
    const db = firebase.firestore();
    const playlists = db.collection('playlists');
    const query = playlists
      .where('user', '==', currentUser.uid)
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          return;
        }
        snapshot.forEach(doc => {
          //console.log(doc.data());
          db.collection(`playlists/${doc.id}/tracks`)
            .get()
            .then(subCollectionSnapshot => {
              subCollectionSnapshot.forEach(subDoc => {
                const item = {
                  uid: subDoc.id,
                  title: subDoc.data().title,
                  album: subDoc.data().album,
                  artist: {
                    name: subDoc.data().artist.name
                  }
                };
                arrItems.push(item);
              });
            });
          const item = {
            uid: doc.id,
            title: doc.data().title,
            tracks: arrItems
          };
          arrPlaylists.push(item);
        });
        dispatchPlaylists(arrPlaylists);
        navigation.navigate('Home');
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
  };

  render() {
    return (
      <View style={Styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}

Loading.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  }).isRequired,
  dispatchLogin: PropTypes.func.isRequired
};

export default connect(
  undefined,
  mapDispatchToProps
)(Loading);
