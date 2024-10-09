import routeConstants from '@utils/routeConstants';
import NotFound from '@app/containers/NotFoundPage/loadable';
import HomeContainer from '@app/containers/HomeContainer/loadable';
import SongsContainer from '@app/containers/SongsContainer/loadable';
import IndividualSongPage from '@app/containers/IndividualSongPage/loadable';

export const routeConfig = {
  repos: {
    component: HomeContainer,
    ...routeConstants.repos
  },
  songs: {
    component: SongsContainer,
    route: '/songs',
    exact: true
  },
  song: {
    component: IndividualSongPage,
    route: '/songs/:id',
    exact: true
  },
  notFoundPage: {
    component: NotFound,
    route: '/'
  }
};
