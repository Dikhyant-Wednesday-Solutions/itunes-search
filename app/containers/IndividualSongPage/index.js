import React, { memo, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { injectSaga } from 'redux-injectors';
import { createStructuredSelector } from 'reselect';
import { Skeleton } from '@mui/material';
import { If } from '@components/If';
import { selectLoading, selectSongData, selectSongError, selectSongId } from './selectors';
import { individualSongPageCreators } from './reducer';
import individualSongPageSaga from './saga';
import { bool, shape, number, array, string, func } from 'prop-types';

/**
 * IndividualSongPage component is responsible for displaying individual song data
 * It includes input handling, loading state management, and rendering of the repository list or error state.
 *
 *
 * @param {Object} props - The component props.
 * @param {string} props.trackName - The name of the track.
 * @param {string} props.collectionName - The name of the collection.
 * @param {string} props.artistName - The name of the artist.
 * @param {string} props.country - The name of the country the media is from
 * @param {string} props.primaryGenreName - Genre name
 * @param {string} props.thumbnailSrc - thumbnail of the media
 * @returns {JSX.Element} The HomeContainer component.
 */
export function IndividualSongPage({
  loading,
  songData,
  songError,
  songId,
  dispatchRequestGetItuneSong,
  dispatchClearItuneSong
}) {
  const { id } = useParams();
  const { state } = useLocation();
  const songDataFromPreviousPage = state?.songData;
  // const {trackName, collectionName, artistName, country, primaryGenreName, artworkUrl100: thumbnailSrc} = state;
  useEffect(() => {
    if (songDataFromPreviousPage === undefined) {
      dispatchRequestGetItuneSong(id);
    }
  }, [id, songDataFromPreviousPage]);
  return (
    <>
      <If
        condition={songDataFromPreviousPage !== undefined}
        otherwise={<If condition={songData && songData?.results}>{renderSongInfo(loading, songData?.results[0])}</If>}
      >
        {renderSongInfo(false, songDataFromPreviousPage)}
      </If>
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

const renderSongInfo = (loading, songData) => {
  return (
    <>
      <If condition={songData || loading}>
        <If condition={!loading} otherwise={renderSkeleton()}>
          <If condition={songData?.artworkUrl100 !== undefined}>
            <img src={songData?.artworkUrl100} alt="thumbnail" />
          </If>
          <If condition={songData?.trackName !== undefined}>
            <div data-testid="track_name">{songData?.trackName}</div>
          </If>
          <If condition={songData?.collectionName !== undefined}>
            <div data-testid="collection_name">{songData?.collectionName}</div>
          </If>
          <If condition={songData?.artistName !== undefined}>
            <div data-testid="artist_name">{songData?.artistName}</div>
          </If>
          <If condition={songData?.country !== undefined}>
            <div data-testid="country">{songData?.country}</div>
          </If>
          <If condition={songData?.primaryGenreName !== undefined}>
            <div data-testid="primary_genre_name">{songData?.primaryGenreName}</div>
          </If>
        </If>
      </If>
    </>
  );
};

IndividualSongPage.propTypes = {
  loading: bool,
  songData: shape({
    resultCount: number,
    results: array
  }),
  songError: string,
  songId: string,
  dispatchRequestGetItuneSong: func,
  dispatchClearItuneSong: func
};

const mapStateToProps = createStructuredSelector({
  loading: selectLoading(),
  songData: selectSongData(),
  songError: selectSongError(),
  songId: selectSongId()
});

// eslint-disable-next-line require-jsdoc
export function mapDispatchToProps(dispatch) {
  const { requestGetItuneSong, clearItuneSong } = individualSongPageCreators;
  return {
    dispatchRequestGetItuneSong: (songId) => dispatch(requestGetItuneSong(songId)),
    dispatchClearItuneSong: () => dispatch(clearItuneSong())
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
  memo,
  injectSaga({ key: 'individualSongPage', saga: individualSongPageSaga })
)(IndividualSongPage);
