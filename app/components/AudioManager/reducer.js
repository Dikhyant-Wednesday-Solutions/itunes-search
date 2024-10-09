/*
 *
 * AudioManager reducer
 *
 */
import { produce } from 'immer';
import { useDispatch } from 'react-redux';
import { createActions } from 'reduxsauce';

export const { Types: audioManagerTypes, Creators: audioManagerCreators } = createActions({
  play: {},
  pause: {},
  playNew: ['src'],
  reset: {},
  end: {}
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
    const actionHandlers = {
      [audioManagerTypes.PLAY]: () => {
        draft.audioState = audioState.PLAYING;
      },
      [audioManagerTypes.PAUSE]: () => {
        draft.audioState = audioState.PAUSED;
      },
      [audioManagerTypes.PLAY_NEW]: () => {
        draft.audioState = audioState.PLAYING;
        draft.src = action.src;
      },
      [audioManagerTypes.RESET]: () => {
        draft.audioState = audioState.NO_SONG;
        draft.src = null;
      },
      [audioManagerTypes.END]: () => {
        draft.audioState = audioState.ENDED;
      }
    };

    const handler = actionHandlers[action.type];
    if (handler) {
      handler();
    }
  });

export default audioManagerReducer;

export const useAudioManagerDispatch = () => {
  const dispatch = useDispatch();
  return {
    dispatchAudioReset: () =>
      dispatch({
        type: audioManagerTypes.RESET
      }),
    dispatchEndAudio: () =>
      dispatch({
        type: audioManagerTypes.END
      })
  };
};
