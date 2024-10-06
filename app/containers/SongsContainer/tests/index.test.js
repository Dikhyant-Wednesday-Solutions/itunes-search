import React from 'react';
import { fireEvent } from '@testing-library/dom';
import { timeout, renderProvider } from '@utils/testUtils';
import { mapDispatchToProps, SongsContainer } from '../index';
import { songsContainerTypes } from '../reducer';
import { translate } from '@app/utils';
import songData from './song.data.json';

describe('<SongsContainer />', () => {
    it('should render and match the snapshot', () => {
        const { baseElement } = renderProvider(<SongsContainer/>);
        expect(baseElement).toMatchSnapshot();
    });
    
    it('should call dispatchClearItuneSongs when search input is empty', async () => {
        const clearItunesSongsSpy = jest.fn();
        const requestGetItunesSongsSpy = jest.fn();
        const { getByTestId } = renderProvider(
            <SongsContainer
                dispatchRequestGetItuneSongs={requestGetItunesSongsSpy}
                dispatchClearItuneSongs={clearItunesSongsSpy}
            />
        )
        
        fireEvent.change(getByTestId('search-bar'), {
            target: { value: 'a' }
        });
        await timeout(500);
        expect(requestGetItunesSongsSpy).toHaveBeenCalled();
        fireEvent.change(getByTestId('search-bar'), {
        target: { value: '' }
        });
        await timeout(500);
        expect(clearItunesSongsSpy).toHaveBeenCalled();
    })

    it('should call dispatchGithubRepos on change and after enter', async () => {
        const songName = 'Boulevard of Broken Dreams';
        const requestGetItunesSongsSpy = jest.fn();
        const { getByTestId } = renderProvider(<SongsContainer dispatchRequestGetItuneSongs={requestGetItunesSongsSpy} />);
        const searchBar = getByTestId('search-bar');
        fireEvent.change(searchBar, {
            target: { value: songName }
        });
        await timeout(500);
        expect(requestGetItunesSongsSpy).toHaveBeenCalledWith(songName);

        fireEvent.keyDown(searchBar, {
            key: 'Enter',
            code: 13,
            charCode: 13
        });
        expect(requestGetItunesSongsSpy).toHaveBeenCalledWith(songName);
    });

    it('should call dispatchGithubRepos on clicking the search icon', async () => {
        const songName = 'Boulevard of Broken Dreams';
        const requestGetItunesSongsSpy = jest.fn();
        const { getByTestId } = renderProvider(<SongsContainer dispatchRequestGetItuneSongs={requestGetItunesSongsSpy} songName={songName} />);
        fireEvent.click(getByTestId('search-icon'));
    
        await timeout(500);
        expect(requestGetItunesSongsSpy).toHaveBeenCalledWith(songName);
    });

    it('should call dispatchGithubRepos on mount if repoName is already persisted', async () => {
        const songName = 'Boulevard of Broken Dreams';
        const requestGetItunesSongsSpy = jest.fn();
        renderProvider(<SongsContainer songName={songName} songsData={null} dispatchRequestGetItuneSongs={requestGetItunesSongsSpy} />);
    
        await timeout(500);
        expect(requestGetItunesSongsSpy).toHaveBeenCalledWith(songName);
    });

    it('should validate mapDispatchToProps actions', async () => {
        const spy = jest.fn();
        const songName = "What I've done";
        const actions = {
          dispatchRequestGetItuneSongs: { songName: songName, type: songsContainerTypes.REQUEST_GET_ITUNE_SONGS },
          dispatchClearItuneSongs: { type: songsContainerTypes.CLEAR_ITUNE_SONGS }
        };
    
        const props = mapDispatchToProps(spy);
        props.dispatchRequestGetItuneSongs(songName);
        expect(spy).toHaveBeenCalledWith(actions.dispatchRequestGetItuneSongs);
    
        await timeout(500);
        props.dispatchClearItuneSongs();
        expect(spy).toHaveBeenCalledWith(actions.dispatchClearItuneSongs);
    });

    it('should render default error message when search goes wrong', () => {
        const defaultError = translate('something_went_wrong');
        const { getByTestId } = renderProvider(<SongsContainer songsError={defaultError} />);
        expect(getByTestId('error-message')).toBeInTheDocument();
        expect(getByTestId('error-message')).toHaveTextContent(defaultError);
    });

    it('should render the data when loading becomes false', () => {
        const { getByTestId } = renderProvider(<SongsContainer songsData={songData} />);
        expect(getByTestId('for')).toBeInTheDocument();
    });

    it('should render Skeleton Comp when "loading" is true', async () => {
        const { getAllByTestId } = renderProvider(
          <SongsContainer loading />
        );
        expect(getAllByTestId('skeleton').length).toBe(3);
    });
})