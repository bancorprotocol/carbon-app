import { ExplorerRouteGenerics } from 'components/explorer/utils';
import { useMatch } from 'libs/routing';
import { useExplorerPairs } from 'pages/explorer/type/useExplorerPairs';
import { useExplorerWallet } from 'pages/explorer/type/useExplorerWallet';

interface Props {
  search?: string;
}

export const useExplorer = ({ search }: Props = {}) => {
  const { params } = useMatch<ExplorerRouteGenerics>();
  const usePairs = useExplorerPairs({ search, params });
  const useWallet = useExplorerWallet({ search, params });

  return { routeParams: params, usePairs, useWallet };
};
