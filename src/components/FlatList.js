import React from 'react';
import PropTypes from 'prop-types';
import { FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';

class MyFlatList extends React.PureComponent {
  render() {
    const { data, onPress } = this.props;
    return (
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <ListItem
            style={{ width: '100%' }}
            roundAvatar
            title={item.title}
            subtitle={item.artist && item.artist.name}
            onPress={() => onPress(item.uid)}
            avatar={{
              source: item.artist && { uri: item.artist.picture_small },
              title: item.title
            }}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }
}

MyFlatList.propTypes = {
  data: PropTypes.instanceOf(Array).isRequired,
  onPress: PropTypes.func.isRequired
};

export default MyFlatList;
