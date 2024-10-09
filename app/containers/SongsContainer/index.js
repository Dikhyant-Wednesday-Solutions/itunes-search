import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import { createStructuredSelector } from 'reselect';
import { injectSaga } from 'redux-injectors';
import { useHistory } from 'react-router-dom';
import styled from '@emotion/styled';
import { IconButton, InputAdornment, OutlinedInput, Card, CardHeader, Divider, Skeleton } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { translate } from '@app/utils';
import T from '@components/T';
import { If } from '@app/components/If/index';
import { For } from '@app/components/For/index';
import { MediaItemCard } from '@app/components/MediaItemCard/index';
import { selectAudioState, selectSrc } from '@app/components/AudioManager/selectors';
import { audioManagerCreators, audioState } from '@app/components/AudioManager/reducer';
import { AudioManager } from '@app/components/AudioManager/index';
import { selectLoading, selectSongName, selectSongsData, selectSongsError } from './selectors';
import { songsContainerCreators } from './reducer';
import songsContainerSaga from './saga';

const CustomCard = styled(Card)`
  && {
    margin: 20px 0px;
    padding: 16px;
    color: ${(props) => props.color};
    ${(props) => props.color && `color: ${props.color}`};
  }
`;

const CustomCardHeader = styled(CardHeader)`
  && {
    padding: 0;
  }
`;

const StyledOutlinedInput = styled(OutlinedInput)`
  & {
    margin: 20px 0px;
  }
  legend {
    display: none;
  }
  > fieldset {
    top: 0;
  }
`;

const Grid = styled.div`
  width: 950px;
  display: grid;
  grid-template-columns: 317px 317px 317px;
  gap: 10px;
`;

const LoadingComponentContainer = styled.div`
  margin: 10px auto;
`;
const Page = styled.div`
  width: 971px;
  margin: 0px auto;
`;
/**
 * SongsContainer component is responsible for fetching and displaying song data fetched from itunes
 *
 * @param {Object} props - The component props.
 * @param {Function} props.dispatchRequestGetItuneSongs - dispatch action to get itune songs
 * @param {Function} props.dispatchClearItuneSongs - dispatch action to clear all songs from store
 * @param {Object} props.songsData - info of songs fetched from itunes
 * @param {string} props.songName - name of the song provided by user as input
 * @returns {JSX.Element} The SongsContainer component
 */
export function SongsContainer({
  dispatchRequestGetItuneSongs,
  dispatchClearItuneSongs,
  dispatchPlayAudio,
  dispatchPauseAudio,
  dispatchPlayNewAudio,
  songsData,
  songsError,
  songName,
  loading,
  audioSrc,
  audioState: audSt
}) {
  useEffect(() => {
    if (songName && !songsData?.results?.length) {
      dispatchRequestGetItuneSongs(songName);
    }
  }, []);

  const searchSongName = (sName) => {
    dispatchRequestGetItuneSongs(sName);
  };

  const handleOnChange = async (sName) => {
    if (!isEmpty(sName)) {
      searchSongName(sName);
    } else {
      dispatchClearItuneSongs();
    }
  };

  const debouncedHandleOnChange = debounce(handleOnChange, 200);

  const handleOnSearchIconClick = () => {
    searchSongName(songName);
  };
  return (
    <Page>
      <StyledOutlinedInput
        inputProps={{ 'data-testid': 'search-bar' }}
        onChange={(event) => debouncedHandleOnChange(event.target.value)}
        fullWidth
        defaultValue={songName}
        placeholder={translate('songs_search_input_placeholder')}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              data-testid="search-icon"
              aria-label="search repos"
              type="button"
              onClick={handleOnSearchIconClick}
            >
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        }
      />
      {renderSongs({
        loading,
        songsData,
        audioSrc,
        audioState: audSt,
        dispatchPlayAudio,
        dispatchPauseAudio,
        dispatchPlayNewAudio
      })}
      <If condition={!loading}>{renderErrorState(songName, songsError)}</If>
    </Page>
  );
}

const renderSkeleton = () => {
  return (
    <LoadingComponentContainer>
      <Skeleton data-testid="skeleton" animation="wave" variant="text" height={40} />
      <Skeleton data-testid="skeleton" animation="wave" variant="text" height={40} />
      <Skeleton data-testid="skeleton" animation="wave" variant="text" height={40} />
    </LoadingComponentContainer>
  );
};

const renderSongs = ({
  loading,
  songsData,
  audioSrc,
  audioState: audSt,
  dispatchPlayAudio,
  dispatchPauseAudio,
  dispatchPlayNewAudio
}) => {
  const history = useHistory();
  const items = get(songsData, 'results', []);

  const handleOnCardClick = (id, item) => {
    history.push(`/songs/${id}`, { songData: item });
  };

  const handleOnPausePlayClick = (ev, item) => {
    ev.stopPropagation();
    if (audioSrc !== item?.previewUrl) {
      dispatchPlayNewAudio(item?.previewUrl);
      return;
    }

    if (audSt === audioState.PLAYING) {
      dispatchPauseAudio();
      return;
    }

    dispatchPlayAudio();
  };
  return (
    <If condition={!isEmpty(items) || loading}>
      <If condition={!loading} otherwise={renderSkeleton()}>
        <If condition={!isEmpty(items)}>
          <For
            of={items}
            ParentComponent={Grid}
            renderItem={(item, index) => {
              const requiredFields = [
                'trackId',
                'trackName',
                'collectionName',
                'artistName',
                'country',
                'primaryGenreName',
                'artworkUrl100'
              ];

              const shouldRender = requiredFields.every((field) => get(item, field));
              const playing = audioSrc === item?.previewUrl && audSt === audioState.PLAYING;
              return (
                <If condition={shouldRender}>
                  <MediaItemCard
                    key={item?.trackId}
                    trackName={item?.trackName}
                    collectionName={item?.collectionName}
                    artistName={item?.artistName}
                    country={item?.country}
                    primaryGenreName={item?.primaryGenreName}
                    thumbnailSrc={item?.artworkUrl100}
                    playing={playing}
                    onClick={() => handleOnCardClick(item?.trackId, item)}
                    onPausePlayClick={(ev) => handleOnPausePlayClick(ev, item)}
                  />
                </If>
              );
            }}
          />
          <AudioManager />
        </If>
      </If>
    </If>
  );
};

const renderErrorState = (songName, songsError) => {
  let error = songsError;
  let messageId = 'error-message';

  if (isEmpty(songName)) {
    error = 'songs_search_default';
    messageId = 'default-message';
  }

  if (!isEmpty(songName) && !songsError) {
    error = 'song_not_found';
    messageId = 'no-songs-message';
  }
  return (
    <CustomCard color={songsError ? 'red' : 'grey'} maxwidth={971}>
      <CustomCardHeader title={translate('media_list')} />
      <Divider sx={{ mb: 1.25 }} light />
      <T data-testid={messageId} id={error} text={error} />
    </CustomCard>
  );
};

SongsContainer.propTypes = {
  dispatchRequestGetItuneSongs: PropTypes.func,
  dispatchClearItuneSongs: PropTypes.func,
  songsData: PropTypes.shape({
    resultCount: PropTypes.number,
    results: PropTypes.array
  }),
  songsError: PropTypes.string,
  songName: PropTypes.string,
  history: PropTypes.object,
  loading: PropTypes.bool,
  audioSrc: PropTypes.string,
  audioState: PropTypes.string,
  dispatchPlayAudio: PropTypes.func,
  dispatchPauseAudio: PropTypes.func,
  dispatchPlayNewAudio: PropTypes.func
};

SongsContainer.defaultProps = {
  songsData: {},
  songsError: null
};

const mapStateToProps = createStructuredSelector({
  loading: selectLoading(),
  songsData: selectSongsData(),
  songsError: selectSongsError(),
  songName: selectSongName(),
  audioSrc: selectSrc(),
  audioState: selectAudioState()
});

/**
 * mapDispatchToProps - maps store dispatchers with props
 * @param {*} dispatch
 * @returns {Object} dispatchers for getting itune songs and clearing songs from store
 */
export function mapDispatchToProps(dispatch) {
  const { requestGetItuneSongs, clearItuneSongs } = songsContainerCreators;
  const { play, pause, playNew } = audioManagerCreators;
  return {
    dispatchRequestGetItuneSongs: (songName) => dispatch(requestGetItuneSongs(songName)),
    dispatchClearItuneSongs: () => dispatch(clearItuneSongs()),
    dispatchPlayAudio: () => dispatch(play()),
    dispatchPauseAudio: () => dispatch(pause()),
    dispatchPlayNewAudio: (src) => dispatch(playNew(src))
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
  memo,
  injectSaga({ key: 'songsContainer', saga: songsContainerSaga })
)(SongsContainer);
