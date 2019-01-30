import { createDrawerNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import Loading from './screens/Loading';
import SignUp from './screens/SignUp';
import Login from './screens/Login';
import Home from './screens/Home';
import Search from './screens/Search';
import Profile from './screens/Profile';
import Drawer from './components/Drawer';

const AuthNavigator = createStackNavigator(
  {
    Loading,
    Login,
    SignUp,
    Home,
    Profile,
    Search
  },
  {
    initialRoute: 'Loading',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#f4511e'
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold'
      }
    }
  }
);

const AppNavigator = createDrawerNavigator(
  {
    Home: AuthNavigator
  },
  {
    contentComponent: Drawer
  }
);

export default createAppContainer(AppNavigator);
