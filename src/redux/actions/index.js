import {
  LOGIN,
  LOGOUT,
  COLLECTION,
  ADD_PLAYLIST,
  REMOVE_PLAYLIST
} from '../../config/action-types';

export const logIn = user => ({ type: LOGIN, payload: user });

export const collection = playlists => ({ type: COLLECTION, payload: playlists });

export const addPlaylist = playlist => ({ type: ADD_PLAYLIST, payload: playlist });

export const removePlaylist = playlist => ({ type: REMOVE_PLAYLIST, payload: playlist });

export const logOut = () => ({ type: LOGOUT });
