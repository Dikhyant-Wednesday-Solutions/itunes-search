import React from 'react';
import { renderProvider } from '@utils/testUtils';
import { useAudioManagerDispatch } from '@app/components/AudioManager/reducer';
import AudioManager from '../index';

jest.mock('../reducer', () => ({
    useAudioManagerDispatch: jest.fn(),
    audioState: {
        PAUSED: 'PAUSED',
        PLAYING: 'PLAYING',
        ENDED: 'ENDED',
        NO_SONG: 'NO_SONG'
      }
}));

jest.mock('../selectors', () => ({
    useAudioManagerSelector: jest.fn(() => ({
        src: 'audio-src',
        audioState: 'PLAYING'
    }))
}));



describe('<AudioManager /> test suite', () => {
    const dispatchAudioReset = jest.fn();
    const dispatchEndAudio = jest.fn();

    beforeEach(() => {
        // Mock dispatch functions to return the jest mock functions
        useAudioManagerDispatch.mockReturnValue({
          dispatchAudioReset,
          dispatchEndAudio
        });

        
    });

    it('should called dispatchAudioReset when <AudioManager /> mounts', () => {
        renderProvider(<AudioManager />);
        expect(dispatchAudioReset).toHaveBeenCalled();
    });
});