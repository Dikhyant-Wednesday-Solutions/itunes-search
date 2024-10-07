import { selectIndividualSongPageDomain, selectLoading, selectSongData, selectSongError, selectSongId } from '../selectors';
import { initialState } from '../reducer';
import songData from './song.data.json';

describe('SongsContainer selector tests', () => {
  let mockedState;
  let songId;
  let songError;
  let loading;

  beforeEach(() => {
    songId = '1440833081';
    songError = 'There was some error while fetching the repository details';

    mockedState = {
      individualSongPage: {
        songId: songId,
        songData: songData,
        songError: songError,
        loading
      }
    };
  });
  it('should select the songName', () => {
    const songSelector = selectSongId();
    expect(songSelector(mockedState)).toEqual(songId);
  });

  it('should select songData', () => {
    const songDataSelector = selectSongData();
    expect(songDataSelector(mockedState)).toEqual(songData);
  });

  it('should select the songError', () => {
    const songErrorSelector = selectSongError();
    expect(songErrorSelector(mockedState)).toEqual(songError);
  });

  it('should select loading', () => {
    const loadingSelector = selectLoading();
    expect(loadingSelector(mockedState)).toEqual(loading);
  })

  it('should select the global state', () => {
    const selector = selectIndividualSongPageDomain(initialState);
    expect(selector).toEqual(initialState);
  });
});
