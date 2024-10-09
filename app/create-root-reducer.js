/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux';
import LanguageProviderReducer from '@containers/LanguageProvider/reducer';
import HomeContainerReducer from '@containers/HomeContainer/reducer';
import SongsContainerReducer from '@containers/SongsContainer/reducer';
import IndividualSongPageReducer from '@containers/IndividualSongPage/reducer';
import AudioManagerReducer from '@components/AudioManager/reducer';

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export default function createRootReducer(injectedReducer = {}) {
  return combineReducers({
    ...injectedReducer,
    language: LanguageProviderReducer,
    homeContainer: HomeContainerReducer,
    songsContainer: SongsContainerReducer,
    individualSongPage: IndividualSongPageReducer,
    audioManager: AudioManagerReducer
  });
}
