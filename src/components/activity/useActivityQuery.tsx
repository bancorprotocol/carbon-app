import { useQuery } from '@tanstack/react-query';
import { isAddress } from 'ethers/lib/utils';
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
import { carbonApi } from 'utils/carbonApi';
import { THIRTY_SEC_IN_MS } from 'utils/time';

const toActivities = (
  data: ServerActivity[],
  tokenMap: Map<string, Token>
): Activity[] => {
  return data.map((activity) => {
    const { strategy } = activity;
    const base = tokenMap.get(strategy.base.toLowerCase());
    const quote = tokenMap.get(strategy.quote.toLowerCase());
    if (!base) {
      throw new Error(
        `Base "${strategy.base}" not found for activity with txhash "${activity.txHash}"`
      );
    }
    if (!quote) {
      throw new Error(
        `Quote "${strategy.quote}" not found for activity with txhash "${activity.txHash}"`
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

export const useActivityQuery = (params: QueryActivityParams = {}) => {
  const { tokensMap, isPending } = useTokens();
  const validParams = isValidParams(params);
  return useQuery({
    queryKey: QueryKey.activities(params),
    queryFn: async () => {
      console.log({ params });
      const activities = await carbonApi.getActivity(params);
      return toActivities(activities.data, tokensMap).sort((a, b) => {
        return b.date.getTime() - a.date.getTime();
      });
    },
    enabled: !isPending && validParams,
    refetchInterval: THIRTY_SEC_IN_MS,
  });
};

const toMetaActivities = (
  meta: ServerActivityMeta,
  tokenMap: Map<string, Token>
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
