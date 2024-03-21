import { useQuery } from '@tanstack/react-query';
import { useTokens } from 'hooks/useTokens';
import { QueryKey } from 'libs/queries';
import {
  Activity,
  QueryActivityParams,
  ServerActivity,
} from 'libs/queries/extApi/activity';
import { Token } from 'libs/tokens';
import { carbonApi } from 'utils/carbonApi';

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

export const useActivityQuery = (params: QueryActivityParams = {}) => {
  const { tokensMap, isLoading } = useTokens();
  return useQuery(
    QueryKey.activities(params),
    async () => {
      const activities = await carbonApi.getActivity(params);
      return toActivities(activities, tokensMap).sort((a, b) => {
        return b.date.getTime() - a.date.getTime();
      });
    },
    {
      enabled: !isLoading,
      refetchInterval: 30 * 1000,
    }
  );
};
