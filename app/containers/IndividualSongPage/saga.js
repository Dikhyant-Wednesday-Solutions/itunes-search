import { put, call, takeLatest } from 'redux-saga/effects';
import { individualSongPageCreators, individualSongPageTypes } from './reducer';
import { getSongById } from '@services/songApi';

const { REQUEST_GET_ITUNE_SONG } = individualSongPageTypes;
const { successGetItuneSong, failureGetItuneSong } = individualSongPageCreators;

/**
 * A saga that handles fetching GitHub repositories based on a given repository name.
 * On success, it dispatches a success action with the fetched data.
 * On failure, it dispatches a failure action with the error data.
 *
 * @date 01/03/2024 - 14:47:28
 *
 * @param {Object} action - The action object containing the repository name.
 * @yields {Effect} The effect of calling the API, and then either the success or failure action.
 */
export function* getItuneSongById(action) {
  const response = yield call(getSongById, action.songId);
  const { data, ok } = response;
  if (ok) {
    yield put(successGetItuneSong(data));
  } else {
    yield put(failureGetItuneSong(data));
  }
}

/**
 * registering events
 * @date 04/03/2024 - 12:57:49
 *
 * @export
 * @returns {{}}
 */
export default function* individualSongPageSaga() {
  yield takeLatest(REQUEST_GET_ITUNE_SONG, getItuneSongById);
}
