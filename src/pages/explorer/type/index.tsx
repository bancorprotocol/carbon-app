import { Route } from '@tanstack/react-router';
import { ExplorerEmpty } from 'components/explorer';
import { explorerPage } from '..';

export const ExplorerTypePage = () => {
  return (
    <ExplorerEmpty
      variant={'info'}
      title={'Explore Strategies'}
      text={
        'You can search for existing strategies by wallet address or a token pair. Please note that you can only view the strategies and cannot take any actions.'
      }
    />
  );
};

export const explorerTypePage = new Route({
  getParentRoute: () => explorerPage,
  path: '/',
  component: ExplorerTypePage,
});
