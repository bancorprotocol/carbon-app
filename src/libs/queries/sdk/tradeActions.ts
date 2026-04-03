import { useQuery } from '@tanstack/react-query';
import { MatchActionBNStr } from '@bancor/carbon-sdk';
import { QueryKey } from 'libs/queries';
import { getSDK } from 'libs/sdk';
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
  return useQuery({
    queryKey: QueryKey.tradeActions(
      [sourceToken, targetToken],
      isTradeBySource,
      actionsWei,
    ),
    queryFn: async () => {
      const sdk = await getSDK();
      return sdk.getTradeDataFromActions(
        sourceToken,
        targetToken,
        !isTradeBySource,
        actionsWei,
      );
    },
    staleTime: ONE_DAY_IN_MS,
  });
};
