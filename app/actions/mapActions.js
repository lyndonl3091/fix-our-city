import { polyfill } from 'es6-promise';
import * as types from '../types';
import { findIssues } from '../api';

polyfill();

const updateMapData = (newMapInfo) => ({
  newMapInfo,
  type: types.UPDATE_MAP_DATA,
});

const updateIssues = (issues) => ({
  issues,
  type: types.UPDATE_ISSUES,
});

const issuesLoading = () => ({
  type: types.ISSUES_LOADING,
});

export const mapBoundsChanged = (newMapInfo) =>
  dispatch => {
    console.log(newMapInfo.center);
    if (newMapInfo.center.lng > -178 && newMapInfo.center.lng < -2) {
      dispatch(issuesLoading());
      findIssues(newMapInfo.center, newMapInfo.bounds.nw)
      .then(response => {
        newMapInfo.radius = response.data.radius; // eslint-disable-line no-param-reassign
        dispatch(updateMapData(newMapInfo));
        dispatch(updateIssues(response.data.issues));
      });
    } else {
      dispatch(updateMapData(newMapInfo));
    }
  };
