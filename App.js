import React from 'react';
import { Provider } from 'react-redux';
import * as firebase from 'firebase';
import { ThemeProvider } from 'react-native-elements';

import store from './src/redux/configureStore';
import Routes from './src/Routes';
import firebaseConfig from './src/config/firebase';

firebase.initializeApp(firebaseConfig);

const theme = {};

const App = () => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <Routes />
    </ThemeProvider>
  </Provider>
);

export default App;
