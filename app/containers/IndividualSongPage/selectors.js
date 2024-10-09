import { createSelector } from 'reselect';
import get from 'lodash/get';
import { initialState } from './reducer';

/**
 * Direct selector to the IndividualSongPage state domain
 */

export const selectIndividualSongPageDomain = (state) => state.individualSongPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by IndividualSongPage
 */

export const selectSongData = () =>
  createSelector(selectIndividualSongPageDomain, (substate) => get(substate, 'songData'));

export const selectLoading = () =>
  createSelector(selectIndividualSongPageDomain, (substate) => get(substate, 'loading'));

export const selectSongError = () =>
  createSelector(selectIndividualSongPageDomain, (substate) => get(substate, 'songError'));

export const selectSongId = () => createSelector(selectIndividualSongPageDomain, (substate) => get(substate, 'songId'));
