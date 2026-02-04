import { useQuery } from '@tanstack/react-query';
import { QueryKey } from '..';
import { getUniswapPositions } from 'services/uniswap';
import { useWagmi } from 'libs/wagmi';
import { useTokens } from 'hooks/useTokens';
import { UniswapPosition } from 'services/uniswap/utils';

export const useUniswapPositions = () => {
  const { user, provider } = useWagmi();
  const { importTokenAddresses, getTokenById } = useTokens();
  return useQuery({
    queryKey: QueryKey.uniswapPosition(user || ''),
    queryFn: async () => {
      const positions = await getUniswapPositions(
        provider!,
        user!,
        getTokenById,
      );
      sessionStorage.setItem('migration-position', JSON.stringify(positions));
      const tokens = positions.map((p) => [p.base, p.quote]).flat();
      await importTokenAddresses(tokens);
      return positions;
    },
    enabled: !!provider && !!user,
    refetchOnWindowFocus: false,
    initialData: () => {
      const positions = sessionStorage.getItem('migration-position');
      if (!positions) return;
      return JSON.parse(positions) as UniswapPosition[];
    },
  });
};
