/**
 *
 * PausePlay
 *
 */

import React from 'react';
import { bool, fun } from 'prop-types';
import styled from '@emotion/styled';
import { PauseSharp, PlayArrowOutlined } from '@mui/icons-material';
import { If } from '@app/components/If/index';

const CustomButton = styled.button`
  width: 100px;
  aspect-ratio: 1;
  border-radius: 100%;
`;
const PlayIcon = styled(PlayArrowOutlined)`
  scale: 2;
`;

const PauseIcon = styled(PauseSharp)`
  scale: 2;
`;

/**
 * PausePlay component that displays play or pause icon.
 * It shows the repository's name, full name, and star count.
 *
 * @param {Object} props - The component props.
 * @param {bool} props.playing - whether playing state is true or false
 * @param {Function} props.onClick - callback to check if this button was clicked
 * @returns {JSX.Element} The PausePlay component displaying the repository information.
 */
export default function PausePlay({ playing, onClick }) {
  return (
    <CustomButton onClick={onClick ?? onClick}>
      <If condition={playing} otherwise={<PlayIcon />}>
        <PauseIcon />
      </If>
    </CustomButton>
  );
}

PausePlay.propTypes = {
  playing: bool,
  onClick: fun
};
