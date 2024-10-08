/**
 *
 * Tests for MediaItemCard
 *
 */

import React from 'react';
import { renderWithIntl } from '@utils/testUtils';
import MediaItemCard from "../index";

describe('<MediaItemCard />', () => {
    it('should render and match the snapshot', () => {
      const { baseElement } = renderWithIntl(<MediaItemCard />);
      expect(baseElement).toMatchSnapshot();
    });

    it('should contain 1 MediaItemCard component', () => {
        const { getAllByTestId } = renderWithIntl(<MediaItemCard />);
        expect(getAllByTestId('media-item-card').length).toBe(1);
    });

    it('should render the media details inside the card', () => {
        const artistName = "J.J. Abrams";
        const trackName = "Star Wars: The Force Awakens";
        const collectionName = "Star Wars";
        const country = "USA";
        const primaryGenreName = "Action / Adventure";
        const thumbnailSrc = "https://is1-ssl.mzstatic.com/image/thumb/Video123/v4/1f/2b/ae/1f2bae7f-62a1-1055-8471-401291b6dcdd/pr_source.lsr/100x100bb.jpg";
        const { getByTestId } = renderWithIntl(
            <MediaItemCard
                artistName={artistName}
                trackName={trackName}
                collectionName={collectionName}
                country={country}
                primaryGenreName={primaryGenreName}
                thumbnailSrc={thumbnailSrc}
            />
        );

        expect(getByTestId('thumbnail')).toHaveAttribute('src', thumbnailSrc);
        expect(getByTestId('track_name')).toHaveTextContent(trackName);
        expect(getByTestId('collection_name')).toHaveTextContent(collectionName);
        expect(getByTestId('artist_name')).toHaveTextContent(artistName);
        expect(getByTestId('country')).toHaveTextContent(country);
        expect(getByTestId('primary_genre_name')).toHaveTextContent(primaryGenreName);
 });
});