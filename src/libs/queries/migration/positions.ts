import { useQueries } from '@tanstack/react-query';
import { QueryKey } from '..';
import { allUniConfigs } from 'services/uniswap';
import { useWagmi } from 'libs/wagmi';
import { useTokens } from 'hooks/useTokens';
import {
  UniswapPosition,
  UniswapV2Config,
  UniswapV3Config,
} from 'services/uniswap/utils';
import { getAllV3Positions } from 'services/uniswap/v3/read.contract';
import { getAllV2Positions } from 'services/uniswap/v2/read.contract';

export const useDexesMigration = () => {
  const { user, provider } = useWagmi();
  const { importTokenAddresses, getTokenById } = useTokens();
  return useQueries({
    queries: allUniConfigs.map((config) => ({
      queryKey: QueryKey.dexMigration(config.dex, user || ''),
      queryFn: async () => {
        const [_, version] = config.dex.split('-');
        let positions: UniswapPosition[];
        if (version === 'v2') {
          positions = await getAllV2Positions(
            config as UniswapV2Config,
            provider!,
            user!,
            getTokenById,
          );
        } else {
          positions = await getAllV3Positions(
            config as UniswapV3Config,
            provider!,
            user!,
            getTokenById,
          );
        }
        sessionStorage.setItem(
          `migration-${config.dex}-${user}`,
          JSON.stringify(positions),
        );
        const tokens = positions.map((p) => [p.base, p.quote]).flat();
        await importTokenAddresses(tokens);
        return positions;
      },
      enabled: !!user && !!provider,
      refetchOnWindowFocus: true,
      initialData: () => {
        if (!user) return;
        const positions = sessionStorage.getItem(
          `migration-${config.dex}-${user}`,
        );
        if (!positions) return;
        return JSON.parse(positions) as UniswapPosition[];
      },
    })),
    combine: (queries) => {
      return {
        isLoading: queries.some((q) => q.isLoading),
        data: queries
          .map((q) => q.data)
          .filter((data) => !!data)
          .flat(),
        states: queries.map((q, i) => ({
          dex: allUniConfigs[i].dex,
          status: q.status,
          fetchStatus: q.fetchStatus,
        })),
      };
    },
  });
};
