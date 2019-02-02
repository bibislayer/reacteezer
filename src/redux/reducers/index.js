import { LOGIN, LOGOUT, COLLECTION, ADD_PLAYLIST } from '../../config/action-types';

const initialState = null;

function authReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return Object.assign({}, state, {
        user: action.payload
      });
      return { ...state, ...action.payload };
    case LOGOUT:
      return null;
    case COLLECTION:
      console.log('dispatch');
      console.log(state);
      console.log({ ...state, playlists: action.payload });
      return { ...state, playlists: action.payload };
      return Object.assign({}, state, {
        playlists: action.payload
      });
    case ADD_PLAYLIST:
      console.log('dispatch');
      console.log(state);
      console.log({ ...state.playlists, ...action.payload });
      return { ...state.playlists, ...action.payload };
    default:
      return state;
  }
}

export default authReducer;
