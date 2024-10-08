import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { injectSaga } from 'redux-injectors';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import debounce from 'lodash/debounce';
import styled from '@emotion/styled';
import { IconButton, InputAdornment, OutlinedInput } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { translate } from '@app/utils';
import { If } from '@app/components/If/index';
import { For } from '@app/components/For/index';
import { MediaItemCard } from '@app/components/MediaItemCard/index';
import { selectLoading, selectSongName, selectSongsData, selectSongsError } from './selectors';
import { songsContainerCreators } from './reducer';
import songsContainerSaga from './saga';

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
export function SongsContainer({ dispatchRequestGetItuneSongs, dispatchClearItuneSongs, songsData, songName }) {
  useEffect(() => {
    if (songName && songsData?.results?.length === 0) {
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
      <If condition={songsData?.results?.length > 0}>
        <For
          of={songsData.results}
          ParentComponent={Grid}
          renderItem={(item) => {
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
    </>
  );
}

SongsContainer.propTypes = {
  dispatchRequestGetItuneSongs: PropTypes.func,
  dispatchClearItuneSongs: PropTypes.func,
  intl: PropTypes.object,
  songsData: PropTypes.shape({
    resultCount: PropTypes.number,
    results: PropTypes.array
  }),
  songsError: PropTypes.string,
  songName: PropTypes.string,
  history: PropTypes.object,
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
