import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries';
import { useCarbonSDK } from 'hooks/useCarbonSDK';
import { SerializableMatchAction } from '@bancor/carbon-sdk/src/types';
import { ONE_DAY_IN_MS } from 'utils/time';
import { carbonSDK } from 'libs/sdk';

type Props = {
  sourceToken: string;
  targetToken: string;
  actionsWei: SerializableMatchAction[];
  isTradeBySource: boolean;
};

export const useGetTradeActionsQuery = ({
  isTradeBySource,
  actionsWei,
  sourceToken,
  targetToken,
}: Props) => {
  const { isInitialized } = useCarbonSDK();

  return useQuery(
    QueryKey.tradeActions(
      [sourceToken, targetToken],
      isTradeBySource,
      actionsWei
    ),
    async () => {
      return carbonSDK.getTradeDataFromActions(
        sourceToken,
        targetToken,
        !isTradeBySource,
        actionsWei
      );
    },
    {
      enabled: isInitialized,
      staleTime: ONE_DAY_IN_MS,
    }
  );
};
