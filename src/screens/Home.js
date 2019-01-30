import React from 'react';
import { Text, View, Image, Button } from 'react-native';
import * as firebase from 'firebase';
import PropTypes from 'prop-types';
import Styles from '../utils/Styles';
import FlatList from '../components/FlatList';

const iconFile = require('../assets/icon.png');

class Home extends React.Component {
  state = { currentUser: null };

  navigationOptions = {
    drawerLabel: 'Home',
    drawerIcon: ({ tintColor }) => <Image source={iconFile} style={[Styles.icon, { tintColor }]} />
  };

  componentDidMount() {
    const { currentUser } = firebase.auth();
    this.setState({ currentUser });
    fetch('http://api.deezer.com/search?q=eminem', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log(response);
    });
  }

  render() {
    const { navigation } = this.props;
    const { currentUser } = this.state;

    if (currentUser) {
      return (
        <View style={Styles.container}>
          <FlatList navigation={navigation} />
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
