/**
 * Test homeContainer sagas
 */

/* eslint-disable redux-saga/yield-effects */
import { takeLatest, call, put } from 'redux-saga/effects';
import { apiResponseGenerator } from '@utils/testUtils';
import { getItuneSongById } from '../saga';
import { individualSongPageTypes } from '../reducer';
import { getSongById } from '@app/services/songApi';
import songData from './song.data.json';
import individualSongPageSaga from '../saga';

describe('SongsContainer saga tests', () => {
  const generator = individualSongPageSaga();
  const songId = '1440833081';
  let getItuneSongsGenerator = getItuneSongById({ songId: songId });

  it('should start task to watch for REQUEST_GET_ITUNE_SONG action', () => {
    expect(generator.next().value).toEqual(takeLatest(individualSongPageTypes.REQUEST_GET_ITUNE_SONG, getItuneSongById));
  });

  it('should ensure that the action FAILURE_GET_ITUNE_SONG is dispatched when the api call fails', () => {
    const res = getItuneSongsGenerator.next().value;
    expect(res).toEqual(call(getSongById, songId));
    const errorResponse = {
      errorMessage: 'There was an error while fetching repo informations.'
    };
    expect(getItuneSongsGenerator.next(apiResponseGenerator(false, errorResponse)).value).toEqual(
      put({
        type: individualSongPageTypes.FAILURE_GET_ITUNE_SONG,
        error: errorResponse
      })
    );
  });

  it('should ensure that the action SUCCESS_GET_ITUNE_SONG is dispatched when the api call succeeds', () => {
    getItuneSongsGenerator = getItuneSongById({ songId: songId });
    const res = getItuneSongsGenerator.next().value;
    expect(res).toEqual(call(getSongById, songId));
    const reposResponse = songData;
    expect(getItuneSongsGenerator.next(apiResponseGenerator(true, reposResponse)).value).toEqual(
      put({
        type: individualSongPageTypes.SUCCESS_GET_ITUNE_SONG,
        data: reposResponse
      })
    );
  });
});
