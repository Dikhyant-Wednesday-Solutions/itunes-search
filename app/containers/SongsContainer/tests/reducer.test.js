import songsContainerReducer, { initialState, songsContainerTypes } from "../reducer";
import songData from './song.data.json';

/* eslint-disable default-case, no-param-reassign */
describe('SongsContainer reducer tests', () => {
    let state;
    beforeEach(() => {
        state = initialState;
    });

    it('should return the initial state', () => {
        expect(songsContainerReducer(undefined, {})).toEqual(state);
    });

    it('should return initial state when REQUEST_GET_ITUNE_SONGS action is dispatched', () => {
      const songName = 'Stairway to heaven';
      const action = {
        type: songsContainerTypes.REQUEST_GET_ITUNE_SONGS,
        songName: songName
      }
      const expectedResult = {...state, songName, loading: true};
      expect(
        songsContainerReducer(state,action)
      ).toEqual(expectedResult);
    })

    it('should ensure that the user data is present and loading = false when SUCCESS_GET_ITUNE_SONGS is dispatched', () => {
        const data = songData;
        const expectedResult = { ...state, songsData: data, loading: false };
        expect(
          songsContainerReducer(state, {
            type: songsContainerTypes.SUCCESS_GET_ITUNE_SONGS,
            data
          })
        ).toEqual(expectedResult);
    });

    it('should ensure that the userErrorMessage has some data and loading = false when FAILURE_GET_ITUNE_SONGS is dispatched', () => {
        const error = 'something_went_wrong';
        const expectedResult = { ...state, songsError: error, songsData: null, loading: false };
        expect(
            songsContainerReducer(state, {
            type: songsContainerTypes.FAILURE_GET_ITUNE_SONGS,
            error
          })
        ).toEqual(expectedResult);
    });

    it('should return the initial state when CLEAR_ITUNE_SONGS is dispatched', () => {
        expect(
          songsContainerReducer(state, {
            type: songsContainerTypes.CLEAR_ITUNE_SONGS
          })
        ).toEqual(initialState);
    });
})