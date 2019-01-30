import React from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import Styles from '../utils/Styles';
import { logIn } from '../redux/actions/index';

const mapDispatchToProps = dispatch => ({
  dispatchLogin: isLogged => dispatch(logIn({ isLogged }))
});

class Loading extends React.Component {
  componentDidMount() {
    const { navigation } = this.props;
    firebase.auth().onAuthStateChanged(user => {
      const { dispatchLogin } = this.props;
      dispatchLogin(true);
      navigation.navigate(user ? 'Home' : 'Login');
    });
    if (firebase.auth().currentUser) {
      navigation.navigate('Home');
    }
  }

  render() {
    return (
      <View style={Styles.container}>
        <Text>Loading</Text>
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