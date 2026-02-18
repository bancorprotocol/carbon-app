import { useQueries } from '@tanstack/react-query';
import { QueryKey } from '../queryKey';
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
import { EthersError } from 'ethers';

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
      retry: 3,
      retryDelay: (attemptIndex: number, error: any) => {
        const msg = (() => {
          if ('info' in error)
            return (error as EthersError).info?.error?.message;
          if (error instanceof Error) return error.message;
          return error;
        })();
        console.log(
          `[${config.dex} - attempt ${attemptIndex}] Getting error ${msg}`,
        );
        return 500 * attemptIndex;
      },
      enabled: !!user && !!provider,
      refetchOnWindowFocus: false, // Too many errors: we don't want to hide existing queries on tab focus
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
        isPending: queries.some((q) => q.isPending),
        data: queries
          .filter((q) => !!q.data && !q.isError)
          .map((q) => q.data)
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
