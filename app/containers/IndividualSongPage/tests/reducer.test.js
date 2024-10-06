import songsContainerReducer, { individualSongPageReducer, individualSongPageTypes, initialState, songsContainerTypes } from "../reducer";
import songData from './song.data.json';

/* eslint-disable default-case, no-param-reassign */
describe('SongsContainer reducer tests', () => {
    let state;
    beforeEach(() => {
        state = initialState;
    });

    it('should return the initial state', () => {
        expect(individualSongPageReducer(undefined, {})).toEqual(state);
    });

    it('should ensure that the user data is present and loading = false when SUCCESS_GET_ITUNE_SONG is dispatched', () => {
        const data = songData;
        const expectedResult = { ...state, songData: data, loading: false };
        expect(
          individualSongPageReducer(state, {
            type: individualSongPageTypes.SUCCESS_GET_ITUNE_SONG,
            data
          })
        ).toEqual(expectedResult);
    });

    it('should ensure that the userErrorMessage has some data and loading = false when FAILURE_GET_ITUNE_SONG is dispatched', () => {
        const error = 'something_went_wrong';
        const expectedResult = { ...state, songError: error, songData: null, loading: false };
        expect(
          individualSongPageReducer(state, {
            type: individualSongPageTypes.FAILURE_GET_ITUNE_SONG,
            error
          })
        ).toEqual(expectedResult);
    });

    it('should return the initial state when CLEAR_ITUNE_SONG is dispatched', () => {
        expect(
          individualSongPageReducer(state, {
            type: individualSongPageTypes.CLEAR_ITUNE_SONG
          })
        ).toEqual(initialState);
    });
})