import React from 'react';
import { View, Image, TouchableOpacity, Text, Button } from 'react-native';
import { Camera, Permissions } from 'expo';

const iconFile = require('../assets/4kito_no_typo.png');

class Drawer extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  signOutUser = async () => {
    try {
      await firebase.auth().signOut();
      navigate('Auth');
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const { type, hasCameraPermission } = this.state;
    const { navigation } = this.props;
    if (hasCameraPermission === null) {
      return <View />;
    }

    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'transparent',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 75
        }}
      >
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
            width: 100,
            height: 100,
            backgroundColor: '#fff',
            borderRadius: 100
          }}
          onPress={() => {
            navigation.navigate('Camera');
            this.setState({
              type:
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
            });
          }}
        >
          <Image
            source={iconFile}
            style={{
              width: 100,
              height: 100,
              borderRadius: 100
            }}
          />
        </TouchableOpacity>
        <Button title="Logout" onPress={() => this.signOutUser} />
      </View>
    );
  }
}

export default Drawer;
