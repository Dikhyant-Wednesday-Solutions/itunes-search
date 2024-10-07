/*
 *
 * AudioManager reducer
 *
 */
import { produce } from 'immer';
import { createActions } from 'reduxsauce';

export const { Types: audioManagerTypes, Creators: audioManagerCreators } = createActions({
  play: {},
  pause: {},
  playNew: ['src'],
  reset: {}
});

export const audioState = {
  PAUSED: 'PAUSED',
  PLAYING: 'PLAYING',
  ENDED: 'ENDED',
  NO_SONG: 'NO_SONG'
};

export const initialState = { src: null, audioState: audioState.NO_SONG };

export const audioManagerReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case audioManagerTypes.PLAY:
        draft.audioState = audioState.PLAYING;
        break;
      case audioManagerTypes.PAUSE:
        draft.audioState = audioState.PAUSED;
        break;
      case audioManagerTypes.PLAY_NEW:
        draft.audioState = audioState.PLAYING;
        draft.src = action.src;
        break;
      case audioManagerTypes.RESET:
        draft.audioState = audioState.NO_SONG;
        draft.src = null;
        break;
      default:
    }
  });

export default audioManagerReducer;
