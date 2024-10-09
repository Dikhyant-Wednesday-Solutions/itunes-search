/*
 *
 * IndividualSongPage reducer
 *
 */
import { produce } from 'immer';
import { createActions } from 'reduxsauce';
import get from 'lodash/get';

export const { Types: individualSongPageTypes, Creators: individualSongPageCreators } = createActions({
  requestGetItuneSong: ['songId'],
  successGetItuneSong: ['data'],
  failureGetItuneSong: ['error'],
  clearItuneSong: {}
});
export const initialState = { songId: null, songData: {}, songError: null, loading: null };

export const individualSongPageReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case individualSongPageTypes.REQUEST_GET_ITUNE_SONG:
        draft.songId = action.songId;
        draft.loading = true;
        break;
      case individualSongPageTypes.CLEAR_ITUNE_SONG:
        draft.songId = null;
        draft.songError = null;
        draft.songData = {};
        draft.loading = null;
        break;
      case individualSongPageTypes.SUCCESS_GET_ITUNE_SONG:
        draft.songData = action.data;
        draft.songError = null;
        draft.loading = false;
        break;
      case individualSongPageTypes.FAILURE_GET_ITUNE_SONG:
        draft.songError = get(action.error, 'message', 'something_went_wrong');
        draft.songData = null;
        draft.loading = false;
        break;
    }
  });

export default individualSongPageReducer;
