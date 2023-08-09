import { ExplorerRouteGenerics } from 'components/explorer/utils';
import { useMatch } from 'libs/routing';
import { useExplorerPairs } from 'components/explorer/useExplorerPairs';
import { useExplorerWallet } from 'components/explorer/useExplorerWallet';

interface Props {
  search?: string;
}

export const useExplorer = ({ search }: Props = {}) => {
  const { params } = useMatch<ExplorerRouteGenerics>();
  const usePairs = useExplorerPairs({ search, params });
  const useWallet = useExplorerWallet({ search, params });

  return { routeParams: params, usePairs, useWallet };
};
