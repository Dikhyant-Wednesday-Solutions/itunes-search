import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { audioState } from './reducer';

/**
 * AudioManager component is responsible for playing and pausing audio
 *
 * @returns {JSX.Element} The AudioManager component.
 */
export function AudioManager() {
  const audioRef = useRef(null);
  const { src, audioState: audSt } = useSelector((state) => state.audioManager);
  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    if (audSt === audioState.PLAYING) {
      audioRef.current.play();
      return;
    }
    if (audSt === audioState.PAUSED) {
      audioRef.current.pause();
    }
  }, [audSt, audioRef, src]);
  return (
    <audio src={src} ref={audioRef}>
      <source type="type/mpeg"></source>
    </audio>
  );
}

export default AudioManager;
