import { useQuery } from '@tanstack/react-query';
import { MatchActionBNStr } from '@bancor/carbon-sdk';
import { QueryKey } from 'libs/queries';
import { carbonSDK } from 'libs/sdk';
import { useCarbonInit } from 'hooks/useCarbonInit';
import { ONE_DAY_IN_MS } from 'utils/time';

type Props = {
  sourceToken: string;
  targetToken: string;
  actionsWei: MatchActionBNStr[];
  isTradeBySource: boolean;
};

export const useGetTradeActionsQuery = ({
  isTradeBySource,
  actionsWei,
  sourceToken,
  targetToken,
}: Props) => {
  const { isInitialized } = useCarbonInit();

  return useQuery({
    queryKey: QueryKey.tradeActions(
      [sourceToken, targetToken],
      isTradeBySource,
      actionsWei,
    ),
    queryFn: async () => {
      return carbonSDK.getTradeDataFromActions(
        sourceToken,
        targetToken,
        !isTradeBySource,
        actionsWei,
      );
    },
    enabled: isInitialized,
    staleTime: ONE_DAY_IN_MS,
  });
};
