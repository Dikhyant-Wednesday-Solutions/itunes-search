import { createSelector } from 'reselect';
import get from 'lodash/get';
import { initialState } from './reducer';
import { useSelector } from 'react-redux';

/**
 * Direct selector to the audioManager state domain
 */

export const selectAudioManagerDomain = (state) => state.audioManager || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by AudioManager
 */

export const selectSrc = () => createSelector(selectAudioManagerDomain, (substate) => get(substate, 'src'));

export const selectAudioState = () =>
  createSelector(selectAudioManagerDomain, (substate) => get(substate, 'audioState'));

export const useAudioManagerSelector = () => useSelector((state) => state.audioManager);
