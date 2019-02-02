import React from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';
import { Input } from 'react-native-elements';
import * as firebase from 'firebase';
import PropTypes from 'prop-types';
import Styles from '../utils/Styles';
import t from 'tcomb-form-native';

const Form = t.form.Form;

const User = t.struct({
  email: t.String,
  password: t.String
});

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: '#ffffff'
  }
});

class Login extends React.Component {
  state = { email: '', password: '', errorMessage: '' };

  handleLogin = () => {
    const { email, password } = this.state;

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(error => this.setState({ errorMessage: error.message }));
  };

  render() {
    const { navigation } = this.props;
    const { email, password, errorMessage } = this.state;

    return (
      <View style={styles.container}>
        <Text>Login</Text>
        <Form type={User} />
        {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}
        <Input
          style={Styles.textInput}
          autoCapitalize="none"
          placeholder="Email"
          onChangeText={text => this.setState({ email: text })}
          value={email}
        />
        <Input
          secureTextEntry
          style={Styles.textInput}
          autoCapitalize="none"
          placeholder="Password"
          onChangeText={text => this.setState({ password: text })}
          value={password}
        />
        <Button title="Login" onPress={this.handleLogin} />
        <Button
          title="Don't have an account? Sign Up"
          onPress={() => navigation.navigate('SignUp')}
        />
      </View>
    );
  }
}

Login.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired
};

export default Login;
