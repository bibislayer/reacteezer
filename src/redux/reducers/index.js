import {
  LOGIN,
  LOGOUT,
  COLLECTION,
  ADD_PLAYLIST,
  REMOVE_PLAYLIST
} from '../../config/action-types';

const initialState = null;

function authReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return Object.assign({}, state, {
        user: action.payload
      });
    case LOGOUT:
      return null;
    case COLLECTION:
      return { ...state, playlists: action.payload };
    case REMOVE_PLAYLIST:
      const filteredPlaylists = state.playlists.filter(playlist => {
        return playlist.uid !== action.payload;
      });
      //console.log(filteredPlaylists);
      return {
        playlists: filteredPlaylists,
        user: state.user
      };
    case ADD_PLAYLIST:
      return {
        playlists: [...state.playlists, action.payload],
        user: state.user
      };
    default:
      return state;
  }
}

export default authReducer;
