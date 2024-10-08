import React from 'react';
import { string } from 'prop-types';
import styled from '@emotion/styled';
import { colors } from '@app/themes/index';

const Card = styled.div`
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
 * @returns {JSX.Element} The MediaItemCard component displaying the song information.
 */
export function MediaItemCard({ trackName, collectionName, artistName, country, primaryGenreName, thumbnailSrc }) {
  return (
    <Card>
      <img src={thumbnailSrc} alt="thumbnail" />
      <div>{trackName}</div>
      <div>{collectionName}</div>
      <div>{artistName}</div>
      <div>{country}</div>
      <div>{primaryGenreName}</div>
    </Card>
  );
}

MediaItemCard.propTypes = {
  trackName: string,
  collectionName: string,
  artistName: string,
  country: string,
  primaryGenreName: string,
  thumbnailSrc: string
};

export default MediaItemCard;
