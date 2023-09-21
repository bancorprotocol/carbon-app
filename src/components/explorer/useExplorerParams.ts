import { useMatch } from '@tanstack/react-location';
import { ExplorerRouteGenerics } from './utils';

export const useExplorerParams = () => {
  const { params } = useMatch<ExplorerRouteGenerics>();
  return params;
};
