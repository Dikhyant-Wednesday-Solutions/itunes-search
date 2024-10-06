import { selectSongName, selectSongsContainerDomain, selectSongsData, selectSongsError } from '../selectors';
import { initialState } from '../reducer';
import songData from './song.data.json';

describe('SongsContainer selector tests', () => {
  let mockedState;
  let songName;
  let songsData;
  let songsError;

  beforeEach(() => {
    songName = 'International Love';
    songsData = songData;
    songsError = 'There was some error while fetching the repository details';

    mockedState = {
      songsContainer: {
        songName: songName,
        songsData: songsData,
        songsError: songsError
      }
    };
  });
  it('should select the songName', () => {
    const songSelector = selectSongName();
    expect(songSelector(mockedState)).toEqual(songName);
  });

  it('should select songsData', () => {
    const songsDataSelector = selectSongsData();
    expect(songsDataSelector(mockedState)).toEqual(songsData);
  });

  it('should select the songsError', () => {
    const songsErrorSelector = selectSongsError();
    expect(songsErrorSelector(mockedState)).toEqual(songsError);
  });

  it('should select the global state', () => {
    const selector = selectSongsContainerDomain(initialState);
    expect(selector).toEqual(initialState);
  });
});
