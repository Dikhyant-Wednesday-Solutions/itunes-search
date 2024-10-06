/**
 * Test homeContainer sagas
 */

/* eslint-disable redux-saga/yield-effects */
import { takeLatest, call, put } from 'redux-saga/effects';
import { apiResponseGenerator } from '@utils/testUtils';
import songsContainerSaga, { getItuneSongs } from '../saga';
import { homeContainerTypes, songsContainerTypes } from '../reducer';
import { getSongs } from '@app/services/songApi';
import songData from './song.data.json';

describe('SongsContainer saga tests', () => {
  const generator = songsContainerSaga();
  const songName = 'Thunder struck';
  let getItuneSongsGenerator = getItuneSongs({ songName: songName });

  it('should start task to watch for REQUEST_GET_ITUNE_SONGS action', () => {
    expect(generator.next().value).toEqual(takeLatest(songsContainerTypes.REQUEST_GET_ITUNE_SONGS, getItuneSongs));
  });

  it('should ensure that the action FAILURE_GET_ITUNE_SONGS is dispatched when the api call fails', () => {
    const res = getItuneSongsGenerator.next().value;
    expect(res).toEqual(call(getSongs, songName));
    const errorResponse = {
      errorMessage: 'There was an error while fetching repo informations.'
    };
    expect(getItuneSongsGenerator.next(apiResponseGenerator(false, errorResponse)).value).toEqual(
      put({
        type: songsContainerTypes.FAILURE_GET_ITUNE_SONGS,
        error: errorResponse
      })
    );
  });

  it('should ensure that the action SUCCESS_GET_ITUNE_SONGS is dispatched when the api call succeeds', () => {
    getItuneSongsGenerator = getItuneSongs({ songName: songName });
    const res = getItuneSongsGenerator.next().value;
    expect(res).toEqual(call(getSongs, songName));
    const reposResponse = songData;
    expect(getItuneSongsGenerator.next(apiResponseGenerator(true, reposResponse)).value).toEqual(
      put({
        type: songsContainerTypes.SUCCESS_GET_ITUNE_SONGS,
        data: reposResponse
      })
    );
  });
});
