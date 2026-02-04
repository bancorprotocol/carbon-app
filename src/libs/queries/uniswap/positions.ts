import { useQuery } from '@tanstack/react-query';
import { QueryKey } from '..';
import { getUniswapPositions } from 'components/uniswap';
import { useWagmi } from 'libs/wagmi';
import { useTokens } from 'hooks/useTokens';

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
      const tokens = positions.map((p) => [p.base, p.quote]).flat();
      await importTokenAddresses(tokens);
      return positions;
    },
    enabled: !!provider && !!user,
    refetchOnWindowFocus: false,
  });
};
