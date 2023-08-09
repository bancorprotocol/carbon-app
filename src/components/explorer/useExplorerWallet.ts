import { ExplorerRouteGenerics } from 'components/explorer/utils';
import { useGetUserStrategies } from 'libs/queries';

interface Props {
  search?: string;
  params: ExplorerRouteGenerics['Params'];
}

export const useExplorerWallet = ({ params: { slug, type } }: Props) => {
  const strategiesQuery = useGetUserStrategies({
    user: type === 'wallet' ? slug : undefined,
  });

  return { strategiesQuery };
};
