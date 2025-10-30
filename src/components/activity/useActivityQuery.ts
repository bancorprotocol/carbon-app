import { useQuery } from '@tanstack/react-query';
import { getAddress, isAddress } from 'ethers';
import { useTokens } from 'hooks/useTokens';
import { getMissingTokens, QueryKey } from 'libs/queries';
import {
  Activity,
  ActivityMeta,
  QueryActivityParams,
  ServerActivity,
  ServerActivityMeta,
} from 'libs/queries/extApi/activity';
import { Token } from 'libs/tokens';
import { carbonApi } from 'utils/carbonApi';
import { THIRTY_SEC_IN_MS } from 'utils/time';
import { fromUnixUTC } from 'components/simulator/utils';
import { useContract } from 'hooks/useContract';
import { fetchTokenData } from 'libs/tokens/tokenHelperFn';
export const toActivities = (
  data: ServerActivity[],
  tokensMap: Map<string, Token>,
) => {
  return data.map((activity) => {
    const { strategy } = activity;
    const base = tokensMap.get(strategy.base.toLowerCase());
    const quote = tokensMap.get(strategy.quote.toLowerCase());
    if (!base) {
      throw new Error(
        `Base "${strategy.base}" not found for activity with txhash "${activity.txHash}"`,
      );
    }
    if (!quote) {
      throw new Error(
        `Quote "${strategy.quote}" not found for activity with txhash "${activity.txHash}"`,
      );
    }
    const type = '_sP_' in strategy.buy ? 'gradient' : 'static';
    return {
      ...activity,
      date: fromUnixUTC(activity.timestamp),
      strategy: {
        ...strategy,
        base,
        quote,
        type,
      },
    } as Activity; // needed to force type because it was too difficult to deal with deep types
  });
};

const isValidParams = (params: QueryActivityParams) => {
  if ('ownerId' in params && !isAddress(params.ownerId ?? '')) return false;
  return true;
};

const toMetaActivities = (
  meta: ServerActivityMeta,
  getTokenById: (address: string) => Token | undefined,
) => {
  const result: ActivityMeta = {
    size: meta.size,
    actions: meta.actions,
    pairs: [],
    strategies: {},
  };
  for (const pair of meta.pairs) {
    const base = getTokenById(pair[0]);
    const quote = getTokenById(pair[1]);
    if (!base || !quote) throw new Error('token not found');
    result.pairs.push([base, quote]);
  }
  for (const [id, pair] of Object.entries(meta.strategies)) {
    const base = getTokenById(pair[0]);
    const quote = getTokenById(pair[1]);
    if (!base || !quote) throw new Error('token not found');
    result.strategies[id] = [base, quote];
  }
  return result;
};

interface ActivityQueryConfig {
  refetchInterval?: number;
}
export const useActivityQuery = (
  params: QueryActivityParams = {},
  config: ActivityQueryConfig = {},
) => {
  const { tokensMap, isPending } = useTokens();
  const validParams = isValidParams(params);
  const { refetchInterval = THIRTY_SEC_IN_MS } = config;

  return useQuery({
    queryKey: QueryKey.activities(params),
    queryFn: async () => {
      const activities = await carbonApi.getActivity(params);
      return toActivities(activities, tokensMap);
    },
    enabled: !isPending && validParams,
    refetchInterval,
    refetchOnWindowFocus: false,
  });
};

export const useActivityMetaQuery = (params: QueryActivityParams = {}) => {
  const { importTokens, getTokenById, isPending } = useTokens();
  const { Token } = useContract();
  const validParams = isValidParams(params);
  return useQuery({
    queryKey: QueryKey.activitiesMeta(params),
    queryFn: async () => {
      const meta = await carbonApi.getActivityMeta(params);
      // Get addresses of tokens from deleted strategies
      const addresses = new Set(
        meta.pairs.flat().filter((address) => !getTokenById(address)),
      );
      const tokens = await getMissingTokens(addresses, (address) =>
        fetchTokenData(Token, getAddress(address)),
      );
      importTokens(tokens);
      return toMetaActivities(meta, getTokenById);
    },
    enabled: !isPending && validParams,
    refetchInterval: THIRTY_SEC_IN_MS,
    refetchOnWindowFocus: false,
  });
};
