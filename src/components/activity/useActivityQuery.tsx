import { useQuery } from '@tanstack/react-query';
import { isAddress } from 'ethers/lib/utils';
import { useContract } from 'hooks/useContract';
import { useTokens } from 'hooks/useTokens';
import { QueryKey } from 'libs/queries';
import {
  Activity,
  ActivityMeta,
  QueryActivityParams,
  ServerActivity,
  ServerActivityMeta,
} from 'libs/queries/extApi/activity';
import { Token } from 'libs/tokens';
import { fetchTokenData } from 'libs/tokens/tokenHelperFn';
import { carbonApi } from 'utils/carbonApi';
import { THIRTY_SEC_IN_MS } from 'utils/time';

export const toActivities = (
  data: ServerActivity[],
  tokensMap: Map<string, Token>,
): Activity[] => {
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
    return {
      ...activity,
      date: new Date(activity.timestamp * 1000),
      strategy: {
        ...strategy,
        base,
        quote,
      },
    };
  });
};

const isValidParams = (params: QueryActivityParams) => {
  if ('ownerId' in params && !isAddress(params.ownerId ?? '')) return false;
  return true;
};

const toMetaActivities = (
  meta: ServerActivityMeta,
  tokenMap: Map<string, Token>,
) => {
  const result: ActivityMeta = {
    size: meta.size,
    actions: meta.actions,
    pairs: [],
    strategies: {},
  };
  for (const pair of meta.pairs) {
    const base = tokenMap.get(pair[0].toLowerCase());
    const quote = tokenMap.get(pair[1].toLowerCase());
    if (!base || !quote) throw new Error('token not found');
    result.pairs.push([base, quote]);
  }
  for (const [id, pair] of Object.entries(meta.strategies)) {
    const base = tokenMap.get(pair[0].toLowerCase());
    const quote = tokenMap.get(pair[1].toLowerCase());
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
  const { tokensMap, isPending, importTokens } = useTokens();
  const { Token } = useContract();
  const validParams = isValidParams(params);

  const { refetchInterval = THIRTY_SEC_IN_MS } = config;

  const importMissingTokens = async (activities: ServerActivity[]) => {
    const missingTokens = new Set<string>();
    for (const activity of activities) {
      const { base, quote } = activity.strategy;
      if (!tokensMap.has(base.toLowerCase())) missingTokens.add(base);
      if (!tokensMap.has(quote.toLowerCase())) missingTokens.add(quote);
    }
    if (!missingTokens.size) return;
    const getTokens = Array.from(missingTokens).map((address) => {
      return fetchTokenData(Token, address);
    });
    const tokens = await Promise.all(getTokens);
    importTokens(tokens);
  };

  return useQuery({
    queryKey: QueryKey.activities(params),
    queryFn: async () => {
      const activities = await carbonApi.getActivity(params);
      await importMissingTokens(activities);
      return toActivities(activities, tokensMap);
    },
    enabled: !isPending && validParams,
    refetchInterval,
  });
};

export const useActivityMetaQuery = (params: QueryActivityParams = {}) => {
  const { tokensMap, isPending } = useTokens();
  const validParams = isValidParams(params);
  return useQuery({
    queryKey: QueryKey.activitiesMeta(params),
    queryFn: async () => {
      const meta = await carbonApi.getActivityMeta(params);
      return toMetaActivities(meta, tokensMap);
    },
    enabled: !isPending && validParams,
    refetchInterval: THIRTY_SEC_IN_MS,
  });
};
