import { useDispatch } from 'react-redux';
import { renderHook } from '@testing-library/react-hooks';
import audioManagerReducer, { audioManagerTypes, audioState, initialState, useAudioManagerDispatch } from "../reducer";

jest.mock('react-redux', () => ({
    useDispatch: jest.fn()
}));

describe('Audio Manager reducer test suite', () => {
    let state;
    beforeEach(() => {
        state = initialState;
    })
    it('should return the initial state', () => {
        expect(audioManagerReducer(undefined, {})).toEqual(state);
    });

    it('should return the state with audioState PLAYING when PLAY action is dispatched', () => {
        const src = 'some-song-url';
        state = {
            src: src,
        }
        const expectedResult = { ...state, audioState: audioState.PLAYING }
        expect(
            audioManagerReducer(state, {
                type: audioManagerTypes.PLAY
            })
        ).toEqual(expectedResult);
    });

    it('should return the state with audioState PAUSED when PAUSE action is dispatched', () => {
        const src = 'some-song-url';
        state = {
            src: src,
        }
        const expectedResult = { ...state, audioState: audioState.PAUSED }
        expect(
            audioManagerReducer(state, {
                type: audioManagerTypes.PAUSE
            })
        ).toEqual(expectedResult);
    });

    it('should return the state with audioState PLAYING with a new audio src when PLAY_NEW action is dispatched', () => {
        const src = 'some-song-url';
        const newAudioSrc = 'new-audio-src';
        state = {
            src: src,
        }
        const expectedResult = { src: newAudioSrc, audioState: audioState.PLAYING }
        expect(
            audioManagerReducer(state, {
                type: audioManagerTypes.PLAY_NEW,
                src: newAudioSrc
            })
        ).toEqual(expectedResult);
    });

    it('should return state with no audio src and audioState NO_SONG when RESET action is dispatched', () => {
        state = {
            src: 'some-song-url',
            audioState: audioState.PLAYING,
        }
        const expectedResult = { src: null, audioState: audioState.NO_SONG }
        expect(
            audioManagerReducer(state, {
                type: audioManagerTypes.RESET,
            })
        ).toEqual(expectedResult);
    });

    it('should return state with an audio src and audioState ENDED when END action is dispatched', () => {
        state = {
            src: 'some-song-url',
        }
        const expectedResult = { ...state, audioState: audioState.ENDED }
        expect(
            audioManagerReducer(state, {
                type: audioManagerTypes.END,
            })
        ).toEqual(expectedResult);
    });

    it('should dispatch RESET action when dispatchAudioReset is called', () => {
        const dispatchMock = jest.fn();
        useDispatch.mockReturnValue(dispatchMock);
        const { result } = renderHook(() => useAudioManagerDispatch());

        result.current.dispatchAudioReset();

        expect(dispatchMock).toHaveBeenCalledWith({
            type: audioManagerTypes.RESET
        });
    });

    it('should dispatch END action when dispatchEndAudio is called', () => {
        const dispatchMock = jest.fn();
        useDispatch.mockReturnValue(dispatchMock);
        const { result } = renderHook(() => useAudioManagerDispatch());

        result.current.dispatchEndAudio();

        expect(dispatchMock).toHaveBeenCalledWith({
            type: audioManagerTypes.END
        });
    });
})