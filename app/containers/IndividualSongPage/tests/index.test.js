import React from 'react';
import Router from "react-router-dom";
import { fireEvent } from '@testing-library/dom';
import { i18n } from '@lingui/core';
import { renderProvider } from '@utils/testUtils';
import { translate } from '@app/utils';
import en from "@app/translations/en.json";
import { audioState } from '@app/components/AudioManager/reducer';
import { IndividualSongPage, mapDispatchToProps } from '../index';
import songData from './song.data.json';
import { individualSongPageTypes } from '../reducer';


jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
    useLocation: jest.fn(),
}));

i18n.load('en', en);
i18n.activate('en');

describe('<IndividualSongPage /> test suite', () => {
    beforeEach(() => {
        const songId = "1440833081";
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: songId });
        jest.spyOn(Router, 'useLocation').mockReturnValue({state: {}});
    });
    it('should render and match snapshot', () => {
        const { baseElement } = renderProvider(<IndividualSongPage dispatchRequestGetItuneSong={jest.fn()}/>);
        expect(baseElement).toMatchSnapshot();
    }); 

    it('should call dispatchRequestGetItuneSong when no song info is provided by previous page and song id is available in url param', () => {
        const songId = "1440833081";
        const dispatchRequestGetItuneSongSpy = jest.fn();
        console.log("dispatchRequestGetItuneSongSpy instanceof Function = ", dispatchRequestGetItuneSongSpy instanceof Function);
        renderProvider(<IndividualSongPage dispatchRequestGetItuneSong={dispatchRequestGetItuneSongSpy}/>);
        expect(dispatchRequestGetItuneSongSpy).toHaveBeenCalledWith(songId);
    });

    it('should not call dispatchRequestGetItuneSong when song info from previous page is provided', () => {
        jest.spyOn(Router, 'useLocation').mockReturnValue({state: {songData: songData}});
        const dispatchRequestGetItuneSongSpy = jest.fn();
        renderProvider(<IndividualSongPage dispatchRequestGetItuneSong={dispatchRequestGetItuneSongSpy}/>);
        expect(dispatchRequestGetItuneSongSpy).not.toHaveBeenCalled();
    });

    it('should call dispatchPlayAudio when pause-play button is clicked and audioState is ENDED', () => {
        const dispatchPlayAudioSpy = jest.fn();
        const audSt = audioState.ENDED;
        const { getByTestId } = renderProvider(
            <IndividualSongPage audioState={audSt} songData={songData} dispatchRequestGetItuneSong={jest.fn()} dispatchPlayAudio={dispatchPlayAudioSpy} />
        );
        fireEvent.click(getByTestId('pause-play'));
        expect(dispatchPlayAudioSpy).toHaveBeenCalled();
    });

    it('should call dispatchPlayAudio when pause-play button is clicked and audioState is PAUSED ', () => {
        const dispatchPlayAudioSpy = jest.fn();
        const audSt = audioState.PAUSED;
        const { getByTestId } = renderProvider(
            <IndividualSongPage audioState={audSt} songData={songData} dispatchRequestGetItuneSong={jest.fn()} dispatchPlayAudio={dispatchPlayAudioSpy} />
        );
        fireEvent.click(getByTestId('pause-play'));
        expect(dispatchPlayAudioSpy).toHaveBeenCalled();
    });

    it('should call dispatchPlayNewAudio when pause-play button is clicked and audioState is NO_SONG ', () => {
        const dispatchPlayNewAudioSpy = jest.fn();
        const audSt = audioState.NO_SONG;
        const { getByTestId } = renderProvider(
            <IndividualSongPage audioState={audSt} songData={songData} dispatchRequestGetItuneSong={jest.fn()} dispatchPlayNewAudio={dispatchPlayNewAudioSpy} />
        );
        fireEvent.click(getByTestId('pause-play'));
        expect(dispatchPlayNewAudioSpy).toHaveBeenCalled();
    });

    it('should call dispatchPauseAudio when pause-play button is clicked and audioState is PLAYING ', () => {
        const dispatchPauseAudioSpy = jest.fn();
        const audSt = audioState.PLAYING;
        const { getByTestId } = renderProvider(
            <IndividualSongPage audioState={audSt} songData={songData} dispatchRequestGetItuneSong={jest.fn()} dispatchPauseAudio={dispatchPauseAudioSpy} />
        );
        fireEvent.click(getByTestId('pause-play'));
        expect(dispatchPauseAudioSpy).toHaveBeenCalled();
    });

    it('should render error component when songError is provided', () => {
        const defaultError = translate('something_went_wrong');
        console.log(defaultError);
        const { getByTestId } = renderProvider(<IndividualSongPage songError={defaultError} dispatchRequestGetItuneSong={jest.fn()} />);
        expect(getByTestId('error-message')).toBeInTheDocument();
        expect(getByTestId('error-message')).toHaveTextContent(defaultError);
    });

    it('should render Skeleton Comp when "loading" is true', async () => {
        const { getAllByTestId } = renderProvider(
          <IndividualSongPage loading={true} dispatchRequestGetItuneSong={jest.fn()} />
        );
        expect(getAllByTestId('skeleton').length).toBe(3);
    });

    it('should validate mapDispatchToProps actions', async () => {
        const dispatchIndieSongSpy = jest.fn();
        const songId = "1440833081";
        const actions = {
            dispatchRequestGetItuneSong: {
                type: individualSongPageTypes.REQUEST_GET_ITUNE_SONG,
                songId
            },
            dispatchClearItuneSong: {
                type: individualSongPageTypes.CLEAR_ITUNE_SONG,
            }
        }

        const props = mapDispatchToProps(dispatchIndieSongSpy);
        props.dispatchRequestGetItuneSong(songId);
        expect(dispatchIndieSongSpy).toHaveBeenCalledWith(actions.dispatchRequestGetItuneSong);
    })
})