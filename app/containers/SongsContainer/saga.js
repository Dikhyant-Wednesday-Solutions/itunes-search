import { put, call, takeLatest } from 'redux-saga/effects';
import { getSongs } from '@services/songApi';
import { songsContainerCreators, songsContainerTypes } from './reducer';

const { REQUEST_GET_ITUNE_SONGS } = songsContainerTypes;
const { successGetItuneSongs, failureGetItuneSongs } = songsContainerCreators;

/**
 * A saga that handles fetching itnue songs based on a given song name.
 * On success, it dispatches a success action with the fetched data.
 * On failure, it dispatches a failure action with the error data.
 *
 * @param {Object} action - The action object containing the song name.
 * @yields {Effect} The effect of calling the API, and then either the success or failure action.
 */
export function* getItuneSongs(action) {
  const response = yield call(getSongs, action.songName);
  const { data, ok } = response;
  if (ok) {
    yield put(successGetItuneSongs(data));
  } else {
    yield put(failureGetItuneSongs(data));
  }
}

/**
 * registering events
 *
 * @export
 * @returns {{}}
 */
export default function* songsContainerSaga() {
  yield takeLatest(REQUEST_GET_ITUNE_SONGS, getItuneSongs);
}
