import { API_TYPES, generateApiClient } from '@utils/apiUtils';
const songApi = generateApiClient(API_TYPES.ITUNES);

/**
 * @see https://github.com/elbywan/wretch?tab=readme-ov-file#http-methods-
 */
export const getSongs = (songName) => songApi.get(`search?term=${songName}&entity=song`);
export const getSongById = (songId) => songApi.get(`lookup?id=${songId}&entity=song`);
