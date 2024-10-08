import React, { memo, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { injectSaga } from 'redux-injectors';
import { createStructuredSelector } from 'reselect';
import get from 'lodash/get';
import { bool, shape, number, array, string, func } from 'prop-types';
import { Skeleton, Card, Divider, CardHeader } from '@mui/material';
import styled from '@emotion/styled';
import { If } from '@components/If';
import { translate } from '@app/utils';
import { audioManagerCreators, audioState } from '@app/components/AudioManager/reducer';
import T from '@components/T';
import { AudioManager } from '@app/components/AudioManager/index';
import { selectAudioState } from '@app/components/AudioManager/selectors';
import PausePlay from '@app/components/PausePlay/index';
import { selectLoading, selectSongData, selectSongError } from './selectors';
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

const MainContainer = styled.div`
  display: flex;
`;

const Thumbnail = styled.img`
  width: 600px;
  height: 6s00px;
  border-radius: 5px;
`;

const SongInfoContainer = styled.div`
  margin-left: 20px;
`;

const SongInfoText = styled.div`
  font-size: 36px;
`;

const PausePlayContainer = styled.div`
  width: 100px;
  height: 100px;
`;

/**
 * IndividualSongPage component is responsible for displaying individual song data
 * It includes input handling, loading state management, and rendering of the repository list or error state.
 *
 *
 * @param {Object} props - The component props.
 * @param {Function} props.dispatchRequestGetItuneSong - The get song action dispatcher
 * @param {Function} props.dispatchPlayAudio - The play audio action dispatcher
 * @param {Function} props.dispatchPauseAudio - The pause audio action dispatcher
 * @param {Function} props.dispatchPlayNewAudio - The assign a new song to audio manager dispatcher
 * @param {bool} props.loading - Flag that tells whether song data is loading or not
 * @param {Object} props.songData - The info about the song
 * @param {Object} props.songError - Error info if something went wrong while getting song info
 * @param {string} props.artistName - The name of the artist.
 * @param {string} props.audioState - State of the audio manager whehter song is playing, paused, ended or no song is in the player
 * @returns {JSX.Element} The IndividualSongPage component.
 */
export function IndividualSongPage({
  dispatchRequestGetItuneSong,
  dispatchPlayAudio,
  dispatchPauseAudio,
  dispatchPlayNewAudio,
  loading,
  songData,
  songError,
  audioState: audSt
}) {
  const { id } = useParams();
  const { state } = useLocation();
  const songDataFromPreviousPage = state?.songData;
  const renderSongInfoProps =
    songDataFromPreviousPage !== undefined
      ? {
          dispatchPlayAudio,
          dispatchPauseAudio,
          dispatchPlayNewAudio,
          loading: false,
          songData: songDataFromPreviousPage,
          audioState: audSt
        }
      : {
          dispatchPlayAudio,
          dispatchPauseAudio,
          dispatchPlayNewAudio,
          loading,
          songData: get(songData, 'results[0]'),
          audioState: audSt
        };
  useEffect(() => {
    if (songDataFromPreviousPage === undefined && id) {
      dispatchRequestGetItuneSong(id);
    }
  }, [id, songDataFromPreviousPage]);
  return (
    <>
      {renderSongInfo(renderSongInfoProps)}
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

const renderSongInfo = ({
  dispatchPlayAudio,
  dispatchPauseAudio,
  dispatchPlayNewAudio,
  loading,
  songData,
  audioState: audSt
}) => {
  const handleOnPausePlayClick = () => {
    if (audSt === audioState.NO_SONG) {
      dispatchPlayNewAudio(songData?.previewUrl);
      return;
    }

    if (audSt !== audioState.PLAYING) {
      dispatchPlayAudio();
      return;
    }

    dispatchPauseAudio();
  };
  return (
    <MainContainer>
      <If condition={songData || loading}>
        <If condition={!loading} otherwise={renderSkeleton()}>
          <Thumbnail src={songData?.artworkUrl100} alt="thumbnail" />
          <SongInfoContainer>
            <SongInfoText data-testid="track_name">{songData?.trackName}</SongInfoText>
            <SongInfoText data-testid="collection_name">{songData?.collectionName}</SongInfoText>
            <SongInfoText data-testid="artist_name">{songData?.artistName}</SongInfoText>
            <SongInfoText data-testid="country">{songData?.country}</SongInfoText>
            <SongInfoText data-testid="primary_genre_name">{songData?.primaryGenreName}</SongInfoText>
            <SongInfoText>{songData?.releaseDate}</SongInfoText>
            <SongInfoText>{songData?.country}</SongInfoText>
            <PausePlayContainer>
              <PausePlay
                data-testid="pause-play"
                onClick={handleOnPausePlayClick}
                playing={audSt === audioState.PLAYING}
              />
            </PausePlayContainer>
          </SongInfoContainer>
        </If>
      </If>
      <AudioManager />
    </MainContainer>
  );
};

IndividualSongPage.propTypes = {
  loading: bool,
  songData: shape({
    resultCount: number,
    results: array
  }),
  songError: string,
  dispatchRequestGetItuneSong: func,
  dispatchPlayAudio: func,
  dispatchPauseAudio: func,
  dispatchPlayNewAudio: func,
  audioState: string
};

const mapStateToProps = createStructuredSelector({
  loading: selectLoading(),
  songData: selectSongData(),
  songError: selectSongError(),
  audioState: selectAudioState()
});

/**
 * mapDispatchToProps is function that helps in mapping store dispatchers to component props
 * @param {Function} dispatch - function that takes an action as input and returns a custom action dispatcher
 * @returns {Object} dispatchers for getting songs from itune, playing , pausing audio
 */
export function mapDispatchToProps(dispatch) {
  const { requestGetItuneSong } = individualSongPageCreators;
  const { play, pause, playNew } = audioManagerCreators;
  return {
    dispatchRequestGetItuneSong: (songId) => dispatch(requestGetItuneSong(songId)),
    dispatchPlayAudio: () => dispatch(play()),
    dispatchPauseAudio: () => dispatch(pause()),
    dispatchPlayNewAudio: (src) => dispatch(playNew(src))
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
  memo,
  injectSaga({ key: 'individualSongPage', saga: individualSongPageSaga })
)(IndividualSongPage);
