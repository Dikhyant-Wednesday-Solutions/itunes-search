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
  border-radius: 5px;
  overflow: hidden;
  height: 200px;

  & > * {
    position: relative;
  }

  &:hover {
    cursor: pointer;
    background: ${colors.greenWhite};
  }

  #thumbnail {
    transition: scale 1s;
  }

  &:hover #thumbnail {
    scale: 1.15;
  }

  &:active {
    background: ${colors.pastelGrey};
  }
`;

const TextContainer = styled.div`
  overflow: hidden;
`;

const TruncateText = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PausePlayContainer = styled.div`
  bottom: 30px;
  right: 30px;
`;

const BottomContainer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 70px;
  background-color: #393939c9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 10px;
  padding-right: 10px;
  gap: 10px;
`;

/**
 * MediaItemCard component that displays information about a Media item (like a song).
 *
 * @param {Object} props - The component props.
 * @param {string} props.trackName - The name of the track.
 * @param {string} props.artistName - The name of the artist.
 * @param {string} props.thumbnailSrc - thumbnail of the media
 * @param {Function} props.onClick - callback to handle onclick
 * @returns {JSX.Element} The MediaItemCard component displaying the song information.
 */
export function MediaItemCard({ trackName, artistName, thumbnailSrc, playing, onClick, onPausePlayClick }) {
  return (
    <Card data-testid="media-item-card" onClick={onClick ?? onClick} playing={playing}>
      <img
        id="thumbnail"
        data-testid="thumbnail"
        src={thumbnailSrc}
        alt="thumbnail"
        style={{
          position: 'absolute',
          top: 0,
          width: '100%'
        }}
      />
      <BottomContainer>
        <TextContainer>
          <TruncateText data-testid="track_name" style={{ color: 'white' }}>
            {trackName}
          </TruncateText>
          <TruncateText data-testid="artist_name" style={{ color: 'white' }}>
            {artistName}
          </TruncateText>
        </TextContainer>
        <PausePlayContainer>
          <PausePlay playing={playing} onClick={onPausePlayClick} />
        </PausePlayContainer>
      </BottomContainer>
    </Card>
  );
}

MediaItemCard.propTypes = {
  trackName: string,
  artistName: string,
  thumbnailSrc: string,
  playing: bool,
  onClick: Function,
  onPausePlayClick: Function
};

export default MediaItemCard;
