/**
 *
 * MediaItemCard
 *
 */

import React from 'react';
import { bool, string } from 'prop-types';
import styled from '@emotion/styled';
import { colors } from '@app/themes/index';
import PausePlay from '../PausePlay/index';

const Card = styled.div`
  position: relative;
  border-style: solid;
  border-width: 1px;
  padding: 5px;
  border-radius: 5px;

  &:hover {
    cursor: pointer;
    background: ${colors.greenWhite};
  }

  &:active {
    background: ${colors.pastelGrey};
  }
`;

const PausePlayContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

/**
 * MediaItemCard component that displays information about a Media item (like a song).
 *
 * @param {Object} props - The component props.
 * @param {string} props.trackName - The name of the track.
 * @param {string} props.collectionName - The name of the collection.
 * @param {string} props.artistName - The name of the artist.
 * @param {string} props.country - The name of the country the media is from
 * @param {string} props.primaryGenreName - Genre name
 * @param {string} props.thumbnailSrc - thumbnail of the media
 * @param {Function} props.onClick - callback to handle onclick
 * @returns {JSX.Element} The MediaItemCard component displaying the song information.
 */
export function MediaItemCard({
  trackName,
  collectionName,
  artistName,
  country,
  primaryGenreName,
  thumbnailSrc,
  playing,
  onClick,
  onPausePlayClick
}) {
  return (
    <Card data-testid="media-item-card" onClick={onClick ?? onClick}>
      <img data-testid="thumbnail" src={thumbnailSrc} alt="thumbnail" />
      <div data-testid="track_name">{trackName}</div>
      <div data-testid="collection_name">{collectionName}</div>
      <div data-testid="artist_name">{artistName}</div>
      <div data-testid="country">{country}</div>
      <div data-testid="primary_genre_name">{primaryGenreName}</div>
      <PausePlayContainer id="pause-play-container">
        <PausePlay playing={playing} onClick={onPausePlayClick ?? onPausePlayClick} />
      </PausePlayContainer>
    </Card>
  );
}

MediaItemCard.propTypes = {
  trackName: string,
  collectionName: string,
  artistName: string,
  country: string,
  primaryGenreName: string,
  thumbnailSrc: string,
  playing: bool,
  onClick: Function,
  onPausePlayClick: Function
};

export default MediaItemCard;
