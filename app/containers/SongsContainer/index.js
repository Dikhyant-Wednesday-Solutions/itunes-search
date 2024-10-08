import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import { createStructuredSelector } from 'reselect';
import { injectSaga } from 'redux-injectors';
import styled from '@emotion/styled';
import { IconButton, InputAdornment, OutlinedInput, Card, CardHeader, Divider, Skeleton } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { translate } from '@app/utils';
import T from '@components/T';
import { If } from '@app/components/If/index';
import { For } from '@app/components/For/index';
import { MediaItemCard } from '@app/components/MediaItemCard/index';
import { selectLoading, selectSongName, selectSongsData, selectSongsError } from './selectors';
import { songsContainerCreators } from './reducer';
import songsContainerSaga from './saga';

const CustomCard = styled(Card)`
  && {
    margin: 1.25rem 0;
    padding: 1rem;
    max-width: ${(props) => props.maxwidth};
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
  legend {
    display: none;
  }
  > fieldset {
    top: 0;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
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
  songsData,
  songsError,
  songName,
  loading
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
    <>
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
      {renderSongs(loading, songsData)}
      {renderErrorState(songName, loading, songsError)}
      <If condition={!isEmpty(songName) && !loading && !isEmpty(songsData)}>{renderNoSongsFound()}</If>
    </>
  );
}

const renderSkeleton = () => {
  return (
    <>
      <Skeleton data-testid="skeleton" animation="wave" variant="text" height={40} />
      <Skeleton data-testid="skeleton" animation="wave" variant="text" height={40} />
      <Skeleton data-testid="skeleton" animation="wave" variant="text" height={40} />
    </>
  );
};

const renderNoSongsFound = () => {
  const notFoundText = translate('song_not_found');
  return (
    <CustomCard color={'grey'}>
      <CustomCardHeader title={translate('oops')} />
      <Divider sx={{ mb: 1.25 }} light />
      <T data-testid={'no-songs-message'} id={notFoundText} text={notFoundText} />
    </CustomCard>
  );
};

const renderSongs = (loading, songsData) => {
  const items = get(songsData, 'results', []);
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
                  />
                </If>
              );
            }}
          />
        </If>
      </If>
    </If>
  );
};

const renderErrorState = (songName, loading, songsError) => {
  let error;
  let messageId;
  if (songsError) {
    error = songsError;
    messageId = 'error-message';
  } else if (isEmpty(songName)) {
    error = 'songs_search_default';
    messageId = 'default-message';
  }
  return (
    <If condition={!loading && error}>
      <CustomCard color={songsError ? 'red' : 'grey'}>
        <CustomCardHeader title={translate('media_list')} />
        <Divider sx={{ mb: 1.25 }} light />
        <T data-testid={messageId} id={error} text={error} />
      </CustomCard>
    </If>
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
  loading: PropTypes.bool
};

SongsContainer.defaultProps = {
  songsData: {},
  songsError: null
};

const mapStateToProps = createStructuredSelector({
  loading: selectLoading(),
  songsData: selectSongsData(),
  songsError: selectSongsError(),
  songName: selectSongName()
});

/**
 * mapDispatchToProps - maps store dispatchers with props
 * @param {*} dispatch
 * @returns {Object} dispatchers for getting itune songs and clearing songs from store
 */
export function mapDispatchToProps(dispatch) {
  const { requestGetItuneSongs, clearItuneSongs } = songsContainerCreators;
  return {
    dispatchRequestGetItuneSongs: (songName) => dispatch(requestGetItuneSongs(songName)),
    dispatchClearItuneSongs: () => dispatch(clearItuneSongs())
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
  memo,
  injectSaga({ key: 'songsContainer', saga: songsContainerSaga })
)(SongsContainer);
