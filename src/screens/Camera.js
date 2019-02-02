import React from 'react';
import {
  ActivityIndicator,
  Button,
  Clipboard,
  Image,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import PropTypes from 'prop-types';
import { ImagePicker, Permissions, FileSystem } from 'expo';
import firebase from 'firebase';

class Camera extends React.Component {
  state = {
    image: null,
    uploading: false
  };

  maybeRenderUploadingOverlay = () => {
    const { uploading } = this.state;

    if (uploading) {
      return (
        <View style={[StyleSheet.absoluteFill, styles.maybeRenderUploading]}>
          <ActivityIndicator color="#fff" size="large" />
        </View>
      );
    }
    return null;
  };

  maybeRenderImage = () => {
    const { image } = this.state;

    if (image) {
      return (
        <View style={styles.maybeRenderContainer}>
          <View style={styles.maybeRenderImageContainer}>
            <Image source={{ uri: image }} style={styles.maybeRenderImage} />
          </View>

          <Text
            onPress={this.copyToClipboard}
            onLongPress={this.share}
            style={styles.maybeRenderImageText}
          >
            {image}
          </Text>
        </View>
      );
    }
    return null;
  };

  share = () => {
    const { image } = this.state;
    Share.share({
      message: image,
      title: 'Check out this photo',
      url: image
    });
  };

  copyToClipboard = () => {
    const { image } = this.state;
    Clipboard.setString(image);
    alert('Copied image URL to clipboard');
  };

  takePhoto = async () => {
    const { status: cameraPerm } = await Permissions.askAsync(Permissions.CAMERA);

    const { status: cameraRollPerm } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    // only if user allows permission to camera AND camera roll
    if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
      const pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3]
      });

      this.handleImagePicked(pickerResult);
    }
  };

  pickImage = async () => {
    const { status: cameraRollPerm } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    // only if user allows permission to camera roll
    if (cameraRollPerm === 'granted') {
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3]
      });

      this.handleImagePicked(pickerResult);
    }
  };

  handleImagePicked = async pickerResult => {
    let uploadResult;
    let uploadResponse;
    try {
      this.setState({
        uploading: true
      });

      if (!pickerResult.cancelled) {
        //uploadImageAsync(pickerResult.uri);
        uploadResponse = await uploadImageAsync(pickerResult.uri);
        console.log(uploadResponse);
        // console.log(uploadResponse.json());
        // uploadResult = await uploadResponse.json();
        /*this.setState({
          image: uploadResult.location
        });*/
      }
    } catch (e) {
      console.log({ uploadResponse });
      console.log({ uploadResult });
      console.log({ e });
      alert('Upload failed, sorry :(');
    } finally {
      this.setState({
        uploading: false
      });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="default" />

        <Text style={styles.exampleText}>Example: Upload ImagePicker result</Text>

        <Button onPress={this.pickImage} title="Pick an image from camera roll" />

        <Button onPress={this.takePhoto} title="Take a photo" />

        {this.maybeRenderImage()}
        {this.maybeRenderUploadingOverlay()}
      </View>
    );
  }
}

async function uploadImageAsync(uri) {
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      resolve(xhr.response);
    };
    xhr.onerror = function(e) {
      console.log(e);
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });
  const user = firebase.auth().currentUser;
  const ref = firebase
    .storage()
    .ref(`${user.uid}/profilePicture/${uri.substring(uri.lastIndexOf('/') + 1)}`);
  const snapshot = await ref.put(blob);

  // We're done with the blob, close and release it
  blob.close();

  return await snapshot.ref.getDownloadURL();
}

/*async function uploadImageAsync(pickerResult) {
  const user = firebase.auth().currentUser;
  //  console.log(FileSystem.getInfoAsync(uri, {}));
  console.log('fetch');
  const response = await pickerResult.getDocumentAsync({
    copyToCacheDirectory: false,
    type:
  });
  const file = await FileSystem.readAsStringAsync(response.uri, {
    encoding: FileSystem.EncodingTypes.Base64
  });

  const storageRef = firebase
    .storage()
    .ref(`${user}/profilePicture/${uri.substring(uri.lastIndexOf('/') + 1)}`)
    .putString(pickerResult.base64, 'base64')
    .then(snapshot => {
      console.log('Uploaded a blob or file!');
    });
}*/
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  exampleText: {
    fontSize: 20,
    marginBottom: 20,
    marginHorizontal: 15,
    textAlign: 'center'
  },
  maybeRenderUploading: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center'
  },
  maybeRenderContainer: {
    borderRadius: 3,
    elevation: 2,
    marginTop: 30,
    shadowColor: 'rgba(0,0,0,1)',
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 4,
      width: 4
    },
    shadowRadius: 5,
    width: 250
  },
  maybeRenderImageContainer: {
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    overflow: 'hidden'
  },
  maybeRenderImage: {
    height: 250,
    width: 250
  },
  maybeRenderImageText: {
    paddingHorizontal: 10,
    paddingVertical: 10
  }
});

Camera.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired
};

export default Camera;
