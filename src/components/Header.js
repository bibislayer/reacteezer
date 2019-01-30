import React from 'react';
import { View, Button } from 'react-native';
import PropTypes from 'prop-types';

const CustomHeader = ({ navigation }) => (
  <View
    style={{
      height: 80,
      marginTop: 25
    }}
  >
    <Button onPress={() => navigation.toggleDrawer()} title="Go back home" />
  </View>
);

CustomHeader.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired
};

export default CustomHeader;
