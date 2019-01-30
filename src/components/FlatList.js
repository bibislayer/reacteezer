import React from 'react';
import { Image, FlatList } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import PropTypes from 'prop-types';
import Styles from '../utils/Styles';

const iconFile = require('../assets/icon.png');

class FlatListDemo extends React.Component {
  state = {
    loading: true,
    data: [],
    page: 1,
    seed: 1,
    error: null,
    refreshing: false
  };

  navigationOptions = {
    drawerLabel: 'Home',
    drawerIcon: ({ tintColor }) => <Image source={iconFile} style={[Styles.icon, { tintColor }]} />
  };

  componentDidMount() {
    this.makeRemoteRequest();
  }

  makeRemoteRequest = () => {
    const { data, page, seed } = this.state;
    const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;
    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          data: page === 1 ? res.results : [...data, ...res.results],
          error: res.error || null,
          loading: false,
          refreshing: false
        });
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  };

  render() {
    const { data } = this.props;
    return (
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <ListItem
            style={{ width: '100%' }}
            roundAvatar
            title={item.title}
            subtitle={item.artist.name}
            avatar={{ uri: item.artist.picture_small }}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }
}

export default FlatListDemo;
