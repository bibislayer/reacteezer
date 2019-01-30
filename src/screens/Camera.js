import React from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { Camera, Permissions } from 'expo';
import Styles from '../utils/Styles';

const iconFile = require('../assets/icon.png');

class CameraExample extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back
  };

  navigationOptions = {
    drawerLabel: 'Home',
    drawerIcon: ({ tintColor }) => <Image source={iconFile} style={[Styles.icon, { tintColor }]} />
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  render() {
    const { navigation } = this.props;
    const { type, hasCameraPermission } = this.state;

    if (hasCameraPermission === null) {
      return <View />;
    }

    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }

    return (
      <View style={{ flex: 1 }}>
        <Camera style={{ flex: 1 }} type={type}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              flexDirection: 'row'
            }}
          >
            <TouchableOpacity
              style={{
                flex: 0.1,
                alignSelf: 'flex-end',
                alignItems: 'center'
              }}
              onPress={() => {
                this.setState({
                  type:
                    type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                });
              }}
            >
              <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Flip </Text>
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    );
  }
}
