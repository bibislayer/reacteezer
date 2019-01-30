import React from 'react';
import { Text, View, Image, Button } from 'react-native';
import * as firebase from 'firebase';
import PropTypes from 'prop-types';
import Styles from '../utils/Styles';

const iconFile = require('../assets/icon.png');

class Profile extends React.Component {
  state = { currentUser: null };

  navigationOptions = {
    drawerLabel: 'Home',
    drawerIcon: ({ tintColor }) => <Image source={iconFile} style={[Styles.icon, { tintColor }]} />
  };

  componentDidMount() {
    const { currentUser } = firebase.auth();
    this.setState({ currentUser });
  }

  render() {
    const { navigation } = this.props;
    const { currentUser } = this.state;

    if (currentUser) {
      return (
        <View style={Styles.container}>
          <Button onPress={() => navigation.toggleDrawer()} title="Go back home" />
          <Text>{`Hi PROFILE ${currentUser.email}`}</Text>
        </View>
      );
    }
    return null;
  }
}

Profile.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired
};

export default Profile;
