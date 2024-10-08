/**
 * Asynchronously loads the component for SongsContainer
 */

import loadable from '@utils/loadable';

export default loadable(() => import('./index'));
