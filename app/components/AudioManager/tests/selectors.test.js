import { audioState, initialState } from "../reducer";
import { selectAudioManagerDomain, selectAudioState, selectSrc } from "../selectors";

describe('AudioManager selectors tests', () => {
    let mockedState;
    const audSt = audioState.PAUSED;
    const src = 'some-song-url';
    beforeEach(() => {
        mockedState = {
            audioManager: {
                src: src,
                audioState: audSt
            }
        }
    });

    it('should select src', () => {
        expect(selectSrc()(mockedState)).toBe(src);
    });

    it('should select audio state', () => {
        expect(selectAudioState()(mockedState)).toBe(audSt);
    });

    it('should select the global state', () => {
        const state = selectAudioManagerDomain(initialState);
        expect(state).toEqual(initialState);
    });
})