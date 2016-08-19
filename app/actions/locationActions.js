import { polyfill } from 'es6-promise';
import * as types from '../types';

polyfill();

export const setUserLocation = (coords) => ({
  coords,
  type: types.GET_USER_LOCATION,
});

const toggleLoading = () => ({
  type: types.TOGGLE_LOADING,
});

export const toggleAlert = () => ({
  type: types.TOGGLE_ALERT,
});

export const getUserLocation = () =>
  dispatch => {
    dispatch(toggleLoading());
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(res => {
        if (res === undefined) {
          navigator.geolocation.getCurrentPosition(() => {
            dispatch(setUserLocation(res.coords));
            dispatch(toggleAlert());
          });
        } else {
          dispatch(setUserLocation(res.coords));
          dispatch(toggleAlert());
        }
      });
    }
  };

export default {
  getUserLocation,
};
