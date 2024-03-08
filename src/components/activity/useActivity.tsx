import { useQuery } from '@tanstack/react-query';
import { useTokens } from 'hooks/useTokens';
import { QueryKey } from 'libs/queries';
import { Activity, ServerActivity } from 'libs/queries/extApi/activity';
import { Token } from 'libs/tokens';
import { fetchTokenData } from 'libs/tokens/tokenHelperFn';
import { carbonApi } from 'utils/carbonApi';

const toActivities = (
  data: ServerActivity[],
  tokenMap: Map<string, Token>
): Activity[] => {
  return (
    data
      // TODO: Remove this filter once we have all tokens
      .filter((activity) => {
        const { strategy } = activity;
        if (!tokenMap.has(strategy.base)) return false;
        if (!tokenMap.has(strategy.quote)) return false;
        return true;
      })
      .map((activity) => {
        const { strategy } = activity;
        const base = tokenMap.get(strategy.base);
        const quote = tokenMap.get(strategy.quote);
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
          date: new Date(activity.date),
          strategy: {
            ...strategy,
            base,
            quote,
          },
        };
      })
  );
};

type GetTokenContract = Parameters<typeof fetchTokenData>[0];

const getNewTokens = async (
  tokenMap: Map<string, Token>,
  tokenContract: GetTokenContract,
  activities: ServerActivity[]
) => {
  const remainingAddresses = new Set<string>();
  for (const activity of activities) {
    const { base, quote } = activity.strategy;
    if (!tokenMap.has(base)) remainingAddresses.add(base);
    if (!tokenMap.has(quote)) remainingAddresses.add(quote);
  }
  const remainingList = Array.from(remainingAddresses);
  const query = remainingList.map(async (address) => {
    const token = await fetchTokenData(tokenContract, address);
    tokenMap.set(address, token);
  });
  await Promise.all(query);
  return remainingList.map((address) => tokenMap.get(address)!);
};

// TODO: query all remaining tokens
export const useActivity = () => {
  // const { Token } = useContract();
  const { tokensMap } = useTokens();
  return useQuery(
    QueryKey.tokenPrice('activity'),
    async () => {
      const activities = await carbonApi.getActivity();
      // await getNewTokens(tokensMap, Token, activities);
      return toActivities(activities, tokensMap);
    },
    {
      // refetchInterval: 30 * 1000,
      staleTime: 30 * 60 * 1000,
      placeholderData: [],
    }
  );
};
