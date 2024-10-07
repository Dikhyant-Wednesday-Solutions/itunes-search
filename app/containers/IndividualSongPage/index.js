import React, { memo, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { injectSaga } from 'redux-injectors';
import { createStructuredSelector } from 'reselect';
import { bool, shape, number, array, string, func } from 'prop-types';
import { Skeleton, Card, Divider, CardHeader } from '@mui/material';
import styled from '@emotion/styled';
import T from '@components/T';
import { If } from '@components/If';
import { translate } from '@app/utils';
import { selectLoading, selectSongData, selectSongError, selectSongId } from './selectors';
import { individualSongPageCreators } from './reducer';
import individualSongPageSaga from './saga';

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
  useEffect(() => {
    if (songDataFromPreviousPage === undefined && id && dispatchRequestGetItuneSong) {
      dispatchRequestGetItuneSong(id);
    }
  }, [id, songDataFromPreviousPage]);
  return (
    <>
      <If
        condition={songDataFromPreviousPage !== undefined}
        otherwise={renderSongInfo(loading, songData?.results?.[0])}
      >
        {renderSongInfo(false, songDataFromPreviousPage)}
      </If>
      {renderErrorState(loading, songError)}
    </>
  );
}

const renderErrorState = (loading, songsError) => {
  const error = songsError;
  const messageId = 'error-message';
  return (
    <If condition={!loading && error}>
      <CustomCard color={'red'}>
        <CustomCardHeader title={translate('oops')} />
        <Divider sx={{ mb: 1.25 }} light />
        <T data-testid={messageId} id={error} text={error} />
      </CustomCard>
    </If>
  );
};

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
