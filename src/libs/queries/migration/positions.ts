import { useQuery } from '@tanstack/react-query';
import { QueryKey } from '..';
import { getUniswapPositions } from 'services/uniswap';
import { useWagmi } from 'libs/wagmi';
import { useTokens } from 'hooks/useTokens';
import { UniswapPosition } from 'services/uniswap/utils';

export const useMigrationPositions = () => {
  const { user, provider } = useWagmi();
  const { importTokenAddresses, getTokenById } = useTokens();
  return useQuery({
    queryKey: QueryKey.migrationPositions(user || ''),
    queryFn: async () => {
      const positions = await getUniswapPositions(
        provider!,
        user!,
        getTokenById,
      );
      sessionStorage.setItem(
        `migration-positions-${user}`,
        JSON.stringify(positions),
      );
      const tokens = positions.map((p) => [p.base, p.quote]).flat();
      await importTokenAddresses(tokens);
      return positions;
    },
    enabled: !!user && !!provider,
    refetchOnWindowFocus: false,
    initialData: () => {
      if (!user) return;
      const positions = sessionStorage.getItem(`migration-positions-${user}`);
      if (!positions) return;
      return JSON.parse(positions) as UniswapPosition[];
    },
  });
};
