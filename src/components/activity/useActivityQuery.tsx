import { useQuery } from '@tanstack/react-query';
import { isAddress } from 'ethers/lib/utils';
import { useContract } from 'hooks/useContract';
import { useTokens } from 'hooks/useTokens';
import { QueryKey } from 'libs/queries';
import {
  Activity,
  QueryActivityParams,
  ServerActivity,
} from 'libs/queries/extApi/activity';
import { Token } from 'libs/tokens';
import { fetchTokenData } from 'libs/tokens/tokenHelperFn';
import { carbonApi } from 'utils/carbonApi';
import { THIRTY_SEC_IN_MS } from 'utils/time';

const toActivities = (
  data: ServerActivity[],
  tokensMap: Map<string, Token>
): Activity[] => {
  return data.map((activity) => {
    const { strategy } = activity;
    const base = tokensMap.get(strategy.base.toLowerCase());
    const quote = tokensMap.get(strategy.quote.toLowerCase());
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

// TODO: We can remove the abortTimeout when we consider the backend API stable
export const useActivityQuery = (
  params: QueryActivityParams = {},
  abortTimeout?: number
) => {
  const { tokensMap, isPending, importToken } = useTokens();
  const { Token } = useContract();
  const validParams = isValidParams(params);

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
    tokens.forEach((data) => importToken(data));
  };

  return useQuery({
    queryKey: QueryKey.activities(params),
    queryFn: async () => {
      const activities = await (async () => {
        if (!abortTimeout) return carbonApi.getActivity(params);
        const control = new AbortController();
        const timeout = setTimeout(() => control.abort(), abortTimeout);
        const activities = await carbonApi.getActivity(params, control.signal);
        clearTimeout(timeout);
        return activities;
      })();
      await importMissingTokens(activities);
      return toActivities(activities, tokensMap).sort((a, b) => {
        return b.date.getTime() - a.date.getTime();
      });
    },
    enabled: !isPending && validParams,
    refetchInterval: THIRTY_SEC_IN_MS,
    refetchOnWindowFocus: false,
  });
};
